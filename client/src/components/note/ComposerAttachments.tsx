import { Camera, ChevronDown, File, FolderArchive, Loader2, Mic, Paperclip, X } from "lucide-react";
import { formatNoteFileSize } from "@shared/noteFileLimits";
import { formatAttachmentDisplayName } from "@/utils/formatAttachmentDisplayName";
import { isVoiceMessageFile } from "@/utils/voiceMessageRecording";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function isImageFile(file: File): boolean {
  return file.type.startsWith("image/") || /\.(jpe?g|png|gif|webp|heic|heif)$/i.test(file.name);
}

function AttachmentTypeIcon({ file }: { file: File }) {
  const className = "h-3.5 w-3.5 shrink-0 text-gray-400 dark:text-gray-500";
  if (isVoiceMessageFile(file)) return <Mic className={className} aria-hidden />;
  if (isImageFile(file)) return <Camera className={className} aria-hidden />;
  if (file.type === "application/zip" || file.name.toLowerCase().endsWith(".zip")) {
    return <FolderArchive className={className} aria-hidden />;
  }
  return <Paperclip className={className} aria-hidden />;
}

export function ComposerAttachmentList({
  files,
  onRemove,
  removeLabel,
  attached = false,
}: {
  files: File[];
  onRemove: (index: number) => void;
  removeLabel: string;
  attached?: boolean;
}) {
  if (files.length === 0) return null;
  const scrollable = files.length > 4;
  return (
    <div
      className={cn(
        "overflow-hidden bg-gray-50/80 dark:bg-gray-900/45",
        attached
          ? "-mt-px rounded-b-lg border border-t-0 border-primary/60 dark:border-primary/40"
          : "rounded-lg border border-gray-200 dark:border-gray-700",
      )}
    >
      <ul className={scrollable ? "max-h-[13rem] overflow-y-auto" : undefined}>
        {files.map((file, index) => (
          <li
            key={`${file.name}-${file.size}-${file.lastModified}-${index}`}
            className="flex h-12 items-center gap-2 border-b border-gray-200/70 px-2.5 last:border-b-0 dark:border-gray-800"
          >
            <AttachmentTypeIcon file={file} />
            <p
              className="min-w-0 flex-1 truncate text-[13px] leading-none text-gray-600 dark:text-gray-300"
              title={file.name}
            >
              {formatAttachmentDisplayName(file.name)}
              <span className="text-gray-400 dark:text-gray-500">
                {" · "}
                {formatNoteFileSize(file.size)}
              </span>
            </p>
            <button
              type="button"
              onClick={() => onRemove(index)}
              className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-gray-400 transition-colors hover:bg-gray-200/70 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/30 dark:text-gray-500 dark:hover:bg-gray-800 dark:hover:text-gray-200"
              aria-label={`${removeLabel}: ${formatAttachmentDisplayName(file.name)}`}
            >
              <X className="h-3.5 w-3.5" aria-hidden />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

type AttachLabels = {
  attach: string;
  files: string;
  folder: string;
  zipping: string;
};

export function ComposerAttachControl({
  disabled,
  isPreparingFolder,
  showFolder,
  addDisabledReason,
  fileInputId,
  onAddFile,
  onAddFolder,
  labels,
  buttonClassName,
}: {
  disabled: boolean;
  isPreparingFolder: boolean;
  showFolder: boolean;
  addDisabledReason?: string;
  fileInputId?: string;
  onAddFile: () => void;
  onAddFolder: () => void;
  labels: AttachLabels;
  buttonClassName: string;
}) {
  const className = `${buttonClassName} disabled:cursor-not-allowed disabled:opacity-50`;
  const triggerInner = isPreparingFolder ? (
    <>
      <Loader2 className="h-4 w-4 shrink-0 animate-spin" aria-hidden />
      {labels.zipping}
    </>
  ) : (
    <>
      <Paperclip className="h-4 w-4 shrink-0" aria-hidden />
      {labels.attach}
      {showFolder ? <ChevronDown className="h-3.5 w-3.5 shrink-0 opacity-70" aria-hidden /> : null}
    </>
  );

  if (!showFolder || isPreparingFolder) {
    if (fileInputId && !disabled && !isPreparingFolder) {
      return (
        <label htmlFor={fileInputId} title={addDisabledReason} className={`${className} cursor-pointer`}>
          {triggerInner}
        </label>
      );
    }
    return (
      <button
        type="button"
        disabled={disabled || isPreparingFolder}
        title={addDisabledReason}
        onClick={onAddFile}
        className={className}
      >
        {triggerInner}
      </button>
    );
  }

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <button type="button" disabled={disabled} title={addDisabledReason} className={className}>
          {triggerInner}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="min-w-[12rem]">
        {fileInputId && !disabled ? (
          <DropdownMenuItem asChild>
            <label htmlFor={fileInputId} className="cursor-pointer">
              <File aria-hidden />
              {labels.files}
            </label>
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem onSelect={() => onAddFile()}>
            <File aria-hidden />
            {labels.files}
          </DropdownMenuItem>
        )}
        <DropdownMenuItem onSelect={() => onAddFolder()}>
          <FolderArchive aria-hidden />
          {labels.folder}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

type ComposerAddActionsProps = {
  isMobile: boolean;
  canAdd: boolean;
  addDisabledReason?: string;
  isPreparingFolder: boolean;
  showFolder: boolean;
  fileInputId?: string;
  onAddFile: () => void;
  onAddFolder: () => void;
  onTakePhoto: () => void;
  onRecord: () => void;
  labels: {
    attach: string;
    takePhoto: string;
    record: string;
    files: string;
    folder: string;
    zipping: string;
  };
  attachActionButtonClass: string;
};

export function ComposerAddActions({
  isMobile,
  canAdd,
  addDisabledReason,
  isPreparingFolder,
  showFolder,
  fileInputId,
  onAddFile,
  onAddFolder,
  onTakePhoto,
  onRecord,
  labels,
  attachActionButtonClass,
}: ComposerAddActionsProps) {
  const disabled = !canAdd || isPreparingFolder;
  const attachLabels = {
    attach: labels.attach,
    files: labels.files,
    folder: labels.folder,
    zipping: labels.zipping,
  };
  const actionClass = `${attachActionButtonClass} disabled:cursor-not-allowed disabled:opacity-50`;
  const actions = (
    <>
      <ComposerAttachControl
        disabled={disabled}
        isPreparingFolder={isPreparingFolder}
        showFolder={showFolder}
        addDisabledReason={addDisabledReason}
        fileInputId={fileInputId}
        onAddFile={onAddFile}
        onAddFolder={onAddFolder}
        labels={attachLabels}
        buttonClassName={actionClass}
      />
      <button
        type="button"
        disabled={disabled}
        title={addDisabledReason}
        onClick={onTakePhoto}
        className={actionClass}
      >
        <Camera className="h-4 w-4 shrink-0" aria-hidden />
        <span className="max-w-full truncate">{labels.takePhoto}</span>
      </button>
      <button type="button" disabled={disabled} onClick={onRecord} className={actionClass}>
        <Mic className="h-4 w-4 shrink-0" aria-hidden />
        <span className="max-w-full truncate">{labels.record}</span>
      </button>
    </>
  );

  if (isMobile) return actions;
  return <div className="flex flex-wrap items-center gap-2">{actions}</div>;
}
