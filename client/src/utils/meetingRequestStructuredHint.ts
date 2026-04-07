/**
 * Best-effort extraction for meeting-request template hints (small-tier prompts).
 * If confidence is low, returns an empty string — wrong hints hurt more than none.
 */

const MAX_RECIPIENT_CHARS = 100;
const MAX_TOPIC_CHARS = 220;
const MIN_CHARS = 3;
const MAX_RECIPIENT_WORDS = 14;
const MAX_TOPIC_WORDS = 48;

function stripSchedulingTail(s: string): string {
  let t = s.trim().replace(/[,.;:]+$/, "").trim();
  t = t.replace(/\s+(?:next|this)\s+(?:week|month|year)\b.*$/i, "").trim();
  t = t.replace(/\s+(?:tomorrow|today)\b.*$/i, "").trim();
  t = t.replace(
    /\s+on\s+(?:mon|tues|wednes|thurs|fri|satur|sun)day\b.*$/i,
    ""
  ).trim();
  t = t.replace(/\s+at\s+\d{1,2}(?::\d{2})?\s*(?:am|pm)?\b.*$/i, "").trim();
  t = t.replace(/\s+if\s+we\s+can\s+meet\b.*$/i, "").trim();
  return t;
}

function wordCount(s: string): number {
  return s.split(/\s+/).filter(Boolean).length;
}

function isPlausibleRecipient(s: string): boolean {
  const t = s.trim();
  if (t.length < MIN_CHARS || t.length > MAX_RECIPIENT_CHARS) return false;
  if (/[\n\r]/.test(t)) return false;
  if (wordCount(t) > MAX_RECIPIENT_WORDS) return false;
  if (/^(you|me|us|them|someone|anyone|everyone)\b/i.test(t)) return false;
  if (/\b(the|a)\s+(meeting|call|team|group)\b/i.test(t)) return false;
  return true;
}

function isPlausibleTopic(s: string): boolean {
  const t = s.trim();
  if (t.length < MIN_CHARS || t.length > MAX_TOPIC_CHARS) return false;
  if (/[\n\r]/.test(t)) return false;
  if (wordCount(t) > MAX_TOPIC_WORDS) return false;
  return true;
}

/** Combined high-confidence: "… meeting with X for Y …" */
function tryMeetingWithFor(u: string): { recipient: string; topic: string } | null {
  const m = u.match(
    /\b(?:need\s+(?:a\s+)?)?(?:a\s+)?(?:short\s+)?(?:meeting|call|sync)\s+with\s+(.+?)\s+for\s+([^.!?\n]+)/i
  );
  if (!m) return null;
  const recipient = m[1].trim().replace(/[,:;]+$/, "").trim();
  const topic = stripSchedulingTail(m[2]);
  if (isPlausibleRecipient(recipient) && isPlausibleTopic(topic)) {
    return { recipient, topic };
  }
  return null;
}

/** "… time with X regarding|about Y" */
function tryTimeWithRegardingOrAbout(
  u: string
): { recipient: string; topic: string } | null {
  const m =
    u.match(
      /\bset\s+up\s+time\s+with\s+(.+?)\s+(?:regarding|about)\s+([^.!?\n]+)/i
    ) ??
    u.match(/\btime\s+with\s+(.+?)\s+(?:regarding|about)\s+([^.!?\n]+)/i);
  if (!m) return null;
  const recipient = m[1].trim().replace(/[,:;]+$/, "").trim();
  const topic = stripSchedulingTail(m[2]);
  if (isPlausibleRecipient(recipient) && isPlausibleTopic(topic)) {
    return { recipient, topic };
  }
  return null;
}

/** "… meeting|call|sync with X about|regarding|to discuss Y" */
function tryMeetingWithDelimitedTopic(
  u: string
): { recipient: string; topic: string } | null {
  const m = u.match(
    /\b(?:meeting|call|sync)\s+with\s+(.+?)\s+(?:about|regarding|to\s+discuss)\s+([^.!?\n]+)/i
  );
  if (!m) return null;
  const recipient = m[1].trim().replace(/[,:;]+$/, "").trim();
  const topic = stripSchedulingTail(m[2]);
  if (isPlausibleRecipient(recipient) && isPlausibleTopic(topic)) {
    return { recipient, topic };
  }
  return null;
}

/** "email X … to discuss Y" */
function tryEmailToDiscuss(u: string): { recipient: string; topic: string } | null {
  const m = u.match(
    /\b(?:email|e-mail)\s+(.+?)\s+to\s+discuss\s+([^.!?\n]+)/i
  );
  if (!m) return null;
  const recipient = m[1].trim().replace(/[,:;]+$/, "").trim();
  const topic = stripSchedulingTail(m[2]);
  if (isPlausibleRecipient(recipient) && isPlausibleTopic(topic)) {
    return { recipient, topic };
  }
  return null;
}

/** "ask X if … about Y" (topic must exist) */
function tryAskIfAbout(u: string): { recipient: string; topic: string } | null {
  const m = u.match(/\bask\s+(.+?)\s+if\s+[^.!?\n]*?\babout\s+([^.!?\n]+)/i);
  if (!m) return null;
  const recipient = m[1].trim().replace(/[,:;]+$/, "").trim();
  const topic = stripSchedulingTail(m[2]);
  if (isPlausibleRecipient(recipient) && isPlausibleTopic(topic)) {
    return { recipient, topic };
  }
  return null;
}

/** "request|schedule … meeting|call|intro … with X about|regarding|to discuss Y" */
function tryRequestOrScheduleMeetingWithTopic(
  u: string
): { recipient: string; topic: string } | null {
  const m = u.match(
    /\b(?:request|schedule)\s+(?:a\s+)?(?:\d+[-\s]?(?:minute|min)\s+)?(?:meeting|call|intro|sync)\s+with\s+(.+?)\s+(?:about|regarding|to\s+discuss)\s+([^.!?\n]+)/i
  );
  if (!m) return null;
  const recipient = m[1].trim().replace(/[,:;]+$/, "").trim();
  const topic = stripSchedulingTail(m[2]);
  if (isPlausibleRecipient(recipient) && isPlausibleTopic(topic)) {
    return { recipient, topic };
  }
  return null;
}

const PAIRED_EXTRACTORS: ReadonlyArray<
  (u: string) => { recipient: string; topic: string } | null
> = [
  tryMeetingWithFor,
  tryTimeWithRegardingOrAbout,
  tryRequestOrScheduleMeetingWithTopic,
  tryMeetingWithDelimitedTopic,
  tryEmailToDiscuss,
  tryAskIfAbout,
];

/**
 * Returns recipient + topic only when a paired pattern matches with sane lengths.
 * Exported for unit tests.
 */
export function tryExtractMeetingRecipientAndTopic(
  userInput: string
): { recipient: string; topic: string } | null {
  const u = userInput.trim();
  if (!u) return null;
  for (const ex of PAIRED_EXTRACTORS) {
    const pair = ex(u);
    if (pair) return pair;
  }
  return null;
}

/**
 * Best-effort lines for the model. Empty string if extraction is not confident.
 */
export function buildMeetingStructuredHint(userInput: string): string {
  const pair = tryExtractMeetingRecipientAndTopic(userInput);
  if (!pair) return "";

  return (
    "Best-effort cues (auto-parsed; if anything does not match the USER REQUEST, ignore these lines and use the request only):\n" +
    `- Recipient (from user): ${pair.recipient}\n` +
    `- Purpose / topic (from user): ${pair.topic}\n\n`
  );
}
