import React from 'react'
import Image from 'next/image';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import Link from 'next/link';
import { formatTimestamp } from 'helper/tools'
import Chip from '@mui/material/Chip';

type Props = API.Post & {
    renderBadge?: () => React.ReactNode
}

const BTCBlock = (props: Props) => {
    const { coverPicture, title, id, label, brief, contentEn, prefixContentEn, updateTime, createTime, compositeScore, renderBadge } = props
    return (
        <Link href={`/library/${id}`} className='no-underline max-w-[400px]'>
            <div className={`relative transition ease-linear bg-white hover:shadow-[0_15px_30px_rgb(0,0,0,10%)] hover:scale-105 shadow-[0_2px_3px_0_rgba(0,0,0,0.08)]`}>
                <div className='h-40 relative'>
                    <Image src={coverPicture} fill alt='' sizes='max-width: 400px'/>
                    <div className='absolute bottom-2 left-2'>
                        {
                            (label || '').split(/,|，|\||;|；/).map((str, index) => str && <Chip key={index} className='text-xs h-5 text-[#808080] bg-[#D8D8D8] rounded-sm mr-3' classes={{ label: 'px-1' }} label={str} />)
                        }
                    </div>
                </div>
                <div className='border-0 border-b border-solid border-[#D8D8D8] p-4'>
                    <div className='text-base font-medium h-[50px] text-[#313131] line-clamp-2'>
                        {title}
                    </div>
                    <div className='text-sm text-[#808080] mt-2 h-[60px] line-clamp-3'
                        dangerouslySetInnerHTML={{
                            __html: (brief || prefixContentEn || '').replace(/<[^>]+>/g, "")
                        }}>
                    </div>
                </div>
                <div className='px-4 h-[43px] flex items-center justify-between'>
                    <span className='text-xs text-[#808080]'>
                        {
                            formatTimestamp(+createTime, 'YYYY/MM/DD')
                        }
                    </span>
                    <span className='flex items-center'><StarRoundedIcon className='text-primary' /><span className='text-xs text-[#808080] ml-1'>{compositeScore?.toFixed(1)}</span></span>
                </div>
                {
                    renderBadge && (
                        <div className='absolute top-0 right-0'>{renderBadge()}</div>
                    )
                }
            </div>
        </Link>
    )
}

export default BTCBlock