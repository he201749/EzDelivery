export function verifyMail(mail){
    if (/[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/.test(mail)) {
        return true;
    }
    return false;
}

export function verifyPassword(password){
    if (/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/.test(password)){
        return true;
    }

    return false;
}