import React from 'react';
import { Link } from 'wouter';
import { 
  Check, 
  ShieldCheck, 
  ShieldAlert, 
  AlertTriangle,
  Key 
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface SecurityRecommendationProps {
  type?: 'compact' | 'full';
  context?: 'success' | 'error' | 'generator' | 'general';
}

export const SecurityRecommendations: React.FC<SecurityRecommendationProps> = ({ 
  type = 'compact',
  context = 'general'
}) => {
  if (type === 'compact') {
    return <CompactRecommendations context={context} />;
  }
  
  return <FullRecommendations />;
};

const CompactRecommendations: React.FC<Pick<SecurityRecommendationProps, 'context'>> = ({ context }) => {
  let recommendations: React.ReactNode;
  
  switch (context) {
    case 'success':
      recommendations = (
        <>
          <h3 className="text-lg font-medium mb-2 flex items-center">
            <ShieldCheck className="h-5 w-5 text-green-500 mr-2" />
            Great! Here are a few more tips:
          </h3>
          <ul className="space-y-1 pl-7 list-disc text-sm">
            <li>Store this link somewhere secure</li>
            <li>Don't send it over unsecured channels</li>
            <li>The note will expire in 24 hours for your security</li>
            <li>For sensitive notes, enable password protection and share it separately</li>
            <li>Consider using <Link href="/password-generator" className="text-primary hover:underline">our password generator</Link> for secure passwords</li>
          </ul>
        </>
      );
      break;
    case 'error':
      recommendations = (
        <>
          <h3 className="text-lg font-medium mb-2 flex items-center">
            <ShieldAlert className="h-5 w-5 text-red-500 mr-2" />
            Secure Note Tips
          </h3>
          <ul className="space-y-1 pl-7 list-disc text-sm">
            <li>Ensure you use the complete link including the part after the # symbol</li>
            <li>The decryption key is never sent to our servers</li>
            <li>If the note was already viewed, it might have been deleted</li>
            <li>Notes automatically expire after 24 hours</li>
          </ul>
        </>
      );
      break;
    case 'generator':
      recommendations = (
        <>
          <h3 className="text-lg font-medium mb-2 flex items-center">
            <Key className="h-5 w-5 text-primary mr-2" />
            Password Security Tips
          </h3>
          <ul className="space-y-1 pl-7 list-disc text-sm">
            <li>Use a different password for each account</li>
            <li>Consider a password manager to store your passwords securely</li>
            <li>Enable two-factor authentication when available</li>
            <li>Change passwords for sensitive accounts every few months</li>
            <li>Check if your accounts have been compromised at <a href="https://haveibeenpwned.com/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Have I Been Pwned</a></li>
          </ul>
        </>
      );
      break;
    default:
      recommendations = (
        <>
          <h3 className="text-lg font-medium mb-2 flex items-center">
            <ShieldCheck className="h-5 w-5 text-primary mr-2" />
            Quick Security Tips
          </h3>
          <ul className="space-y-1 pl-7 list-disc text-sm">
            <li>Use strong, unique passwords for each account</li>
            <li>Enable two-factor authentication when available</li>
            <li>Keep your software and devices updated</li>
            <li>Be cautious about the information you share online</li>
            <li>Use encrypted services for sensitive communications</li>
          </ul>
        </>
      );
  }
  
  return (
    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
      {recommendations}
    </div>
  );
};

const FullRecommendations: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center text-xl">
            <ShieldCheck className="h-5 w-5 mr-2 text-primary" />
            Password Managers
          </CardTitle>
          <CardDescription>
            Keep all your passwords secure and accessible
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-1">Recommended Tools:</h4>
              <div className="flex flex-wrap gap-2 mb-3">
                <Badge variant="outline" className="flex items-center">
                  <Check className="h-3 w-3 mr-1 text-green-500" />
                  Bitwarden
                </Badge>
                <Badge variant="outline" className="flex items-center">
                  <Check className="h-3 w-3 mr-1 text-green-500" />
                  1Password
                </Badge>
                <Badge variant="outline" className="flex items-center">
                  <Check className="h-3 w-3 mr-1 text-green-500" />
                  KeePassXC
                </Badge>
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-1">Benefits:</h4>
              <ul className="list-disc pl-5 text-sm text-gray-600 dark:text-gray-400">
                <li>Store unique passwords for every account</li>
                <li>Generate strong passwords automatically</li>
                <li>Access on multiple devices</li>
                <li>Only remember one master password</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center text-xl">
            <ShieldCheck className="h-5 w-5 mr-2 text-primary" />
            VPN Services
          </CardTitle>
          <CardDescription>
            Encrypt your internet connection for privacy
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-1">Recommended Tools:</h4>
              <div className="flex flex-wrap gap-2 mb-3">
                <Badge variant="outline" className="flex items-center">
                  <Check className="h-3 w-3 mr-1 text-green-500" />
                  ProtonVPN
                </Badge>
                <Badge variant="outline" className="flex items-center">
                  <Check className="h-3 w-3 mr-1 text-green-500" />
                  Mullvad
                </Badge>
                <Badge variant="outline" className="flex items-center">
                  <Check className="h-3 w-3 mr-1 text-green-500" />
                  IVPN
                </Badge>
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-1">Benefits:</h4>
              <ul className="list-disc pl-5 text-sm text-gray-600 dark:text-gray-400">
                <li>Hide your browsing from your ISP</li>
                <li>Protect data on public Wi-Fi</li>
                <li>Access geo-restricted content</li>
                <li>Reduce targeted advertising</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center text-xl">
            <ShieldCheck className="h-5 w-5 mr-2 text-primary" />
            Secure Messaging
          </CardTitle>
          <CardDescription>
            Private communication with end-to-end encryption
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-1">Recommended Tools:</h4>
              <div className="flex flex-wrap gap-2 mb-3">
                <Badge variant="outline" className="flex items-center">
                  <Check className="h-3 w-3 mr-1 text-green-500" />
                  Signal
                </Badge>
                <Badge variant="outline" className="flex items-center">
                  <Check className="h-3 w-3 mr-1 text-green-500" />
                  Session
                </Badge>
                <Badge variant="outline" className="flex items-center">
                  <Check className="h-3 w-3 mr-1 text-green-500" />
                  Element
                </Badge>
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-1">Benefits:</h4>
              <ul className="list-disc pl-5 text-sm text-gray-600 dark:text-gray-400">
                <li>End-to-end encryption by default</li>
                <li>Disappearing messages option</li>
                <li>Minimal metadata collection</li>
                <li>Independent security audits</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center text-xl">
            <ShieldCheck className="h-5 w-5 mr-2 text-primary" />
            Private Browsers
          </CardTitle>
          <CardDescription>
            Reduce tracking and enhance browsing privacy
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-1">Recommended Tools:</h4>
              <div className="flex flex-wrap gap-2 mb-3">
                <Badge variant="outline" className="flex items-center">
                  <Check className="h-3 w-3 mr-1 text-green-500" />
                  Firefox
                </Badge>
                <Badge variant="outline" className="flex items-center">
                  <Check className="h-3 w-3 mr-1 text-green-500" />
                  Brave
                </Badge>
                <Badge variant="outline" className="flex items-center">
                  <Check className="h-3 w-3 mr-1 text-green-500" />
                  Tor Browser
                </Badge>
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-1">Benefits:</h4>
              <ul className="list-disc pl-5 text-sm text-gray-600 dark:text-gray-400">
                <li>Built-in tracker blocking</li>
                <li>Reduced fingerprinting</li>
                <li>Private browsing modes</li>
                <li>Advanced privacy settings</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center text-xl">
            <ShieldCheck className="h-5 w-5 mr-2 text-primary" />
            Secure Email
          </CardTitle>
          <CardDescription>
            Private email services with encryption options
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-1">Recommended Tools:</h4>
              <div className="flex flex-wrap gap-2 mb-3">
                <Badge variant="outline" className="flex items-center">
                  <Check className="h-3 w-3 mr-1 text-green-500" />
                  ProtonMail
                </Badge>
                <Badge variant="outline" className="flex items-center">
                  <Check className="h-3 w-3 mr-1 text-green-500" />
                  Tutanota
                </Badge>
                <Badge variant="outline" className="flex items-center">
                  <Check className="h-3 w-3 mr-1 text-green-500" />
                  Mailbox.org
                </Badge>
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-1">Benefits:</h4>
              <ul className="list-disc pl-5 text-sm text-gray-600 dark:text-gray-400">
                <li>End-to-end encryption options</li>
                <li>No targeted advertising</li>
                <li>Minimal data collection</li>
                <li>Enhanced privacy features</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center text-xl">
            <AlertTriangle className="h-5 w-5 mr-2 text-amber-500" />
            Common Threats
          </CardTitle>
          <CardDescription>
            Be aware of these security risks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-1">Watch out for:</h4>
              <ul className="list-disc pl-5 text-sm text-gray-600 dark:text-gray-400">
                <li>Phishing attempts via email or messages</li>
                <li>Using the same password across multiple sites</li>
                <li>Downloading software from untrusted sources</li>
                <li>Connecting to unsecured public Wi-Fi networks</li>
                <li>Clicking on suspicious links or attachments</li>
                <li>Oversharing personal information on social media</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};