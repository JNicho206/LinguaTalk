const submit = document.getElementById("register-submit") as HTMLButtonElement;
const usernameInput: HTMLInputElement | undefined = document.getElementById("username-div")?.getElementsByTagName("input")[0];
const pwdInput: HTMLInputElement | undefined = document.getElementById("password-div")?.getElementsByTagName("input")[0];
const confirm_pwdInput: HTMLInputElement | undefined = document.getElementById("confirm-password-div")?.getElementsByTagName("input")[0];

const PWD_REGEX: RegExp = /^[A-Za-z0-9!@#$%&]{6,20}$/;
const USER_REGEX: RegExp = /^[A-Za-z0-9]{4,10}$/;

enum ValidateResult
{
    VALID = "User info is valid.",
    INV_USER = "Username is invalid.",
    INV_PWD = "Password is invalid.",
    INV_MISMATCH = "Passwords do not match.",
    INV_FORM = "Unable to extract form data"
};


function extractFormData() : any
{
    const username: string | undefined = usernameInput?.value;
    if (!username) throw new Error("Username Undefined.");
    const pwd: string | undefined = pwdInput?.value;
    if (!pwd) throw new Error("Password Undefined.");
    const confirm_pwd: string | undefined = confirm_pwdInput?.value;
    if (!confirm_pwd) throw new Error("Confirm Password Undefined");
    return {"username": username, "password": pwd, "confirm_password": confirm_pwd};
}

function handleSubmitError(e: any)
{
    console.error(e);
}

function registerSubmit() : ValidateResult
{
    // Validate
    let formData;
    try
    {
        console.log("Extracting Form Data");
        formData = extractFormData();
        console.log("Extracted data: ", formData);
    }
    catch (err)
    {
        console.error("Form data error: ", err);
        handleSubmitError(err);
        return ValidateResult.INV_FORM;
    }

    // Send to server
    const response: Promise<Response> = fetch(
        "http://localhost:3000/api/register-user",
        {
            method: "POST",
            headers: 
            {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        }
    );
    response.then(data =>
    {
        console.log(data);
        handleRegisterResponse(data)
    })
    .catch((err) => 
    {
        console.log(err);
    });
    return ValidateResult.VALID;
}

function handleRegisterResponse(response: Response)
{
    if (response.status == 201)
    {
        window.location.href = "http://localhost:3000/";
        return;
    }
    console.error("Registration unsuccessful", response)
}
submit.addEventListener("click", () => registerSubmit());