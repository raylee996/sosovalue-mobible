import Regex from "helper/regex"
import { ChangeEvent, ReactNode, useMemo, useState } from "react"
import Image from "next/image"
import { useDebounceFn } from "ahooks";
import { checkUserNameIsRegister, generateUsername } from "http/user";

export enum ValidateStatus {
    Init, Valid, FormatError, RegistedError
}

type Props = {
    value?: string;
    onChange?: (username: string) => void;
    validate?: boolean;
    validateIsRegister?: boolean;
    requestValidate?: () => Promise<boolean>; // todo
}

const useUsername = (props?: Props) => {
    const [value, setValue] = useState('')
    const [usableNames, setUsableNames] = useState<string[]>([])
    const [status, setStatus] = useState<ValidateStatus>(ValidateStatus.Init)
    const [errMsg, setErrMsg] = useState<string>()
    const onChange = (e: ChangeEvent<HTMLInputElement>) => {
        const username = e.target.value.trim().slice(0, 18)
        onValueChange(username)
    }
    const onValueChange = (username: string) => {
        setValue(username)
        if (props?.validate) {
            validate(username)
        }
    }
    const validateFormat = (username: string) => {
        if (username.length < 3) {
            return 'Username too short'
        } else if (username.length > 18) {
            return 'Username too short'
        } else if (!Regex.username.test(username)) {
            return 'Invalid characters in username'
        } else if (['sosovalue', 'soso', 'support', 'admin'].some(word => username.includes(word))) {
            return 'Contains reserved words'
        }
    }
    const { run: validate } = useDebounceFn(async (username: string) => {
        if (username.length == 0) {
            setStatus(ValidateStatus.Init)
            setUsableNames([])
        } else {
            const errMsg = validateFormat(username)
            if (errMsg) {
                setErrMsg(errMsg)
                setStatus(ValidateStatus.FormatError)
            } else {
                if (props?.validateIsRegister) {
                    const res = await checkUserNameIsRegister(username)
                    if (res.success) {
                        setUsableNames([])
                        setStatus(ValidateStatus.Valid)
                    } else {
                        setErrMsg('Username already taken')
                        setStatus(ValidateStatus.RegistedError)
                        const res = await generateUsername(username)
                        setUsableNames(res.data)
                    }
                } else {
                    setUsableNames([])
                    setStatus(ValidateStatus.Valid)
                }
            }
        }
    }, { wait: 300 })
    const isInit = status === ValidateStatus.Init
    const isRegisted = status === ValidateStatus.RegistedError
    const isFormatError = status === ValidateStatus.FormatError
    const isValid = status === ValidateStatus.Valid
    const isError = isRegisted || isFormatError
    return {
        value, setValue, onChange, onValueChange, status, usableNames, errMsg,
        statusInfo: {
            isInit, isRegisted, isFormatError, isValid, isError
        }
    }
}

export default useUsername