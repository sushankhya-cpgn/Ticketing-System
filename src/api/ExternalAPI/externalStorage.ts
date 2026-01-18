import Cookies  from "js-cookie";

export const EXTERNAl_TOKENS = {
    BIMA:"BIMA_MANAGER_ACCESS_TOKEN",
}

export const getExternalToken = (tokenName: string): string | null => {
    return Cookies.get(tokenName) || null;
}

export const setExternalToken = (tokenName: string, tokenValue: string, expiresInDays: number = 7): void => {
    Cookies.set(tokenName, tokenValue, { expires: expiresInDays });
}

export const removeExternalToken = (tokenName: string): void => {
    Cookies.remove(tokenName);
}