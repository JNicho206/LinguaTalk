const submit = document.getElementById("register-submit") as HTMLButtonElement;
const username: HTMLInputElement | undefined = document.getElementById("username-div")?.getElementsByTagName("input")[0];
const pwd: HTMLInputElement | undefined = document.getElementById("password-div")?.getElementsByTagName("input")[0];
const confirm_pwd: HTMLInputElement | undefined = document.getElementById("password-div")?.getElementsByTagName("input")[0];

function isValidUsername(username: string)
{

}

function isValidPassword(pwd: string)
{
    
}

function passwordsMatch(pwd: string, confirm_pwd: string)
{

}


function registerSubmit()
{

}
//submit.addEventListener("click", registerSubmit());