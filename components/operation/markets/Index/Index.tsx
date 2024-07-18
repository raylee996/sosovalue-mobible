import React from 'react'
import PiCycle from './PiCycle'
import Ahr from './Ahr'
type Props = {
    status:boolean,
} 
const Main = ({status} : Props) => {
    return (
        <div className='w-full h-full grid grid-cols-3 gap-4'>
            <div className='shadow-area h-block bg-block-color text-[#fff] rounded-lg'>
                <Ahr status={status}/>
            </div>
            {/* <div className='shadow-area h-block bg-block-color text-[#fff] rounded-lg'>
                <PiCycle status={status}/>
            </div> */}
         </div>
    )
}

export default Main