/**
 * Best-effort structured fields prepended before USER REQUEST for small-tier models.
 * Improves binding (recipient, topic) without asking the model to substitute {{placeholders}}.
 */

import {
  buildMeetingStructuredHint,
  tryExtractMeetingRecipientAndTopic,
} from "@/utils/meetingRequestStructuredHint";

const PREFIX =
  "Parsed cues (verify against USER REQUEST; ignore these lines if they disagree):\n";

function trimField(s: string): string {
  return s.trim().replace(/[,:;]+$/, "").trim();
}

/**
 * Non–meeting-request templates: conservative recipient / purpose lines when patterns match.
 */
function tryStructuredFieldsForTemplate(
  templateId: string,
  u: string
): { recipient?: string; second?: string; secondLabel: string } | null {
  const meetingPair = tryExtractMeetingRecipientAndTopic(u);
  if (meetingPair) {
    return {
      recipient: meetingPair.recipient,
      second: meetingPair.topic,
      secondLabel: "Purpose / topic",
    };
  }

  const ap = u.match(
    /\bapolog(?:y|ize|ies)\s+to\s+([^.!?\n]{2,90}?)\s+for\s+([^.!\n]{4,220})/i,
  );
  if (ap) {
    return {
      recipient: trimField(ap[1]),
      second: trimField(ap[2]),
      secondLabel: "What to address",
    };
  }

  if (templateId === "thank-you") {
    const noteTo = u.match(
      /\b(?:note|message|email)\s+to\s+([^.!?\n]{2,90}?)\s+for\s+([^.!\n]{4,220})/i,
    );
    if (noteTo) {
      return {
        recipient: trimField(noteTo[1]),
        second: trimField(noteTo[2]),
        secondLabel: "Reason",
      };
    }
    const my = u.match(/\bthank\s+my\s+([^.!?\n]{2,80}?)\s+for\s+([^.!\n]{4,220})/i);
    if (my) {
      return {
        recipient: `my ${trimField(my[1])}`,
        second: trimField(my[2]),
        secondLabel: "Reason",
      };
    }
  }

  const cg = u.match(
    /\bcongratulat(?:e|ions)\s+(?:to\s+)?([^.!?\n]{2,90}?)\s+on\s+([^.!\n]{4,220})/i,
  );
  if (cg && (templateId === "congratulations" || /\bcongratulat/i.test(u))) {
    return {
      recipient: trimField(cg[1]),
      second: trimField(cg[2]),
      secondLabel: "Achievement",
    };
  }

  const wr = u.match(
    /\b(?:write|draft|help\s+me\s+write)\s+(?:a\s+)?(?:short\s+|professional\s+)?(?:email|message|note)\s+to\s+([^.!?\n]{2,90}?)\s+(?:about|for|regarding)\s+([^.!\n]{4,220})/i,
  );
  if (wr) {
    return {
      recipient: trimField(wr[1]),
      second: trimField(wr[2]),
      secondLabel: "Topic",
    };
  }

  return null;
}

/**
 * Structured lines before the raw USER REQUEST for small-tier improve/ask builds.
 */
export function buildSmallTierStructuredFieldsHint(
  templateId: string,
  userInput: string,
  enhancementType: "improve" | "summarize" | "secure" | "ask"
): string {
  if (enhancementType !== "improve" && enhancementType !== "ask") return "";
  const u = userInput.trim();
  if (!u) return "";

  if (templateId === "meeting-request") {
    return buildMeetingStructuredHint(u);
  }

  const fields = tryStructuredFieldsForTemplate(templateId, u);
  if (!fields?.recipient) return "";

  if (fields.second) {
    return `${PREFIX}Recipient: ${fields.recipient}\n${fields.secondLabel}: ${fields.second}\n\n`;
  }
  return `${PREFIX}Recipient: ${fields.recipient}\n\n`;
}
