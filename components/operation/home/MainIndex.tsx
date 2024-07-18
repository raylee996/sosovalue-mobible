import { Swiper, SwiperClass, SwiperSlide } from 'swiper/react'
import { IconButton } from '@mui/material'
import ArrowIcon from 'components/svg/Arrow'
import MarketCap from 'components/operation/markets/Data/Main/MarketCap'
import MarketValue from 'components/operation/markets/Data/Main/MarketValue'
import ActiveAddress from 'components/operation/markets/Data/Main/ActiveAddress'
import ChainTransaction from 'components/operation/markets/Data/Main/ChainTransaction'

import MiningDifficulty from 'components/operation/markets/Data/Main/MiningDifficulty'
import EstimatedRatio from 'components/operation/markets/FundFlow/EstimatedRatio'
import { useRef } from 'react'

const charts = [MarketCap, MarketValue, ActiveAddress, ChainTransaction,  MiningDifficulty, EstimatedRatio]

const MainIndex = () => {
    const swiperRef = useRef<SwiperClass | null>(null)
    return (
        <div>
            <div className="text-primary text-xl font-bold mb-3 mt-6">Top 10 by 24H Volume</div>
            <div className='relative group'>
                <IconButton onClick={() => swiperRef.current!.slidePrev()} className='text-sub-title absolute left-3 top-1/2 -translate-y-1/2 z-10 bg-[#1F1F1F] border border-solid border-[#404040] transition duration-500 opacity-0 scale-75 group-hover:scale-100 group-hover:opacity-100'>
                    <ArrowIcon className='text-[29px] rotate-90' viewBox="0 0 13 12" />
                </IconButton>
                <Swiper
                    allowTouchMove={false}
                    spaceBetween={16}
                    slidesPerGroup={3}
                    slidesPerView='auto'
                    onSwiper={swiper => swiperRef.current = swiper}
                >
                    {
                        charts.map((Chart, index: number) => {
                            return (
                                <SwiperSlide key={index} className='w-[350px] h-[400px] bg-block-color shadow-area rounded-lg text-white cursor-pointer'>
                                    <Chart status={true} classes='w-full h-[292px]'/>
                                </SwiperSlide>
                            )
                        })
                    }
                </Swiper>
                <IconButton onClick={() => swiperRef.current!.slideNext()} className='text-sub-title absolute right-3 top-1/2 -translate-y-1/2 z-10 bg-[#1F1F1F] border border-solid border-[#404040] transition duration-500 opacity-0 scale-75 group-hover:scale-100 group-hover:opacity-100'>
                    <ArrowIcon className='text-[29px] -rotate-90' viewBox="0 0 13 12" />
                </IconButton>
            </div>
        </div>
    )
}

export default MainIndex