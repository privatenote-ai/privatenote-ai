import React from 'react';
import { PrivacyTools as PrivacyToolsComponent } from '@/components/features/PrivacyTools';

export default function PrivacyToolsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        <PrivacyToolsComponent />
      </main>
    </div>
  );
}