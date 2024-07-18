import { Grow, Dialog, Divider, Button, OutlinedInput } from "@mui/material"
import { useDebounceFn } from "ahooks"
import Regex from "helper/regex"
import { checkEmailIsRegister, checkUserNameIsRegister } from "http/user"
import Image from "next/image"
import { ChangeEvent, useContext, useState } from "react"
import { UserContext } from "store/UserStore"

const EnhanceSecurity = () => {
    const { authModal } = useContext(UserContext)
    const [email, setEmail] = useState('')
    const [emailStatus, setEmailStatus] = useState(0)  // 0 init 1 校验通过  2 格式不正确  3 已注册
    const { run: checkEmailIsRegisted } = useDebounceFn(() => {
        checkEmailIsRegister(email).then(res => {
            setEmailStatus(res.data ? 1 : 3)
        })
    })
    const emailOnChange = (e: ChangeEvent<HTMLInputElement>) => {
        const email = e.target.value.trim()
        setEmail(email)
        if (email.length == 0) {
            setEmailStatus(0)
        } else if (Regex.email.test(email)) {
            checkEmailIsRegisted()
        } else {
            setEmailStatus(2)
        }
    }
    const closeModal = () => {
        authModal?.closeModal()
    }
    const toVerify = () => {
        // toVerifyCode({ verifyType: VerifyType.BindEmail, params: { email } })
    }
    const isEmailError = emailStatus === 2 || emailStatus === 3
    const renderEmailAdornment = () => {
        return emailStatus !== 0 ? <Image className="mx-4" src={isEmailError ? '/img/svg/Error.svg' : 'img/svg/Success.svg'} width={16} height={16} alt="" /> : null
    }
    return (
        <Dialog
            open={true}
            TransitionComponent={Grow}
            classes={{ paper: 'w-[393px] bg-[#1A1A1A] rounded-lg p-8' }}
        >
            <Image src='/img/svg/ShieldCheck.svg' width={64} height={64} alt='' />
            <div className="text-base text-title font-bold my-4">Enhance Security</div>
            <div className="text-content text-xs">Linking an email enhances your account's security and aids in account recovery.</div>
            <div className="mb-4 mt-8">
                <div className="text-xs text-sub-title mb-1">Email</div>
                <OutlinedInput value={email} onChange={emailOnChange} autoComplete="off" fullWidth placeholder="Enter email" className="h-[34px] pr-0" classes={{ input: 'h-full py-0 text-sm text-title px-4', notchedOutline: 'border-[#404040] border' }}
                    endAdornment={renderEmailAdornment()} />
            </div>
            <Button disabled={emailStatus !== 1} onClick={toVerify} fullWidth variant="contained" className="bg-[linear-gradient(95deg,#FF3800_0%,#FF7B3D_100%)] normal-case text-title text-sm font-semibold h-[34px]">Submit</Button>
            <div className="mt-8 text-right">
                <Button onClick={closeModal} className="normal-case text-[#226DFF] text-sm">Skip &gt;&gt;</Button>
            </div>
        </Dialog>
    )
}

export default EnhanceSecurity