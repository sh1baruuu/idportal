import { auth } from "@/config/firebase/firebaseConfig";
import SignInCredential from "@/types/LogInCredential";
import { UserCredential, signInWithEmailAndPassword } from "firebase/auth";

export const signIn = async ({ email, password }: SignInCredential): Promise<UserCredential> => {
    return await signInWithEmailAndPassword(auth, email, password);
};

export const signOut = async (): Promise<void> => {
    auth.signOut();
}