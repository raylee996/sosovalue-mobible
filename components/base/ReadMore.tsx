import React from "react";
import Button from '@mui/material/Button'
import Image from "next/image";
import Grow from '@mui/material/Grow'

type Props = React.PropsWithChildren<{
    foldHeight: number;
    readMoreNode?: React.ReactNode;
}>

const ReadMore = ({ children, readMoreNode, foldHeight }: Props) => {
    const [showReadMore, setShowReadMore] = React.useState(false)
    const wrapRef = React.useRef<HTMLDivElement>(null)
    const childrenRef = React.useRef<HTMLDivElement>(null)
    const readMore = () => {
        setShowReadMore(false)
        wrapRef.current!.style.height = childrenRef.current!.offsetHeight + 'px'
    }
    React.useEffect(() => {
        if (childrenRef.current!.offsetHeight > foldHeight) {
            wrapRef.current!.style.height = foldHeight + 'px'
            setShowReadMore(true)
        }else{
            wrapRef.current!.style.height = childrenRef.current!.offsetHeight + 'px'
        }
    }, [])
    return (
        <div className="relative">
            <div ref={wrapRef} className="overflow-hidden transition-[height] ease-in">
                <div ref={childrenRef}>
                    {children}
                </div>
            </div>
            <Grow in={showReadMore}>
                <div className="absolute right-0 -bottom-[7px]" onClick={readMore}>
                    {
                        readMoreNode || (
                            <Button className="capitalize text-sm text-[#323130] shadow-[-30px_0_20px_5px_white] bg-white" endIcon={<Image src='/img/svg/CaretDown.svg' width={14} height={14} alt="" />}>Read More</Button>
                        )
                    }
                </div>
            </Grow>
        </div>
    )
}

export default ReadMore