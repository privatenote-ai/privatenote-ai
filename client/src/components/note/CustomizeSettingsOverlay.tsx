import React from "react";
import { NoteSettingsPanel, type NoteSettingsPanelProps } from "./NoteSettingsPanel";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useLanguage } from "@/context/LanguageContext";

type CustomizeSettingsOverlayProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isMobile: boolean;
  settings: Omit<NoteSettingsPanelProps, "presentation" | "showAdvancedOptions">;
};

function CustomizeDoneButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex w-full items-center justify-center rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/40"
    >
      {label}
    </button>
  );
}

export const CustomizeSettingsOverlay: React.FC<CustomizeSettingsOverlayProps> = ({
  open,
  onOpenChange,
  isMobile,
  settings,
}) => {
  const { t } = useLanguage();
  const doneLabel = t.customizeDone ?? "Done";
  const close = () => onOpenChange(false);
  const panel = (
    <NoteSettingsPanel {...settings} presentation="overlay" showAdvancedOptions />
  );

  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent
          side="bottom"
          className="flex max-h-[90vh] flex-col gap-0 rounded-t-2xl p-0"
        >
          <SheetHeader className="shrink-0 border-b border-gray-200/80 px-4 pb-3 pt-4 text-left dark:border-gray-800/80">
            <SheetTitle>{t.customize}</SheetTitle>
          </SheetHeader>
          <div className="min-h-0 flex-1 overflow-y-auto px-4 py-3">{panel}</div>
          <SheetFooter className="shrink-0 border-t border-gray-200/80 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] dark:border-gray-800/80 sm:flex-col sm:space-x-0">
            <CustomizeDoneButton label={doneLabel} onClick={close} />
          </SheetFooter>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[90vh] flex-col gap-0 overflow-hidden p-0 sm:max-w-2xl">
        <DialogHeader className="shrink-0 border-b border-gray-200/80 px-6 pb-3 pt-6 dark:border-gray-800/80">
          <DialogTitle>{t.customize}</DialogTitle>
        </DialogHeader>
        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-4">{panel}</div>
        <DialogFooter className="shrink-0 border-t border-gray-200/80 px-6 py-4 dark:border-gray-800/80 sm:justify-stretch">
          <CustomizeDoneButton label={doneLabel} onClick={close} />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
