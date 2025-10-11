import React from 'react';
import MenteeAppLayout from '../MenteeAppLayout';

const HelpCenter: React.FC = () => {
  return (
    <MenteeAppLayout>
      <main className="min-h-screen bg-[#F9FAFB] dark:bg-[#0A0A0A]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#312E81] dark:text-[#E0E7FF]">HelpCenter</h1>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300/80">Scaffolded page. Build your UI here.</p>
        </div>
      </main>
    </MenteeAppLayout>
  );
};

export default HelpCenter;
