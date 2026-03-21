// Claude API 服务
import type { Transaction, ParsedResult } from "@/types/transaction";
import { EXPORT_PROMPT } from "./prompts";

const CLAUDE_API_URL = "/api/anthropic/v1/messages";

// 将文件转换为文本
async function fileToText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsText(file, "SHIFT_JIS");
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
}

// API 调用核心
async function callClaudeApi(messages: any[]): Promise<string> {
  const response = await fetch(CLAUDE_API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-5",
      max_tokens: 8000,
      temperature: 0,
      messages: messages,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    console.error("API Error Response:", err);
    throw new Error(`Claude API Failed: ${response.status}`);
  }

  const result = await response.json();
  const text = result.content[0].text;

  // 精确提取 JSON 内容
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");

  if (start === -1 || end === -1 || end < start) {
    throw new Error("AI did not return a valid JSON object.");
  }

  return text.substring(start, end + 1);
}

// 数据映射逻辑
function mapToTransaction(t: any): Transaction {
  return {
    id: crypto.randomUUID(),
    date: t.date,
    amount: t.amount || 0,
    notes: t.notes || "",
    is_recurring: !!t.is_recurring,
    category: {
      id: "temp",
      name: t.category_name || "Others",
      color_code: "#64748B",
    },
    merchant: {
      id: "temp",
      name: t.merchant_name || "Unknown",
      brand: t.brand_name ? { id: "temp", name: t.brand_name, logo_url: null } : null,
    },
    payment_method: t.payment_method_name ? { id: "temp", name: t.payment_method_name } : null,
    tags: [],
  };
}

// CSV 解析 (支持切分)
export async function parseCsvWithClaude(file: File): Promise<ParsedResult> {
  const csvContent = await fileToText(file);
  const lines = csvContent.split(/\r?\n/).filter((line) => line.trim());

  // 每 30 行一个 Batch
  const BATCH_SIZE = 30;
  const batches: string[] = [];
  for (let i = 0; i < lines.length; i += BATCH_SIZE) {
    batches.push(lines.slice(i, i + BATCH_SIZE).join("\n"));
  }

  const allTransactions: Transaction[] = [];

  for (const batchCsv of batches) {
    const prompt = `${EXPORT_PROMPT}\n\nCSV content to parse (Batch):\n${batchCsv}`;
    const jsonStr = await callClaudeApi([{ role: "user", content: prompt }]);
    const parsed = JSON.parse(jsonStr);

    if (parsed.transactions) {
      allTransactions.push(...parsed.transactions.map(mapToTransaction));
    }
  }

  return {
    transactions: allTransactions,
    summary: {
      totalAmount: allTransactions.reduce((s: number, t: Transaction) => s + t.amount, 0),
      transactionCount: allTransactions.length,
    },
  };
}

// PDF 解析
export async function parsePdfWithClaude(file: File): Promise<ParsedResult> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      try {
        const base64 = (reader.result as string).split(",")[1];

        const jsonStr = await callClaudeApi([
          {
            role: "user",
            content: [
              { type: "text", text: EXPORT_PROMPT },
              {
                type: "document",
                source: {
                  type: "base64",
                  media_type: "application/pdf",
                  data: base64,
                },
              },
            ],
          },
        ]);

        const parsed = JSON.parse(jsonStr);
        const mapped = (parsed.transactions || []).map(mapToTransaction);

        resolve({
          transactions: mapped,
          summary: {
            totalAmount: mapped.reduce((s: number, t: Transaction) => s + t.amount, 0),
            transactionCount: mapped.length,
          },
        });
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = (error) => reject(error);
  });
}
