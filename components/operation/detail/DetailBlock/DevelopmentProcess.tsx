import Button from '@mui/material/Button';
import React from 'react'

const tabs = [
    {
        title: '2023',
        index: 0
    },
    {
        title: '2022',
        index: 1
    },
    {
        title: '2021',
        index: 2
    },
    {
        title: '2020',
        index: 3
    },
    {
        title: '2019',
        index: 4
    },
]

const DevelopmentProcess = ({ devProcess }: {devProcess?: API.DevelopmentProcess[]}) => {
    const [tabIndex, setTabIndex] = React.useState(tabs[0].index)
    return (
        <div>
            {/* <div>
                {
                    tabs.map(({ title, index }) => (
                        <Button key={index} className={`py-0 text-xs h-6 ${tabIndex === index ? 'text-white font-bold' : 'text-[#BBBBBB] '}`} onClick={() => setTabIndex(index)} variant="text">{title}</Button>
                    ))
                }
            </div> */}
            <div className='px-3 pb-3'>
                {
                    devProcess?.map((_, index) => (
                        <div key={index}>
                            <div className='text-[#E5E5E5] text-xl font-bold h-[50px] flex items-center'>2023</div>
                            <div>
                                {
                                    [1, 1].map((_, index) => (
                                        <div key={index} className='mb-6'>
                                            <div className='text-[#E5E5E5] text-sm font-bold'>Shanghai (planned)</div>
                                            <div className='text-[#E5E5E5] text-sm mt-4'>
                                                <div>📅 Timestamp: TBD</div>
                                                <div>🧱 Block number: TBD</div>
                                                <div>💰 ETH price: TBD</div>
                                            </div>
                                            <div className='text-[#E5E5E5] text-sm font-medium py-4'>Summary</div>
                                            <div className='text-xs text-[#CCCCCC]'>The Shanghai upgrade brings staking withdrawals to the execution layer. In tandem with the Capella upgrade, this enables blocks to accept withdrawal operations, which allow stakers to withdraw their ETH from the Beacon Chain to the execution layer.</div>
                                            <div className='text-xs text-[#3794FF] underline mt-4'>Read the Shanghai upgrade specification</div>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default DevelopmentProcess