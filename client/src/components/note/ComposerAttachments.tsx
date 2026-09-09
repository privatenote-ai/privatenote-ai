import { Camera, File, FolderArchive, Mic, Paperclip, Plus, X } from "lucide-react";
import { formatNoteFileSize } from "@shared/noteFileLimits";
import { formatAttachmentDisplayName } from "@/utils/formatAttachmentDisplayName";
import { isVoiceMessageFile } from "@/utils/voiceMessageRecording";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

function isImageFile(file: File): boolean {
  return file.type.startsWith("image/") || /\.(jpe?g|png|gif|webp|heic|heif)$/i.test(file.name);
}

function AttachmentTypeIcon({ file }: { file: File }) {
  const className = "h-4 w-4 shrink-0 text-primary";
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
}: {
  files: File[];
  onRemove: (index: number) => void;
  removeLabel: string;
}) {
  if (files.length === 0) return null;
  return (
    <ul className="max-h-[min(40vh,16rem)] space-y-0 overflow-y-auto">
      {files.map((file, index) => (
        <li
          key={`${file.name}-${file.size}-${file.lastModified}-${index}`}
          className="flex items-center gap-3 border-b border-gray-100 py-2 last:border-b-0 dark:border-gray-800"
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-primary/15 bg-primary/8">
            <AttachmentTypeIcon file={file} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-gray-900 dark:text-gray-100" title={file.name}>
              {formatAttachmentDisplayName(file.name)}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{formatNoteFileSize(file.size)}</p>
          </div>
          <button
            type="button"
            onClick={() => onRemove(index)}
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-gray-300 text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100"
            aria-label={`${removeLabel}: ${formatAttachmentDisplayName(file.name)}`}
          >
            <X className="h-4 w-4" aria-hidden />
          </button>
        </li>
      ))}
    </ul>
  );
}

type ComposerAddActionsProps = {
  isMobile: boolean;
  canAdd: boolean;
  addDisabledReason?: string;
  isPreparingFolder: boolean;
  recordDisabled: boolean;
  showFolder: boolean;
  addSheetOpen: boolean;
  onAddSheetOpenChange: (open: boolean) => void;
  onAddFile: () => void;
  onAddFolder: () => void;
  onTakePhoto: () => void;
  onRecord: () => void;
  labels: {
    add: string;
    addToTransfer: string;
    addFile: string;
    addFileHint: string;
    takePhoto: string;
    takePhotoHint: string;
    record: string;
    recordHint: string;
    folder: string;
    cancel: string;
  };
  attachActionButtonClass: string;
};

export function ComposerAddActions({
  isMobile,
  canAdd,
  addDisabledReason,
  isPreparingFolder,
  recordDisabled,
  showFolder,
  addSheetOpen,
  onAddSheetOpenChange,
  onAddFile,
  onAddFolder,
  onTakePhoto,
  onRecord,
  labels,
  attachActionButtonClass,
}: ComposerAddActionsProps) {
  const disabled = !canAdd || isPreparingFolder;

  if (isMobile) {
    return (
      <>
        <button
          type="button"
          disabled={disabled}
          title={addDisabledReason}
          onClick={() => onAddSheetOpenChange(true)}
          className="inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-primary disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Plus className="h-4 w-4" aria-hidden />
          {labels.add}
        </button>
        <Drawer open={addSheetOpen} onOpenChange={onAddSheetOpenChange}>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>{labels.addToTransfer}</DrawerTitle>
              <DrawerDescription>{addDisabledReason || labels.addFileHint}</DrawerDescription>
            </DrawerHeader>
            <div className="flex flex-col gap-1 px-4 pb-6">
              <button
                type="button"
                disabled={disabled}
                onClick={() => {
                  onAddSheetOpenChange(false);
                  window.setTimeout(() => onAddFile(), 0);
                }}
                className="flex items-center gap-3 rounded-lg px-2 py-3 text-left text-sm font-medium text-gray-900 hover:bg-gray-50 disabled:opacity-50 dark:text-gray-100 dark:hover:bg-gray-800"
              >
                <File className="h-5 w-5 text-primary" aria-hidden />
                <span>
                  {labels.addFile}
                  <span className="mt-0.5 block text-xs font-normal text-gray-500 dark:text-gray-400">
                    {labels.addFileHint}
                  </span>
                </span>
              </button>
              <button
                type="button"
                disabled={disabled}
                onClick={() => {
                  onAddSheetOpenChange(false);
                  window.setTimeout(() => onTakePhoto(), 0);
                }}
                className="flex items-center gap-3 rounded-lg px-2 py-3 text-left text-sm font-medium text-gray-900 hover:bg-gray-50 disabled:opacity-50 dark:text-gray-100 dark:hover:bg-gray-800"
              >
                <Camera className="h-5 w-5 text-primary" aria-hidden />
                <span>
                  {labels.takePhoto}
                  <span className="mt-0.5 block text-xs font-normal text-gray-500 dark:text-gray-400">
                    {labels.takePhotoHint}
                  </span>
                </span>
              </button>
              <button
                type="button"
                disabled={disabled || recordDisabled}
                onClick={() => {
                  onAddSheetOpenChange(false);
                  window.setTimeout(() => onRecord(), 0);
                }}
                className="flex items-center gap-3 rounded-lg px-2 py-3 text-left text-sm font-medium text-gray-900 hover:bg-gray-50 disabled:opacity-50 dark:text-gray-100 dark:hover:bg-gray-800"
              >
                <Mic className="h-5 w-5 text-primary" aria-hidden />
                <span>
                  {labels.record}
                  <span className="mt-0.5 block text-xs font-normal text-gray-500 dark:text-gray-400">
                    {labels.recordHint}
                  </span>
                </span>
              </button>
              {showFolder ? (
                <button
                  type="button"
                  disabled={disabled}
                  onClick={() => {
                    onAddSheetOpenChange(false);
                    window.setTimeout(() => onAddFolder(), 0);
                  }}
                  className="flex items-center gap-3 rounded-lg px-2 py-3 text-left text-sm font-medium text-gray-900 hover:bg-gray-50 disabled:opacity-50 dark:text-gray-100 dark:hover:bg-gray-800"
                >
                  <FolderArchive className="h-5 w-5 text-primary" aria-hidden />
                  {labels.folder}
                </button>
              ) : null}
            </div>
          </DrawerContent>
        </Drawer>
      </>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        disabled={disabled}
        title={addDisabledReason}
        onClick={onAddFile}
        className={`${attachActionButtonClass} disabled:cursor-not-allowed disabled:opacity-50`}
      >
        <Paperclip className="h-4 w-4" aria-hidden />
        {labels.addFile}
      </button>
      <button
        type="button"
        disabled={disabled}
        title={addDisabledReason}
        onClick={onTakePhoto}
        className={`${attachActionButtonClass} disabled:cursor-not-allowed disabled:opacity-50`}
      >
        <Camera className="h-4 w-4" aria-hidden />
        {labels.takePhoto}
      </button>
      <button
        type="button"
        disabled={disabled || recordDisabled}
        onClick={onRecord}
        className={`${attachActionButtonClass} disabled:cursor-not-allowed disabled:opacity-50`}
      >
        <Mic className="h-4 w-4" aria-hidden />
        {labels.record}
      </button>
      {showFolder ? (
        <button
          type="button"
          disabled={disabled}
          onClick={onAddFolder}
          className={`${attachActionButtonClass} disabled:cursor-not-allowed disabled:opacity-50`}
        >
          <FolderArchive className="h-4 w-4" aria-hidden />
          {labels.folder}
        </button>
      ) : null}
    </div>
  );
}
