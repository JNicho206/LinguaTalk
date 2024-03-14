"use strict";
var _a, _b, _c;
var submit = document.getElementById("register-submit");
var usernameInput = (_a = document.getElementById("username-div")) === null || _a === void 0 ? void 0 : _a.getElementsByTagName("input")[0];
var pwdInput = (_b = document.getElementById("password-div")) === null || _b === void 0 ? void 0 : _b.getElementsByTagName("input")[0];
var confirm_pwdInput = (_c = document.getElementById("confirm-password-div")) === null || _c === void 0 ? void 0 : _c.getElementsByTagName("input")[0];
var PWD_REGEX = /^[A-Za-z0-9!@#$%&]{6,20}$/;
var USER_REGEX = /^[A-Za-z0-9]{4,10}$/;
var ValidateResult;
(function (ValidateResult) {
    ValidateResult["VALID"] = "User info is valid.";
    ValidateResult["INV_USER"] = "Username is invalid.";
    ValidateResult["INV_PWD"] = "Password is invalid.";
    ValidateResult["INV_MISMATCH"] = "Passwords do not match.";
    ValidateResult["INV_FORM"] = "Unable to extract form data";
})(ValidateResult || (ValidateResult = {}));
;
function extractFormData() {
    var username = usernameInput === null || usernameInput === void 0 ? void 0 : usernameInput.value;
    if (!username)
        throw new Error("Username Undefined.");
    var pwd = pwdInput === null || pwdInput === void 0 ? void 0 : pwdInput.value;
    if (!pwd)
        throw new Error("Password Undefined.");
    var confirm_pwd = confirm_pwdInput === null || confirm_pwdInput === void 0 ? void 0 : confirm_pwdInput.value;
    if (!confirm_pwd)
        throw new Error("Confirm Password Undefined");
    return { "username": username, "password": pwd, "confirm_password": confirm_pwd };
}
function handleSubmitError(e) {
    console.error(e);
}
function registerSubmit() {
    // Validate
    var formData;
    try {
        console.log("Extracting Form Data");
        formData = extractFormData();
        console.log("Extracted data: ", formData);
    }
    catch (err) {
        console.error("Form data error: ", err);
        handleSubmitError(err);
        return ValidateResult.INV_FORM;
    }
    // Send to server
    var response = fetch("http://localhost:3000/api/register-user", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    });
    response.then(function (data) {
        console.log(data);
        handleRegisterResponse(data);
    })
        .catch(function (err) {
        console.log(err);
    });
    return ValidateResult.VALID;
}
function handleRegisterResponse(response) {
    if (response.status == 201) {
        window.location.href = "http://localhost:3000/";
        return;
    }
    console.error("Registration unsuccessful", response);
}
submit.addEventListener("click", function () { return registerSubmit(); });
