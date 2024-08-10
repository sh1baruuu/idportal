import { auth } from "@/config/firebaseConfig";
import { LogInCredential } from "@/types";
import { UserCredential, signInWithEmailAndPassword, updatePassword } from "firebase/auth";


export const signIn = async ({ email, password }: LogInCredential): Promise<UserCredential> => {
    return await signInWithEmailAndPassword(auth, email, password);
};

export const signOut = async (): Promise<void> => {
    auth.signOut();
}
