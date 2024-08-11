
export const getSignInErrorMessage = (code: string): string => {
    switch (code) {
        case 'auth/invalid-email':
            return 'The email address is invalid. Please try again.';
        case 'auth/user-disabled':
            return 'The user account has been disabled.';
        case 'auth/invalid-credential':
            return 'The email or password is incorrect. Please try again.';
        case 'auth/too-many-requests':
            return 'Too many attempts. Please try again later.';
        default:
            return 'An unknown error occurred. Please try again.';
    }
};


export const getPasswordError = async (error: any) => {
    let errorObj: {passwordError?: string, confirmError?: string } = {};

    if (error.message === "pass/is-empty") {
        errorObj.passwordError = "Password cannot be empty.";
    } else if (error.code === "auth/wrong-password") {
        errorObj.passwordError = "Incorrect password.";
    } else if (error.code === "auth/missing-password") {
        errorObj.passwordError = "Password cannot be empty.";
    } else if (error.code === "auth/weak-password") {
        errorObj.passwordError = "Password should be at least 6 characters.";
    } else if (error.message === "pass/test-failed") {
        errorObj.passwordError =
            "Password must contain an uppercase letter, one symbol, and one number.";
    } else if (error.message === "confirm-pass/is-empty") {
        errorObj.confirmError = "Confirm password cannot be empty.";
    } else if (error.message === "pass/not-match") {
        errorObj.confirmError = "Confirm password did not match.";
    }

    return errorObj;
};