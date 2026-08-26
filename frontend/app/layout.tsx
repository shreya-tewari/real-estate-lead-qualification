import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { LeadProvider } from '@/contexts/LeadContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from 'react-hot-toast';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'PropAI — AI-Powered Real Estate Lead Qualification',
  description: 'Qualify real estate leads instantly with our AI conversation system. Get matched with expert consultants in minutes.',
  keywords: 'real estate, AI qualification, lead qualification, property investment, Dubai real estate',
  openGraph: {
    title: 'PropAI — AI-Powered Real Estate Lead Qualification',
    description: 'Qualify real estate leads instantly with our AI conversation system.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <AuthProvider>
          <LeadProvider>
            {children}
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 3000,
                style: {
                  background: '#1a1a2e',
                  color: '#fff',
                  borderRadius: '12px',
                  padding: '12px 16px',
                  fontSize: '14px',
                  fontWeight: '500',
                },
                success: {
                  iconTheme: { primary: '#10b981', secondary: '#fff' },
                },
                error: {
                  iconTheme: { primary: '#ef4444', secondary: '#fff' },
                },
              }}
            />
          </LeadProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
