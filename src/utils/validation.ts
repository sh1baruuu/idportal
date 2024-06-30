import { FirebaseCustomError } from "./customError";
import { emailRegex } from "./regex";

export const validateEmail = ({ email }: { email: string }): Promise<void> => {
    
    return new Promise((resolve, reject) => {
        if (emailRegex.test(email)) {
            resolve()
        } else {
            reject(new FirebaseCustomError('auth/invalid-email'));
        }
    });
};