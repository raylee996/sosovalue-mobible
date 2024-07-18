import React from 'react'
import Button from '@mui/material/Button'
import Image from 'next/image'
import Link from 'next/link'
import dayjs from 'dayjs'
import { extractDomain, transferAddress, urlFilter } from 'helper/tools'
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem'
import Watermark from 'components/operation/Watermark';
const InfoMenu = ({ options, isLink = true }: { options: { label: string; value: string; }[], isLink?: boolean }) => {
    if (options.length > 1) {
        const [first, ...rest] = options
        return (
            <>
                <Tooltip classes={{ tooltip: 'border border-[#404040] border-solid bg-[#141414] max-h-[240px] shadow-area overflow-y-auto px-2 py-0 pt-2' }} title={rest.map(({ label, value }, index) => (
                    <MenuItem key={index} className='p-0 mb-2'>
                        <Link href={value} target='_blank' className={`${!isLink && 'pointer-events-none'} flex-1 text-[13px] text-[#BBBBBB] no-underline flex items-center max-w-[200px]`}>
                            <span className='truncate'>{label}</span>
                            {isLink && <Image className='ml-1' src='/img/svg/ArrowSquareOut.svg' width={16} height={16} alt='' />}
                        </Link>
                    </MenuItem>
                ))} placement="bottom-end">
                    <div>
                        <Link href={first.value} className={`${!isLink && 'pointer-events-none'} mb-1`} target='_blank'>
                            <Button
                                variant='contained' className='text-[13px] text-[#BBBBBB] bg-[#6A6A6A]/[0.16] normal-case py-0.5 px-2 max-w-[200px]'
                                endIcon={isLink && <Image className='ml-1' src='/img/svg/ArrowSquareOut.svg' width={16} height={16} alt='' />}
                            >
                                <span className='truncate'>{first.label}</span>
                            </Button>
                        </Link>
                        <Button variant='contained'
                            className='bg-[#6A6A6A]/[0.16] py-0.5 h-[26px] px-2 min-w-0 ml-2'
                        >
                            <Image src='/img/svg/Down.svg' width={16} height={16} alt='' />
                        </Button>
                    </div>
                </Tooltip>
            </>
        )
    } else if (options.length === 1) {
        const { label, value } = options[0]
        return (
            <Link href={value} className={`${!isLink && 'pointer-events-none'} mb-1`} target='_blank'>
                <Button variant='contained' className='text-[13px] text-[#BBBBBB] bg-[#6A6A6A]/[0.16] normal-case py-0.5 px-2'
                    endIcon={isLink && <Image src='/img/svg/ArrowSquareOut.svg' width={16} height={16} alt=''  className=''/>}>
                    {label}
                </Button>
            </Link>
        )
    } else {
        return null
    }
}

type Info = {
    community?: string;
    chain?: string;
    explorers?: string;
    first_issue_time?: string;
    genesis_block_time?: string;
    source_code?: string;
    update_time: string;
    website?: string;
    white_paper_link?: string;
    contracts: string;
    wallets: string;
    category?: { name: string; fullName: string; }[];
}

const renderItem = (title: string, node?: React.ReactNode) => {
    return (
        <div className="flex mb-3">
            <div className="basis-1/3 text-xs text-[#8D8D8D] pt-1 shrink-0">{title}</div>
            <div className="basis-2/3 text-[13px] text-[#BBBBBB] truncate">{node}</div>
        </div>
    )
}

