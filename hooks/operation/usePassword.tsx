import Regex from "helper/regex"
import { ChangeEvent, ReactNode, useMemo, useState } from "react"
import Image from "next/image"
import { useDebounceFn } from "ahooks";
import EyeOn from "components/svg/EyeOn";
import EyeOff from "components/svg/EyeOff";
import { useTCommon } from "hooks/useTranslation";

export enum ValidateStatus {
    Init, Valid, Incorrect, FormatError
}

type ValidateResult = {
    result: boolean;
    msg: string;
}

type Props = {
    value?: string;
    onChange?: (password: string) => void;
    validate?: boolean;
    className?: string;
    label?: ReactNode;
    syncValidate?: (password: string) => ValidateResult;
    asyncValidate?: (password: string) => Promise<ValidateResult>;
}

const usePassword = (props?: Props) => {
    const { className, label, asyncValidate, syncValidate } = props || {}
    const [value, setValue] = useState('')
    const [status, setStatus] = useState<ValidateStatus>(ValidateStatus.Init)
    const [errMsg, setErrMsg] = useState<string>()
    const [visible, setVisible] = useState(false)
    const { t } = useTCommon();
    const toggle = () => setVisible(!visible)
    const clear = () => setValue('')
    const reset = () => {
        clear()
        setStatus(ValidateStatus.Init)
    }
    const { tipIcon, inputType } = useMemo(() => {
        const [eyeIcon, inputType] = visible ? [<EyeOn key="eyeOn"></EyeOn>, 'text'] : [<EyeOff key="eyeOff"></EyeOff>, 'password']
        return {
            tipIcon: eyeIcon,
            inputType
        }
    }, [visible])
    const onChange = (e: ChangeEvent<HTMLInputElement>) => {
        const password = e.target.value.trim().slice(0, 20)
        setValue(password)
        validate(password)
    }
    const validateFormat = (username: string) => {
        if (username.length < 8) {
            return t("Password too short")
        } else if (username.length > 20) {
            return t("Password too long")
        } else if (!Regex.password.test(username)) {
            return t("Password is too simple")
        }
    }
    const { run: validate } = useDebounceFn((password: string) => {
        if (props?.validate) {
            if (password.length == 0) {
                return setStatus(ValidateStatus.Init)
            } else {
                const errMsg = validateFormat(password)
                if (errMsg) {
                    setErrMsg(errMsg)
                    setStatus(ValidateStatus.FormatError)
                    return
                } else {
                    if (!asyncValidate && !syncValidate) {
                        setStatus(ValidateStatus.Valid)
                    }
                }
            }
        }
        if (syncValidate) {
            const res = syncValidate(password)
            setResult(res)
        }
        if (asyncValidate) {
            asyncValidate(password).then(res => {
                setResult(res)
            })
        }
    }, { wait: 300 })
    const setResult = (res: ValidateResult) => {
        if (res.result) {
            setStatus(ValidateStatus.Valid)
            setErrMsg('')
        } else {
            setStatus(ValidateStatus.Incorrect)
            setErrMsg(res.msg)
        }
    }
    const isInit = status === ValidateStatus.Init
    const isIncorrect = status === ValidateStatus.Incorrect
    const isFormatError = status === ValidateStatus.FormatError
    const isValid = status === ValidateStatus.Valid
    const isError = isIncorrect || isFormatError
    return {
        value, onChange, errMsg, status, tipIcon, inputType, visible, toggle, className, label, clear, reset,
        statusInfo: { isInit, isIncorrect, isFormatError, isValid, isError }
    }
}

export default usePassword