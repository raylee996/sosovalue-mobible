import Regex from 'helper/regex'

export const validateEmail = (emailKey: string, values: Record<string, any>, errors: Record<string, any>) => {
    const password = values[emailKey]
    if (!password) {
        errors[emailKey] = 'required'
    } else if (!Regex.email.test(password)) {
        errors[emailKey] = 'Please enter the correct email format'
    }
    return !errors[emailKey]
}

export const validatePwd = (pwdKey: string, values: Record<string, any>, errors: Record<string, any>) => {
    const password = values[pwdKey]
    if (!password) {
        errors[pwdKey] = 'required'
    } else if (!Regex.password.test(password)) {
        errors[pwdKey] = 'The password needs to meet 8-20 characters, and must contain English letters + numbers'
    }
    return !errors[pwdKey]
}