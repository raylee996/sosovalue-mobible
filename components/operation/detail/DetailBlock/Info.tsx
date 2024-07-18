import Link from "next/link"
import dayjs from "dayjs"

const Info = ({ currencyDetailInfo }: { currencyDetailInfo?: API.CurrencyDetail }) => {
    return (
        <div className="">
            <div className="px-3 pb-2 border-0 border-b border-[#292929] border-solid">
                <div className="text-[#CCCCCC] text-sm font-medium h-[34px] flex items-center">Introduction</div>
                <div className="text-xs text-[#A0A0A0] whitespace-pre-line text-justify" dangerouslySetInnerHTML={{ __html: currencyDetailInfo?.introduction || '' }}>
                </div>
            </div>
            {
                currencyDetailInfo?.whitePaperLink && (
                    <div className="px-3 pb-2 border-0 border-b border-[#292929] border-solid">
                        <div className="text-[#CCCCCC] text-sm font-medium h-[34px] flex items-center">white paper</div>
                        <Link target="_blank" href={currencyDetailInfo?.whitePaperLink || ''} className="text-xs text-[#A0A0A0]">
                            {currencyDetailInfo?.whitePaperLink}
                        </Link>
                    </div>
                )
            }
            {
                currencyDetailInfo?.businessModel && (
                    <div className="px-3 pb-2 border-0 border-b border-[#292929] border-solid">
                        <div className="text-[#CCCCCC] text-sm font-medium h-[34px] flex items-center">Business model</div>
                        <div className="text-xs text-[#A0A0A0]">
                            {currencyDetailInfo?.businessModel}
                        </div>
                    </div>
                )
            }
            {
                currencyDetailInfo?.industryStatus && (
                    <div className="px-3 pb-2 border-0 border-b border-[#292929] border-solid">
                        <div className="text-[#CCCCCC] text-sm font-medium h-[34px] flex items-center">Industry status</div>
                        <div className="text-xs text-[#A0A0A0]">
                            {currencyDetailInfo?.industryStatus}
                        </div>
                    </div>
                )
            }
            {
                currencyDetailInfo?.firstIssueTime && (
                    <div className="px-3 pb-2 border-0 border-b border-[#292929] border-solid">
                        <div className="text-[#CCCCCC] text-sm font-medium h-[34px] flex items-center">First issue time</div>
                        <div className="text-xs text-[#A0A0A0]">
                            {dayjs(+currencyDetailInfo?.firstIssueTime).format('YYYY-MM-DD HH:mm:ss')}
                        </div>
                    </div>
                )
            }
        </div>
    )
}

export default Info