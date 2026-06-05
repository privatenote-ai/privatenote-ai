import { useEffect, useMemo, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { MoreHorizontal, Shield, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import type { PasskeyInfo } from "./types";

type Props = {
  open: boolean;
  passkeys: PasskeyInfo[];
  registeringPasskey: boolean;
  renamingPasskeyId: string | null;
  deletingPasskeyId: string | null;
  dateFormatter: Intl.DateTimeFormat;
  onClose: () => void;
  onAddPasskey: () => void;
  onRenamePasskey: (id: string, displayName: string) => Promise<void>;
  onDeletePasskey: (id: string, label: string) => Promise<void>;
};

function passkeySubtitle(passkey: PasskeyInfo, dateFormatter: Intl.DateTimeFormat, lastUsedLabel: string, addedLabel: string): string {
  if (passkey.lastUsedAt) {
    return `${lastUsedLabel} ${dateFormatter.format(new Date(passkey.lastUsedAt))}`;
  }
  return `${addedLabel} ${dateFormatter.format(new Date(passkey.createdAt))}`;
}

export function ManagePasskeysDialog({
  open,
  passkeys,
  registeringPasskey,
  renamingPasskeyId,
  deletingPasskeyId,
  dateFormatter,
  onClose,
  onAddPasskey,
  onRenamePasskey,
  onDeletePasskey,
}: Props) {
  const { t } = useLanguage();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftName, setDraftName] = useState("");

  useEffect(() => {
    if (!open) {
      setEditingId(null);
      setDraftName("");
    }
  }, [open]);

  const activePasskeys = useMemo(() => passkeys, [passkeys]);

  return (
    <Dialog open={open} onOpenChange={(next) => !next && onClose()}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader className="items-center text-center sm:text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-500 dark:bg-gray-900 dark:text-gray-300">
            <Shield className="h-6 w-6" />
          </div>
          <DialogTitle className="text-3xl font-semibold tracking-tight">{t.authSecManagePasskeysTitle || "Manage passkeys"}</DialogTitle>
          <DialogDescription className="max-w-md text-base leading-7">
            {t.authSecManagePasskeysDesc || "Use your device's built-in security features to sign in without remembering passwords."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <h3 className="text-base font-semibold text-gray-900 dark:text-white">{t.authSecActivePasskeys || "Active passkeys"}</h3>
            <div className="mt-3 space-y-3">
              {activePasskeys.length === 0 ? (
                <div className="rounded-lg border border-gray-200 px-4 py-3 text-sm text-gray-600 dark:border-gray-800 dark:text-gray-400">
                  {t.authSecNoPasskeysYet || "No passkeys added yet."}
                </div>
              ) : (
                activePasskeys.map((passkey) => {
                  const isEditing = editingId === passkey.id;
                  const isRenaming = renamingPasskeyId === passkey.id;
                  const isDeleting = deletingPasskeyId === passkey.id;
                  return (
                    <div
                      key={passkey.id}
                      className="rounded-lg border border-gray-200 px-4 py-3 dark:border-gray-800"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex min-w-0 items-start gap-3">
                          <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-gray-100 text-gray-600 dark:bg-gray-900 dark:text-gray-300">
                            <Shield className="h-5 w-5" />
                          </div>
                          <div className="min-w-0">
                            {isEditing ? (
                              <div className="space-y-2">
                                <Input
                                  value={draftName}
                                  onChange={(e) => setDraftName(e.target.value)}
                                  maxLength={80}
                                  placeholder={passkey.generatedLabel || "Passkey name"}
                                  disabled={isRenaming}
                                  autoFocus
                                />
                                <div className="flex gap-2">
                                  <Button
                                    size="sm"
                                    onClick={() => {
                                      void (async () => {
                                        try {
                                          await onRenamePasskey(passkey.id, draftName);
                                          setEditingId(null);
                                          setDraftName("");
                                        } catch {
                                          // toast already handled by parent
                                        }
                                      })();
                                    }}
                                    disabled={isRenaming}
                                  >
                                    {isRenaming ? (t.authSecSaving || "Saving...") : (t.authSecSave || "Save")}
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => {
                                      setEditingId(null);
                                      setDraftName("");
                                    }}
                                    disabled={isRenaming}
                                  >
                                    {t.authSecCancel || "Cancel"}
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              <>
                                <p className="truncate text-base font-medium text-gray-900 dark:text-white">
                                  {passkey.label}
                                </p>
                                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                  {passkeySubtitle(passkey, dateFormatter, t.authSecPasskeyLastUsed || "Last used", t.authSecPasskeyAddedOn || "Added")}
                                </p>
                              </>
                            )}
                          </div>
                        </div>
                        {!isEditing && (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <button
                                type="button"
                                className="rounded p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200"
                                aria-label={`${t.authManage || "Manage"} ${passkey.label}`}
                                disabled={isDeleting}
                              >
                                {isDeleting ? <Loader2 className="h-5 w-5 animate-spin" /> : <MoreHorizontal className="h-5 w-5" />}
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => {
                                  setEditingId(passkey.id);
                                  setDraftName(passkey.customLabel ?? "");
                                }}
                              >
                                {t.authSecRenamePasskey || "Rename passkey"}
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => void onDeletePasskey(passkey.id, passkey.label)}
                                className="text-red-600 focus:text-red-600 dark:text-red-400 dark:focus:text-red-400"
                              >
                                {t.authSecDeletePasskey || "Delete passkey"}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <Button className="w-full" onClick={onAddPasskey} disabled={registeringPasskey}>
              {registeringPasskey ? (t.authSecAddingPasskey || "Adding...") : (t.authSecAddNewPasskey || "Add new passkey")}
            </Button>
            <Button variant="outline" className="w-full" onClick={onClose}>
              {t.authSecCancel || "Cancel"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
