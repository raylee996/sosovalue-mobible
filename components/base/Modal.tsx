import React, { FC, useContext, ReactNode } from 'react'
import Image from 'next/image';
import { Button, LinearProgress, Stack, Dialog, DialogProps, DialogContent, DialogTitle, Grow, Tabs, Tab } from '@mui/material';

type Props = React.PropsWithChildren<{
    title?: string | React.ReactNode,
    titleMessage?: string | React.ReactNode,
    footerMessage?: string | React.ReactNode,
    hideDefaultFooter?: boolean
}> & Pick<DialogProps, 'open' | 'onClose'>

const Modal = ({ open, onClose, title, titleMessage, footerMessage, hideDefaultFooter, children }: Props) => {
    const titleNode = title && (typeof title === 'string' ? <div className='mb-3 font-semibold text-[28px] text-[#313131]'>{title}</div> : title)
    const titleMessageNode = titleMessage && (typeof titleMessage === 'string' ? <div className='mb-5 text-base text-[#808080]'>{titleMessage}</div> : titleMessage)
    const footerMessageNode = footerMessage ? (typeof footerMessage === 'string' ? <div className='text-sm text-[#ABABAB]'>{footerMessage}</div> : footerMessage)
        : (!hideDefaultFooter && <div className='text-sm text-[#ABABAB] mt-8'>By continuing, you agree to SoSponge's Terms of Use. Read our Privacy Policy.</div>)
    return (
        <Dialog classes={{
            paper: 'w-[471px]'
        }} open={open} onClose={onClose} TransitionComponent={Grow}>
            <DialogContent classes={{ root: 'p-9' }}>
                <div className='flex items-center mb-4'>
                    <Image src="/img/logo.svg" alt="" width={30} height={30} className='mr-2' />
                    <Image src="/img/logo_text.svg" alt="" width={94} height={33} className='relative top-0.5' />
                </div>
                {titleNode}
                {titleMessageNode}
                <div className='pt-3'>
                    {children}
                </div>
                {footerMessageNode}
            </DialogContent>
        </Dialog>
    )
}

export default Modal