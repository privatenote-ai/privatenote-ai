/**
 * LFM-style models may wrap chain-of-thought in `<redacted_thinking>…</redacted_thinking>`.
 * Qwen / DeepSeek-style models often use `<think>…</think>` instead. Both are stripped the same way.
 *
 * We do not block reasoning; we split raw output and only expose user-facing text (never the CoT blob
 * when we can detect it). If the model never closes the tag or puts the note inside reasoning,
 * we try structured fallbacks (e.g. "Putting it all together:" + quoted note).
 *
 * **Nested tags:** Closed blocks are removed with flat regex passes, not a full XML tree. Genuine
 * nesting is uncommon in model output; deeply nested markup can be mis-split in theory.
 *
 * **Streaming buffer:** {@link createRedactedThinkingStreamFilter} caps retained characters; see
 * {@link MAX_REDACTED_THINKING_STREAM_BUFFER}.
 */

/** Max characters retained in the stream filter buffer before forced flush / tail trim (reliability). */
export const MAX_REDACTED_THINKING_STREAM_BUFFER = 64_000;

export const REDACTED_THINKING_OPEN = '<redacted_thinking>';
export const REDACTED_THINKING_CLOSE = '</redacted_thinking>';

const OPEN_RE = /<redacted_thinking\s*>/i;
/** Matches real-world variants: extra attrs, spaces, line breaks inside the tag. */
const OPEN_LOOSE_RE = /<redacted_thinking\b[^>]*>/i;
/** Closing tag: optional space after `/` (some tokenizers). */
const CLOSE_RE = /<\/\s*redacted_thinking\s*>/i;
/** Full closed block: non-greedy inner; open tag may include attributes. */
const CLOSED_BLOCK_RE = /<redacted_thinking\b[^>]*>[\s\S]*?<\/\s*redacted_thinking\s*>/gi;

/** Qwen3-style reasoning blocks (not `<thinking>` — `\b` avoids matching that longer tag). */
const THINK_OPEN_LOOSE_RE = /<think\b[^>]*>/i;
const THINK_CLOSE_RE = /<\/\s*think\s*>/i;
const THINK_CLOSED_BLOCK_RE = /<think\b[^>]*>[\s\S]*?<\/\s*think\s*>/gi;

const LOOSE_OPEN_SUBSTR = /<(?:redacted_thinking|think)\b/i;

type ReasoningKind = "redacted" | "think";

const MAX_OPEN_TAIL_HOLD = 256;
const MAX_CLOSE_TAIL_HOLD = 56;

function findLastThinkingCloseEnd(raw: string): number {
  const re = /<\/\s*redacted_thinking\s*>/gi;
  let end = -1;
  let m: RegExpExecArray | null;
  while ((m = re.exec(raw)) !== null) {
    end = m.index + m[0].length;
  }
  return end;
}

function findLastThinkCloseEnd(raw: string): number {
  const re = /<\/\s*think\s*>/gi;
  let end = -1;
  let m: RegExpExecArray | null;
  while ((m = re.exec(raw)) !== null) {
    end = m.index + m[0].length;
  }
  return end;
}

function findLastAnyReasoningCloseEnd(raw: string): number {
  return Math.max(findLastThinkingCloseEnd(raw), findLastThinkCloseEnd(raw));
}

/**
 * Remove every well-formed thinking block (repeat until stable).
 * Used for post-processing and for detecting orphan opens — not as a prerequisite for {@link parseThinkingOutput}.
 */
export function removeClosedRedactedThinkingBlocks(s: string): string {
  let prev = s.trim();
  for (let i = 0; i < 24; i++) {
    const next = prev.replace(CLOSED_BLOCK_RE, "").replace(THINK_CLOSED_BLOCK_RE, "").trim();
    if (next === prev) break;
    prev = next;
  }
  return prev;
}

/**
 * Remove all loose open/close tag occurrences (global), alternating until stable.
 * Single `.replace()` only hits the first match; this avoids leaving stray pairs that confuse extraction.
 */
function stripLooseThinkingMarkup(s: string): string {
  let t = s;
  for (let i = 0; i < 48; i++) {
    const next = t
      .replace(/<redacted_thinking\b[^>]*>/gi, "")
      .replace(/<\/\s*redacted_thinking\s*>/gi, "")
      .replace(/<think\b[^>]*>/gi, "")
      .replace(/<\/\s*think\s*>/gi, "")
      .trim();
    if (next === t) break;
    t = next;
  }
  return t;
}

