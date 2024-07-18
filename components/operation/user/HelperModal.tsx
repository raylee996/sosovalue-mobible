import { Dialog, Grow, IconButton } from "@mui/material"
import { useContext, useEffect, useState } from "react"
import { UserContext } from "store/UserStore"
import Image from "next/image"

const HelperModal = () => {
    const { userModal } = useContext(UserContext)
    const onClose = () => {
        userModal?.introduce.close()
    }
    return (
        <Dialog TransitionComponent={Grow} open={!!userModal?.introduce.show} classes={{ paper: 'w-[731px] bg-white relative overflow-visible' }}>
            <video preload='auto' controls src='https://sosponge.s3.ap-southeast-1.amazonaws.com/beginnerGuideVideo.mp4' className="w-full aspect-video" />
            <IconButton onClick={onClose} className="absolute -right-12 top-0"><Image src='/img/svg/X.svg' width={32} height={32} alt="" /></IconButton>
        </Dialog>
    )
}

export default HelperModal