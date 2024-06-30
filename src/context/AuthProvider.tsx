'use client';

import { auth } from '@/config/firebase/firebaseConfig';
import { signIn, signOut } from '@/services/firebaseAuth';
import SignInCredential from '@/types/LogInCredential';
import { removeAuthToken, setAuthToken } from '@/utils/authToken';
import { getSignInErrorMessage } from '@/utils/errorMessages';
import { validateEmail } from '@/utils/validation';
import { useKeepMeLoggedInStore } from '@/zustand';
import { User, onAuthStateChanged } from 'firebase/auth';
import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext<any>({});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const { keepMeLoggedIn, dontKeepMeLoggedIn } = useKeepMeLoggedInStore();

    useEffect(() => {
        if (!auth) return;

        return onAuthStateChanged(auth, async (user) => {
            if (!user) {
                setCurrentUser(null);
                removeAuthToken();
            }
            if (user) {
                const token = await user.getIdToken();
                setAuthToken(token, keepMeLoggedIn);
                setCurrentUser(user);
            }
        });
    }, [auth, keepMeLoggedIn]);

    const onSignIn = async (
        signInCredential: SignInCredential
    ): Promise<User> => {
        try {
            await validateEmail(signInCredential);
            const { user } = await signIn(signInCredential);
            return user;
        } catch (error: any) {
            throw new Error(getSignInErrorMessage(error.code));
        }
    };

    const onSignOut = async () => {
        try {
            await signOut();
            removeAuthToken();
            dontKeepMeLoggedIn();
        } catch (error) {
            throw error;
        }
    };

    return (
        <AuthContext.Provider
            value={{
                currentUser,
                onSignIn,
                onSignOut,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
