import TagPill from '../TagPill';
import { FORM_STYLES } from './formStyles';

interface TagsInputProps {
  tags: string[];
  tagInput: string;
  onTagInputChange: (value: string) => void;
  onAddTag: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onRemoveTag: (tag: string) => void;
  disabled?: boolean;
}

export default function TagsInput({
  tags,
  tagInput,
  onTagInputChange,
  onAddTag,
  onRemoveTag,
  disabled,
}: TagsInputProps) {
  return (
    <div>
      <label className={FORM_STYLES.label}>Tags (Press Enter to add)</label>
      <div
        className={`${FORM_STYLES.input} min-h-[46px] flex flex-wrap gap-2 items-center ${
          disabled ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {tags.map((tag) => (
          <TagPill key={tag} label={tag} onRemove={() => onRemoveTag(tag)} />
        ))}
        <input
          type="text"
          value={tagInput}
          onChange={(e) => onTagInputChange(e.target.value)}
          onKeyDown={onAddTag}
          className="bg-transparent outline-none flex-1 min-w-[60px] text-sm"
          placeholder={tags.length === 0 ? 'Add tags...' : ''}
          disabled={disabled}
        />
      </div>
    </div>
  );
}
