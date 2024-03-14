
const PWD_REGEX: RegExp = /^[A-Za-z0-9!@#$%&]{6,20}$/;
const USER_REGEX: RegExp = /^[A-Za-z0-9]{4,10}$/;

export enum ValidateResult
{
    VALID = "User info is valid.",
    INV_USER = "Username is invalid.",
    INV_PWD = "Password is invalid.",
    INV_MISMATCH = "Passwords do not match."
}


export function validateInfo(name: string, pwd: string, confirm_pwd: string) : ValidateResult
{
    if (!USER_REGEX.test(name)) return ValidateResult.INV_USER;
    if (!PWD_REGEX.test(pwd)) return ValidateResult.INV_PWD;
    if (pwd !== confirm_pwd) return ValidateResult.INV_MISMATCH;

    return ValidateResult.VALID;
}
