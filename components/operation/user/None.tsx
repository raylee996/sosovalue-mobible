import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
const None = () => {
    
    return (
        <div className='flex items-center justify-center h-full w-full'>
            <div>
                <Image src='/img/svg/FolderSimpleDashed.svg' alt="" width={32} height={32} className='mx-auto block'/>
                <div className='text-base text-[#F4F4F4]'>
                Empty Collection List
                </div>
                <div className='text-sm text-[#C2C2C2] text-center mt-2'>
                Please go to the <Link href='/' className='text-[#226DFF]'>Homepage</Link> <br/>
                to add pairs.
                </div>
            </div>
        </div>
    )
}

export default None
