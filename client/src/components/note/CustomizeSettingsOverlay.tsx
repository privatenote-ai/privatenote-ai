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

function CustomizeDoneButton({
  id,
  label,
  onClick,
}: {
  id?: string;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      id={id}
      type="button"
      onClick={onClick}
      className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-1.5 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/40"
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
          onOpenAutoFocus={(event) => {
            event.preventDefault();
            const done = document.getElementById("customize-settings-done-mobile");
            if (done instanceof HTMLElement) done.focus();
          }}
        >
          <SheetHeader className="shrink-0 border-b border-gray-200/80 px-4 pb-3 pt-4 text-left dark:border-gray-800/80">
            <SheetTitle>{t.customize}</SheetTitle>
          </SheetHeader>
          <div className="min-h-0 flex-1 overflow-y-auto px-4 py-3">{panel}</div>
          <SheetFooter className="shrink-0 border-t border-gray-200/80 px-4 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] dark:border-gray-800/80 sm:flex-row sm:justify-end sm:space-x-0">
            <CustomizeDoneButton
              id="customize-settings-done-mobile"
              label={doneLabel}
              onClick={close}
            />
          </SheetFooter>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="flex max-h-[90vh] flex-col gap-0 overflow-hidden p-0 sm:max-w-2xl"
        onOpenAutoFocus={(event) => {
          event.preventDefault();
          const done = document.getElementById("customize-settings-done");
          if (done instanceof HTMLElement) done.focus();
        }}
      >
        <DialogHeader className="shrink-0 border-b border-gray-200/80 px-6 pb-3 pt-6 dark:border-gray-800/80">
          <DialogTitle>{t.customize}</DialogTitle>
        </DialogHeader>
        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-4">{panel}</div>
        <DialogFooter className="shrink-0 border-t border-gray-200/80 px-6 py-3 dark:border-gray-800/80 sm:justify-end">
          <CustomizeDoneButton id="customize-settings-done" label={doneLabel} onClick={close} />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