/** First close tag in `buf` using the same grammar as {@link CLOSE_RE} (not a literal substring). */
function findFirstCloseMatch(buf: string): { index: number; length: number } | null {
  const re = /<\/\s*redacted_thinking\s*>/gi;
  re.lastIndex = 0;
  const m = re.exec(buf);
  if (!m || m.index === undefined) return null;
  return { index: m.index, length: m[0].length };
}

function findFirstThinkCloseMatch(buf: string): { index: number; length: number } | null {
  const re = /<\/\s*think\s*>/gi;
  re.lastIndex = 0;
  const m = re.exec(buf);
  if (!m || m.index === undefined) return null;
  return { index: m.index, length: m[0].length };
}

function findFirstCloseForKind(
  buf: string,
  kind: ReasoningKind,
): { index: number; length: number } | null {
  return kind === "redacted" ? findFirstCloseMatch(buf) : findFirstThinkCloseMatch(buf);
}

/**
 * `tail` starts at `<`. Returns whether this is a strict prefix of `</\s*redacted_thinking\s*>`
 * (tokenizer may split the close tag across chunks even when we are “outside” — e.g. stray markup).
 */
function closeTagPrefixStatus(tail: string): "none" | "incomplete" | "complete" {
  if (tail.length > MAX_CLOSE_TAIL_HOLD) return "none";
  if (!tail.startsWith("<")) return "none";
  let i = 1;
  if (i >= tail.length) return "incomplete";
  if (tail[i] !== "/") return "none";
  i++;
  while (i < tail.length && /\s/.test(tail[i])) i++;
  const name = "redacted_thinking";
  for (let k = 0; k < name.length; k++) {
    if (i >= tail.length) return "incomplete";
    if (tail[i].toLowerCase() !== name[k]) return "none";
    i++;
  }
  while (i < tail.length && /\s/.test(tail[i])) i++;
  if (i >= tail.length) return "incomplete";
  if (tail[i] === ">") {
    return i === tail.length - 1 ? "complete" : "none";
  }
  return "none";
}

/** Same as {@link closeTagPrefixStatus} for the XML-style </think> close tag. */
function closeThinkTagPrefixStatus(tail: string): "none" | "incomplete" | "complete" {
  if (tail.length > MAX_CLOSE_TAIL_HOLD) return "none";
  if (!tail.startsWith("<")) return "none";
  let i = 1;
  if (i >= tail.length) return "incomplete";
  if (tail[i] !== "/") return "none";
  i++;
  while (i < tail.length && /\s/.test(tail[i])) i++;
  const name = "think";
  for (let k = 0; k < name.length; k++) {
    if (i >= tail.length) return "incomplete";
    if (tail[i].toLowerCase() !== name[k]) return "none";
    i++;
  }
  while (i < tail.length && /\s/.test(tail[i])) i++;
  if (i >= tail.length) return "incomplete";
  if (tail[i] === ">") {
    return i === tail.length - 1 ? "complete" : "none";
  }
  return "none";
}

/**
 * When outside a thinking block, do not emit past a trailing `<` that may still complete into
 * `<redacted_thinking…>`, `<think…>`, or either closing tag (partial tail is not user text).
 */
function withholdOutsideSuffix(buf: string): number {
  const lastLt = buf.lastIndexOf("<");
  if (lastLt === -1) return 0;
  const tail = buf.slice(lastLt);
  const maxHold = Math.max(MAX_OPEN_TAIL_HOLD, MAX_CLOSE_TAIL_HOLD);
  if (tail.length > maxHold) return 0;

  if (closeTagPrefixStatus(tail) === "incomplete") return buf.length - lastLt;
  if (closeThinkTagPrefixStatus(tail) === "incomplete") return buf.length - lastLt;

  if (/^<redacted_thinking\b[^>]*>/i.test(tail)) return 0;
  if (/^<think\b[^>]*>/i.test(tail)) return 0;
  if (tail === "<") return 1;
  const tl = tail.toLowerCase();
  const markerR = "<redacted_thinking";
  if (markerR.startsWith(tl)) return buf.length - lastLt;
  const markerT = "<think";
  if (markerT.startsWith(tl)) return buf.length - lastLt;
  return 0;
}

export interface ParsedThinkingOutput {
  /** Inner reasoning; not for end-user UI. */
  thinking: string;
  /**
   * User-facing text: tail after the last `</redacted_thinking>` when non-empty; otherwise all text
   * segments outside closed blocks joined (handles interleaved intro / answer / reasoning without a
   * final tail).
   */
  answer: string;
}

