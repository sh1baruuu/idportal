import type { Metadata } from 'next';
import { Inter as FontSans } from 'next/font/google';
import '@/styles/globals.css';
import { AuthProvider } from '@/context/AuthProvider';
import { Toaster } from 'react-hot-toast';
import { TooltipProvider } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

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
                    <TooltipProvider>
                        <Toaster
                            toastOptions={{
                                style: {
                                    maxWidth: 'fit-content',
                                },
                            }}
                        />
                        {children}
                    </TooltipProvider>
                </AuthProvider>
            </body>
        </html>
    );
}
