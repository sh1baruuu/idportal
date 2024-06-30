import Cookies from 'js-cookie';

export const getAuthToken = (): string | undefined => {
    return Cookies.get("firebaseToken");
}

export const setAuthToken = (token: string, keepMeLoggedIn: boolean): string | undefined => {
    const expDaysCount = JSON.stringify(keepMeLoggedIn) == 'true' ? 30 : 1;
    return Cookies.set("firebaseToken", token, { secure: true, expires: expDaysCount });
}

export const removeAuthToken = (): void => {
    return Cookies.remove("firebaseToken");
}
