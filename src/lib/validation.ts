import { FirebaseCustomError } from "./customError";
import { emailRegex, passwordRegex } from "./regex";

export const validateEmail = ({ email }: { email: string }): Promise<void> => {
    
    return new Promise((resolve, reject) => {
        if (emailRegex.test(email)) {
            resolve()
        } else {
            reject(new FirebaseCustomError('auth/invalid-email'));
        }
    });
};


export const validateSignUpPassword = async (password: string, confirm: string): Promise<void> => {
    if (password.length === 0) {
        throw new Error("pass/is-empty");
    }

    if (confirm.length === 0) {
        throw new Error("confirm-pass/is-empty");
    }

    if (!passwordRegex.test(password)) {
        throw new Error("pass/test-failed");
    }

    if (password !== confirm) {
        throw new Error("pass/not-match");
    }
};
