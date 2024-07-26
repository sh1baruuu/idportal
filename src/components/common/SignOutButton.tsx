'use client';

import { useAuth } from '@/context/AuthProvider';
import { useRouter } from 'next/navigation';

function SignOutButton() {
    const router = useRouter();
    const { onSignOut } = useAuth();

    const signOut = async (): Promise<void> => {
        try {
            await onSignOut();
            router.push('login')
        } catch (error) {
            console.error(error);
        }
    };

    return <button onClick={signOut}>SignOutButton</button>;
}

export default SignOutButton;
