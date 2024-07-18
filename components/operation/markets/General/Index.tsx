import React from 'react'
import Dominance from './Dominance'
import Distribution from './Distribution'
import Contract from './Contract'
import Ratio from './Ratio'
import FGI from 'components/operation/markets/HotIndex/FGI'
import News from 'components/operation/News'
import Chart from "components/base/Chart";
type Props = {
    over: Array<number>,
    dominance: Array<number>,
    dominances: Array<number>,
    positionData:any,
    currentName:string,
    cryptoTotalList: any,
    coinList:any,
    initDominances:Array<number>,
    findList: Array<API.findListToCurrency>,
    initSosMarketCup:number,
    filterCoin:number,
    status:boolean,
    changeInitData: (data:any) => void
} 
const Main = (props : Props) => {
    const newsTab = [
        {
            title: 'Research',
            categoryList: [2,8]
        },
        {
            title: 'News',
            categoryList: [1,3,7]
        },
        {
            title: 'Insights',
            categoryList: [4]
        },
    ]
    const { over, dominance,dominances,currentName, positionData,filterCoin,cryptoTotalList,initSosMarketCup, findList,initDominances, changeInitData } = props
    const [down, setDown] = React.useState<number | boolean>(0)
    const [up, setUp] = React.useState<number | boolean>(0)
    const option = {
      tooltip: {
        trigger: 'axis',
        backgroundColor:'#1E1E1E',
        borderColor:'#1E1E1E',
        padding:4,
        textStyle:{
            color:'#A5A7AB',
            fontSize:10
        },
        axisPointer: {
            type: 'line'
        },
        formatter: function (params:any) {
           // console.log(params[0]); // 当我们想要自定义提示框内容时，可以先将鼠标悬浮的数据打印出来，然后根据需求提取出来即可
            let firstParams = params[0];
            let Paramsss = `<i style="margin-right:4px;display:inline-block;width:6px;height:6px;border-radius:50%;font-size:14px;background:${params[0].color}"></i>`;
            if(firstParams.name == '10+'){
                Paramsss += `[10%, ∞）: ${firstParams.data.value}`
            }else if(firstParams.name < 10 && firstParams.name >= -8){
                Paramsss += `[${+firstParams.name-2}%, ${+firstParams.name}%) : ${firstParams.data.value}`
            }else{
                Paramsss += `[∞, ${+firstParams.name}%) : ${firstParams.data.value}`
            }
            return Paramsss;
         }
        },
        
      xAxis: {
        type: 'category',
        data: ['-10%', '-8%', '-6%', '-4%', '-2%', '0%', '2%', '4%', '6%', '8%', '10%',''],
        nameTextStyle:{
          color:'#A0A0A0',
          fontWeight:400,
          fontSize: 10
        },
        axisTick: {
            show: false
          },
        boundaryGap : ['20%', '20%'],
        axisLine:{
        },
        axisLabel: {
          padding: [0, 0, 0, 48],
          interval: 0
      },
        // axisTick: {
        //  show: false
        // },
        splitLine:{
          show:false
        }
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          show:false,
          
        },
        splitLine:{
          lineStyle:{
              color: '#3C3C3C'
          }
        }
      },
      grid:{
          left: "-1px",
          top: "50px",
          bottom: "30px",
          right: "-1px"
      },
      series: [
        {
          data: [
          {
              name: '-10',
              value: over[0],
              itemStyle: {
                  color: '#B7252F'
              },
              
          },
          {
              name: '-8',
              value: over[1],
              itemStyle: {
                  color: '#B7252F'
              }
          },
          {
              name: '-6',
              value: over[2],
              itemStyle: {
                  color: '#B7252F'
              }
          },
          {
              name: '-4',
              value: over[3],
              itemStyle: {
                  color: '#B7252F'
              }
          },
          {
              name: '-2', 
              value: over[4],
              itemStyle: {
                  color: '#B7252F'
              }
          },
          {
              name: '0', 
              value: over[5],
              itemStyle: {
                  color: '#B7252F'
              }
          },
          {
              name: '2', 
              value: over[6],
              itemStyle: {
                  color: '#008D4D'
              }
          },
          {
              name: '4', 
              value: over[7],
              itemStyle: {
                  color: '#008D4D'
              }
          },
          {
              name: '6', 
              value: over[8],
              itemStyle: {
                  color: '#008D4D'
              }
          },
          {
              name: '8',
              value: over[9],
              itemStyle: {
                  color: '#008D4D'
              }
          },
          {
              name: '10',
              value: over[10],
              itemStyle: {
                  color: '#008D4D'
              }
          },
          {
              name: '10+',
              value: over[11],
              itemStyle: {
                  color: '#008D4D'
              }
          }
          ],
          type: 'bar',
          
        }
      ]
    };
    React.useEffect(() => {
        
      const down = over.length >0 && over.slice(0,6).reduce((a,b) => a+b)
      const up = over.length >0 && over.slice(6).reduce((a,b) => a+b)
      setDown(down)
      setUp(up)
    },[over])
    return (
        <div className='w-full h-full  grid grid-cols-3 gap-4'>
            <div className='shadow-area h-block col-span-full lg:col-span-1 bg-block-color text-[#fff] rounded-lg'>
                <News status={props.status} tab={newsTab} coinList={props.coinList}/>
            </div>
            <div className='shadow-area h-block col-span-full lg:col-span-1 text-[#fff]'>
                <div className='mb-2 w-fll h-[246px] bg-block-color relative rounded-lg'>
                    <Distribution over={over}/>
                </div>  
                {/* <div className='w-full h-[209px] rounded-lg'><Ratio /></div> */}
                <div className='w-full h-[246px] bg-block-color rounded-lg'><FGI status={props.status}/></div>
            </div>
            <div className='shadow-area h-block col-span-full lg:col-span-1 bg-block-color text-[#fff] rounded-lg'>
                <Contract status={props.status} positionData={positionData}/>
            </div>
        </div>

    )
}

export default Main