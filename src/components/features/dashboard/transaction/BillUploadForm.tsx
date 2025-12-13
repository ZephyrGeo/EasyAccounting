import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Upload, FileText, Loader2 } from "lucide-react";
import { parseCsvWithClaude, parsePdfWithClaude } from "@/lib/claude-api";
import { Transaction } from "@/types/transaction";
import BillTransactionEditor from "./BillTransactionEditor";

interface BillUploadFormProps {
  onAdd?: (transactions: Transaction[]) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  trigger?: React.ReactNode;
}

export default function BillUploadForm({
  onAdd,
  open,
  setOpen,
  trigger,
}: BillUploadFormProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [extractedTransactions, setExtractedTransactions] = useState<
    Transaction[]
  >([]);
  const [showEditor, setShowEditor] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (
        file.type === "text/csv" ||
        file.name.endsWith(".csv") ||
        file.type === "application/pdf" ||
        file.name.endsWith(".pdf")
      ) {
        setSelectedFile(file);
        setError(null);
      } else {
        setError("Please select CSV or PDF file");
        setSelectedFile(null);
      }
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError("Please select a file first");
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      // Select appropriate parsing function based on file type
      const result =
        selectedFile.type === "application/pdf" ||
        selectedFile.name.endsWith(".pdf")
          ? await parsePdfWithClaude(selectedFile)
          : await parseCsvWithClaude(selectedFile);

      // Convert Claude API returned data format to Transaction format required by application
      const convertedTransactions: Transaction[] = result.transactions.map(
        (t: Transaction, index: number) => {
          // Convert date format from YYYY-MM-DD to YY/MM/DD
          const dateParts = t.date.split("-");
          const formattedDate =
            dateParts.length === 3
              ? `${dateParts[0].slice(2)}/${dateParts[1]}/${dateParts[2]}`
              : t.date;

          return {
            id: `T${Date.now()}${index}`,
            amount: Math.abs(t.amount), // Convert to positive number, as amounts in app are all positive
            category: t.category || "Others",
            subCategory: t.subCategory || "",
            merchant: t.merchant || "Unknown Merchant", // Use t.merchant instead of t.description
            date: formattedDate,
            time: new Date().toLocaleTimeString("en-US", { hour12: false }),
          };
        },
      );

      setExtractedTransactions(convertedTransactions);
      setShowEditor(true);
    } catch (error) {
      console.error("File parsing failed:", error);
      setError("File parsing failed, please try again");
    } finally {
      setIsUploading(false);
    }
  };

  const handleEditorConfirm = (transactions: Transaction[]) => {
    if (onAdd) {
      onAdd(transactions);
    }
    setShowEditor(false);
    setOpen(false);
    resetForm();
  };

  const handleEditorCancel = () => {
    setShowEditor(false);
  };

  const resetForm = () => {
    setSelectedFile(null);
    setExtractedTransactions([]);
    setError(null);
    setIsUploading(false);
    setShowEditor(false);
  };

  const handleDialogClose = (open: boolean) => {
    setOpen(open);
    if (!open) {
      resetForm();
    }
  };

  if (showEditor) {
    return (
      <BillTransactionEditor
        transactions={extractedTransactions}
        onConfirm={handleEditorConfirm}
        onCancel={handleEditorCancel}
        open={true}
        setOpen={setShowEditor}
      />
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Upload Bill</DialogTitle>
          <DialogDescription>
            Please select a CSV or PDF format bill file, the system will
            automatically extract transaction records.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="file" className="text-right">
              Select File
            </Label>
            <div className="col-span-3">
              <div className="relative">
                <Input
                  id="file"
                  type="file"
                  accept=".csv,.pdf"
                  onChange={handleFileSelect}
                  disabled={isUploading}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="flex items-center justify-center h-10 px-3 py-2 text-sm border border-input bg-background rounded-md cursor-pointer hover:bg-accent hover:text-accent-foreground">
                  {selectedFile ? (
                    <span className="text-center">{selectedFile.name}</span>
                  ) : (
                    <span className="text-center text-muted-foreground">
                      Choose File
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {selectedFile && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <FileText className="h-4 w-4" />
              <span>{selectedFile.name}</span>
              <span>({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)</span>
            </div>
          )}

          {error && (
            <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
              {error}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => handleDialogClose(false)}
            disabled={isUploading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpload}
            disabled={!selectedFile || isUploading}
            className="min-w-[80px]"
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Parsing...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Confirm
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
