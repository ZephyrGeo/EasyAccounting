// Claude API 服务
// 注意：在生产环境中，API密钥应该存储在环境变量中，并通过后端服务调用

import type { Transaction, ParsedResult } from "@/types/transaction";

const CLAUDE_API_URL = "/claude-api/v1/messages";
const API_KEY = import.meta.env.VITE_CLAUDE_API_KEY;

// 简单的内存缓存
const apiCache = new Map<string, ParsedResult>();

// 支持Unicode的Base64编码函数
function encodeUnicode(str: string): string {
  try {
    // 先将Unicode字符串转换为UTF-8字节序列，再进行Base64编码
    return btoa(
      encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (_match, p1) => {
        return String.fromCharCode(parseInt(p1, 16));
      }),
    );
  } catch (error) {
    console.error("Unicode编码失败:", error);
    // 如果编码失败，使用字符串长度和时间戳作为简单的缓存键
    return btoa(str.length.toString() + Date.now().toString());
  }
}

// 将CSV文件转换为文本，支持多种编码格式
async function fileToText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    // 首先尝试UTF-8编码
    reader.readAsText(file, "UTF-8");
    reader.onload = () => {
      const result = reader.result as string;

      // 检查是否包含乱码字符（替换字符 � 或其他异常字符）
      const hasReplacementChar = result.includes("�");
      // 简化的控制字符检测，避免ESLint警告
      const hasControlChars = result.split("").some((char) => {
        const code = char.charCodeAt(0);
        return (
          (code >= 0 && code <= 8) ||
          code === 11 ||
          code === 12 ||
          (code >= 14 && code <= 31) ||
          code === 127
        );
      });

      if (hasReplacementChar || hasControlChars) {
        console.log("UTF-8 encoding failed, trying Shift-JIS...");

        // 如果UTF-8失败，尝试Shift-JIS编码（常用于日文CSV）
        const reader2 = new FileReader();
        reader2.readAsText(file, "Shift-JIS");
        reader2.onload = () => {
          const result2 = reader2.result as string;

          // 如果Shift-JIS也有问题，尝试其他编码
          if (result2.includes("�")) {
            console.log("Shift-JIS encoding failed, trying Windows-1252...");

            const reader3 = new FileReader();
            reader3.readAsText(file, "Windows-1252");
            reader3.onload = () => {
              resolve(reader3.result as string);
            };
            reader3.onerror = () => {
              console.warn(
                "All encoding attempts failed, using original UTF-8 result",
              );
              resolve(result);
            };
          } else {
            resolve(result2);
          }
        };
        reader2.onerror = () => {
          console.warn(
            "Shift-JIS encoding failed, using original UTF-8 result",
          );
          resolve(result);
        };
      } else {
        resolve(result);
      }
    };
    reader.onerror = (error) => reject(error);
  });
}

// 分块处理大型CSV内容
function chunkCsvContent(
  csvContent: string,
  maxChunkSize: number = 30000,
): string[] {
  const lines = csvContent.split("\n");
  if (lines.length <= 1) return [csvContent]; // 只有header或空文件

  const header = lines[0];
  const dataLines = lines.slice(1);
  const chunks: string[] = [];

  let currentChunk = header;

  for (const line of dataLines) {
    const testChunk = currentChunk + "\n" + line;

    if (testChunk.length > maxChunkSize && currentChunk !== header) {
      // 当前块已满，保存并开始新块
      chunks.push(currentChunk);
      currentChunk = header + "\n" + line;
    } else {
      currentChunk = testChunk;
    }
  }

  // 添加最后一个块
  if (currentChunk !== header) {
    chunks.push(currentChunk);
  }

  return chunks;
}

// 验证响应完整性
function validateResponseCompleteness(
  content: string,
  expectedRowCount: number,
): boolean {
  try {
    const parsed = JSON.parse(content);
    if (!parsed.transactions || !Array.isArray(parsed.transactions)) {
      return false;
    }

    // 检查交易数量是否符合预期（允许一定误差）
    const actualCount = parsed.transactions.length;
    const tolerance = Math.max(1, Math.floor(expectedRowCount * 0.1)); // 10%容错

    return Math.abs(actualCount - expectedRowCount) <= tolerance;
  } catch {
    return false;
  }
}

