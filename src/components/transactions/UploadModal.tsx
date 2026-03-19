import { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Upload, X, FileText, CheckCircle2, AlertCircle, Loader2, Download } from 'lucide-react';
import { parseCsvWithClaude, parsePdfWithClaude } from '@/lib/claude-api';
import { parseAndDownloadJson } from '@/lib/claude-api-exporter';
import { importAITransactions } from '@/api/transactions/ai-processor';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function UploadModal({ isOpen, onClose, onSuccess }: UploadModalProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [status, setStatus] = useState<'idle' | 'analyzing' | 'importing' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFile = async (file: File, mode: 'import' | 'export' = 'import') => {
    if (!file) return;
    
    const isCsv = file.name.endsWith('.csv');
    const isPdf = file.name.endsWith('.pdf');

    if (!isCsv && !isPdf) {
      setErrorMessage('Please upload a CSV or PDF file.');
      setStatus('error');
      return;
    }

    try {
      setFileName(file.name);
      setStatus('analyzing');
      setErrorMessage(null);

      if (mode === 'export') {
        // 模式 1: 仅解析并下载
        await parseAndDownloadJson(file);
        setStatus('success');
      } else {
        // 模式 2: 解析并导入数据库
        const result = isCsv 
          ? await parseCsvWithClaude(file)
          : await parsePdfWithClaude(file);

        setStatus('importing');
        await importAITransactions(result.transactions);
        setStatus('success');
      }

      setTimeout(() => {
        onSuccess();
        onClose();
        // 重置状态
        setStatus('idle');
        setFileName(null);
      }, 2000);

    } catch (error: any) {
      console.error('Upload process failed:', error);
      setErrorMessage(error.message || 'Analysis failed. Please check your API key or file format.');
      setStatus('error');
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleFile(file);
  };

  const modalContent = (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-[32px] shadow-2xl border border-slate-200 dark:border-slate-800 p-8 max-w-lg w-full relative overflow-hidden">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
        >
          <X className="w-5 h-5 text-slate-400" />
        </button>

        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Upload Bill</h2>
          <p className="text-slate-500 dark:text-slate-400">AI will automatically analyze and categorize your records.</p>
        </div>

        {/* Upload Area */}
        <div 
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={onDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`
            relative border-2 border-dashed rounded-[24px] p-12 transition-all cursor-pointer
            flex flex-col items-center justify-center gap-4
            ${isDragging ? 'border-[#5dd6f4] bg-[#5dd6f4]/5 scale-[0.99]' : 'border-slate-200 dark:border-slate-800 hover:border-[#5dd6f4]/50'}
            ${status !== 'idle' && status !== 'error' ? 'pointer-events-none' : ''}
          `}
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            accept=".csv,.pdf"
            className="hidden" 
          />

          {status === 'idle' && (
            <>
              <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center">
                <Upload className="w-8 h-8 text-[#5dd6f4]" />
              </div>
              <div className="text-center mb-4">
                <p className="font-semibold text-slate-700 dark:text-slate-200 text-lg">Select a file to start</p>
                <p className="text-sm text-slate-400 mt-1">CSV or PDF bank statements</p>
              </div>
              
              <div className="flex flex-col w-full gap-3">
                <button 
                  onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                  className="w-full py-3 bg-[#5dd6f4] hover:bg-[#4bcceb] text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95 shadow-md"
                >
                  <Upload className="w-4 h-4" />
                  Analyze & Import to DB
                </button>
                
                <button 
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    const input = document.createElement('input');
                    input.type = 'file';
                    input.accept = '.csv,.pdf';
                    input.onchange = (ev) => {
                      const file = (ev.target as HTMLInputElement).files?.[0];
                      if (file) handleFile(file, 'export');
                    };
                    input.click();
                  }}
                  className="w-full py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95 shadow-sm"
                >
                  <Download className="w-4 h-4" />
                  Analyze & Download JSON
                </button>
              </div>
            </>
          )}

          {(status === 'analyzing' || status === 'importing') && (
            <div className="flex flex-col items-center gap-4 py-4">
              <div className="relative">
                <Loader2 className="w-12 h-12 text-[#5dd6f4] animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-6 h-6 bg-white dark:bg-slate-900 rounded-full" />
                </div>
              </div>
              <div className="text-center">
                <p className="font-bold text-slate-900 dark:text-white text-lg">
                  {status === 'analyzing' ? 'AI is reading your bill...' : 'Importing records...'}
                </p>
                <p className="text-sm text-slate-400 mt-1">{fileName}</p>
              </div>
            </div>
          )}

          {status === 'success' && (
            <div className="flex flex-col items-center gap-4 py-4">
              <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10 text-emerald-500" />
              </div>
              <div className="text-center">
                <p className="font-bold text-emerald-500 text-xl">Upload Successful!</p>
                <p className="text-sm text-slate-400 mt-1">Your records are now in the list.</p>
              </div>
            </div>
          )}

          {status === 'error' && (
            <div className="flex flex-col items-center gap-4 py-4">
              <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center">
                <AlertCircle className="w-10 h-10 text-red-500" />
              </div>
              <div className="text-center px-4">
                <p className="font-bold text-red-500 text-lg">Analysis Failed</p>
                <p className="text-sm text-slate-400 mt-1 break-words max-w-[300px]">
                  {errorMessage}
                </p>
                <button 
                  onClick={(e) => { e.stopPropagation(); setStatus('idle'); }}
                  className="mt-4 text-xs font-bold text-[#5dd6f4] underline decoration-2 underline-offset-4"
                >
                  TRY ANOTHER FILE
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Info */}
        <div className="mt-8 flex items-center justify-center gap-2 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
          <FileText className="w-3.5 h-3.5" />
          <span>Security & Private • Powered by Claude 3.5</span>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
