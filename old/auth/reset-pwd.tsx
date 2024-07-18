import { Button, IconButton, OutlinedInput } from "@mui/material"
import Regex from "helper/regex"
import usePassword from "hooks/operation/usePassword"
import { usePwdVisible } from "hooks/tool"
import { resetPasswordV2 } from "http/user"
import Image from "next/image"
import { ChangeEvent, useContext, useState } from "react"
import { UserContext } from "store/UserStore"
import Password from "components/operation/auth/Password"
import useNotistack from "hooks/useNotistack"

const ResetPwd = ({ token }: { token: string }) => {
    const { success } = useNotistack()
    const { authModal } = useContext(UserContext)
    const password = usePassword({ validate: true })
    const rePassword = usePassword({
        validate: false, syncValidate(value: string) {
            return { result: value === password.value, msg: 'The passwords do not match.' }
        }
    })
    const resetPwd = () => {
        resetPasswordV2({ password: btoa(password.value), rePassword: btoa(rePassword.value), token }).then(res => {
            authModal?.openLoginModal()
            success('success')
        })
    }
    return (
        <div>
            <div className="mb-8">
                <Button className={`normal-case text-2xl font-bold text-primary -ml-2`}>Reset password</Button>
            </div>
            <Password {...password} className='mb-5' label={<div className='text-xs text-[#C2C2C2] font-bold mb-2 mt-4'>New password</div>} />
            <Password {...rePassword} className='mb-5' label={<div className='text-xs text-[#C2C2C2] font-bold mb-2 mt-4'>New password (again)</div>} />
            <Button onClick={resetPwd} disabled={!rePassword.statusInfo.isValid} fullWidth variant="contained" className="bg-[linear-gradient(95deg,#FF3800_0%,#FF7B3D_100%)] normal-case text-title text-sm font-semibold h-[34px]">Reset</Button>
        </div>
    )
}

export default ResetPwd