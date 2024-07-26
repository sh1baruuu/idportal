'use client';

import { auth } from '@/config/firebaseConfig';
import { removeAuthToken, setAuthToken } from '@/lib/authToken';
import { getSignInErrorMessage } from '@/lib/errorMessages';
import { validateEmail } from '@/lib/validation';
import { signIn, signOut } from '@/services/firebaseAuthService';
import { LogInCredential } from '@/types';
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

    const onLogIn = async (
        logInCredential: LogInCredential
    ): Promise<User> => {
        try {
            await validateEmail(logInCredential);
            const { user } = await signIn(logInCredential);
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
                onLogIn,
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
