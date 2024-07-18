import { Button, IconButton, OutlinedInput } from "@mui/material"
import Regex from "helper/regex"
import usePassword from "hooks/operation/usePassword"
import { usePwdVisible } from "hooks/tool"
import { resetPasswordV2, userRegister } from "http/user"
import Image from "next/image"
import { ChangeEvent, useContext, useState } from "react"
import { UserContext } from "store/UserStore"
import Password from "components/operation/auth/Password"
import useNotistack from "hooks/useNotistack"
import useUsername from "hooks/operation/useUsername"
import Username from "components/operation/auth/Username"
import { useRouter } from "next/router"
import { setToken } from "helper/storage"

const LinkSignUp = () => {
    const { getUserInfo, authModal } = useContext(UserContext)
    const router = useRouter()
    const username = useUsername({ validate: true, validateIsRegister: true })
    const password = usePassword({ validate: true })
    const rePassword = usePassword({
        validate: false, syncValidate(value: string) {
            return { result: value === password.value, msg: 'The passwords do not match.' }
        }
    })
    const signUp = async () => {
        const { token, email } = router.query
        const res = await userRegister({ token, password: btoa(password.value), rePassword: btoa(rePassword.value), username: username.value })
        setToken(res.data.token)
        await getUserInfo()
        router.replace('/')
        authModal?.closeModal()
    }
    return (
        <div>
            <div className="mb-8">
                <Button className={`normal-case text-2xl font-bold text-primary -ml-2`}>Sign Up</Button>
            </div>
            <Username className="mb-5" {...username} renderTip={(statusInfo, node) => {
                return (
                    <div>
                        <div className="text-xs text-sub-title mt-1">After username registration, it can be modified once.</div>
                        {node}
                    </div>
                )
            }} />
            <Password {...password} className='mb-5' label={<div className='text-xs text-[#C2C2C2] font-bold mb-2 mt-4'>Password</div>} />
            <Password {...rePassword} className='mb-5' label={<div className='text-xs text-[#C2C2C2] font-bold mb-2 mt-4'>Password (again)</div>} />
            <Button onClick={signUp} disabled={!rePassword.statusInfo.isValid || !username.statusInfo.isValid} fullWidth variant="contained" className="bg-[linear-gradient(95deg,#FF3800_0%,#FF7B3D_100%)] normal-case text-title text-sm font-semibold h-[34px]">Sign up</Button>
        </div>
    )
}

export default LinkSignUp