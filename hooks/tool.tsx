import { useMemo, useState } from "react"

export const usePwdVisible = () => {
    const [pwdVisible, setPwdVisible] = useState(false)

    const togglePwdVisible = () => setPwdVisible(!pwdVisible)

    const [svgUrl, inputType] = useMemo(() => pwdVisible ? ['/img/svg/eye-on.svg', 'text'] : ['/img/svg/eye-off.svg', 'password'], [pwdVisible])

    return {
        togglePwdVisible, svgUrl, inputType
    }
}