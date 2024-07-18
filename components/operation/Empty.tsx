import React from 'react'
import ErrorIcon from '@mui/icons-material/Error';
import Button from '@mui/material/Button';
import { useRouter } from 'next/router';

const Empty = () => {
    const router = useRouter()
    return (
        <div className='flex flex-col justify-center items-center'>
            <ErrorIcon className='text-[#165DFF] w-10 h-10'/>
            <span className='mt-5 text-[#313131] text-sm'>No content</span>
            <Button onClick={() => router.back()} className='mt-4 text-[#808080] bg-[#D8D8D8]' color='inherit'>Back</Button>
        </div>
    )
}

export default Empty