import React from 'react'
import Image from 'next/image'
import IconButton from '@mui/material/IconButton';
import TwitterIcon from 'components/svg/TwitterIcon';
import TelegramIcon from 'components/svg/TelegramIcon';
import DiscordIcon from 'components/svg/DiscordIcon';
import Link from 'next/link'

const FooterNav = () => {
    return (
        <div>
            <div className='flex justify-between items-center pt-4 pb-6 border-0 border-b border-[#555555] border-solid'>
                <Link href='/' className='no-underline'>
                    <div className='cursor-pointer'>
                        <Image src="/img/logo.svg" alt="" width={30} height={30} />
                        <Image src="/img/logo_text.svg" alt="" width={94} height={33} className='relative top-0.5 ml-4' />
                    </div>
                </Link>
                <div>
                    <Link href='https://twitter.com/SoSpongeCrypto' className='no-underline' target='_blank'>
                        <IconButton>
                            <Image src='/img/telegram.svg' alt="" width={20} height={20} />
                        </IconButton>
                    </Link>
                    <Link href='https://twitter.com/SoSpongeCrypto' className='no-underline' target='_blank'>
                        <IconButton>
                            <Image src='/img/discord.svg' alt="" width={20} height={20} />
                        </IconButton>
                    </Link>
                    <Link href='https://twitter.com/SoSpongeCrypto' className='no-underline' target='_blank'>
                        <IconButton>
                            <Image src='/img/twitter.svg' alt="" width={20} height={20} />
                        </IconButton>
                    </Link>
                </div>
            </div>
            <div className='flex justify-between items-center py-6'>
                <div className='flex gap-x-[50px] text-xs font-bold'>
                    <Link href='/' className='hover:text-primary transition no-underline text-[#D8D8D8]'>Home</Link>
                    {/* <Link href='/research' className='hover:text-primary transition no-underline text-[#D8D8D8]'>Research</Link> */}
                    <Link href='/library' className='hover:text-primary transition no-underline text-[#D8D8D8]'>Library</Link>
                    <Link href='/portfolio' className='hover:text-primary transition no-underline text-[#D8D8D8]'>Portfolio</Link>
                    <Link href='/bookmarks' className='hover:text-primary transition no-underline text-[#D8D8D8]'>Bookmarks</Link>
                </div>
                <div className='flex gap-x-[50px] text-xs font-bold'>
                    <Link href='https://sosovalue.xyz/blog/privacy-policy' className='no-underline text-[#D8D8D8]'>Privacy policy</Link>
                    <Link href='https://sosovalue.xyz/blog/terms-of-service' className='no-underline text-[#D8D8D8]'>Terms of use</Link>
                </div>
            </div>
            <div className='text-xs text-[#D8D8D8] pb-20'>@2022 Copyright Info. All Rights Reserved.</div>
        </div>
    )
}

export default FooterNav