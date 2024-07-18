import { Button, IconButton, OutlinedInput } from "@mui/material"
import useUsername, { ValidateStatus } from "hooks/operation/useUsername"
import { ChangeEvent, useContext, useState } from "react"
import { UserContext } from "store/UserStore"
import Username from "components/operation/auth/Username"
import { useDisconnect } from "wagmi"

const EnterUsername = () => {
    const { authModal, thirdRegister } = useContext(UserContext)
    const { disconnect } = useDisconnect()
    const username = useUsername({ validate: true, validateIsRegister: true })
    const register = () => {
        thirdRegister(username.value)
    }
    const goBack = () => {
        disconnect()
        authModal?.openSignupModal()
    }
    return (
        <div>
            <Username {...username} />
            <Button onClick={register} disabled={!username.statusInfo.isValid} fullWidth variant="contained" className="mt-8 bg-[linear-gradient(95deg,#FF3800_0%,#FF7B3D_100%)] normal-case text-title text-sm font-semibold h-[34px]">Sign Up</Button>
            <Button onClick={goBack} fullWidth variant="outlined" className="normal-case text-content text-sm font-semibold h-[34px] mt-5 border-[#404040]">Return to homepage</Button>
        </div>
    )
}

export default EnterUsername