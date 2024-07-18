import Image from "next/image"
import React from "react"

const Investors = ({ currencyDetailInfo }: { currencyDetailInfo?: API.CurrencyDetail }) => {
    return (
        <div>
            {
                currencyDetailInfo?.investors.map(({avatar, bio, name, location}, index) => (
                    <div key={index} className="flex items-center h-[66px] px-3 border-0 border-b border-[#292929] border-solid">
                        <Image src={avatar || '/img/UserSquare.png'} width={50} height={50} alt="" />
                        <div className="ml-2 flex flex-col justify-center">
                            <span className="text-sm text-[#CCCCCC] font-medium mr-2">{name}</span>
                            <span className="mt-1 text-[#808080] text-xs">{location}</span>
                        </div>
                    </div>
                ))
            }
        </div>
    )
}

export default Investors