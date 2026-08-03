export type StdoutPolicyInput = {
  isStdoutTty: boolean;
  json: boolean;
  forceStdout: boolean;
  outputUrlOnly: boolean;
};

export function assertStdoutWriteAllowed(input: StdoutPolicyInput): void {
  if (input.isStdoutTty) return;
  if (input.forceStdout || input.outputUrlOnly) return;

  throw new Error(
    "stdout is not a terminal (piped or captured). Refusing to print note output to CI logs. " +
      "Pass --force-stdout or --output-url-only if you intend to write the link to a pipe or file.",
  );
}

/** Warnings when bypassing the non-TTY stdout guard (stderr only). */
export function stdoutBypassWarnings(input: StdoutPolicyInput): string[] {
  if (input.isStdoutTty) return [];

  const warnings: string[] = [];
  if (input.outputUrlOnly) {
    warnings.push(
      "privatenote: warning — writing the note URL to non-terminal stdout (--output-url-only). " +
        "Redirect to a chmod 600 file; do not tee into CI logs.",
    );
  }
  if (input.forceStdout) {
    warnings.push(
      "privatenote: warning — writing note output to non-terminal stdout (--force-stdout). " +
        "Use masked secrets in CI; never echo the URL or JSON to build logs.",
    );
  }
  return warnings;
}
