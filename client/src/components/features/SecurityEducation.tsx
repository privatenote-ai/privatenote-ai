import React from 'react';
import { 
  Fingerprint, 
  Globe, 
  MessageSquare, 
  Smartphone, 
  Wifi 
} from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useLanguage } from '@/context/LanguageContext';

export const SecurityEducation: React.FC = () => {
  const { t } = useLanguage();
  const sections = [
    {
      value: "item-1",
      icon: Wifi,
      title: t.educationNetworkTitle,
      items: [t.educationNetwork1, t.educationNetwork2, t.educationNetwork3, t.educationNetwork4, t.educationNetwork5],
    },
    {
      value: "item-2",
      icon: Smartphone,
      title: t.educationMobileTitle,
      items: [t.educationMobile1, t.educationMobile2, t.educationMobile3, t.educationMobile4, t.educationMobile5, t.educationMobile6],
    },
    {
      value: "item-3",
      icon: Globe,
      title: t.educationBrowsingTitle,
      items: [t.educationBrowsing1, t.educationBrowsing2, t.educationBrowsing3, t.educationBrowsing4, t.educationBrowsing5, t.educationBrowsing6],
    },
    {
      value: "item-4",
      icon: MessageSquare,
      title: t.educationCommunicationTitle,
      items: [t.educationCommunication1, t.educationCommunication2, t.educationCommunication3, t.educationCommunication4, t.educationCommunication5, t.educationCommunication6],
    },
    {
      value: "item-5",
      icon: Fingerprint,
      title: t.educationPrivacyTitle,
      items: [t.educationPrivacy1, t.educationPrivacy2, t.educationPrivacy3, t.educationPrivacy4, t.educationPrivacy5, t.educationPrivacy6],
    },
  ];

  return (
    <div className="space-y-6">
      <Accordion
        type="single"
        collapsible
        className="w-full rounded-2xl border border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-gray-900/50 backdrop-blur-sm overflow-hidden"
      >
        {sections.map(({ value, icon: Icon, title, items }) => (
          <AccordionItem value={value} key={value}>
            <AccordionTrigger className="text-lg font-medium px-5 py-4 hover:no-underline">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/15">
                  <Icon className="h-5 w-5" />
                </span>
                <span>{title}</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="text-gray-600 dark:text-gray-400 px-6 pt-6 pb-6 text-base">
              <ul className="list-disc pl-5 space-y-2">
                {items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
        ))}
        
      </Accordion>
    </div>
  );
};
