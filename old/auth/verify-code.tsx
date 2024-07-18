import { Button, IconButton } from "@mui/material"
import { ChangeEvent, useContext, useEffect, useRef, useState } from "react"
import { UserContext } from "store/UserStore"
import { bindEmailV2 } from "http/user"
import Image from "next/image"
import useNotistack from "hooks/useNotistack"
import { setToken } from "helper/storage"

const VerifyCode = ({ setTempToken }: { setTempToken: (tempToken: string) => void }) => {
    const { error } = useNotistack()
    const { verifyCode, getUserAndCheckModal, getUserInfo, authModal } = useContext(UserContext)
    const inputRef = useRef<HTMLInputElement | null>(null)
    const [code, setCode] = useState('')
    const [isError, setIsError] = useState(false)
    const onChange = async (e: ChangeEvent<HTMLInputElement>) => {
        const code = e.target.value.trim().slice(0, 6)
        setCode(code)
        if (code.length < 6 && isError) {
            setIsError(false)
        }
        if (code.length === 6) {
            const res = await verifyCode!.verify(code)
            if (!res) return;
            if (verifyCode?.isVerifySignUpByEmail) {
                if (res.success) {
                    setToken((res.data as API.LoginResult).token)
                    getUserAndCheckModal()
                    authModal?.closeModal()
                } else if (res.code === 40016) {
                    setIsError(true)
                    error(res.msg)
                }
            } else {
                if (res.success) {
                    if (verifyCode?.isVerifyResetPwd) {
                        setTempToken(res.data as string)
                        authModal?.openResetPwd()
                    } else if (verifyCode?.isVerifyBindEmail) {
                        const { password, rePassword } = verifyCode.verifyInfo?.params as {password: string; rePassword: string}
                        bindEmailV2({ token: res.data as string, password, rePassword  }).then(res => {
                            getUserInfo()
                            authModal?.closeModal()
                        })
                    }
                } else if (res.code === 40016) {
                    setIsError(true)
                    error(res.msg)
                }
            }
        }
    }
    const cancel = () => {
        if (verifyCode?.isVerifySignUpByEmail) {
            authModal?.openSignupModal()
        } else if (verifyCode?.isVerifyResetPwd) {
            authModal?.openResetSendEmail()
        } else if (verifyCode?.isVerifyBindEmail) {
            authModal?.closeModal()
        }
    }
    useEffect(() => {
        inputRef.current?.focus()
        const clear = verifyCode?.startInterval()
        return clear
    }, [])
    return (
        <div>
            <div className="text-xl text-title font-bold flex items-center justify-between">
                <span>We’ve sent you a code</span>
                <IconButton className="text-title" onClick={cancel}><Image src='/img/svg/X.svg' width={20} height={20} alt="" /></IconButton>
            </div>
            <div className="text-sm text-content my-4 whitespace-nowrap">
                the code was sent to: <span className="font-bold text-title">{verifyCode?.verifyInfo?.params.email}</span>
            </div>
            <div>
                <input type="number" className="opacity-0 w-full h-full fixed left-10000 top-10000" value={code} onChange={onChange} ref={inputRef} autoFocus onBlur={() => inputRef.current?.focus()} />
                <div className="flex gap-2 h-[72px]">
                    {
                        Array.from({ length: 6 }).map((_, i) => (
                            <span key={i} className={`flex-1 flex items-center justify-center h-full text-sub-title text-[40px] font-medium rounded-lg
                            ${isError ? 'border-[2px] border-[#F00]' : code.length === i ? 'border-[2px] border-[#F4F4F4]' : 'border border-[#404040]'} border-solid bg-[#1A1A1A]`}>
                                {code[i]}
                            </span>
                        ))
                    }
                </div>
            </div>
            {
                verifyCode?.showInterval ? (
                    <div className={`mt-8 mb-[26px] text-content text-sm`}>Request new code in 00:{verifyCode.numNode}</div>
                ) : (
                    <Button onClick={() => verifyCode?.resend()} className="my-[26px] -ml-2 normal-case text-[#226DFF] text-sm whitespace-nowrap shrink-0">Resend</Button>
                )
            }
            <div className="pt-8 text-xs text-content border-0 border-t border-solid border-[#242424]">
                Can't see the email please check the spam folder.
                Wrong email? <Button onClick={cancel} className="text-[#226DFF] p-0 normal-case text-xs">Please re-enter your e-mail address.</Button>
            </div>
        </div>
    )
}

export default VerifyCode