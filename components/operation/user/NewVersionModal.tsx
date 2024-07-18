import { Button, Dialog, Grow, IconButton } from "@mui/material"
import { useContext, useEffect, useState } from "react"
import { UserContext } from "store/UserStore"
import Image from "next/image"
import { useAutoAnimate } from "@formkit/auto-animate/react"
import { usePrevNext } from "hooks/operation/usePrevNext"

const renderList = (list: string[]) => {
    return (
        <ul className="text-sm text-sub-title pl-4 list-none">
            {
                list.map((item, index) => (
                    <li key={index} className="flex mb-2">
                        <span>{index + 1}.</span>
                        <span>{item}</span>
                    </li>
                ))
            }
        </ul>
    )
}

const steps = [
    {
        node: (
            <div>
                <div className="flex justify-center">
                    <Image src='/img/new-version/step1.png' width={500} height={373} alt="" />
                </div>
                {
                    renderList([
                        'We provide the latest and most comprehensive research reports, news, and insights.',
                        'You can quickly filter research reports by popular tags.',
                        'You can also perform more detailed filtering in the filtering area.',
                        'You can save filters at any time for easy one-click filtering.',
                        'We will soon be launching exclusive research reports, so stay tuned!'
                    ])
                }
            </div>
        )
    },
    {
        node: (
            <div>
                <div className="flex justify-center">
                    <Image src='/img/new-version/step2.png' width={500} height={277} alt="" />
                </div>
                {
                    renderList([
                        'We offer a candlestick chart tool to help you quickly view market trends.',
                        'You can choose different time frames to view market trends.',
                        'You can choose various technical indicators for assistance.',
                        'We will continue to improve the drawing tool to support more features.'
                    ])
                }
            </div>
        )
    },
]

const NewVersionModal = () => {
    const { userModal } = useContext(UserContext)
    const onClose = () => {
        userModal?.whatsNew.close()
    }
    const {step, hasPrev, hasNext, prev, next} = usePrevNext(steps.length)
    const [parent] = useAutoAnimate()
    const [buttonParent] = useAutoAnimate()
    return (
        <Dialog TransitionComponent={Grow} open={!!userModal?.whatsNew.show} classes={{ paper: 'relative bg-[#292929] p-4' }}>
            <div className="flex items-center justify-between">
                <span className="text-2xl text-primary font-semibold">Whats New</span>
                <IconButton onClick={onClose}><Image src='/img/svg/X.svg' width={20} height={20} alt="" /></IconButton>
            </div>
            <div ref={parent}>
                <div key={step}>
                    {steps[step].node}
                </div>
            </div>
            <div className="flex items-center justify-between">
                <span className="text-content text-sm"><span className="text-title">{step + 1}</span>/{steps.length}</span>
                <div className="flex items-center justify-between" ref={buttonParent}>
                    {
                        hasPrev && <Button onClick={prev} className="normal-case text-sm text-content">Back</Button>
                    }
                    {
                        hasNext && <Button onClick={next} className="normal-case text-sm text-title ml-2" variant="contained">Next</Button>
                    }
                </div>
            </div>
        </Dialog>
    )
}

export default NewVersionModal