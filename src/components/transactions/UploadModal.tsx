import { useState, useRef } from "react";
import { createPortal } from "react-dom";
import { Upload, X, FileText, CheckCircle2, AlertCircle, Loader2, Download, FileJson } from "lucide-react";
import { parseCsvWithClaude, parsePdfWithClaude } from "@/lib/claude-api";
import { parseAndDownloadJson } from "@/lib/claude-api-exporter";
import { importAITransactions } from "@/api/transactions/ai-processor";

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function UploadModal({ isOpen, onClose, onSuccess }: UploadModalProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [status, setStatus] = useState<"idle" | "analyzing" | "importing" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFile = async (file: File, mode: "import" | "export" = "import") => {
    if (!file) return;

    const isCsv = file.name.endsWith(".csv");
    const isPdf = file.name.endsWith(".pdf");

    if (!isCsv && !isPdf) {
      setErrorMessage("Please upload a CSV or PDF file.");
      setStatus("error");
      return;
    }

    try {
      setFileName(file.name);
      setStatus("analyzing");
      setErrorMessage(null);

      if (mode === "export") {
        await parseAndDownloadJson(file);
        setStatus("success");
      } else {
        const result = isCsv ? await parseCsvWithClaude(file) : await parsePdfWithClaude(file);

        setStatus("importing");
        await importAITransactions(result.transactions);
        setStatus("success");
      }

      setTimeout(() => {
        onSuccess();
        onClose();
        setStatus("idle");
        setFileName(null);
      }, 2000);
    } catch (error: any) {
      console.error("Upload process failed:", error);
      setErrorMessage(error.message || "Analysis failed. Please check your API key or file format.");
      setStatus("error");
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleFile(file);
  };

  const modalContent = (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-white dark:bg-[#1A1A1A] rounded-[24px] shadow-2xl border border-[#E5E5E0] dark:border-[#333333] p-8 max-w-lg w-full relative overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h2 className="text-[22px] font-medium text-[#1A1A1A] dark:text-white font-serif tracking-tight">
              Upload Statement
            </h2>
            <p className="text-[14px] text-[#6B6B6B] dark:text-[#8E8E8E] mt-1">Import CSV or PDF for AI analysis</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-[#F0F0EA] dark:hover:bg-[#2A2A2A] rounded-md transition-colors"
          >
            <X className="w-5 h-5 text-[#8E8E8E]" />
          </button>
        </div>

        {/* Action Area */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={onDrop}
          className={`
            relative rounded-xl border-2 border-dashed transition-all duration-300 min-h-[240px] flex flex-col items-center justify-center p-6
            ${isDragging ? "border-[#1A1A1A] bg-[#F7F7F3] dark:border-white dark:bg-[#2A2A2A]" : "border-[#E5E5E0] dark:border-[#333333] hover:border-[#1A1A1A]/30"}
            ${status !== "idle" && status !== "error" ? "pointer-events-none" : ""}
          `}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            accept=".csv,.pdf"
            className="hidden"
          />

          {status === "idle" && (
            <div className="flex flex-col items-center text-center w-full animate-in fade-in zoom-in-95 duration-300">
              <div className="w-12 h-12 bg-[#F7F7F3] dark:bg-[#2A2A2A] rounded-full flex items-center justify-center mb-4">
                <Upload className="w-5 h-5 text-[#1A1A1A] dark:text-white" />
              </div>
              <p className="text-[15px] font-medium text-[#1A1A1A] dark:text-white mb-6">
                Drag and drop your file here, or click to browse
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-sm">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center justify-center gap-2 py-2.5 px-4 bg-[#1A1A1A] hover:bg-[#333333] text-white rounded-lg text-[13.5px] font-medium transition-all active:scale-95"
                >
                  <Upload className="w-3.5 h-3.5" />
                  Analyze & Import
                </button>
                <button
                  onClick={() => {
                    const input = document.createElement("input");
                    input.type = "file";
                    input.accept = ".csv,.pdf";
                    input.onchange = (ev) => {
                      const file = (ev.target as HTMLInputElement).files?.[0];
                      if (file) handleFile(file, "export");
                    };
                    input.click();
                  }}
                  className="flex items-center justify-center gap-2 py-2.5 px-4 bg-white dark:bg-[#2A2A2A] border border-[#E5E5E0] dark:border-[#333333] text-[#1A1A1A] dark:text-white rounded-lg text-[13.5px] font-medium hover:bg-[#F7F7F3] dark:hover:bg-[#333333] transition-all active:scale-95"
                >
                  <FileJson className="w-3.5 h-3.5 text-[#6B6B6B]" />
                  Get JSON Only
                </button>
              </div>
            </div>
          )}

          {(status === "analyzing" || status === "importing") && (
            <div className="flex flex-col items-center gap-5 animate-in fade-in duration-300">
              <div className="relative">
                <Loader2 className="w-10 h-10 text-[#1A1A1A] dark:text-white animate-spin" />
              </div>
              <div className="text-center">
                <p className="text-[16px] font-medium text-[#1A1A1A] dark:text-white">
                  {status === "analyzing" ? "AI is analyzing statements..." : "Saving to records..."}
                </p>
                <p className="text-[13px] text-[#8E8E8E] mt-1.5 italic">{fileName}</p>
              </div>
            </div>
          )}

          {status === "success" && (
            <div className="flex flex-col items-center gap-4 animate-in zoom-in-95 duration-300">
              <div className="w-14 h-14 bg-[#EBEBE3] dark:bg-emerald-900/20 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-[#1A1A1A] dark:text-emerald-400" />
              </div>
              <div className="text-center">
                <p className="text-[18px] font-medium text-[#1A1A1A] dark:text-white tracking-tight">Sync Completed</p>
                <p className="text-[13px] text-[#6B6B6B] dark:text-[#8E8E8E] mt-1">Your Dashboard is up to date.</p>
              </div>
            </div>
          )}

          {status === "error" && (
            <div className="flex flex-col items-center gap-4 py-4 animate-in fade-in duration-300">
              <div className="w-14 h-14 bg-red-50/50 dark:bg-red-900/10 rounded-full flex items-center justify-center">
                <AlertCircle className="w-8 h-8 text-red-500" />
              </div>
              <div className="text-center px-4">
                <p className="text-[16px] font-medium text-red-600">Sync Interrupted</p>
                <p className="text-[13px] text-[#8E8E8E] mt-2 leading-relaxed max-w-[280px]">{errorMessage}</p>
                <button
                  onClick={() => setStatus("idle")}
                  className="mt-6 text-[12px] font-bold text-[#1A1A1A] dark:text-white underline decoration-1 underline-offset-4 hover:decoration-2 transition-all"
                >
                  TRY AGAIN
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Info */}
        <div className="mt-10 flex items-center justify-center gap-2.5">
          <div className="h-px bg-[#F0F0EA] dark:bg-[#333333] flex-1" />
          <div className="flex items-center gap-2 px-3 text-[10px] font-bold text-[#8E8E8E] uppercase tracking-[0.15em]">
            <FileText className="w-3 h-3" />
            <span>Secure & Private Analysis</span>
          </div>
          <div className="h-px bg-[#F0F0EA] dark:bg-[#333333] flex-1" />
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