/**
 * Text outside well-formed `<redacted_thinking>…</redacted_thinking>` blocks (segments before the
 * first block, between blocks, and after the last block), joined for batch parsing when the tail
 * after the last close is empty.
 */
function visibleSegmentsOutsideClosedBlocks(raw: string): string {
  const parts: string[] = [];
  let cursor = 0;
  const re =
    /<(?:redacted_thinking\b[^>]*>[\s\S]*?<\/\s*redacted_thinking\s*|think\b[^>]*>[\s\S]*?<\/\s*think\s*>)/gi;
  let m: RegExpExecArray | null;
  let sawBlock = false;
  while ((m = re.exec(raw)) !== null) {
    sawBlock = true;
    if (m.index > cursor) {
      parts.push(raw.slice(cursor, m.index).trim());
    }
    cursor = m.index + m[0].length;
  }
  if (!sawBlock) return raw.trim();
  if (cursor < raw.length) {
    parts.push(raw.slice(cursor).trim());
  }
  return parts.filter(Boolean).join("\n\n").trim();
}

/** Earliest opening tag among redacted_thinking and think (for unclosed / partial parses). */
function earliestReasoningOpen(raw: string): { index: number; len: number } | null {
  let best: { index: number; len: number } | null = null;
  for (const re of [OPEN_LOOSE_RE, OPEN_RE, THINK_OPEN_LOOSE_RE]) {
    const m = raw.match(re);
    if (!m || m.index === undefined) continue;
    if (!best || m.index < best.index) {
      best = { index: m.index, len: m[0].length };
    }
  }
  return best;
}

/**
 * Collect inner spans (closed blocks) and user-visible text: prefer tail after the final close; if
 * that is empty, concatenate outside segments (interleaved visible text between blocks).
 */
export function parseThinkingOutput(raw: string): ParsedThinkingOutput {
  if (!raw) {
    return { thinking: "", answer: "" };
  }

  const thinkingParts: string[] = [];
  const blockRe = /<redacted_thinking\b[^>]*>([\s\S]*?)<\/\s*redacted_thinking\s*>/gi;
  let m: RegExpExecArray | null;
  while ((m = blockRe.exec(raw)) !== null) {
    thinkingParts.push(m[1].trim());
  }
  const thinkInnerRe = /<think\b[^>]*>([\s\S]*?)<\/\s*think\s*>/gi;
  while ((m = thinkInnerRe.exec(raw)) !== null) {
    thinkingParts.push(m[1].trim());
  }
  const thinkingClosed = thinkingParts.filter(Boolean).join("\n\n");

  const lastCloseEnd = findLastAnyReasoningCloseEnd(raw);

  if (lastCloseEnd === -1) {
    const open = earliestReasoningOpen(raw);
    if (open) {
      const afterOpen = raw.slice(open.index + open.len).trim();
      return {
        thinking: afterOpen,
        answer: "",
      };
    }
    return { thinking: "", answer: raw.trim() };
  }

  const tailAfterLastClose = raw.slice(lastCloseEnd).trim();
  const answer = tailAfterLastClose || visibleSegmentsOutsideClosedBlocks(raw);
  return { thinking: thinkingClosed, answer };
}

/** First line / start of string looks like model meta-reasoning, not user-facing note text. */
function looksLikeMetaReasoningSnippet(t: string): boolean {
  const x = t.trim().slice(0, 120);
  return /^(okay,|first,|let me|i need to|i should|the user |original text|i'm |i am |check for |perhaps |maybe |writing a |it('| i)s a bit|that makes it|as per the|i need to ensure)/i.test(
    x
  );
}

/**
 * Extract a quoted / colon-prefixed draft from model reasoning (unclosed think blocks, "Possible improvements:", etc.).
 */
