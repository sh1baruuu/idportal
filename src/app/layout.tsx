import { TooltipProvider } from '@/components/ui/tooltip';
import { AuthProvider } from '@/context/AuthProvider';
import { TRCPProvider } from '@/context/TRPCProvider';
import { cn } from '@/lib/utils';
import '@/styles/globals.css';
import type { Metadata } from 'next';
import { Inter as FontSans } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import { Toaster as ShadToaster } from '@/components/ui/toaster';
import { Suspense } from 'react';
import Loader from './dashboard/_components/Loader';

const fontSans = FontSans({
    subsets: ['latin'],
    variable: '--font-sans',
});

export const metadata: Metadata = {
    title: 'Welcome to IDPortal',
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
        <html lang='en'>
            <body
                className={cn(
                    'min-h-screen bg-background font-sans antialiased',
                    fontSans.variable
                )}
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
            </body>
        </html>
    );
}
