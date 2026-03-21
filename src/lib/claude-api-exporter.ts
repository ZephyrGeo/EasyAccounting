// Claude API 导出工具 (分块解析 + 合并逻辑)
import { EXPORT_PROMPT } from "./prompts";

const CLAUDE_API_URL = "/api/anthropic/v1/messages";

// 将文件转换为文本 (针对日本信用卡 CSV 使用 SHIFT_JIS)
async function fileToText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsText(file, "SHIFT_JIS");
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
}

/**
 * 单个分块的 API 调用
 */
async function callClaudeForChunk(chunkContent: string): Promise<any[]> {
  const prompt = `Parse these CSV lines:\n${chunkContent}`;

  const response = await fetch(CLAUDE_API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-5",
      max_tokens: 4000, // 分块后不需要 8000 那么大，降低风险
      temperature: 0,
      system: EXPORT_PROMPT,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!response.ok) {
    const errorMsg = await response.text();
    throw new Error(`Claude API Error: ${response.status} - ${errorMsg}`);
  }

  const result = await response.json();
  const text = result.content[0].text;

  // 提取 JSON
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end === -1) return [];

  try {
    const parsed = JSON.parse(text.substring(start, end + 1));
    return parsed.transactions || [];
  } catch (e) {
    console.error("Failed to parse chunk JSON:", text);
    return [];
  }
}

/**
 * 主逻辑：分块解析并合并下载
 */
export async function parseAndDownloadJson(file: File) {
  const csvContent = await fileToText(file);
  const lines = csvContent.split(/\r?\n/).filter((line) => line.trim() !== "");

  // 1. 分块 (每 30 行一组)
  const CHUNK_SIZE = 30;
  const chunks = [];
  for (let i = 0; i < lines.length; i += CHUNK_SIZE) {
    chunks.push(lines.slice(i, i + CHUNK_SIZE).join("\n"));
  }

  console.log(`Starting chunked processing: ${chunks.length} chunks found.`);

  let finalTransactions: any[] = [];

  // 2. 依次处理每个分块
  for (let i = 0; i < chunks.length; i++) {
    console.log(`Processing chunk ${i + 1}/${chunks.length}...`);
    try {
      const transactions = await callClaudeForChunk(chunks[i]);
      finalTransactions = [...finalTransactions, ...transactions];
    } catch (err) {
      console.error(`Error in chunk ${i + 1}:`, err);
      // 可选：决定是跳过还是中断。这里选择继续。
    }
  }

  // 3. 校验与对齐
  console.log(`Validation: CSV Lines: ${lines.length}, Extracted Transactions: ${finalTransactions.length}`);
  if (Math.abs(lines.length - finalTransactions.length) > 5) {
    console.warn("⚠️ Significant mismatch between CSV lines and extracted transactions. Please check the output.");
  }

  // 4. 合并结果并下载
  const finalResult = {
    transactions: finalTransactions,
    metadata: {
      source_file: file.name,
      processed_at: new Date().toISOString(),
      total_count: finalTransactions.length,
    },
  };

  const blob = new Blob([JSON.stringify(finalResult, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `parsed_${file.name.split(".")[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  console.log("Merge completed and download triggered.");
  return finalResult;
}
