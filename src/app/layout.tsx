import { Toaster as ShadToaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { AuthProvider } from '@/context/AuthProvider';
import { ThemeProvider } from '@/context/ThemeProvider';
import { TRCPProvider } from '@/context/TRPCProvider';
import { cn } from '@/lib/utils';
import '@/styles/globals.css';
import type { Metadata } from 'next';
import { Inter as FontSans } from 'next/font/google';
import { Suspense } from 'react';
import { Toaster } from 'react-hot-toast';
import Loader from './dashboard/_components/Loader';

const fontSans = FontSans({
    subsets: ['latin'],
    variable: '--font-sans',
});

export const metadata: Metadata = {
    title: 'Welcome to Tricycle Permit Console',
    description: 'Developed by shibadev',
};

interface Props {
    children: React.ReactNode;
}

const toastOptions = {
    style: {
        maxWidth: 'fit-content',
    },
};

export default function RootLayout({ children }: Readonly<Props>) {
    return (
        <html lang='en' suppressHydrationWarning>
            <body
                className={cn(
                    'min-h-screen bg-background font-sans antialiased',
                    fontSans.variable
                )}
            ><ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
            >
                    <AuthProvider>
                        <TRCPProvider>
                            <TooltipProvider>
                                <Toaster toastOptions={toastOptions} />
                                <ShadToaster />
                                <Suspense fallback={<Loader className='h-screen' />}>
                                    {children}
                                </Suspense>
                            </TooltipProvider>
                        </TRCPProvider>
                    </AuthProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
