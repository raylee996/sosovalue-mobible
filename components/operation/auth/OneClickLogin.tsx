import { Grow, Dialog, Divider, Button, OutlinedInput, ListItemButton } from "@mui/material"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import Image from "next/image"
import { useContext } from "react"
import { UserContext } from "store/UserStore"

const OneClickLogin = ({onClose}: {onClose?: () => void;}) => {
    const { authModal, googleLogin, twitterLoginRedirect } = useContext(UserContext)
    const onClickClose = () => {
        if (onClose) {
            onClose()
        } else {
            authModal?.closeModal()
        }
    }
    return (
        <div>
            <Image src='/img/svg/HandTap.svg' width={64} height={64} alt='' />
            <div className="text-base text-title font-bold my-4">One-click login</div>
            <div className="text-content text-xs">Connect a third-party account for one-click, secure login.</div>
            <div className="flex gap-4 h-[74px] my-8">
                <ConnectButton.Custom>
                    {({
                        account,
                        chain,
                        openAccountModal,
                        openChainModal,
                        openConnectModal,
                        authenticationStatus,
                        mounted,
                    }) => {
                        return (
                            <ListItemButton onClick={openConnectModal} className="text-sub-title text-base flex-col h-full rounded border border-solid border-[#404040] hover:bg-primary hover:border-primary hover:text-title">
                                <Image className="mb-2" src='/img/svg/Wallet.svg' width={24} height={24} alt="" />
                                <span>Wallet</span>
                            </ListItemButton>
                        )
                    }}
                </ConnectButton.Custom>

                <ListItemButton onClick={googleLogin} className="text-sub-title text-base flex-col h-full rounded border border-solid border-[#404040] hover:bg-primary hover:border-primary hover:text-title">
                    <Image className="mb-2" src='/img/svg/google-bold.svg' width={24} height={24} alt="" />
                    <span>Google</span>
                </ListItemButton>
                <ListItemButton onClick={twitterLoginRedirect} className="text-sub-title text-base flex-col h-full rounded border border-solid border-[#404040] hover:bg-primary hover:border-primary hover:text-title">
                    <Image className="mb-2" src='/img/svg/twitter-new.svg' width={24} height={24} alt="" />
                    <span>Twitter</span>
                </ListItemButton>
            </div>
            <div className="text-right">
                <Button onClick={onClickClose} className="normal-case text-[#226DFF] text-sm">Skip &gt;&gt;</Button>
            </div>
        </div>
    )
}

export default OneClickLogin