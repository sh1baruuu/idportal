
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