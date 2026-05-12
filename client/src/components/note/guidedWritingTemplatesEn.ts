import {
  guidedWritingOption as option,
  type GuidedWritingTemplateRecord,
} from "./localFallbackShared";

/** English guided-writing starters (offline fallback templates). */
export const GUIDED_WRITING_TEMPLATES_EN: GuidedWritingTemplateRecord = {
  "ask-anything": {
    "1-2": [
      option("Short line", "Hi {{recipientName}}, {{mainMessage}}", {
        tone: "warm",
        audience: "general",
        style: "balanced",
        sensitivity: "standard",
        placeholders: ["recipientName", "mainMessage"],
      }),
      option("Quick ask", "Hi {{recipientName}}, about {{topic}} — what time works best for you?", {
        tone: "casual",
        audience: "general",
        style: "direct",
        sensitivity: "standard",
        placeholders: ["recipientName", "topic"],
      }),
    ],
    "2-3": [
      option("Follow-up", "Hi {{recipientName}}, circling back on {{topic}}. {{mainMessage}}. Context: {{reason}}.", {
        tone: "warm",
        audience: "general",
        style: "thoughtful",
        sensitivity: "standard",
        placeholders: ["recipientName", "topic", "mainMessage", "reason"],
      }),
      option("Work update", "Hi {{recipientName}}, quick update on {{topic}}: {{mainMessage}}. Say if you want more detail.", {
        tone: "professional",
        audience: "general",
        style: "direct",
        sensitivity: "standard",
        placeholders: ["recipientName", "topic", "mainMessage"],
      }),
    ],
    "4-6": [
      option("Mid-length note", "Hi {{recipientName}}, writing about {{topic}}. {{relevantDetail}} made me reach out. What I wanted to say is {{mainMessage}}. Thanks for {{specificDetail}} — reply whenever suits you.", {
        tone: "warm",
        audience: "general",
        style: "thoughtful",
        sensitivity: "standard",
        placeholders: ["recipientName", "topic", "relevantDetail", "mainMessage", "specificDetail"],
      }),
      option("Structured note", "Hi {{recipientName}}, {{topic}}: {{reason}}. {{mainMessage}}. Also: {{extraDetail}}. No rush on a reply.", {
        tone: "professional",
        audience: "general",
        style: "balanced",
        sensitivity: "standard",
        placeholders: ["recipientName", "topic", "reason", "mainMessage", "extraDetail"],
      }),
    ],
    "7-10": [
      option("Longer note", "Hi {{recipientName}}, I am writing about {{topic}}. Over {{timeframe}}, {{relevantDetail}} kept coming up. What I need to say is {{mainMessage}}. {{extraDetail}} matters here too. I value {{specificDetail}}. Reply when you can; no pressure on timing.", {
        tone: "warm",
        audience: "general",
        style: "thoughtful",
        sensitivity: "standard",
        placeholders: ["recipientName", "topic", "timeframe", "relevantDetail", "mainMessage", "extraDetail", "specificDetail"],
      }),
      option("Longer work note", "Hi {{recipientName}}, fuller context on {{topic}}: {{mainMessage}}. Why it matters: {{reason}}. {{extraDetail}}. If useful, we can {{nextStep}}. If timing is bad, no problem — tell me what works later.", {
        tone: "professional",
        audience: "general",
        style: "balanced",
        sensitivity: "standard",
        placeholders: ["recipientName", "topic", "mainMessage", "reason", "extraDetail", "nextStep"],
      }),
    ],
  },
  "thank-you": {
    "1-2": [
      option("Simple thanks", "Thanks, {{recipientName}}, for {{supportType}} — it helped.", {
        tone: "warm",
        audience: "general",
        style: "direct",
        sensitivity: "standard",
        placeholders: ["recipientName", "supportType"],
      }),
      option("Work thanks", "Thanks for {{specificDetail}}, {{recipientName}}. I owe you one.", {
        tone: "professional",
        audience: "coworker",
        style: "balanced",
        sensitivity: "standard",
        placeholders: ["specificDetail", "recipientName"],
      }),
    ],
    "2-3": [
      option("Thanks with detail", "Thanks, {{recipientName}}, for {{actionTaken}}. It made {{result}} much easier.", {
        tone: "warm",
        audience: "general",
        style: "thoughtful",
        sensitivity: "standard",
        placeholders: ["recipientName", "actionTaken", "result"],
      }),
      option("Short note", "Hi {{recipientName}}, thanks for {{supportType}}. It made a difference on my end.", {
        tone: "warm",
        audience: "general",
        style: "balanced",
        sensitivity: "standard",
        placeholders: ["recipientName", "supportType"],
      }),
    ],
    "4-6": [
      option("Expanded thanks", "Hi {{recipientName}}, thank you for {{actionTaken}}. {{specificDetail}} stood out. It took weight off a busy week.", {
        tone: "warm",
        audience: "general",
        style: "thoughtful",
        sensitivity: "standard",
        placeholders: ["recipientName", "actionTaken", "specificDetail"],
      }),
      option("Thanks with context", "Thanks, {{recipientName}}, for {{supportType}}. {{reason}}. I noticed the effort — it mattered.", {
        tone: "warm",
        audience: "general",
        style: "balanced",
        sensitivity: "standard",
        placeholders: ["recipientName", "supportType", "reason"],
      }),
    ],
    "7-10": [
      option("Longer thanks", "Hi {{recipientName}}, a real thank-you for {{actionTaken}}. I know it cost time and attention. {{specificDetail}} is what stuck with me. It changed {{resultOrSituation}} for the better. I am glad you were in my corner.", {
        tone: "warm",
        audience: "general",
        style: "thoughtful",
        sensitivity: "standard",
        placeholders: ["recipientName", "actionTaken", "specificDetail", "resultOrSituation"],
      }),
      option("Formal thanks", "Dear {{recipientName}}, thank you for {{supportType}}. {{specificDetail}} was above and beyond. {{positiveResult}}. I will remember the help.", {
        tone: "formal",
        audience: "general",
        style: "thoughtful",
        sensitivity: "standard",
        placeholders: ["recipientName", "supportType", "specificDetail", "positiveResult"],
      }),
    ],
  },
  "meeting-request": {
    "1-2": [
      option("Quick request", "Hi {{recipientName}}, could we set up a meeting about {{topic}} sometime on {{dayOrTime}}?", {
        tone: "casual",
        audience: "coworker",
        style: "direct",
        sensitivity: "standard",
        placeholders: ["recipientName", "topic", "dayOrTime"],
      }),
      option("Executive request", "Hi {{recipientName}}, can we book a short meeting on {{topic}}? Send a few times that work.", {
        tone: "professional",
        audience: "client",
        style: "direct",
        sensitivity: "standard",
        placeholders: ["recipientName", "topic"],
      }),
    ],
    "2-3": [
      option("Clean request", "Hi {{recipientName}}, meeting on {{topic}} — does {{dayOrTime}} work? If not, propose another slot.", {
        tone: "professional",
        audience: "coworker",
        style: "balanced",
        sensitivity: "standard",
        placeholders: ["recipientName", "topic", "dayOrTime"],
      }),
      option("Polished follow-up", "Hi {{recipientName}}, call about {{topic}}? I can do {{dayOrTime}} — what fits you?", {
        tone: "professional",
        audience: "client",
        style: "direct",
        sensitivity: "standard",
        placeholders: ["recipientName", "topic", "dayOrTime"],
      }),
    ],
    "4-6": [
      option("Polished request", "Hi {{recipientName}}, proposing a meeting on {{topic}} to cover {{specificDetail}}. I can do {{dayOrTime}} — say what works or suggest another slot.", {
        tone: "professional",
        audience: "client",
        style: "balanced",
        sensitivity: "standard",
        placeholders: ["recipientName", "topic", "specificDetail", "dayOrTime"],
      }),
      option("Formal request", "Hello {{recipientName}}, may we schedule a short meeting on {{topic}}? I would like to cover {{specificDetail}}. I am free {{dayOrTime}} or {{alternateTime}}. Please propose a time if neither fits.", {
        tone: "formal",
        audience: "client",
        style: "balanced",
        sensitivity: "standard",
        placeholders: ["recipientName", "topic", "specificDetail", "dayOrTime", "alternateTime"],
      }),
    ],
    "7-10": [
      option("Detailed brief", "Hi {{recipientName}}, could we book time for {{topic}}? I want to align on {{specificDetail}} and next steps. I am open {{dayOrTime}} or {{alternateTime}}; happy to move dates. Tell me what fits.", {
        tone: "professional",
        audience: "coworker",
        style: "thoughtful",
        sensitivity: "standard",
        placeholders: ["recipientName", "topic", "specificDetail", "dayOrTime", "alternateTime"],
      }),
      option("Formal brief", "Hello {{recipientName}}, requesting a meeting about {{topic}}, mainly {{specificDetail}}. Availability: {{dayOrTime}}; flexible otherwise. We can meet live or over {{extraDetail}} — whichever you prefer.", {
        tone: "formal",
        audience: "client",
        style: "balanced",
        sensitivity: "standard",
        placeholders: ["recipientName", "topic", "specificDetail", "dayOrTime", "extraDetail"],
      }),
    ],
  },
  birthday: {
    "1-2": [
      option("Short wish", "Happy birthday, {{recipientName}} — hope you have a lovely day.", {
        tone: "warm",
        audience: "general",
        style: "celebratory",
        sensitivity: "standard",
        placeholders: ["recipientName"],
      }),
      option("Warm line", "Happy birthday, {{recipientName}}. Wishing you a good year ahead.", {
        tone: "warm",
        audience: "general",
        style: "celebratory",
        sensitivity: "standard",
        placeholders: ["recipientName"],
      }),
    ],
    "2-3": [
      option("Friend note", "Happy birthday, {{recipientName}}. Enjoy the day — you put a lot of good into the world.", {
        tone: "warm",
        audience: "friend",
        style: "celebratory",
        sensitivity: "standard",
        placeholders: ["recipientName"],
      }),
      option("Wish plus detail", "Happy birthday, {{recipientName}}. Here is to more {{joyWish}} this year.", {
        tone: "warm",
        audience: "friend",
        style: "thoughtful",
        sensitivity: "standard",
        placeholders: ["recipientName", "joyWish"],
      }),
    ],
    "4-6": [
      option("Mid note", "Happy birthday, {{recipientName}}. People lean on your {{quality}} — thanks for that. {{specificDetail}} is one thing I will not forget. Have a great day.", {
        tone: "warm",
        audience: "friend",
        style: "thoughtful",
        sensitivity: "standard",
        placeholders: ["recipientName", "quality", "specificDetail"],
      }),
      option("Cheer + goal", "Happy birthday, {{recipientName}}. Rooting for {{goalOrWish}} in the year ahead. Celebrate properly when you can.", {
        tone: "warm",
        audience: "friend",
        style: "celebratory",
        sensitivity: "standard",
        placeholders: ["recipientName", "goalOrWish"],
      }),
    ],
    "7-10": [
      option("Longer wish", "Happy birthday, {{recipientName}}. You bring {{quality}} into rooms without trying. {{memory}} is one moment that stuck with me. For the next year: {{hopeOrGoal}}, good health, and time with people who get you. Enjoy today on your terms.", {
        tone: "warm",
        audience: "friend",
        style: "thoughtful",
        sensitivity: "standard",
        placeholders: ["recipientName", "quality", "memory", "hopeOrGoal"],
      }),
      option("Longer cheer", "Happy birthday, {{recipientName}}. You earn more than a one-line text — so here is a fuller cheer. Your {{quality}} changes weeks for the better. {{memory}} still makes me smile. Wishing you {{hopeOrGoal}} and a day that feels as good as you make things for others.", {
        tone: "warm",
        audience: "friend",
        style: "celebratory",
        sensitivity: "standard",
        placeholders: ["recipientName", "quality", "memory", "hopeOrGoal"],
      }),
    ],
  },
  apology: {
    "1-2": [
      option("Direct apology", "I am sorry, {{recipientName}}, for {{happened}}. I should have handled it better.", {
        tone: "gentle",
        audience: "general",
        style: "direct",
        sensitivity: "sensitive",
        placeholders: ["recipientName", "happened"],
      }),
      option("Short sorry", "I am sorry about {{happened}}. That was on me.", {
        tone: "gentle",
        audience: "general",
        style: "gentle",
        sensitivity: "sensitive",
        placeholders: ["happened"],
      }),
    ],
    "2-3": [
      option("Clear apology", "I am sorry, {{recipientName}}, for {{happened}}. It affected you, and I regret my part in it. I am open to hearing what would help.", {
        tone: "gentle",
        audience: "general",
        style: "direct",
        sensitivity: "sensitive",
        placeholders: ["recipientName", "happened"],
      }),
      option("Professional apology", "I apologize for {{issue}}. I own the inconvenience and am working on a fix.", {
        tone: "professional",
        audience: "client",
        style: "balanced",
        sensitivity: "sensitive",
        placeholders: ["issue"],
      }),
    ],
    "4-6": [
      option("Sincere apology", "Hi {{recipientName}}, I am sorry for {{happened}}. It caused {{impact}}, and that is not what I want for you. Here is what I can offer now: {{fixStep}}.", {
        tone: "gentle",
        audience: "general",
        style: "thoughtful",
        sensitivity: "sensitive",
        placeholders: ["recipientName", "happened", "impact", "fixStep"],
      }),
      option("Reflective apology", "About {{happened}}: I am sorry. The fallout included {{impact}}. If {{feeling}} is part of your reaction, I hear that. No excuses — I am trying to respond more carefully next time.", {
        tone: "gentle",
        audience: "general",
        style: "gentle",
        sensitivity: "sensitive",
        placeholders: ["happened", "impact", "feeling"],
      }),
    ],
    "7-10": [
      option("Long apology", "Hi {{recipientName}}, I owe you an apology for {{happened}}. It led to {{impact}}, and I am sorry for the stress that added. I could have acted with more care. {{fixStep}} is what I can commit to now. If trust needs time, I understand — I still want you to know I mean the apology.", {
        tone: "gentle",
        audience: "general",
        style: "thoughtful",
        sensitivity: "sensitive",
        placeholders: ["recipientName", "happened", "impact", "fixStep"],
      }),
      option("Long reflective apology", "I am sorry, {{recipientName}}, for {{happened}}. I have sat with how it landed on you. I regret not being clearer or kinder in the moment. {{fixStep}} is the amends I can make from here. Thank you for reading.", {
        tone: "gentle",
        audience: "general",
        style: "gentle",
        sensitivity: "sensitive",
        placeholders: ["recipientName", "happened", "fixStep"],
      }),
    ],
  },
  love: {
    "1-2": [
      option("Short love note", "I love you, {{recipientName}}.", {
        tone: "romantic",
        audience: "partner",
        style: "direct",
        sensitivity: "sensitive",
        placeholders: ["recipientName"],
      }),
      option("Simple line", "Love you — thanks for being my person.", {
        tone: "romantic",
        audience: "partner",
        style: "gentle",
        sensitivity: "sensitive",
        placeholders: [],
      }),
    ],
    "2-3": [
      option("Warm note", "I love you, {{recipientName}}. You bring {{feeling}} into my days.", {
        tone: "romantic",
        audience: "partner",
        style: "thoughtful",
        sensitivity: "sensitive",
        placeholders: ["recipientName", "feeling"],
      }),
      option("Appreciation", "I love you for {{quality}}. Ordinary days feel better with you in them.", {
        tone: "romantic",
        audience: "partner",
        style: "gentle",
        sensitivity: "sensitive",
        placeholders: ["quality"],
      }),
    ],
    "4-6": [
      option("Mid note", "I love you, {{recipientName}}. Your {{quality}} is one of the first things I brag about. Being with you feels like {{feeling}} — steady, real, ours.", {
        tone: "romantic",
        audience: "partner",
        style: "thoughtful",
        sensitivity: "sensitive",
        placeholders: ["recipientName", "quality", "feeling"],
      }),
      option("Tender note", "Love you. The way you {{specificDetail}} still gets me. Life with you feels like {{feeling}}.", {
        tone: "romantic",
        audience: "partner",
        style: "gentle",
        sensitivity: "sensitive",
        placeholders: ["specificDetail", "feeling"],
      }),
    ],
    "7-10": [
      option("Longer note", "I love you, {{recipientName}}. You bring {{feeling}} into ordinary days and make the good ones feel even better. {{specificDetail}} is something I never get tired of. You move through the world with {{quality}}, and I am grateful to share life with you.", {
        tone: "romantic",
        audience: "partner",
        style: "thoughtful",
        sensitivity: "sensitive",
        placeholders: ["recipientName", "feeling", "specificDetail", "quality"],
      }),
      option("Longer letter", "{{recipientName}} — I love you. {{memory}} is on my mind today. You bring {{feeling}} home with you. I admire your {{quality}} and the small thing: {{specificDetail}}. Thanks for staying in the work with me.", {
        tone: "romantic",
        audience: "partner",
        style: "gentle",
        sensitivity: "sensitive",
        placeholders: ["recipientName", "feeling", "memory", "quality", "specificDetail"],
      }),
    ],
  },
  congratulations: {
    "1-2": [
      option("Short cheer", "Congrats, {{recipientName}}, on {{achievement}} — well earned.", {
        tone: "warm",
        audience: "general",
        style: "celebratory",
        sensitivity: "standard",
        placeholders: ["recipientName", "achievement"],
      }),
      option("Plain cheer", "Big congrats on {{achievement}}. The work showed.", {
        tone: "warm",
        audience: "general",
        style: "celebratory",
        sensitivity: "standard",
        placeholders: ["achievement"],
      }),
    ],
    "2-3": [
      option("Warm cheer", "Congrats, {{recipientName}}, on {{achievement}}. Happy for you — this was not luck.", {
        tone: "warm",
        audience: "general",
        style: "celebratory",
        sensitivity: "standard",
        placeholders: ["recipientName", "achievement"],
      }),
      option("Work cheer", "Congratulations on {{achievement}}. Clear effort went in; good to see it land.", {
        tone: "professional",
        audience: "coworker",
        style: "supportive",
        sensitivity: "standard",
        placeholders: ["achievement"],
      }),
    ],
    "4-6": [
      option("Mid cheer", "Congrats, {{recipientName}}, on {{achievement}}. Rarely is something this earned. Enjoy the win.", {
        tone: "warm",
        audience: "general",
        style: "celebratory",
        sensitivity: "standard",
        placeholders: ["recipientName", "achievement"],
      }),
      option("Timeline cheer", "Congratulations on {{achievement}}. {{timeframe}} of work went into this, and I am glad it paid off.", {
        tone: "professional",
        audience: "coworker",
        style: "supportive",
        sensitivity: "standard",
        placeholders: ["achievement", "timeframe"],
      }),
    ],
    "7-10": [
      option("Long cheer", "Congrats, {{recipientName}}, on {{achievement}}. News like this is easy to cheer because it is true: you earned it. Your {{quality}} showed the whole way. Take a real beat to enjoy it — then keep going.", {
        tone: "warm",
        audience: "general",
        style: "celebratory",
        sensitivity: "standard",
        placeholders: ["recipientName", "achievement", "quality"],
      }),
      option("Long proud", "{{recipientName}} — huge congrats on {{achievement}}. Milestones like this take {{quality}} and a lot of work behind the scenes. Proud of you; enjoy the moment.", {
        tone: "warm",
        audience: "general",
        style: "celebratory",
        sensitivity: "standard",
        placeholders: ["achievement", "recipientName", "quality"],
      }),
    ],
  },
  farewell: {
    "1-2": [
      option("Short goodbye", "Thank you all — it has been a good run. Wishing you well.", {
        tone: "warm",
        audience: "team",
        style: "balanced",
        sensitivity: "standard",
        placeholders: [],
      }),
      option("Warm line", "Thanks for the support and the memories. Wishing everyone good things ahead.", {
        tone: "warm",
        audience: "team",
        style: "supportive",
        sensitivity: "standard",
        placeholders: [],
      }),
    ],
    "2-3": [
      option("Thanks + detail", "Heading out soon — thank you for {{specificDetail}}. This team mattered. Rooting for you all.", {
        tone: "warm",
        audience: "team",
        style: "thoughtful",
        sensitivity: "standard",
        placeholders: ["specificDetail"],
      }),
      option("Professional sign-off", "Thank you for the stretch here — I learned plenty. Wishing the group continued wins.", {
        tone: "professional",
        audience: "team",
        style: "balanced",
        sensitivity: "standard",
        placeholders: [],
      }),
    ],
    "4-6": [
      option("Mid goodbye", "{{groupName}} — thank you. {{specificDetail}} is what I will cite first. I will miss {{memory}}. Stay in touch if you want.", {
        tone: "warm",
        audience: "team",
        style: "thoughtful",
        sensitivity: "standard",
        placeholders: ["groupName", "specificDetail", "memory"],
      }),
      option("Grateful exit", "Leaving {{groupName}} is not light. Thanks for {{specificDetail}} and for the pace you kept. Carrying a lot forward.", {
        tone: "warm",
        audience: "team",
        style: "supportive",
        sensitivity: "standard",
        placeholders: ["groupName", "specificDetail"],
      }),
    ],
    "7-10": [
      option("Long goodbye", "{{groupName}} — a real thank-you before I go. {{specificDetail}} shaped my time here. {{memory}} is the snapshot I keep. Proud to have worked with you; ping me anytime.", {
        tone: "warm",
        audience: "team",
        style: "thoughtful",
        sensitivity: "standard",
        placeholders: ["groupName", "specificDetail", "memory"],
      }),
      option("Long sign-off", "Before I sign off from {{groupName}}: thanks for the trust and {{specificDetail}}. I am better at the job for having been here. Next chapter calls — still hoping our paths cross again.", {
        tone: "professional",
        audience: "team",
        style: "balanced",
        sensitivity: "standard",
        placeholders: ["groupName", "specificDetail"],
      }),
    ],
  },
  invitation: {
    "1-2": [
      option("Short invite", "{{eventName}} — {{date}}, {{place}}. Come if you can.", {
        tone: "warm",
        audience: "general",
        style: "direct",
        sensitivity: "standard",
        placeholders: ["eventName", "date", "place"],
      }),
      option("Casual invite", "{{eventName}} on {{dayOrTime}}. Would be great to see you.", {
        tone: "casual",
        audience: "friend",
        style: "direct",
        sensitivity: "standard",
        placeholders: ["eventName", "dayOrTime"],
      }),
    ],
    "2-3": [
      option("Clear invite", "{{eventName}}: {{date}} at {{place}}, around {{time}}. RSVP when you can.", {
        tone: "warm",
        audience: "general",
        style: "thoughtful",
        sensitivity: "standard",
        placeholders: ["eventName", "date", "place", "time"],
      }),
      option("Friend invite", "Hi {{recipientName}}, {{eventName}} at {{place}}, {{dayOrTime}}. Save a spot if it fits.", {
        tone: "casual",
        audience: "friend",
        style: "celebratory",
        sensitivity: "standard",
        placeholders: ["recipientName", "eventName", "dayOrTime", "place"],
      }),
    ],
    "4-6": [
      option("Mid invite", "Hi {{recipientName}}, inviting you to {{eventName}} on {{date}} at {{place}}, start ~{{time}}. {{occasion}}. Let me know either way.", {
        tone: "warm",
        audience: "general",
        style: "thoughtful",
        sensitivity: "standard",
        placeholders: ["recipientName", "eventName", "date", "place", "time", "occasion"],
      }),
      option("Detail invite", "{{eventName}} — {{date}}, {{place}}, {{time}}. Plan: {{eventDetail}}. RSVP by {{rsvpDate}}.", {
        tone: "warm",
        audience: "general",
        style: "balanced",
        sensitivity: "standard",
        placeholders: ["eventName", "date", "place", "time", "eventDetail", "rsvpDate"],
      }),
    ],
    "7-10": [
      option("Long invite", "Hi {{recipientName}}, fuller invite for {{eventName}}: {{date}} at {{place}}, doors {{time}}. {{eventDetail}}. RSVP by {{rsvpDate}} — no stress if you cannot; just helps headcount.", {
        tone: "warm",
        audience: "general",
        style: "thoughtful",
        sensitivity: "standard",
        placeholders: ["recipientName", "eventName", "date", "place", "time", "eventDetail", "rsvpDate"],
      }),
      option("Long warm invite", "{{eventName}} on {{date}} at {{place}} ({{time}}). {{eventDetail}}. Means a lot if you can make it — reply by {{rsvpDate}} so I can plan food.", {
        tone: "warm",
        audience: "general",
        style: "celebratory",
        sensitivity: "standard",
        placeholders: ["eventName", "date", "place", "time", "eventDetail", "rsvpDate"],
      }),
    ],
  },
  condolence: {
    "1-2": [
      option("Gentle condolence", "I am so sorry for your loss, {{recipientName}}. You are in my thoughts.", {
        tone: "gentle",
        audience: "general",
        style: "gentle",
        sensitivity: "sensitive",
        placeholders: ["recipientName"],
      }),
      option("Quiet support", "I heard your news, and I am so sorry. Thinking of you right now.", {
        tone: "gentle",
        audience: "general",
        style: "supportive",
        sensitivity: "sensitive",
        placeholders: [],
      }),
    ],
    "2-3": [
      option("Simple condolence", "I am so sorry for your loss, {{recipientName}}. I am thinking of you.", {
        tone: "gentle",
        audience: "general",
        style: "gentle",
        sensitivity: "sensitive",
        placeholders: ["recipientName"],
      }),
      option("Gentle support", "I was sorry to hear about {{loss}}. I am thinking of you and your family.", {
        tone: "gentle",
        audience: "general",
        style: "supportive",
        sensitivity: "sensitive",
        placeholders: ["loss"],
      }),
    ],
    "4-6": [
      option("Warm condolence", "I was sorry to hear about {{loss}}. Please accept my condolences. Wishing you a little ease in the coming days.", {
        tone: "gentle",
        audience: "general",
        style: "supportive",
        sensitivity: "sensitive",
        placeholders: ["loss"],
      }),
      option("Gentle heartfelt note", "I am so sorry for your loss, {{recipientName}}. {{personName}} will be remembered for {{tribute}}. I am here if you want company or practical help.", {
        tone: "gentle",
        audience: "general",
        style: "gentle",
        sensitivity: "sensitive",
        placeholders: ["recipientName", "personName", "tribute"],
      }),
    ],
    "7-10": [
      option("Long condolence message", "I was sorry to hear about {{loss}}, {{recipientName}}. My condolences to you and those close to you. {{personName}} will be remembered for {{tribute}}. There is no rush to reply — I just wanted you to know I am thinking of you.", {
        tone: "gentle",
        audience: "general",
        style: "supportive",
        sensitivity: "sensitive",
        placeholders: ["loss", "recipientName", "personName", "tribute"],
      }),
      option("Long gentle support note", "I am deeply sorry for your loss. {{personName}} mattered to many people and will be remembered with care. Wishing you rest and support from the people around you. Reach out if a quiet walk or a meal would help — no pressure either way.", {
        tone: "gentle",
        audience: "general",
        style: "gentle",
        sensitivity: "sensitive",
        placeholders: ["personName"],
      }),
    ],
  },
  reminder: {
    "1-2": [
      option("Short reminder", "Just a quick reminder about {{task}} on {{dayOrTime}}.", {
        tone: "casual",
        audience: "general",
        style: "direct",
        sensitivity: "standard",
        placeholders: ["task", "dayOrTime"],
      }),
      option("Polite nudge", "Friendly reminder to {{task}} by {{deadline}}.", {
        tone: "professional",
        audience: "general",
        style: "direct",
        sensitivity: "standard",
        placeholders: ["task", "deadline"],
      }),
    ],
    "2-3": [
      option("Polite reminder", "Hi {{recipientName}}, just a quick reminder about {{task}}. The deadline is {{dayOrTime}}. Please let me know if you need anything from me.", {
        tone: "professional",
        audience: "coworker",
        style: "balanced",
        sensitivity: "standard",
        placeholders: ["recipientName", "task", "dayOrTime"],
      }),
      option("Professional reminder", "Just a friendly reminder about {{task}}. Please send it by {{deadline}} if possible. Thanks so much.", {
        tone: "professional",
        audience: "coworker",
        style: "direct",
        sensitivity: "standard",
        placeholders: ["task", "deadline"],
      }),
    ],
    "4-6": [
      option("Thoughtful reminder", "Hi {{recipientName}}, quick ping on {{task}} — due {{dayOrTime}}. Ping me if you need anything from my side.", {
        tone: "professional",
        audience: "coworker",
        style: "supportive",
        sensitivity: "standard",
        placeholders: ["recipientName", "task", "dayOrTime"],
      }),
      option("Clear reminder", "Hello {{recipientName}}, gentle nudge on {{task}}. Target finish: {{deadline}}. Questions welcome.", {
        tone: "professional",
        audience: "coworker",
        style: "balanced",
        sensitivity: "standard",
        placeholders: ["recipientName", "task", "deadline"],
      }),
    ],
    "7-10": [
      option("Long reminder note", "Hi {{recipientName}}, checking in on {{task}} before {{dayOrTime}}. This is a light nudge, not pressure — tell me if the date needs to move or if something is blocked.", {
        tone: "professional",
        audience: "coworker",
        style: "supportive",
        sensitivity: "standard",
        placeholders: ["recipientName", "task", "dayOrTime"],
      }),
      option("Long professional reminder", "Hello {{recipientName}}, a reminder about {{task}}, with {{deadline}} as the target. Please let me know early if anything is blocked, and I will help where I can.", {
        tone: "professional",
        audience: "client",
        style: "balanced",
        sensitivity: "standard",
        placeholders: ["recipientName", "task", "deadline"],
      }),
    ],
  },
};
