import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getSessionDevice } from "./getSessionDevice";
import type { SessionInfo } from "./types";

type Props = {
  sessions: SessionInfo[];
  dateFormatter: Intl.DateTimeFormat;
  revokingAllSessions: boolean;
  revokingSessionId: string | null;
  onRevokeAll: () => void;
  onRevokeSession: (sessionId: string) => void;
};

export function DevicesSection({
  sessions,
  dateFormatter,
  revokingAllSessions,
  revokingSessionId,
  onRevokeAll,
  onRevokeSession,
}: Props) {
  const currentSessionCount = sessions.filter((session) => session.current).length;

  return (
    <section className="mb-12">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Sessions</h2>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          {currentSessionCount > 0 ? "You are signed in on this device." : "Review your active sessions."}
        </p>
      </div>

      <div className="mb-4 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Button
          variant="outline"
          onClick={onRevokeAll}
          disabled={revokingAllSessions}
          className="w-full shrink-0 sm:ml-auto sm:w-auto"
        >
          {revokingAllSessions ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Logging out…
            </>
          ) : (
            "Log out of all other devices"
          )}
        </Button>
      </div>

      <div className="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
              <tr>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-900 dark:text-white">Session</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-900 dark:text-white">Last active</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-900 dark:text-white">Action</th>
              </tr>
            </thead>
            <tbody>
              {sessions.length === 0 ? (
                <tr>
                  <td colSpan={3} className="py-8 px-4 text-center text-sm text-gray-600 dark:text-gray-400">
                    No active sessions found.
                  </td>
                </tr>
              ) : (
                sessions.map((session) => {
                  const device = getSessionDevice(session);
                  const Icon = device.icon;
                  const lastActive = session.lastSeenAt || session.createdAt;
                  const isCurrent = session.current;
                  const rowBusy = revokingSessionId === session.id;

                  return (
                    <tr
                      key={session.id}
                      className="border-b border-gray-200 dark:border-gray-800 last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-900"
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                          <span className="text-sm text-gray-900 dark:text-white">{device.label}</span>
                          {isCurrent && (
                            <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">This Device</span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {lastActive ? (isCurrent ? "Now" : dateFormatter.format(new Date(lastActive))) : "Unknown"}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        {!isCurrent && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onRevokeSession(session.id)}
                            disabled={rowBusy}
                          >
                            {rowBusy ? (
                              <>
                                <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                                Logging out
                              </>
                            ) : (
                              "Log out"
                            )}
                          </Button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