const Info = ({ originalCurrencyDetail }: { originalCurrencyDetail?: API.OriginalCurrencyDetail }) => {
    const info = React.useMemo(() => {
        const infoObj = (originalCurrencyDetail?.info ? JSON.parse(originalCurrencyDetail.info) : {}) as Info
        const explorers = (infoObj.explorers ? JSON.parse(infoObj.explorers) : []) as string[]
        const website = (infoObj.website ? infoObj.website.split(',') : []) as string[]
        const source_code = (infoObj.source_code ? infoObj.source_code.split(',') : []) as string[]
        const communityMap = (infoObj.community ? JSON.parse(infoObj.community) : {}) as Record<string, string>
        const community = Object.keys(communityMap).map(name => ({ name, link: communityMap[name] }))
        const wallets = (infoObj.wallets ? JSON.parse(infoObj.wallets) : []) as { walletName: string; walletUrl: string }[]
        const contracts = (infoObj.contracts ? JSON.parse(infoObj.contracts) : []) as { contractPlatform: string; contractAddress: string; contractExplorerUrl: string }[]
        return {
            ...infoObj, explorers, community, contracts, wallets, website, source_code
        }
    }, [originalCurrencyDetail])
    return (
        <div className="p-3 relative">
            <Watermark />
            <div className="text-[#E5E5E5] text-sm font-medium mb-4">Info</div>
            {renderItem('White paper', info.white_paper_link && <Link href={urlFilter(info.white_paper_link)} target='_blank'><Button variant='contained' className='text-[13px] text-[#BBBBBB] bg-[#6A6A6A]/[0.16] normal-case py-0.5 px-2' endIcon={<Image src='/img/svg/ArrowSquareOut.svg' width={16} height={16} alt='' />}>{extractDomain(info.white_paper_link)}</Button></Link>)}
            {renderItem('Chain', (
                <div className='flex flex-wrap relative z-10'>
                    <InfoMenu options={info.chain?.split(',').filter(i => !!i).map((name, index) => ({ label: name, value: '' })) || []} isLink={false}/>
                </div>
            ))}
            {/* {renderItem('Chain', info.chain?.split(',').filter(i => !!i).join(','))} */}
            {info.website && renderItem('Website', (
                <div className='flex flex-wrap relative z-10'>
                    {info.website.map((link, index) => <Link key={index} href={urlFilter(link)} target='_blank'><Button variant='contained' className='text-[13px] text-[#BBBBBB] bg-[#6A6A6A]/[0.16] normal-case py-0.5 px-2 truncate' endIcon={<Image src='/img/svg/ArrowSquareOut.svg' width={16} height={16} alt='' />}>{extractDomain(link)}</Button></Link>)}
                </div>
            ))}
            {renderItem('Contracts', (
                <div className='flex flex-wrap relative z-10'>
                    <InfoMenu options={info.contracts.map(({ contractAddress, contractExplorerUrl, contractPlatform }, index) => ({ label: `${contractPlatform}:${transferAddress(contractAddress)}`, value: urlFilter(contractExplorerUrl) }))} />
                </div>
            ))}
            {renderItem('Explorers', (
                <div className='flex flex-wrap relative z-10'>
                    <InfoMenu options={info.explorers.map((link, index) => ({ label: extractDomain(link), value: urlFilter(link) }))} />
                </div>
            ))}
            {renderItem('Wallets', (
                <div className='flex flex-wrap relative z-10'>
                    <InfoMenu options={info.wallets.map(({ walletName, walletUrl }, index) => ({ label: extractDomain(walletName), value: urlFilter(walletUrl) }))} />
                </div>
            ))}
            {renderItem('Community', (
                <div className='flex flex-wrap relative z-10'>
                    <InfoMenu options={info.community.map(({ name, link }, index) => ({ label: name, value: urlFilter(link) }))} />
                </div>
            ))}
            {info.source_code && renderItem('Source code', (
                <div className='flex flex-wrap relative z-10'>
                    <InfoMenu options={info.source_code.map((link, index) => ({ label: extractDomain(link), value: urlFilter(link) }))} />
                </div>
            ))}
            {renderItem('Category', info.category?.map(({ name }) => name).join(','))}
            {info.first_issue_time && renderItem('First issue time', <span className='text-[13px] text-[#BBBBBB]'>{dayjs(+info.first_issue_time).format('MMM DD, YYYY')}</span>)}
            {info.genesis_block_time && renderItem('Genesis block time', <span className='text-[13px] text-[#BBBBBB]'>{dayjs(+info.genesis_block_time).format('MMM DD, YYYY')}</span>)}
        </div>
    )
}

export default Info