import Image from 'next/image';
import Link from 'next/link';

type Props = API.Project & {
    specValue: string;
    renderBadge?: () => React.ReactNode
}

const BTCBlock = ({ id, coverPicture, projectName, projectIntroduction, projectCode, specValue, renderBadge }: Props) => {
    const countMap: {
        exclusiveCount: number;
        choicenessCount: number;
        ataAnalysisCount: number;
    } = JSON.parse(specValue)
    return (
            <div className="transition ease-linear bg-white hover:shadow-[0_15px_30px_rgb(0,0,0,10%)] hover:scale-105 relative">
                <div className='p-4 flex justify-between items-start'>
                    <div className='flex h-[52px]'>
                        <div className='w-[60px] relative shrink-0'><Image src={coverPicture} width={60} height={60} alt='' /></div>
                        <div className='self-stretch flex flex-col justify-between ml-4'>
                            <div className='flex items-center justify-start'>
                                <span className={`${projectName.length > 12 ? 'max-w-[120px] text-base' : 'text-2xl'} break-all text-[#313131] font-bold leading-none align-middle`}>{projectName}</span>
                                <span className='rounded-sm bg-[#D8D8D8] text-[#808080] h-[19px] text-xs p-0.5 ml-3'>{projectCode}</span>
                            </div>
                            <div>
                                <span className='text-xl text-[#808080]'>$</span><span className='ml-1 mr-4 text-xl text-[#313131] font-medium'>{ }</span><span className='text-xs text-[#FF3236]'>{ }%</span>
                            </div>
                        </div>
                    </div>
                    {/* <IconButton className='relative -top-2'>
                        <AddFolderIcon />
                    </IconButton> */}
                </div>
                <div className='border-y border-x-0 border-solid border-[#D8D8D8] px-4 py-3'>
                    <div className='flex justify-between'>
                        <span><span className='text-[#313131] text-base font-medium'>{countMap.ataAnalysisCount}篇</span><span className='text-xs text-[#808080]'>独家研究</span></span>
                        <span><span className='text-[#313131] text-base font-medium'>{countMap.choicenessCount}篇</span><span className='text-xs text-[#808080]'>独家研究</span></span>
                        <span><span className='text-[#313131] text-base font-medium'>{countMap.exclusiveCount}篇</span><span className='text-xs text-[#808080]'>数据分析</span></span>
                    </div>
                    <div className='text-[10px] text-[#808080] mt-2 line-clamp-4 h-[70px]'>{projectIntroduction}</div>
                </div>
                <div className='px-4 h-[43px] flex items-center justify-between border-solid border-0 border-b-2 border-primary'>
                    <span className='text-xs text-[#313131]'>{ }</span>
                    <span className='rounded-2xl bg-[#D8D8D8] text-[#808080] h-[19px] text-xs py-0.5 px-2'>{ }</span>
                </div>
                {
                    renderBadge && (
                        <div className='absolute top-0 right-0'>{renderBadge()}</div>
                    )
                }
            </div>
       
    )
}

export default BTCBlock