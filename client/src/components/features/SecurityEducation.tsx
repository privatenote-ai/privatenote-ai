import React from 'react';
import { 
  BookOpen, 
  Fingerprint, 
  Globe, 
  MessageSquare, 
  Smartphone, 
  Wifi 
} from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export const SecurityEducation: React.FC = () => {
  return (
    <div className="space-y-6">
      <p className="text-center text-gray-600 dark:text-gray-400 mb-8 max-w-3xl mx-auto">
        Understanding digital privacy is the first step to protecting yourself online. 
        Learn about common threats and how to safeguard your information.
      </p>
      
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger className="text-lg font-medium">
            <div className="flex items-center">
              <Wifi className="h-5 w-5 mr-3 text-primary" />
              <span>Secure Your Network</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="text-gray-600 dark:text-gray-400 pl-8 text-base">
            <ul className="list-disc pl-5 space-y-2">
              <li>Use WPA3 encryption for your home Wi-Fi network</li>
              <li>Change default router credentials and update firmware regularly</li>
              <li>Set up a guest network for visitors to keep your main network secure</li>
              <li>Use a VPN when connecting to public Wi-Fi to encrypt your traffic</li>
              <li>Disable remote management features that you don't use</li>
            </ul>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="item-2">
          <AccordionTrigger className="text-lg font-medium">
            <div className="flex items-center">
              <Smartphone className="h-5 w-5 mr-3 text-primary" />
              <span>Mobile Device Security</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="text-gray-600 dark:text-gray-400 pl-8 text-base">
            <ul className="list-disc pl-5 space-y-2">
              <li>Use strong authentication (biometrics + PIN)</li>
              <li>Keep your OS and apps updated</li>
              <li>Review app permissions regularly and limit location access</li>
              <li>Install apps only from official app stores</li>
              <li>Enable remote wipe features in case your device is lost or stolen</li>
              <li>Use encrypted messaging apps for sensitive communications</li>
            </ul>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="item-3">
          <AccordionTrigger className="text-lg font-medium">
            <div className="flex items-center">
              <Globe className="h-5 w-5 mr-3 text-primary" />
              <span>Secure Browsing Habits</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="text-gray-600 dark:text-gray-400 pl-8 text-base">
            <ul className="list-disc pl-5 space-y-2">
              <li>Use a privacy-focused browser with tracking protection</li>
              <li>Install browser extensions that block trackers and ads</li>
              <li>Clear cookies and browsing history regularly</li>
              <li>Check for HTTPS on websites before entering personal information</li>
              <li>Use private browsing mode for sensitive searches</li>
              <li>Consider using Tor for anonymous browsing when maximum privacy is needed</li>
            </ul>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="item-4">
          <AccordionTrigger className="text-lg font-medium">
            <div className="flex items-center">
              <MessageSquare className="h-5 w-5 mr-3 text-primary" />
              <span>Secure Communication</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="text-gray-600 dark:text-gray-400 pl-8 text-base">
            <ul className="list-disc pl-5 space-y-2">
              <li>Use end-to-end encrypted messaging apps for sensitive conversations</li>
              <li>Verify contact identities through security codes or QR codes</li>
              <li>Be cautious with message disappearing features—recipients can still screenshot</li>
              <li>Use encrypted email services for sensitive communications</li>
              <li>Be aware of metadata even when content is encrypted</li>
              <li>Avoid sending sensitive information through SMS or traditional email</li>
            </ul>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="item-5">
          <AccordionTrigger className="text-lg font-medium">
            <div className="flex items-center">
              <Fingerprint className="h-5 w-5 mr-3 text-primary" />
              <span>Digital Privacy Best Practices</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="text-gray-600 dark:text-gray-400 pl-8 text-base">
            <ul className="list-disc pl-5 space-y-2">
              <li>Review privacy settings on all your accounts and services</li>
              <li>Opt out of data collection when possible</li>
              <li>Use different emails for different purposes (work, personal, newsletters)</li>
              <li>Be cautious about sharing personal information on social media</li>
              <li>Use privacy-focused alternatives to mainstream services when possible</li>
              <li>Understand that "free" services often pay for themselves by collecting your data</li>
            </ul>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="item-6">
          <AccordionTrigger className="text-lg font-medium">
            <div className="flex items-center">
              <BookOpen className="h-5 w-5 mr-3 text-primary" />
              <span>Resources for Beginners</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="text-gray-600 dark:text-gray-400 pl-8 text-base">
            <p className="mb-3">
              If you're new to digital privacy and security, these resources will help you get started:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <a 
                  href="https://ssd.eff.org/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  EFF's Surveillance Self-Defense
                </a> - Easy-to-understand guides for protecting your digital privacy
              </li>
              <li>
                <a 
                  href="https://privacytools.io/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  PrivacyTools
                </a> - Recommendations for privacy-focused software and services
              </li>
              <li>
                <a 
                  href="https://www.consumerreports.org/digital-security/online-security-and-privacy-guide/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Consumer Reports Security Planner
                </a> - Step-by-step guides tailored to your devices
              </li>
            </ul>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};