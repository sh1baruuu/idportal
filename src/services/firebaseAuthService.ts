import { auth } from "@/config/firebaseConfig";
import { LogInCredential } from "@/types";
import { UserCredential, sendPasswordResetEmail, signInWithEmailAndPassword, updatePassword } from "firebase/auth";


export const signIn = async ({ email, password }: LogInCredential): Promise<UserCredential> => {
    return await signInWithEmailAndPassword(auth, email, password);
};

export const signOut = async (): Promise<void> => {
    auth.signOut();
}

export const resetUserPassword = async (email: string) => {
    return await sendPasswordResetEmail(auth, email);
};