const submit = document.getElementById("register-submit") as HTMLButtonElement;
const usernameInput: HTMLInputElement | undefined = document.getElementById("username-div")?.getElementsByTagName("input")[0];
const pwdInput: HTMLInputElement | undefined = document.getElementById("password-div")?.getElementsByTagName("input")[0];
const confirm_pwdInput: HTMLInputElement | undefined = document.getElementById("password-div")?.getElementsByTagName("input")[0];

function isValidUsername(username: string) : boolean
{
    if (!(username.length > 3 && username.length < 11)) throw new Error("Username length invalid.");
    return true;
}
function isValidPassword(pwd: string) : boolean
{
    if (pwd.length < 4) throw new Error("Password length invalid.");

    return true;
}

function passwordsMatch(pwd: string, confirm_pwd: string) : boolean
{
    return pwd === confirm_pwd;
}

function extractFormData() : object
{
    const username: string | undefined = usernameInput?.value;
    if (!username) throw new Error("Username Undefined.");
    const pwd: string | undefined = pwdInput?.value;
    if (!pwd) throw new Error("Password Undefined.");
    const confirm_pwd: string | undefined = confirm_pwdInput?.value;
    if (!confirm_pwd) throw new Error("Confirm Password Undefined");
    return {"username": username, "password": pwd, "confirm_password": confirm_pwd};
}

function handleSubmitError(e: Error)
{

}

async function registerSubmit()
{
    // Validate
    let formData;
    try
    {
        formData = extractFormData();

    }
    catch (err)
    {
        console.error("Form data error: ", err);
        handleSubmitError(err);
        return;
    }

    // Send to server
    const response: Response = await fetch(
        "localhost:3000/api/register",
        {
            method: "POST",
            headers: 
            {
                'Content-Type': 'application/json'
            },
            body: formData
        }
    )

    if (response.status == 200)
    {
        window.location.href = "localhost:3000/";
    }
}
//submit.addEventListener("click", registerSubmit());