// 带重试的API调用
async function callClaudeApiWithRetry(
  prompt: string,
  expectedRowCount: number,
  maxRetries: number = 3,
): Promise<{ content: string }> {
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`API调用尝试 ${attempt}/${maxRetries}`);

      const response = await fetch(CLAUDE_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": API_KEY!,
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-5-20250929",
          max_tokens: 8000,
          temperature: 0, // 降低随机性，提高一致性
          messages: [{ role: "user", content: prompt }],
        }),
      });

      if (!response.ok) {
        const errorBody = await response.text();
        console.error(
          `API请求失败 (尝试 ${attempt}): ${response.status} ${response.statusText}`,
          errorBody,
        );

        let errorMessage = "Claude API调用失败";
        if (response.status === 401) {
          errorMessage = "API密钥无效或已过期";
        } else if (response.status === 403) {
          errorMessage = "API访问被拒绝";
        } else if (response.status === 429) {
          errorMessage = "API调用频率超限";
        } else if (response.status >= 500) {
          errorMessage = "Claude API服务器错误";
        }

        throw new Error(`${errorMessage} (状态码: ${response.status})`);
      }

      const result = await response.json();

      // 检查响应结构
      if (
        !result.content ||
        !Array.isArray(result.content) ||
        result.content.length === 0 ||
        !result.content[0].text
      ) {
        throw new Error("API响应格式异常");
      }

      // 提取并清理内容
      let cleanedContent = result.content[0].text.trim();
      if (cleanedContent.startsWith("```json")) {
        cleanedContent = cleanedContent.substring(7);
      }
      if (cleanedContent.endsWith("```")) {
        cleanedContent = cleanedContent.substring(0, cleanedContent.length - 3);
      }
      cleanedContent = cleanedContent.trim();

      // 验证JSON完整性
      if (!cleanedContent.endsWith("}")) {
        throw new Error("响应被截断，JSON不完整");
      }

      // 验证响应完整性
      if (!validateResponseCompleteness(cleanedContent, expectedRowCount)) {
        throw new Error(`响应不完整，预期约${expectedRowCount}条记录`);
      }

      console.log(`API调用成功 (尝试 ${attempt})`);
      return { content: cleanedContent };
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      console.error(`API调用失败 (尝试 ${attempt}):`, lastError.message);

      // 如果不是最后一次尝试，等待后重试
      if (attempt < maxRetries) {
        const delay = Math.pow(2, attempt) * 1000; // 指数退避
        console.log(`等待 ${delay}ms 后重试...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError || new Error("API调用失败");
}

// 专门用于PDF的API调用函数
async function callClaudeApiForPdf(
  prompt: string,
  base64Content: string,
  maxRetries: number = 3,
): Promise<{ content: string }> {
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`PDF API调用尝试 ${attempt}/${maxRetries}`);

      const response = await fetch(CLAUDE_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": API_KEY!,
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-5-20250929",
          max_tokens: 8000,
          temperature: 0,
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: prompt,
                },
                {
                  type: "document",
                  source: {
                    type: "base64",
                    media_type: "application/pdf",
                    data: base64Content,
                  },
                },
              ],
            },
          ],
        }),
      });

      if (!response.ok) {
        const errorBody = await response.text();
        console.error(
          `PDF API请求失败 (尝试 ${attempt}): ${response.status} ${response.statusText}`,
          errorBody,
        );

        let errorMessage = "Claude API调用失败";
        if (response.status === 401) {
          errorMessage = "API密钥无效或已过期";
        } else if (response.status === 403) {
          errorMessage = "API访问被拒绝";
        } else if (response.status === 429) {
          errorMessage = "API调用频率超限";
        } else if (response.status >= 500) {
          errorMessage = "Claude API服务器错误";
        }

        throw new Error(`${errorMessage} (状态码: ${response.status})`);
      }

      const result = await response.json();

      // 检查响应结构
      if (
        !result.content ||
        !Array.isArray(result.content) ||
        result.content.length === 0 ||
        !result.content[0].text
      ) {
        throw new Error("API响应格式异常");
      }

      // 提取并清理内容
      let cleanedContent = result.content[0].text.trim();
      if (cleanedContent.startsWith("```json")) {
        cleanedContent = cleanedContent.substring(7);
      }
      if (cleanedContent.endsWith("```")) {
        cleanedContent = cleanedContent.substring(0, cleanedContent.length - 3);
      }
      cleanedContent = cleanedContent.trim();

      // 验证JSON完整性
      if (!cleanedContent.endsWith("}")) {
        throw new Error("PDF响应被截断，JSON不完整");
      }

      console.log(`PDF API调用成功 (尝试 ${attempt})`);
      return { content: cleanedContent };
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      console.error(`PDF API调用失败 (尝试 ${attempt}):`, lastError.message);

      // 如果不是最后一次尝试，等待后重试
      if (attempt < maxRetries) {
        const delay = Math.pow(2, attempt) * 1000;
        console.log(`等待 ${delay}ms 后重试...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError || new Error("PDF API调用失败");
}

// 合并多个块的解析结果
function mergeChunkResults(chunkResults: ParsedResult[]): ParsedResult {
  const allTransactions: Transaction[] = [];
  let totalAmount = 0;

  for (const result of chunkResults) {
    allTransactions.push(...result.transactions);
    totalAmount += result.summary.totalAmount;
  }

  return {
    transactions: allTransactions,
    summary: {
      totalAmount,
      transactionCount: allTransactions.length,
    },
  };
}

// 调用Claude API解析CSV - 重写版本，确保完整响应
export async function parseCsvWithClaude(file: File): Promise<ParsedResult> {
  const fileName = file.name;
  const csvContent = await fileToText(file);
  console.log(`开始解析CSV文件: ${fileName}`);

  // 生成缓存键
  const cacheKey = encodeUnicode(
    csvContent.substring(0, 100) + csvContent.length,
  );
  if (apiCache.has(cacheKey)) {
    console.log(`缓存命中: ${fileName}`);
    return apiCache.get(cacheKey)!;
  }

  if (!API_KEY) {
    throw new Error(
      "Claude API密钥未配置。请检查.env.local文件中的VITE_CLAUDE_API_KEY设置。",
    );
  }

  try {
    // 计算预期的行数（用于验证完整性）
    const csvLines = csvContent.split("\n").filter((line) => line.trim());
    const expectedRowCount = Math.max(0, csvLines.length - 1); // 减去header行

    console.log(`CSV包含 ${expectedRowCount} 条数据记录`);

    // 检查是否需要分块处理
    const chunks = chunkCsvContent(csvContent);
    console.log(`CSV被分为 ${chunks.length} 个块进行处理`);

    if (chunks.length === 1) {
      // 单块处理
      const prompt = `
CRITICAL: You MUST process ALL rows and return COMPLETE JSON. No truncation allowed.

Parse this CSV into JSON. Return ONLY valid JSON with "transactions" array.

Format for each transaction:
{"id":"T1","date":"2025-04-20","time":"00:00","merchant":"原始商户名","amount":610,"category":"Food & Drink","tags":["Restaurant","Lunch"]}

STRICT Rules:
- Process EVERY single row, no exceptions
- Keep merchant names EXACTLY as they appear (preserve Japanese, Chinese, English)
- Use positive amounts
- Date format: YYYY-MM-DD
- Categories in ENGLISH: Food & Drink, Shopping, Transportation, Entertainment, Healthcare, Education, Bills & Utilities, Other
- Return format: {"transactions":[...ALL transactions...]}

Expected ${expectedRowCount} transactions. You MUST return ALL of them.

CSV:
${csvContent}

RESPONSE MUST BE COMPLETE JSON STARTING WITH { AND ENDING WITH }`;

      const result = await callClaudeApiWithRetry(prompt, expectedRowCount);
      const parsed = JSON.parse(result.content);

      const finalResult: ParsedResult = {
        transactions: parsed.transactions,
        summary: {
          totalAmount: parsed.transactions.reduce(
            (sum: number, t: Transaction) => sum + Math.abs(t.amount || 0),
            0,
          ),
          transactionCount: parsed.transactions.length,
        },
      };

      console.log(`成功解析 ${finalResult.transactions.length} 条交易记录`);
      apiCache.set(cacheKey, finalResult);
      return finalResult;
    } else {
      // 多块处理
      console.log(`开始分块处理 ${chunks.length} 个块`);
      const chunkResults: ParsedResult[] = [];

      for (let i = 0; i < chunks.length; i++) {
        const chunk = chunks[i];
        const chunkLines = chunk.split("\n").filter((line) => line.trim());
        const chunkExpectedRows = Math.max(0, chunkLines.length - 1);

        console.log(
          `处理块 ${i + 1}/${chunks.length}, 预期 ${chunkExpectedRows} 条记录`,
        );

        const chunkPrompt = `
CRITICAL: Process ALL rows in this CSV chunk. Return COMPLETE JSON.

Parse this CSV chunk into JSON. Return ONLY valid JSON with "transactions" array.

Format: {"id":"T${i}_1","date":"2025-04-20","time":"00:00","merchant":"原始商户名","amount":610,"category":"Food & Drink","tags":["Restaurant","Lunch"]}

Rules:
- Process EVERY row in this chunk
- Keep merchant names exactly as they appear
- Use positive amounts
- Date format: YYYY-MM-DD
- Categories in ENGLISH
- ID prefix: "T${i}_" (e.g., T${i}_1, T${i}_2, etc.)

Expected ${chunkExpectedRows} transactions in this chunk.

CSV Chunk:
${chunk}

RETURN COMPLETE JSON: {"transactions":[...ALL transactions...]}`;

        const chunkResult = await callClaudeApiWithRetry(
          chunkPrompt,
          chunkExpectedRows,
        );
        const chunkParsed = JSON.parse(chunkResult.content);

        const chunkFinalResult: ParsedResult = {
          transactions: chunkParsed.transactions,
          summary: {
            totalAmount: chunkParsed.transactions.reduce(
              (sum: number, t: Transaction) => sum + Math.abs(t.amount || 0),
              0,
            ),
            transactionCount: chunkParsed.transactions.length,
          },
        };

        chunkResults.push(chunkFinalResult);
        console.log(
          `块 ${i + 1} 处理完成: ${chunkFinalResult.transactions.length} 条记录`,
        );
      }

      // 合并所有块的结果
      const mergedResult = mergeChunkResults(chunkResults);
      console.log(
        `所有块合并完成: 总计 ${mergedResult.transactions.length} 条交易记录`,
      );

      apiCache.set(cacheKey, mergedResult);
      return mergedResult;
    }
  } catch (error) {
    console.error("CSV解析失败:", error);

    if (error instanceof Error && error.message.includes("Claude API")) {
      throw error;
    }

    throw new Error(
      `CSV解析失败: ${error instanceof Error ? error.message : "未知错误"}`,
    );
  }
}

// 将文件转换为base64
async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // 移除data:application/pdf;base64,前缀
      const base64 = result.split(",")[1];
      resolve(base64);
    };
    reader.onerror = (error) => reject(error);
  });
}

// PDF解析功能 - 重写版本，确保完整响应
export async function parsePdfWithClaude(file: File): Promise<ParsedResult> {
  const fileName = file.name;
  console.log(`开始解析PDF文件: ${fileName}`);

  if (!API_KEY) {
    throw new Error(
      "Claude API密钥未配置。请检查.env.local文件中的VITE_CLAUDE_API_KEY设置。",
    );
  }

  try {
    // 将PDF文件转换为base64
    const base64Content = await fileToBase64(file);

    // 优化的prompt，强调完整性
    const prompt = `
CRITICAL: You MUST extract ALL transaction records from this PDF. No truncation allowed.

Analyze the attached PDF document and extract ALL transaction records. Return ONLY valid JSON.

Format:
{
  "transactions": [
    {
      "id": "unique_transaction_id",
      "amount": number,
      "category": "string",
      "tags": ["string"],
      "merchant": "string",
      "date": "YYYY-MM-DD",
      "time": "HH:MM"
    }
  ]
}

STRICT Rules:
- Extract EVERY transaction, no exceptions
- Generate unique IDs (e.g., "PDF_T1", "PDF_T2", etc.)
- Amount should be positive numbers
- Date format: YYYY-MM-DD (e.g., "2024-02-01")
- Time format: HH:MM (use "12:00" if not available)
- Categories in ENGLISH: Food & Drink, Shopping, Transportation, Entertainment, Healthcare, Education, Bills & Utilities, Other
- Extract merchant names exactly as they appear
- If no transactions found, return {"transactions":[]}

RESPONSE MUST BE COMPLETE JSON STARTING WITH { AND ENDING WITH }
NO MARKDOWN, NO EXPLANATIONS, ONLY JSON`;

    // 使用专门的PDF API调用函数
    const result = await callClaudeApiForPdf(prompt, base64Content, 3);

    const parsed = JSON.parse(result.content);

    if (parsed && Array.isArray(parsed.transactions)) {
      const finalResult: ParsedResult = {
        transactions: parsed.transactions,
        summary: {
          totalAmount: parsed.transactions.reduce(
            (sum: number, t: Transaction) => sum + Math.abs(t.amount || 0),
            0,
          ),
          transactionCount: parsed.transactions.length,
        },
      };

      console.log(`成功解析PDF: ${finalResult.transactions.length} 条交易记录`);
      return finalResult;
    } else {
      console.error("PDF解析结果不包含transactions数组:", parsed);
      throw new Error("Claude API返回的PDF数据格式不正确");
    }
  } catch (error) {
    console.error("PDF解析失败:", error);

    if (error instanceof Error && error.message.includes("Claude API")) {
      throw error;
    }

    throw new Error(
      `PDF解析失败: ${error instanceof Error ? error.message : "未知错误"}`,
    );
  }
}
