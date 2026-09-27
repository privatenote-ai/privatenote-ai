/**
 * Compact Q→A patterns for local LLMs: teach “user intent → final note only”.
 * Designed for weak local models that tend to copy examples.
 */

const RULES = `Use only facts from the user's message.
Do not copy names, titles, dates, or details from examples.
Do not invent missing facts.
If the user gives a name or title, use it exactly.
Output only the final note text.
No explanations.
No labels.
No quotation marks around the answer.`;

/** Shorter list for small / tight context models. */
export const FEW_SHOT_APPENDIX_COMPACT = `${RULES}

Examples (user → output):
— "thanks for dinner" → Thank you so much for dinner—it was wonderful to spend the evening with you.
— "say sorry for being late to the meeting" → I'm sorry I was late to the meeting. I know your time is valuable, and I'll be more punctual next time.
— "thank my coworker for covering my shift" → Thank you for covering my shift. I really appreciate you stepping in on short notice.
— "birthday message, warm and upbeat" → Happy birthday! Wishing you a wonderful day and a great year ahead.
— "remind team meeting moved to 3pm" → Quick reminder: our team meeting has moved to 3pm today. See you there.
— "congrats to my teammate on the promotion" → Congratulations on the promotion! I'm really happy for you and excited to see what you do next.
— "request a meeting with Dr. Lee about the budget review" → Hello Dr. Lee, I would like to request a meeting to discuss the budget review. Please let me know a time that works for you.
— "email Professor Ahmed asking about thesis feedback" → Dear Professor Ahmed, I wanted to ask whether you have any feedback on my thesis when you have a chance. Thank you for your time.`;

/** Fuller list for larger local models. */
export const FEW_SHOT_APPENDIX_FULL = `${FEW_SHOT_APPENDIX_COMPACT}

— "thank client for quick payment" → Thank you for your prompt payment. We appreciate your business and look forward to continuing to work together.
— "polite decline invitation for Friday" → Thank you for inviting me on Friday. I won't be able to make it, but I hope you have a great time.
— "welcome new neighbour short" → Welcome to the neighbourhood! If you need anything as you settle in, feel free to knock.
— "sympathy note after loss, gentle" → I'm so sorry for your loss. You're in my thoughts, and I'm here if you need anything at all.
— "love note to partner for rough week" → I know this week has been a lot. I'm proud of you, I love you, and I'm right here beside you.
— "thank teacher for extra help" → Thank you for the extra time and support. It made a real difference, and I'm grateful.
— "RSVP yes to wedding" → We're delighted to accept and can't wait to celebrate with you on your big day.
— "short resignation thank you" → Thank you for the opportunities here. I'm grateful for what I've learned and wish the team continued success.
— "ask Ms. Rivera for an update on the contract" → Hello Ms. Rivera, I wanted to follow up and ask whether there are any updates on the contract. Thank you.`;
