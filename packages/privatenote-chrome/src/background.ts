/**
 * Service worker: context menu, keyboard shortcut, selection capture.
 */

import { setPendingSelection } from "./settings.ts";

const CONTEXT_MENU_ID = "privatenote-create";

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: CONTEXT_MENU_ID,
    title: "Create PrivateNote",
    contexts: ["selection"],
  });
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId !== CONTEXT_MENU_ID || !info.selectionText?.trim()) {
    return;
  }
  await openPopupWithSelection(info.selectionText, tab?.id);
});

chrome.commands.onCommand.addListener(async (command) => {
  if (command !== "create-from-selection") return;

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab?.id) return;

  const selection = await getSelectedTextFromTab(tab.id);
  if (!selection?.trim()) {
    await chrome.action.setBadgeText({ text: "!" });
    await chrome.action.setBadgeBackgroundColor({ color: "#0000FF" });
    await chrome.action.setTitle({ title: "PrivateNote — select text first, then use the shortcut" });
    return;
  }

  await openPopupWithSelection(selection, tab.id);
});

async function openPopupWithSelection(text: string, tabId?: number): Promise<void> {
  await setPendingSelection(text);
  await chrome.action.setBadgeText({ text: "1" });
  await chrome.action.setBadgeBackgroundColor({ color: "#0000FF" });
  await chrome.action.setTitle({ title: "PrivateNote — selection ready" });

  try {
    await chrome.action.openPopup();
    await chrome.action.setBadgeText({ text: "" });
  } catch {
    // openPopup fails when no user gesture (older Chrome) — badge prompts user to click icon.
    if (tabId) {
      await chrome.action.setTitle({
        title: "PrivateNote — click to create note from selection",
      });
    }
  }
}

async function getSelectedTextFromTab(tabId: number): Promise<string | null> {
  try {
    const [{ result }] = await chrome.scripting.executeScript({
      target: { tabId },
      func: () => window.getSelection()?.toString() ?? "",
    });
    return typeof result === "string" ? result : null;
  } catch {
    return null;
  }
}
