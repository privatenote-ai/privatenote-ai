import { z } from "zod";
import { getConfig } from "../config.ts";
import { fetchAuthMe, logoutRemote, pollDeviceAuth, startDeviceAuth } from "../apiClient.ts";
import {
  clearStoredSession,
  writeStoredSession,
} from "../sessionStore.ts";
import { spawn } from "node:child_process";

function openInBrowser(url: string): void {
  try {
    if (process.platform === "darwin") {
      spawn("open", [url], { stdio: "ignore", detached: true }).unref();
    } else if (process.platform === "win32") {
      spawn("cmd", ["/c", "start", "", url], { stdio: "ignore", detached: true }).unref();
    } else {
      spawn("xdg-open", [url], { stdio: "ignore", detached: true }).unref();
    }
  } catch {
    /* user can open the URL manually */
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const signInSchema = z.object({
  pollDeviceCode: z
    .string()
    .optional()
    .describe(
      "After the first sign_in returns verificationUriComplete, call again with this device code to finish sign-in. Omit to start a new sign-in and receive the approve URL immediately.",
    ),
});

export async function handleSignIn(args: z.infer<typeof signInSchema>) {
  const { apiBaseUrl } = getConfig();
  const existing = await fetchAuthMe(apiBaseUrl);
  if (existing && !args.pollDeviceCode) {
    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify(
            {
              status: "already_signed_in",
              email: existing.email,
              accountType: existing.accountType,
            },
            null,
            2,
          ),
        },
      ],
    };
  }

  const started = args.pollDeviceCode
    ? {
        deviceCode: args.pollDeviceCode,
        userCode: "",
        verificationUriComplete: "",
        expiresIn: 600,
        interval: 3,
      }
    : await startDeviceAuth(apiBaseUrl);

  if (!args.pollDeviceCode && started.verificationUriComplete) {
    openInBrowser(started.verificationUriComplete);
    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify(
            {
              status: "authorization_pending",
              verificationUriComplete: started.verificationUriComplete,
              pollDeviceCode: started.deviceCode,
              expiresIn: started.expiresIn,
              message:
                "A browser window should have opened to approve this MCP client. Ask the user to sign in if needed and click Approve. Do not ask them to type or confirm a code — the link already carries it. Then call sign_in again with pollDeviceCode until status is signed_in. If no window opened, share verificationUriComplete.",
            },
            null,
            2,
          ),
        },
      ],
    };
  }

  const deadline = Date.now() + 180_000;
  const intervalMs = Math.max(2, started.interval) * 1000;
  while (Date.now() < deadline) {
    try {
      const poll = await pollDeviceAuth(apiBaseUrl, started.deviceCode);
      if (poll.status === "authorized" && poll.accessToken) {
        await writeStoredSession({
          accessToken: poll.accessToken,
          apiBaseUrl,
          storedAt: new Date().toISOString(),
        });
        const me = await fetchAuthMe(apiBaseUrl);
        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify(
                {
                  status: "signed_in",
                  email: me?.email ?? null,
                  accountType: me?.accountType ?? null,
                },
                null,
                2,
              ),
            },
          ],
        };
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Sign-in failed";
      if (/expired|denied/i.test(message)) {
        return {
          content: [{ type: "text" as const, text: message }],
          isError: true,
        };
      }
      throw err;
    }
    await sleep(intervalMs);
  }

  return {
    content: [
      {
        type: "text" as const,
        text: JSON.stringify(
          {
            status: "authorization_pending",
            verificationUriComplete: started.verificationUriComplete,
            pollDeviceCode: started.deviceCode,
            message:
              "Ask the user to click Approve in the browser (no code to type). Then call sign_in again with pollDeviceCode. If the page is missing, share verificationUriComplete.",
          },
          null,
          2,
        ),
      },
    ],
  };
}

export const whoamiSchema = z.object({});

export async function handleWhoami() {
  const { apiBaseUrl } = getConfig();
  const me = await fetchAuthMe(apiBaseUrl);
  if (!me) {
    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify({ signedIn: false }, null, 2),
        },
      ],
    };
  }
  return {
    content: [
      {
        type: "text" as const,
        text: JSON.stringify(
          { signedIn: true, email: me.email, accountType: me.accountType },
          null,
          2,
        ),
      },
    ],
  };
}

export const signOutSchema = z.object({});

export async function handleSignOut() {
  const { apiBaseUrl } = getConfig();
  await logoutRemote(apiBaseUrl);
  await clearStoredSession();
  return {
    content: [
      {
        type: "text" as const,
        text: JSON.stringify({ signedOut: true }, null, 2),
      },
    ],
  };
}
