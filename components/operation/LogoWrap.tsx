import { PropsWithChildren } from "react"
import Image from "next/image"

const LogoWrap = ({ children }: PropsWithChildren) => {
    return (
        <div>
            <div>
                <Image src='/img/full-logo.png' className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" width={190} height={32} alt="" />
            </div>

        </div>
    )
}

export default LogoWrap