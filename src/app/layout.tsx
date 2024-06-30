import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@/styles/globals.css';
import { AuthProvider } from '@/context/AuthProvider';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'Welcome to IDPortal',
    description: 'Developed by shibadev',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang='en'>
            <body className={inter.className}>
                <AuthProvider>
                    <main>
                        <Toaster
                            toastOptions={{
                                style: {
                                    maxWidth: 'fit-content',
                                },
                            }}
                        />
                        {children}
                    </main>
                </AuthProvider>
            </body>
        </html>
    );
}