export function extractNoteFromReasoningBlob(blob: string): string | null {
  const s = blob.trim();
  if (!s) return null;

  const draftIntro =
    /(?:^|\n)\s*(?:Putting it all together|The (?:final |improved )?note|Here'?s (?:the |a |my )?(?:note|draft|letter|(?:output )?text)|Output|The answer|Possible improvements|A (?:better|clearer|stronger|more concise) (?:version|draft|note)|(?:The |My )(?:improved |final )?(?:draft|note|text|version)|Better (?:phrasing|wording))\s*:\s*/gim;

  draftIntro.lastIndex = 0;
  let intro: RegExpExecArray | null;
  let best: string | null = null;

  while ((intro = draftIntro.exec(s)) !== null) {
    const rest = s.slice(intro.index + intro[0].length);
    const qOpen = /^["\u201c\u2018]([\s\S]*?)(?:["\u201d\u2019](?=\s|$|[.!?])|$)/.exec(rest);
    if (qOpen?.[1]) {
      const body = qOpen[1].trim().replace(/["\u201d\u2019]+\s*$/g, "").trim();
      if (body.length >= 10 && !looksLikeMetaReasoningSnippet(body)) {
        best = body;
      }
    }
  }

  if (best) return best;

  const linePatterns: RegExp[] = [
    /(?:^|\n)\s*(?:Putting it all together|The (?:final |improved )?note|Here'?s (?:the )?note|Output|The answer)\s*:\s*["“”']([\s\S]*)$/im,
    /(?:^|\n)\s*(?:Putting it all together|The (?:final |improved )?note)\s*:\s*([\s\S]*)$/im,
  ];

  for (const re of linePatterns) {
    const mm = s.match(re);
    if (!mm?.[1]) continue;
    let body = mm[1].trim();
    const q = /^["\u201c\u2018]([\s\S]*)/.exec(body);
    if (q) body = q[1];
    body = body.replace(/["\u201d\u2019]+$/g, "").trim();
    if (body.length >= 8 && !looksLikeMetaReasoningSnippet(body)) {
      return body;
    }
  }

  const candidates: RegExpExecArray[] = [];
  const quoteRe = /["“”']([A-Z][^"“”'\n]{14,})["“”']/g;
  let qm: RegExpExecArray | null;
  while ((qm = quoteRe.exec(s)) !== null) {
    candidates.push(qm);
  }
  for (let i = candidates.length - 1; i >= 0; i--) {
    const c = candidates[i][1]?.trim();
    if (c && !looksLikeMetaReasoningSnippet(c) && !/^write a thank you note\b/i.test(c)) {
      return c;
    }
  }

  return null;
}

export interface ThinkingStripDiagnosis {
  rawCharLength: number;
  rawHead200: string;
  rawTail120: string;
  hasLooseOpenTag: boolean;
  hasCloseTag: boolean;
  strictOpenMatched: boolean;
  parsedTailAnswerLen: number;
  thinkingBlobLen: number;
  extractedQuote: boolean;
  finalOutLen: number;
  /** Why the pipeline stopped (for logs). */
  outcome:
    | "user_text_after_close"
    | "extracted_from_thinking"
    | "extracted_from_whole"
    | "plain_untagged"
    | "blocked_tagged_no_deliverable"
    | "empty_input";
}

/**
 * Structured snapshot for debugging reasoning leaks / max_tokens cutoffs.
 */
export function diagnoseThinkingStrip(raw: string, extractedOut: string): ThinkingStripDiagnosis {
  const trimmed = raw.trim();
  const { thinking, answer } = parseThinkingOutput(trimmed);
  const fromThink = thinking.trim() ? extractNoteFromReasoningBlob(thinking.trim()) : null;
  const strippedTags = stripLooseThinkingMarkup(trimmed);
  const fromWhole = extractNoteFromReasoningBlob(strippedTags) ?? extractNoteFromReasoningBlob(trimmed);

  let outcome: ThinkingStripDiagnosis["outcome"];
  if (!trimmed) {
    outcome = "empty_input";
  } else if (extractedOut.length === 0) {
    outcome = LOOSE_OPEN_SUBSTR.test(trimmed) ? "blocked_tagged_no_deliverable" : "plain_untagged";
  } else if (answer.trim() === extractedOut) {
    outcome = "user_text_after_close";
  } else if (fromThink && extractedOut === fromThink) {
    outcome = "extracted_from_thinking";
  } else {
    outcome = "extracted_from_whole";
  }

  return {
    rawCharLength: raw.length,
    rawHead200: raw.slice(0, 200).replace(/\s+/g, " "),
    rawTail120: raw.slice(-120).replace(/\s+/g, " "),
    hasLooseOpenTag: LOOSE_OPEN_SUBSTR.test(trimmed),
    hasCloseTag: CLOSE_RE.test(trimmed) || THINK_CLOSE_RE.test(trimmed),
    strictOpenMatched: OPEN_RE.test(trimmed) || THINK_OPEN_LOOSE_RE.test(trimmed),
    parsedTailAnswerLen: answer.trim().length,
    thinkingBlobLen: thinking.trim().length,
    extractedQuote: Boolean(fromThink ?? fromWhole),
    finalOutLen: extractedOut.length,
    outcome,
  };
}

/**
 * Streaming-only: remove thinking tag artifacts. Does **not** apply conversational prefix stripping
 * (`Sure`, `Here's`, `Output:`) — those must run only on complete strings (e.g. after
 * {@link extractUserFacingAnswer}), never on arbitrary chunk boundaries.
 *
 * **Content-safety:** `orphanOpenTail` strips from any `<redacted_thinking…>` that opens without a
 * closing `>` in the chunk through end-of-string. If genuine user-facing text mentioned that tag as
 * documentation (e.g. “use `<redacted_thinking>` as an example”), text from there onward is removed.
 * Tags are treated as internal protocol only; that tradeoff is intentional for privacy.
 */
function stripStreamingThinkingTagArtifacts(s: string): string {
  let t = s;
  const orphanClose = /<\/\s*redacted_thinking\s*>/gi;
  const orphanCloseThink = /<\/\s*think\s*>/gi;
  const orphanOpenTail = /<redacted_thinking\b[^>]*>[\s\S]*$/i;
  const orphanOpenTailThink = /<think\b[^>]*>[\s\S]*$/i;
  for (let i = 0; i < 16; i++) {
    const next = t
      .replace(CLOSED_BLOCK_RE, "")
      .replace(THINK_CLOSED_BLOCK_RE, "")
      .replace(orphanClose, "")
      .replace(orphanCloseThink, "");
    if (next === t) break;
    t = next;
  }
  t = t.replace(orphanOpenTail, "").replace(orphanOpenTailThink, "");
  return t.replace(/\r\n/g, "\n");
}

/**
 * Last-line defense: remove any thinking blocks that leaked into a string we already treat as "answer".
 */
export function stripRedactedThinkingTags(s: string): string {
  let t = s.trim();
  const orphanClose = /<\/\s*redacted_thinking\s*>/gi;
  const orphanCloseThink = /<\/\s*think\s*>/gi;
  const orphanOpenTail = /<redacted_thinking\b[^>]*>[\s\S]*$/i;
  const orphanOpenTailThink = /<think\b[^>]*>[\s\S]*$/i;
  for (let i = 0; i < 16; i++) {
    const next = t
      .replace(CLOSED_BLOCK_RE, "")
      .replace(THINK_CLOSED_BLOCK_RE, "")
      .replace(orphanClose, "")
      .replace(orphanCloseThink, "")
      .trim();
    if (next === t) break;
    t = next;
  }
  t = t.replace(orphanOpenTail, "").replace(orphanOpenTailThink, "").trim();
  return t
    .replace(/\r\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/^(sure|of course|here'?s|here is)[^:\n]*:?\s*/i, "")
    .replace(/^output:\s*/i, "")
    .trim();
}

/**
 * Full pipeline: LFM tags + fallbacks when the answer is empty but reasoning contains the real note.
 * Always parses the original raw string first (do not strip closed blocks before {@link parseThinkingOutput}).
 * If structured extraction fails and thinking markers may be present, returns empty string (no permissive raw leak).
 *
 * **Strict block:** If the raw string contains `<redacted_thinking` or `<think` (reasoning tags), we return
 * `""` when no safe extractable answer was found — even if that substring was meant as literal documentation.
 */
export function extractUserFacingAnswer(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return "";

  const { thinking, answer } = parseThinkingOutput(trimmed);

  let out = answer.trim();

  if (!out && thinking.trim()) {
    const fromThink = extractNoteFromReasoningBlob(thinking);
    if (fromThink) out = fromThink;
  }

  if (!out) {
    const strippedTags = stripLooseThinkingMarkup(trimmed);
    const fromWhole = extractNoteFromReasoningBlob(strippedTags);
    if (fromWhole) out = fromWhole;
  }

  const afterClosedRemoved = removeClosedRedactedThinkingBlocks(trimmed);

  if (
    !out &&
    (OPEN_LOOSE_RE.test(afterClosedRemoved) ||
      OPEN_RE.test(afterClosedRemoved) ||
      THINK_OPEN_LOOSE_RE.test(afterClosedRemoved)) &&
    !CLOSE_RE.test(afterClosedRemoved) &&
    !THINK_CLOSE_RE.test(afterClosedRemoved)
  ) {
    const open = earliestReasoningOpen(afterClosedRemoved);
    if (open) {
      const inner = afterClosedRemoved.slice(open.index + open.len).trim();
      const fromInner = extractNoteFromReasoningBlob(inner);
      if (fromInner) out = fromInner;
    }
  }

  if (!out && !LOOSE_OPEN_SUBSTR.test(afterClosedRemoved)) {
    out = extractNoteFromReasoningBlob(afterClosedRemoved) ?? "";
  }

  if (out) return stripRedactedThinkingTags(out);

  if (LOOSE_OPEN_SUBSTR.test(trimmed)) {
    return "";
  }

  return "";
}

/** @deprecated Prefer extractUserFacingAnswer; kept for call sites that only need tail-after-close. */
export function userFacingModelAnswer(raw: string): string {
  return extractUserFacingAnswer(raw);
}

export type RedactedThinkingStreamPusher = (delta: string) => void;
export type RedactedThinkingStreamFlusher = () => void;

/**
 * Stream filter: alternate outside / inside reasoning blocks (`<redacted_thinking>…` or `<think>…`)
 * using the same open/close grammar as the batch parser.
 *
 * **Performance:** Each `push` rescans `buf` with `String#match` for the next open tag. Buffer size
 * is capped at {@link MAX_REDACTED_THINKING_STREAM_BUFFER} (while inside thinking, oldest content is
 * dropped; while outside, safe prefix is emitted and a withheld suffix is kept).
 *
 * **Flush (inside thinking):** {@link extractUserFacingAnswer} runs only on the CoT tail after the
 * last seen open tag, not the full stream. Quoted drafts inside an unclosed block recover; text that
 * was withheld before that open or complex interleavings may be lost (privacy-safe, not a leak).
 */
function findNextReasoningOpenInBuf(buf: string): { index: number; len: number; kind: ReasoningKind } | null {
  let best: { index: number; len: number; kind: ReasoningKind } | null = null;
  const consider = (re: RegExp, kind: ReasoningKind) => {
    const m = buf.match(re);
    if (!m || m.index === undefined) return;
    if (!best || m.index < best.index) {
      best = { index: m.index, len: m[0].length, kind };
    }
  };
  consider(OPEN_LOOSE_RE, "redacted");
  consider(THINK_OPEN_LOOSE_RE, "think");
  return best;
}

export function createRedactedThinkingStreamFilter(
  emit: (s: string) => void
): [RedactedThinkingStreamPusher, RedactedThinkingStreamFlusher] {
  let buf = "";
  let insideThinking = false;
  let thinkingKind: ReasoningKind | null = null;

  function enforceBufferCap() {
    if (buf.length <= MAX_REDACTED_THINKING_STREAM_BUFFER) return;
    if (insideThinking) {
      buf = buf.slice(-MAX_REDACTED_THINKING_STREAM_BUFFER);
      return;
    }
    const keep = withholdOutsideSuffix(buf);
    const visible = buf.slice(0, buf.length - keep);
    emitOutside(visible);
    buf = buf.slice(buf.length - keep);
    if (buf.length > MAX_REDACTED_THINKING_STREAM_BUFFER) {
      buf = buf.slice(-MAX_REDACTED_THINKING_STREAM_BUFFER);
    }
  }

  function emitOutside(s: string) {
    if (!s) return;
    const cleaned = stripStreamingThinkingTagArtifacts(s);
    if (cleaned) emit(cleaned);
  }

  function processBuffer() {
    while (true) {
      if (!insideThinking) {
        const nextOpen = findNextReasoningOpenInBuf(buf);
        if (!nextOpen) {
          const w = withholdOutsideSuffix(buf);
          const take = buf.length - w;
          if (take <= 0) return;
          emitOutside(buf.slice(0, take));
          buf = buf.slice(take);
          return;
        }
        if (nextOpen.index > 0) {
          emitOutside(buf.slice(0, nextOpen.index));
        }
        buf = buf.slice(nextOpen.index + nextOpen.len);
        insideThinking = true;
        thinkingKind = nextOpen.kind;
        continue;
      }

      const close = findFirstCloseForKind(buf, thinkingKind!);
      if (!close) {
        return;
      }
      buf = buf.slice(close.index + close.length);
      insideThinking = false;
      thinkingKind = null;
      continue;
    }
  }

  function push(delta: string) {
    buf += delta;
    processBuffer();
    enforceBufferCap();
  }

  function flush() {
    if (insideThinking) {
      const recovered = extractUserFacingAnswer(buf);
      if (recovered) emit(recovered);
    } else {
      const w = withholdOutsideSuffix(buf);
      const visible = buf.slice(0, buf.length - w);
      emitOutside(visible);
    }
    buf = "";
    insideThinking = false;
    thinkingKind = null;
  }

  return [push, flush];
}
