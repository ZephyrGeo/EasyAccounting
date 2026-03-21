import { useState } from 'react';
import { X, Trash2, Tag as TagIcon, Search, AlertCircle } from 'lucide-react';
import { deleteTag } from '@/api/entities/tags';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";

interface TagManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  allTags: string[];
  onTagsUpdated: () => void;
}

export default function TagManagementModal({
  isOpen,
  onClose,
  allTags,
  onTagsUpdated,
}: TagManagementModalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [tagToDelete, setTagToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isOpen) return null;

  const filteredTags = allTags.filter(tag => 
    tag.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async () => {
    if (!tagToDelete) return;
    
    setIsDeleting(true);
    try {
      await deleteTag(tagToDelete);
      onTagsUpdated();
      setTagToDelete(null);
    } catch (error) {
      console.error("Failed to delete tag:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white dark:bg-[#1A1A1A] rounded-[24px] shadow-2xl border border-[#E5E5E0] dark:border-[#333333] overflow-hidden flex flex-col max-h-[80vh]">
        
        {/* Header */}
        <div className="p-6 border-b border-[#F0F0EA] dark:border-[#2A2A2A] flex justify-between items-center bg-[#FBFBFA] dark:bg-[#1E1E1E]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
              <TagIcon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <h2 className="text-[18px] font-medium text-[#1A1A1A] dark:text-white font-serif">Manage Tags</h2>
              <p className="text-[12px] text-[#8E8E8E]">View and clean up your tag library</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 hover:bg-[#F0F0EA] dark:hover:bg-[#2A2A2A] rounded-md transition-colors"
          >
            <X className="w-5 h-5 text-[#8E8E8E]" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-4 border-b border-[#F0F0EA] dark:border-[#2A2A2A]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8E8E8E]" />
            <input
              type="text"
              placeholder="Search tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#F7F7F3] dark:bg-[#2A2A2A] border border-[#E5E5E0] dark:border-[#333333] rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
            />
          </div>
        </div>

        {/* Tag List */}
        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
          {filteredTags.length > 0 ? (
            <div className="grid grid-cols-1 gap-2">
              {filteredTags.map((tag) => (
                <div 
                  key={tag}
                  className="group flex items-center justify-between p-3 rounded-xl hover:bg-[#FBFBFA] dark:hover:bg-[#252525] border border-transparent hover:border-[#E5E5E0] dark:hover:border-[#333333] transition-all"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-[#1A1A1A] dark:text-white">#{tag}</span>
                  </div>
                  <button
                    onClick={() => setTagToDelete(tag)}
                    className="p-2 text-[#8E8E8E] hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                    title="Delete tag"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-40 flex flex-col items-center justify-center text-center p-6">
              <div className="w-12 h-12 bg-[#F7F7F3] dark:bg-[#2A2A2A] rounded-full flex items-center justify-center mb-3">
                <Search className="w-6 h-6 text-[#E5E5E0] dark:text-[#333333]" />
              </div>
              <p className="text-[14px] text-[#8E8E8E]">No tags found</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#F0F0EA] dark:border-[#2A2A2A] bg-[#FBFBFA] dark:bg-[#1E1E1E]">
          <p className="text-[11px] text-[#8E8E8E] text-center italic">
            Note: Deleting a tag removes it from all associated transactions.
          </p>
        </div>
      </div>

      {/* Delete Confirmation */}
      <AlertDialog open={!!tagToDelete} onOpenChange={(open) => !open && setTagToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="w-12 h-12 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-2">
              <AlertCircle className="w-6 h-6 text-red-500" />
            </div>
            <AlertDialogTitle>Permanent Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <span className="font-bold text-[#1A1A1A] dark:text-white">#{tagToDelete}</span>? 
              This will remove it from all records and cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={(e) => {
                e.preventDefault();
                handleDelete();
              }}
              disabled={isDeleting}
              className="bg-red-500 hover:bg-red-600 text-white border-none"
            >
              {isDeleting ? "Deleting..." : "Confirm Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
