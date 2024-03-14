"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateInfo = exports.ValidateResult = void 0;
const PWD_REGEX = /^[A-Za-z0-9!@#$%&]{6,20}$/;
const USER_REGEX = /^[A-Za-z0-9]{4,10}$/;
var ValidateResult;
(function (ValidateResult) {
    ValidateResult["VALID"] = "User info is valid.";
    ValidateResult["INV_USER"] = "Username is invalid.";
    ValidateResult["INV_PWD"] = "Password is invalid.";
    ValidateResult["INV_MISMATCH"] = "Passwords do not match.";
})(ValidateResult || (exports.ValidateResult = ValidateResult = {}));
function validateInfo(name, pwd, confirm_pwd) {
    if (!USER_REGEX.test(name))
        return ValidateResult.INV_USER;
    if (!PWD_REGEX.test(pwd))
        return ValidateResult.INV_PWD;
    if (pwd !== confirm_pwd)
        return ValidateResult.INV_MISMATCH;
    return ValidateResult.VALID;
}
exports.validateInfo = validateInfo;
