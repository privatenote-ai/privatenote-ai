import React from "react";
import { NoteSettingsPanel, type NoteSettingsPanelProps } from "./NoteSettingsPanel";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
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

export const CustomizeSettingsOverlay: React.FC<CustomizeSettingsOverlayProps> = ({
  open,
  onOpenChange,
  isMobile,
  settings,
}) => {
  const { t } = useLanguage();
  const panel = (
    <NoteSettingsPanel {...settings} presentation="overlay" showAdvancedOptions />
  );

  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent
          side="bottom"
          className="max-h-[90vh] overflow-y-auto rounded-t-2xl px-4 pb-8 pt-2"
        >
          <SheetHeader className="pb-2 text-left">
            <SheetTitle>{t.customize}</SheetTitle>
          </SheetHeader>
          {panel}
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{t.customize}</DialogTitle>
        </DialogHeader>
        {panel}
      </DialogContent>
    </Dialog>
  );
};
