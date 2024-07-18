import React,{ useEffect, useRef } from 'react'
import * as echarts from 'echarts'


import dayjs from 'dayjs'



const option1 = {
    color:['#3794FF'],
    xAxis: {
      type: 'category',
      data: ['10-26', '10-27', '10-28', '10-29', '10-30', '10-31', '11-1', '11-2', '11-3', '11-4', '11-5'],
      nameTextStyle:{
        color:'#A0A0A0',
        fontWeight:400,
        fontSize: 10
      },
      boundaryGap : ['20%', '20%'],  
    },
    yAxis: {
      type: 'value',
      //show:false
      axisLine:{
        lineStyle:{
            color: "#fff"
        }
      },
      axisLabel: {
        show:false
      },
      splitLine:{
        lineStyle:{
            color: '#3C3C3C'
        }
      }
    },
    grid:{
        left: "12px",
        top: "50px",
        bottom: "30px",
        right: "12px"
    },
    series: [
      {
        data: [ 43,332,64, 30, 77,19,152,15, 72,128,10],
        type: 'line',
      }
    ]
};
let xAxisData: string[] = ['5-6', '5-7', '5-8', '5-9', '5-10', '5-11', '5-12', '5-13', '5-14'];
let data1: number[] = [];
let data2: number[] = [];


for (let i = 0; i < 9; i++) {
  data1.push(+(Math.random() * 2).toFixed(2));
  data2.push(+(Math.random() * 5).toFixed(2));

}

// var emphasisStyle = {
//   itemStyle: {
//     shadowBlur: 10,
//     shadowColor: 'rgba(0,0,0,0.3)'
//   }
// };

const option2 = {
    color:['#008D4D','#B7252F'],
  legend: {
    data: ['', ''],
    left: '10%'
  },
  
  tooltip: {},
  xAxis: {
    data: xAxisData,
    name: 'X Axis',
    axisLine: { onZero: true },
    splitLine: { show: false },
    splitArea: { show: false }
  },
  yAxis: {
    axisLabel: {
        show:false
      },
      splitLine:{
        lineStyle:{
            color: '#3C3C3C'
        }
      }
  },
  grid:{
    left: "12px",
    top: "50px",
    bottom: "30px",
    right: "12px"
},
  series: [
    {
      name:'',
      type: 'bar',
      stack: 'one',
     
      //emphasis: emphasisStyle,
      data: data1
    },
    {
      name:'',
      type: 'bar',
      stack: 'one',
      
      //emphasis: emphasisStyle,
      data: data2
    },
    
  ]
};


const General = () => {
    
    
    

    
    
    
    
    
    // const publicChain = (dominances[0]+ dominances[1]+dominances[2])!=0 ? (dominances[0] / (dominances[0]+ dominances[1]+dominances[2]) * 100).toFixed(2) : 0
    // const stablCoin = (dominances[0]+ dominances[1]+dominances[2])!=0 ? (dominances[1] / (dominances[0]+ dominances[1]+dominances[2]) * 100).toFixed(2) : 0
    // const cex = (dominances[0]+ dominances[1]+dominances[2])!=0 ? (100 - +publicChain - +stablCoin).toFixed(2) : 0
    const chartDiv = React.useRef<HTMLDivElement>(null)
    const chartDiv1 = React.useRef<HTMLDivElement>(null)
    
    
    const chart111 = React.useRef<any>(null)
    
    
    
    // const dataList = findList.map(item => {
    //   let zb = 0
    //   item.currencyDoVOS?.map(i => {
    //     console.log(i)
    //     //zb = i.currentSupply * i.p
    //   })
    //   return item
    // })
    
    
    React.useEffect(() => {
      chart111.current = echarts.init(chartDiv.current!, 'black')
      
     
      
      
      return () => {
        echarts.dispose(chart111.current);
      };
    },[])
    /*
    
    */
    return (
        <div className='h-[calc(100vh-78px)] overflow-y-auto' id='hidden-scroll'>
        
        {/* <div className='bg-[#292929] relative w-[500px] h-[188px] mb-0.5'>
            <div className='absolute left-0 top-[12px] p-3 flex h-4 leading-4 text-sm justify-between items-center w-full'>
                <div className='text-[#E5E5E5]'>FGI</div>
                <div className='text-[#BBBBBB]'>64</div>
            </div>
            <div ref={chartDiv1} className="w-[500px] h-[190px]">

            </div>
            
        </div> */}
        
        
        </div>
    )
}

export default General