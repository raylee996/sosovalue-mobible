import React from 'react'
import Image from 'next/image'
type Props = {
  initText: any,
  active:boolean,
  introHeight? : string,
  changeActive:(val:any) => any
}
const News = (props:Props) => {
  const {active,initText} = props
  const [showMore,setShowMore] = React.useState<boolean>(false)
  
  const handleClick = () => {
    setShowMore(!showMore)
  }
  
  return (
    <div className='absolute h-[500px] w-full bg-[#171717]' style={{'display': `${active ? 'block' : 'none'}`}}>
          <div className='flex items-center justify-between h-12 p-3 mb-1'>
                <div className='text-[#F4F4F4] text-sm leading-6'>
                    <span>{initText?.title}</span>
                </div>
                <div className='cursor-pointer' onClick={() => props.changeActive(false)}>
                    <Image src="/img/svg/IconActive.svg" alt="" width={24} height={24} className='align-bottom' />
                </div>
            </div>
          <div>
          <div className={` overflow-y-scroll px-3 ${props.introHeight ? props.introHeight : 'h-[448px]'}`}>
            { initText?.whatisMeaning && 
              <div className='mb-2'>
                <div className='text-sm text-[#CCCCCC]'><Image src='/img/svg/indicator.svg' alt="" width={20} height={20} className='align-top mr-0.5'/>Meaning of indicators</div>
                  <div className='text-xs text-[#676564] py-2 whitespace-pre-line text-justify'
                      dangerouslySetInnerHTML={{
                      __html: (initText?.whatisMeaning || '')
                  }}>
                </div>
              </div>
            }
            { initText?.whatisDescription && 
              <div className='mb-2'>
                <div className='text-sm text-[#CCCCCC]'><Image src='/img/svg/desc.svg' alt="" width={20} height={20} className='align-top mr-0.5'/>Data Description</div>
                
                <div className='text-xs text-[#676564] py-2 whitespace-pre-line text-justify'
                    dangerouslySetInnerHTML={{
                    __html: (initText?.whatisDescription || '')
                }}>
              </div>
              </div>
            }
            { initText?.whatisFormula && 
              <div className='mb-2'>
                <div className='text-sm text-[#CCCCCC]'><Image src='/img/svg/formula.svg' alt="" width={20} height={20} className='align-top mr-0.5'/>Calculation formula</div>
                
                <div className='text-xs text-[#676564] py-2 whitespace-pre-line text-justify'
                    dangerouslySetInnerHTML={{
                    __html: (initText?.whatisFormula || '')
                }}>
              </div>
              </div>
            }
          </div>
          
        </div>
    </div> 
  )
}

export default News