import {
  guidedWritingOption as option,
  type GuidedWritingTemplateSet,
  type LocalFallbackTemplateId,
} from "./localFallbackShared";

/** English guided-writing starters (offline fallback templates). */
export const GUIDED_WRITING_TEMPLATES_EN: Record<LocalFallbackTemplateId, GuidedWritingTemplateSet> = {
  "ask-anything": {
    "1-2": [
      option("Warm opener", "Hi {{recipientName}}, just wanted to say {{mainMessage}}. Hope you are doing well.", {
        tone: "warm",
        audience: "general",
        style: "balanced",
        sensitivity: "standard",
        placeholders: ["recipientName", "mainMessage"],
      }),
      option("Clean note", "Hi {{recipientName}}, I wanted to reach out about {{topic}}. Let me know what works for you.", {
        tone: "casual",
        audience: "general",
        style: "direct",
        sensitivity: "standard",
        placeholders: ["recipientName", "topic"],
      }),
    ],
    "2-3": [
      option("Warm draft", "Hi {{recipientName}}, I have been meaning to message you about {{topic}}. I wanted to say {{mainMessage}} because {{reason}}. Hope the rest of your week goes smoothly.", {
        tone: "warm",
        audience: "general",
        style: "thoughtful",
        sensitivity: "standard",
        placeholders: ["recipientName", "topic", "mainMessage", "reason"],
      }),
      option("Clear follow-up", "Hi {{recipientName}}, I wanted to follow up about {{topic}}. The main thing I wanted to share is {{mainMessage}}. Let me know if you would like to talk more about it.", {
        tone: "professional",
        audience: "general",
        style: "direct",
        sensitivity: "standard",
        placeholders: ["recipientName", "topic", "mainMessage"],
      }),
    ],
    "4-6": [
      option("Thoughtful draft", "Hi {{recipientName}}, I wanted to send a quick note about {{topic}}. I have been thinking about {{relevantDetail}}, and I felt it was worth reaching out. What I really want to say is {{mainMessage}}. I appreciate {{specificDetail}}. Let me know if you want to talk more when you have time.", {
        tone: "warm",
        audience: "general",
        style: "thoughtful",
        sensitivity: "standard",
        placeholders: ["recipientName", "topic", "relevantDetail", "mainMessage", "specificDetail"],
      }),
      option("Balanced draft", "Hi {{recipientName}}, I hope you are doing well. I am writing about {{topic}} because {{reason}}. I wanted to let you know {{mainMessage}}. I also wanted to mention {{extraDetail}}. Please feel free to reply whenever it is convenient.", {
        tone: "professional",
        audience: "general",
        style: "balanced",
        sensitivity: "standard",
        placeholders: ["recipientName", "topic", "reason", "mainMessage", "extraDetail"],
      }),
    ],
    "7-10": [
      option("Personal letter", "Hi {{recipientName}}, I hope you are doing well. I wanted to write to you about {{topic}} because it has been on my mind. Over the last {{timeframe}}, I have been thinking about {{relevantDetail}}. The main thing I wanted to say is {{mainMessage}}. I also wanted to mention {{extraDetail}} because it felt important. I really appreciate {{specificDetail}}. There is no pressure to reply right away. I just wanted to reach out properly and say this with care.", {
        tone: "warm",
        audience: "general",
        style: "thoughtful",
        sensitivity: "standard",
        placeholders: ["recipientName", "topic", "timeframe", "relevantDetail", "mainMessage", "extraDetail", "specificDetail"],
      }),
      option("Full note", "Hi {{recipientName}}, I wanted to send a fuller note about {{topic}}. First, I want to say {{mainMessage}}. The reason this matters to me is {{reason}}. I also wanted to share {{extraDetail}}. If it makes sense, we could {{nextStep}}. If now is not the best time, that is completely okay too. I simply wanted to be clear, thoughtful, and honest in reaching out.", {
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
      option("Classic gratitude", "Thank you, {{recipientName}}, for {{supportType}}. It really meant a lot to me.", {
        tone: "warm",
        audience: "general",
        style: "direct",
        sensitivity: "standard",
        placeholders: ["recipientName", "supportType"],
      }),
      option("Polished appreciation", "Thank you for {{specificDetail}}, {{recipientName}}. I truly appreciate your support.", {
        tone: "professional",
        audience: "coworker",
        style: "balanced",
        sensitivity: "standard",
        placeholders: ["specificDetail", "recipientName"],
      }),
    ],
    "2-3": [
      option("Warm gratitude", "Thank you so much, {{recipientName}}, for {{actionTaken}}. Your support really helped with {{result}}. I appreciate it more than I can say.", {
        tone: "warm",
        audience: "general",
        style: "thoughtful",
        sensitivity: "standard",
        placeholders: ["recipientName", "actionTaken", "result"],
      }),
      option("Gracious note", "Hi {{recipientName}}, thank you for {{supportType}}. It was thoughtful and generous, and it made a real difference. I am very grateful.", {
        tone: "warm",
        audience: "general",
        style: "balanced",
        sensitivity: "standard",
        placeholders: ["recipientName", "supportType"],
      }),
    ],
    "4-6": [
      option("Heartfelt gratitude", "Hi {{recipientName}}, I wanted to thank you properly for {{actionTaken}}. It was incredibly thoughtful of you, and it helped me more than you probably realized. I especially appreciated {{specificDetail}}. Your kindness made a stressful time feel much lighter. Thank you again for being so generous and supportive.", {
        tone: "warm",
        audience: "general",
        style: "thoughtful",
        sensitivity: "standard",
        placeholders: ["recipientName", "actionTaken", "specificDetail"],
      }),
      option("Appreciative letter", "Thank you, {{recipientName}}, for {{supportType}}. I have been wanting to tell you how much I appreciated it. It meant a lot because {{reason}}. Your thoughtfulness did not go unnoticed. I feel very lucky to have your support.", {
        tone: "warm",
        audience: "general",
        style: "balanced",
        sensitivity: "standard",
        placeholders: ["recipientName", "supportType", "reason"],
      }),
    ],
    "7-10": [
      option("Gratitude letter", "Hi {{recipientName}}, I wanted to send a proper thank-you for {{actionTaken}}. I know it took time, effort, and care, and I do not take that lightly. What meant the most was {{specificDetail}}. It really helped with {{resultOrSituation}}, and it made things easier for me in a meaningful way. Your kindness came at exactly the right time. I am genuinely grateful for your support. Thank you again for showing up for me the way you did.", {
        tone: "warm",
        audience: "general",
        style: "thoughtful",
        sensitivity: "standard",
        placeholders: ["recipientName", "actionTaken", "specificDetail", "resultOrSituation"],
      }),
      option("Deep appreciation", "Dear {{recipientName}}, thank you so much for {{supportType}}. I have been reflecting on how much it meant to me. It was not only generous, but also deeply thoughtful. I especially appreciated {{specificDetail}}. Because of you, {{positiveResult}}. Please know how grateful I am. Your support made a lasting impression on me, and I will remember it for a long time.", {
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
      option("Executive request", "Hi {{recipientName}}, I would like to schedule a quick meeting to discuss {{topic}}. Please let me know your availability.", {
        tone: "professional",
        audience: "client",
        style: "direct",
        sensitivity: "standard",
        placeholders: ["recipientName", "topic"],
      }),
    ],
    "2-3": [
      option("Clean request", "Hi {{recipientName}}, I would like to schedule a meeting about {{topic}}. Would {{dayOrTime}} work for you? If not, I am happy to find another time.", {
        tone: "professional",
        audience: "coworker",
        style: "balanced",
        sensitivity: "standard",
        placeholders: ["recipientName", "topic", "dayOrTime"],
      }),
      option("Polished follow-up", "Hi {{recipientName}}, I am reaching out to see if we can set up a call about {{topic}}. I am available on {{dayOrTime}}. Please let me know what works best for you.", {
        tone: "professional",
        audience: "client",
        style: "direct",
        sensitivity: "standard",
        placeholders: ["recipientName", "topic", "dayOrTime"],
      }),
    ],
    "4-6": [
      option("Polished request", "Hi {{recipientName}}, I wanted to reach out about scheduling a meeting to discuss {{topic}}. I think it would be helpful to talk through {{specificDetail}}. I am currently available on {{dayOrTime}}, but I can adjust if needed. Please let me know what time works best for you. I would be glad to coordinate around your schedule.", {
        tone: "professional",
        audience: "client",
        style: "balanced",
        sensitivity: "standard",
        placeholders: ["recipientName", "topic", "specificDetail", "dayOrTime"],
      }),
      option("Formal request", "Hello {{recipientName}}, I would appreciate the chance to meet regarding {{topic}}. I believe a short conversation would help clarify {{specificDetail}}. I am available on {{dayOrTime}} and can also offer {{alternateTime}} if that is easier. Please let me know your preferred time. Thank you in advance.", {
        tone: "formal",
        audience: "client",
        style: "balanced",
        sensitivity: "standard",
        placeholders: ["recipientName", "topic", "specificDetail", "dayOrTime", "alternateTime"],
      }),
    ],
    "7-10": [
      option("Detailed brief", "Hi {{recipientName}}, I hope you are doing well. I wanted to ask whether we could schedule a meeting to discuss {{topic}}. I think it would be useful to review {{specificDetail}} together and make sure we are aligned on next steps. I am available on {{dayOrTime}}, and I can also make {{alternateTime}} work if needed. If another day is better, I am happy to adjust. Please let me know what works best for you. I appreciate your time and would value the chance to talk this through properly.", {
        tone: "professional",
        audience: "coworker",
        style: "thoughtful",
        sensitivity: "standard",
        placeholders: ["recipientName", "topic", "specificDetail", "dayOrTime", "alternateTime"],
      }),
      option("Formal brief", "Hello {{recipientName}}, I am writing to request a meeting about {{topic}}. There are a few points I would like to cover, especially {{specificDetail}}. I believe a short discussion would help move things forward more efficiently. My current availability is {{dayOrTime}}, though I can be flexible if another slot suits you better. If you prefer, we could also do this over {{extraDetail}}. Please let me know what works best on your side. Thank you for considering it.", {
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
      option("Classic birthday wish", "Happy Birthday, {{recipientName}}! I hope your day is full of joy and good moments.", {
        tone: "warm",
        audience: "general",
        style: "celebratory",
        sensitivity: "standard",
        placeholders: ["recipientName"],
      }),
      option("Bright birthday note", "Happy Birthday, {{recipientName}}! Wishing you a wonderful year ahead.", {
        tone: "warm",
        audience: "general",
        style: "celebratory",
        sensitivity: "standard",
        placeholders: ["recipientName"],
      }),
    ],
    "2-3": [
      option("Warm birthday note", "Happy Birthday, {{recipientName}}! I hope today brings you a lot of happiness and a chance to celebrate properly. You deserve a really good day.", {
        tone: "warm",
        audience: "friend",
        style: "celebratory",
        sensitivity: "standard",
        placeholders: ["recipientName"],
      }),
      option("Personal birthday note", "Happy Birthday, {{recipientName}}! I am so glad to have you in my life. I hope this year brings you more of {{joyWish}} and plenty of reasons to smile.", {
        tone: "warm",
        audience: "friend",
        style: "thoughtful",
        sensitivity: "standard",
        placeholders: ["recipientName", "joyWish"],
      }),
    ],
    "4-6": [
      option("Thoughtful birthday message", "Happy Birthday, {{recipientName}}! I hope you get to spend today surrounded by people and things you love. You bring so much {{quality}} into the lives of people around you. I am really grateful for {{specificDetail}}. Wishing you a year filled with happiness, good health, and memorable moments.", {
        tone: "warm",
        audience: "friend",
        style: "thoughtful",
        sensitivity: "standard",
        placeholders: ["recipientName", "quality", "specificDetail"],
      }),
      option("Warm personal greeting", "Happy Birthday, {{recipientName}}! I wanted to send you a proper message today because you mean a lot to me. I hope this year brings you {{goalOrWish}} and many moments that make you feel proud and happy. You deserve to be celebrated. Have an amazing day.", {
        tone: "warm",
        audience: "friend",
        style: "celebratory",
        sensitivity: "standard",
        placeholders: ["recipientName", "goalOrWish"],
      }),
    ],
    "7-10": [
      option("Long birthday message", "Happy Birthday, {{recipientName}}! I hope your day is filled with laughter, warmth, and all the little things that make you happiest. You are such a {{quality}} person, and it is a real gift to know you. One of the things I appreciate most about you is {{memory}}. I hope the year ahead brings you {{hopeOrGoal}}. You deserve good people, good health, and a lot of joy. Thank you for being exactly who you are. I hope today feels as special as you are to the people around you.", {
        tone: "warm",
        audience: "friend",
        style: "thoughtful",
        sensitivity: "standard",
        placeholders: ["recipientName", "quality", "memory", "hopeOrGoal"],
      }),
      option("Long heartfelt greeting", "Happy Birthday, {{recipientName}}! I wanted to send more than a quick message because you truly deserve that. You have such a way of bringing {{quality}} into the lives of people around you. I am especially grateful for {{memory}}. I hope this next year gives you {{hopeOrGoal}}, along with plenty of peace, fun, and exciting moments. May you feel celebrated, appreciated, and deeply loved today. Have the happiest birthday.", {
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
      option("Direct apology", "I am sorry, {{recipientName}}, for {{happened}}. I know I should have handled it better.", {
        tone: "gentle",
        audience: "general",
        style: "direct",
        sensitivity: "sensitive",
        placeholders: ["recipientName", "happened"],
      }),
      option("Simple sincere apology", "I am really sorry for {{happened}}. I understand why it hurt or caused frustration.", {
        tone: "gentle",
        audience: "general",
        style: "gentle",
        sensitivity: "sensitive",
        placeholders: ["happened"],
      }),
    ],
    "2-3": [
      option("Clear apology", "I am sorry, {{recipientName}}, for {{happened}}. I understand that my actions affected you, and I regret that. I will do better going forward.", {
        tone: "gentle",
        audience: "general",
        style: "direct",
        sensitivity: "sensitive",
        placeholders: ["recipientName", "happened"],
      }),
      option("Professional apology", "I want to apologize for {{issue}}. I understand the inconvenience this caused, and I take responsibility for it. I am working to make it right.", {
        tone: "professional",
        audience: "client",
        style: "balanced",
        sensitivity: "sensitive",
        placeholders: ["issue"],
      }),
    ],
    "4-6": [
      option("Sincere apology", "Hi {{recipientName}}, I want to sincerely apologize for {{happened}}. I understand that it caused {{impact}}, and I am sorry for putting you in that position. I should have handled it differently. I take full responsibility for my part in it. If possible, I would like to make things right by {{fixStep}}.", {
        tone: "gentle",
        audience: "general",
        style: "thoughtful",
        sensitivity: "sensitive",
        placeholders: ["recipientName", "happened", "impact", "fixStep"],
      }),
      option("Thoughtful apology", "I have been reflecting on {{happened}}, and I want to say clearly that I am sorry. You did not deserve {{impact}}, and I regret the way I handled things. I understand why you feel {{feeling}}. I am not making excuses. I just want to acknowledge it honestly and do better.", {
        tone: "gentle",
        audience: "general",
        style: "gentle",
        sensitivity: "sensitive",
        placeholders: ["happened", "impact", "feeling"],
      }),
    ],
    "7-10": [
      option("Long apology", "Hi {{recipientName}}, I wanted to send a proper apology for {{happened}}. I know that my actions caused {{impact}}, and I am genuinely sorry for that. Looking back, I should have handled the situation with more care and respect. You did not deserve the stress or disappointment this created. I take responsibility for my part in it. I also want to make things right by {{fixStep}}. I understand if it takes time to rebuild trust, but I wanted to say clearly that I am sorry and that I mean it.", {
        tone: "gentle",
        audience: "general",
        style: "thoughtful",
        sensitivity: "sensitive",
        placeholders: ["recipientName", "happened", "impact", "fixStep"],
      }),
      option("Long thoughtful apology", "I am sorry, {{recipientName}}, for {{happened}}. I have thought a lot about it, and I can see how it affected you. I regret that I was not more careful, considerate, or honest in that moment. You deserved better from me. I am not trying to explain it away. I just want to acknowledge that I was wrong and that I am sorry. If you are open to it, I would like to make amends by {{fixStep}}. Thank you for reading this.", {
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
      option("Short love note", "I love you, {{recipientName}}. You make my life brighter in so many ways.", {
        tone: "romantic",
        audience: "partner",
        style: "direct",
        sensitivity: "sensitive",
        placeholders: ["recipientName"],
      }),
      option("Simple romantic note", "Just wanted to say I love you and appreciate you more than words can fully say.", {
        tone: "romantic",
        audience: "partner",
        style: "gentle",
        sensitivity: "sensitive",
        placeholders: [],
      }),
    ],
    "2-3": [
      option("Warm romantic message", "I love you, {{recipientName}}, and I feel lucky to have you in my life. You bring me so much {{feeling}}. I hope you know how much you mean to me.", {
        tone: "romantic",
        audience: "partner",
        style: "thoughtful",
        sensitivity: "sensitive",
        placeholders: ["recipientName", "feeling"],
      }),
      option("Gentle love note", "Being with you makes ordinary days feel special. I love you for {{quality}}, and I never want to take that for granted. You mean so much to me.", {
        tone: "romantic",
        audience: "partner",
        style: "gentle",
        sensitivity: "sensitive",
        placeholders: ["quality"],
      }),
    ],
    "4-6": [
      option("Thoughtful love message", "I love you, {{recipientName}}, and I wanted to put that into words properly. One of the things I appreciate most about you is {{quality}}. You make me feel {{feeling}}, and that means more than I can explain. I am grateful for the way you show up in my life. Loving you is one of the easiest and best things I know.", {
        tone: "romantic",
        audience: "partner",
        style: "thoughtful",
        sensitivity: "sensitive",
        placeholders: ["recipientName", "quality", "feeling"],
      }),
      option("Tender romantic note", "Sometimes I do not say it enough, but I love you deeply. I love the way you {{specificDetail}}, and I love how being with you feels like {{feeling}}. You make life softer, funnier, and more meaningful. I am grateful for you every day. You mean so much to me.", {
        tone: "romantic",
        audience: "partner",
        style: "gentle",
        sensitivity: "sensitive",
        placeholders: ["specificDetail", "feeling"],
      }),
    ],
    "7-10": [
      option("Long romantic message", "I love you, {{recipientName}}, and I wanted to say it in a fuller way today. You bring so much {{feeling}} into my life, and I do not take that for granted. One of the things I cherish most about you is {{specificDetail}}. Being with you has changed my life for the better in so many quiet and meaningful ways. I love the way you {{quality}}. I feel incredibly lucky that I get to know you, love you, and share life with you. Thank you for being you. I love you more than I can put into one message.", {
        tone: "romantic",
        audience: "partner",
        style: "thoughtful",
        sensitivity: "sensitive",
        placeholders: ["recipientName", "feeling", "specificDetail", "quality"],
      }),
      option("Long heartfelt love note", "You mean so much to me, {{recipientName}}. I love you for who you are, for how you make me feel, and for the way you bring {{feeling}} into my life. I keep thinking about {{memory}}, and it reminds me how lucky I am to have you. You have a way of making even hard days feel lighter. I admire {{quality}}, and I appreciate {{specificDetail}}. I hope you always know how deeply loved you are. I am so grateful for you.", {
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
      option("Classic congratulations", "Congratulations, {{recipientName}}, on {{achievement}}! That is such wonderful news.", {
        tone: "warm",
        audience: "general",
        style: "celebratory",
        sensitivity: "standard",
        placeholders: ["recipientName", "achievement"],
      }),
      option("Proud note", "Huge congratulations on {{achievement}}. You worked hard for this, and it shows.", {
        tone: "warm",
        audience: "general",
        style: "celebratory",
        sensitivity: "standard",
        placeholders: ["achievement"],
      }),
    ],
    "2-3": [
      option("Warm congratulations", "Congratulations, {{recipientName}}, on {{achievement}}! I am so happy for you. You really deserve this moment.", {
        tone: "warm",
        audience: "general",
        style: "celebratory",
        sensitivity: "standard",
        placeholders: ["recipientName", "achievement"],
      }),
      option("Professional congratulations", "Congratulations on {{achievement}}. Your hard work and dedication clearly paid off. Wishing you continued success in what comes next.", {
        tone: "professional",
        audience: "coworker",
        style: "supportive",
        sensitivity: "standard",
        placeholders: ["achievement"],
      }),
    ],
    "4-6": [
      option("Thoughtful congratulations", "Congratulations, {{recipientName}}, on {{achievement}}. This is such exciting and well-earned news. I know how much work, time, and effort went into reaching this point. You should feel incredibly proud of yourself. I am very happy for you and excited to see what comes next.", {
        tone: "warm",
        audience: "general",
        style: "celebratory",
        sensitivity: "standard",
        placeholders: ["recipientName", "achievement"],
      }),
      option("Supportive congratulations", "I wanted to say a big congratulations on {{achievement}}. You have been working toward this for {{timeframe}}, and it is great to see that effort recognized. You earned this. I hope you take a moment to celebrate properly. Wishing you even more success ahead.", {
        tone: "professional",
        audience: "coworker",
        style: "supportive",
        sensitivity: "standard",
        placeholders: ["achievement", "timeframe"],
      }),
    ],
    "7-10": [
      option("Long congratulations note", "Congratulations, {{recipientName}}, on {{achievement}}. I was so happy to hear the news. You have worked hard for this, and it is great to see that effort pay off in such a meaningful way. One of the things I admire most is {{quality}}. You should be very proud of what you have accomplished. I hope you take time to enjoy this moment and celebrate it properly. You earned it. Wishing you even more success and happiness in the next chapter.", {
        tone: "warm",
        audience: "general",
        style: "celebratory",
        sensitivity: "standard",
        placeholders: ["recipientName", "achievement", "quality"],
      }),
      option("Long proud message", "Huge congratulations on {{achievement}}, {{recipientName}}. This is such a wonderful milestone, and I know it did not happen by accident. Your {{quality}} really shines through. I have no doubt that you earned this with a lot of effort behind the scenes. It is exciting to see you reach this point. I hope you are taking a moment to appreciate how far you have come. You should be proud. I am certainly proud of you.", {
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
      option("Classic goodbye", "It has been wonderful working with you all. Thank you for everything, and I wish you the best.", {
        tone: "warm",
        audience: "team",
        style: "balanced",
        sensitivity: "standard",
        placeholders: [],
      }),
      option("Warm farewell", "Thank you for the support and good memories. Wishing you all the very best.", {
        tone: "warm",
        audience: "team",
        style: "supportive",
        sensitivity: "standard",
        placeholders: [],
      }),
    ],
    "2-3": [
      option("Warm farewell", "As I head into my next chapter, I just want to say thank you for {{specificDetail}}. Working with you has meant a lot to me. I will be wishing you all the best.", {
        tone: "warm",
        audience: "team",
        style: "thoughtful",
        sensitivity: "standard",
        placeholders: ["specificDetail"],
      }),
      option("Professional goodbye", "Thank you for the opportunity to work with such a great team. I have learned a lot from this experience, and I truly appreciate your support. Wishing everyone continued success.", {
        tone: "professional",
        audience: "team",
        style: "balanced",
        sensitivity: "standard",
        placeholders: [],
      }),
    ],
    "4-6": [
      option("Thoughtful farewell", "As I get ready to leave, I wanted to say thank you to {{groupName}}. This experience has meant a lot to me, and I am grateful for {{specificDetail}}. I have genuinely appreciated being part of this team. I will miss {{memory}}. Wishing all of you continued success and happiness.", {
        tone: "warm",
        audience: "team",
        style: "thoughtful",
        sensitivity: "standard",
        placeholders: ["groupName", "specificDetail", "memory"],
      }),
      option("Grateful goodbye", "It is not easy to say goodbye, but I wanted to take a moment to thank {{groupName}} for everything. I have learned so much here, and I am especially grateful for {{specificDetail}}. Working with you has been meaningful and memorable. I will carry a lot from this experience with me. Wishing you all the very best ahead.", {
        tone: "warm",
        audience: "team",
        style: "supportive",
        sensitivity: "standard",
        placeholders: ["groupName", "specificDetail"],
      }),
    ],
    "7-10": [
      option("Long farewell message", "As I prepare to move on, I wanted to send a proper thank-you to {{groupName}}. This chapter has meant a great deal to me, and I am truly grateful for {{specificDetail}}. I have learned so much from working alongside you. I will especially remember {{memory}}. Thank you for making this experience both meaningful and memorable. I will miss the people here and the moments we shared. Wishing you all continued success, happiness, and good things ahead.", {
        tone: "warm",
        audience: "team",
        style: "thoughtful",
        sensitivity: "standard",
        placeholders: ["groupName", "specificDetail", "memory"],
      }),
      option("Long team goodbye", "Before I leave, I wanted to say how much I have appreciated being part of {{groupName}}. Thank you for your support, generosity, and encouragement along the way. This experience gave me a lot, both personally and professionally. I am especially thankful for {{specificDetail}}. While I am excited for what comes next, I will miss this team and the connections built here. I hope we stay in touch. Wishing all of you nothing but success and happiness moving forward.", {
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
      option("Classic invitation", "You are invited to {{eventName}} on {{date}} at {{place}}. I would love for you to come.", {
        tone: "warm",
        audience: "general",
        style: "direct",
        sensitivity: "standard",
        placeholders: ["eventName", "date", "place"],
      }),
      option("Casual invite", "We are getting together for {{eventName}} on {{dayOrTime}}, and I would love to have you there.", {
        tone: "casual",
        audience: "friend",
        style: "direct",
        sensitivity: "standard",
        placeholders: ["eventName", "dayOrTime"],
      }),
    ],
    "2-3": [
      option("Warm invitation", "I would love to invite you to {{eventName}} on {{date}} at {{place}}. It starts at {{time}}, and it would mean a lot if you could come. Let me know if you can make it.", {
        tone: "warm",
        audience: "general",
        style: "thoughtful",
        sensitivity: "standard",
        placeholders: ["eventName", "date", "place", "time"],
      }),
      option("Friendly invite", "Hi {{recipientName}}, I am hosting {{eventName}} on {{dayOrTime}} at {{place}}. I would be really happy to celebrate with you. Hope you can make it.", {
        tone: "casual",
        audience: "friend",
        style: "celebratory",
        sensitivity: "standard",
        placeholders: ["recipientName", "eventName", "dayOrTime", "place"],
      }),
    ],
    "4-6": [
      option("Thoughtful invitation", "Hi {{recipientName}}, I wanted to invite you to {{eventName}} on {{date}} at {{place}}. We will be starting around {{time}}, and it would really mean a lot to have you there. It is a chance to {{occasion}}. Please let me know if you can make it. I would love to celebrate together.", {
        tone: "warm",
        audience: "general",
        style: "thoughtful",
        sensitivity: "standard",
        placeholders: ["recipientName", "eventName", "date", "place", "time", "occasion"],
      }),
      option("Detailed invite", "You are warmly invited to {{eventName}} on {{date}} at {{place}}. We will start at {{time}} and would love to have you join us. It should be a lovely time with {{eventDetail}}. If you can come, please let me know by {{rsvpDate}}. I hope you can be there.", {
        tone: "warm",
        audience: "general",
        style: "balanced",
        sensitivity: "standard",
        placeholders: ["eventName", "date", "place", "time", "eventDetail", "rsvpDate"],
      }),
    ],
    "7-10": [
      option("Long invitation message", "Hi {{recipientName}}, I wanted to send you a proper invitation to {{eventName}}. We will be gathering on {{date}} at {{place}}, starting around {{time}}. It would mean a lot to have you there and share the occasion with us. We are planning {{eventDetail}}, and I think it will be a really special time. Please let me know if you can make it by {{rsvpDate}}. I would genuinely love to celebrate together. Hope to see you there.", {
        tone: "warm",
        audience: "general",
        style: "thoughtful",
        sensitivity: "standard",
        placeholders: ["recipientName", "eventName", "date", "place", "time", "eventDetail", "rsvpDate"],
      }),
      option("Long warm invite", "I would love to invite you to {{eventName}} on {{date}} at {{place}}. This event means a lot to me, and it would feel even more special with you there. We will begin at {{time}}, and we are planning {{eventDetail}}. There will be time to relax, celebrate, and enjoy the moment together. If you are able to come, please let me know by {{rsvpDate}}. I really hope you can join us. It would not be the same without you.", {
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
      option("Gentle condolence", "I am so sorry for your loss, {{recipientName}}. Thinking of you and your family.", {
        tone: "gentle",
        audience: "general",
        style: "gentle",
        sensitivity: "sensitive",
        placeholders: ["recipientName"],
      }),
      option("Quiet support", "My heart is with you during this difficult time. I am so sorry for what you are going through.", {
        tone: "gentle",
        audience: "general",
        style: "supportive",
        sensitivity: "sensitive",
        placeholders: [],
      }),
    ],
    "2-3": [
      option("Simple condolence", "I am so sorry for your loss, {{recipientName}}. Please know that I am thinking of you and sending you love. I hope you feel supported in the days ahead.", {
        tone: "gentle",
        audience: "general",
        style: "gentle",
        sensitivity: "sensitive",
        placeholders: ["recipientName"],
      }),
      option("Gentle support", "I was so sorry to hear about {{loss}}. Please know that I am thinking of you and your family. Sending you strength and care during this difficult time.", {
        tone: "gentle",
        audience: "general",
        style: "supportive",
        sensitivity: "sensitive",
        placeholders: ["loss"],
      }),
    ],
    "4-6": [
      option("Warm condolence", "I was deeply sorry to hear about {{loss}}. Please accept my heartfelt condolences. I can only imagine how difficult this time must be for you and your family. I hope you are surrounded by love and support. Thinking of you and sending you strength.", {
        tone: "gentle",
        audience: "general",
        style: "supportive",
        sensitivity: "sensitive",
        placeholders: ["loss"],
      }),
      option("Gentle heartfelt note", "I am so sorry for your loss, {{recipientName}}. There are no perfect words for a moment like this, but I wanted to let you know that I am thinking of you. {{personName}} will be remembered for {{tribute}}. Please know that you are not alone. Sending you love and care.", {
        tone: "gentle",
        audience: "general",
        style: "gentle",
        sensitivity: "sensitive",
        placeholders: ["recipientName", "personName", "tribute"],
      }),
    ],
    "7-10": [
      option("Long condolence message", "I was so sorry to hear about {{loss}}, {{recipientName}}. I cannot imagine how heavy this moment must feel, but I wanted to reach out and let you know that I am thinking of you. Please accept my heartfelt condolences. {{personName}} will be remembered for {{tribute}}. I hope you are surrounded by people who care for you and support you through this difficult time. If there is anything I can do, even something small, please let me know. Sending you love, strength, and comfort.", {
        tone: "gentle",
        audience: "general",
        style: "supportive",
        sensitivity: "sensitive",
        placeholders: ["loss", "recipientName", "personName", "tribute"],
      }),
      option("Long gentle support note", "I am deeply sorry for your loss. I know words can feel small in moments like this, but I wanted you to know that I am thinking of you and your family. {{personName}} clearly meant so much and will be remembered with love. I hope you find comfort in the people around you and in the memories you shared. Please take care of yourself as best you can. Sending you my heartfelt sympathy and support.", {
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
      option("Thoughtful reminder", "Hi {{recipientName}}, I wanted to send a quick reminder about {{task}}. The deadline is {{dayOrTime}}, so I just wanted to make sure it is on your radar. If you need anything from me to help move it along, please let me know. Thanks again for taking care of it.", {
        tone: "professional",
        audience: "coworker",
        style: "supportive",
        sensitivity: "standard",
        placeholders: ["recipientName", "task", "dayOrTime"],
      }),
      option("Clear reminder", "Hello {{recipientName}}, just a gentle reminder about {{task}}. We are hoping to have it completed by {{deadline}}. I know schedules get busy, so I wanted to send a quick note in case this slipped through. Please let me know if you have any questions. Thank you.", {
        tone: "professional",
        audience: "coworker",
        style: "balanced",
        sensitivity: "standard",
        placeholders: ["recipientName", "task", "deadline"],
      }),
    ],
    "7-10": [
      option("Long reminder note", "Hi {{recipientName}}, I wanted to send a friendly reminder about {{task}}. The deadline is {{dayOrTime}}, and I just wanted to check in before then. I know you may have a lot going on, so this is simply meant as a helpful nudge. If there is anything you need from me to make it easier, please let me know. I appreciate your help with this. Thanks again for your time and attention.", {
        tone: "professional",
        audience: "coworker",
        style: "supportive",
        sensitivity: "standard",
        placeholders: ["recipientName", "task", "dayOrTime"],
      }),
      option("Long professional reminder", "Hello {{recipientName}}, I hope you are doing well. I wanted to follow up with a quick reminder about {{task}}. We are aiming to have this completed by {{deadline}}, so I wanted to check in ahead of time. If there are any issues, delays, or questions, feel free to let me know and I will do my best to help. Thank you for your attention to this. I appreciate it.", {
        tone: "professional",
        audience: "client",
        style: "balanced",
        sensitivity: "standard",
        placeholders: ["recipientName", "task", "deadline"],
      }),
    ],
  },
};
