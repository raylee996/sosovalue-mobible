import React from 'react'
import * as echarts from 'echarts'
import { getDataChart } from 'http/home'
import { EChartsOption } from 'echarts'
import Chart from "components/base/Charts";
import { transferMoney } from 'helper/tools'
import dayjs from 'dayjs'
type Props = {
  status:boolean,
} 
const EthAmout = ({status} : Props) => {
    const [legend,setLegend] =  React.useState<API.legend[]>()
    const [options,setOptions] = React.useState<EChartsOption>({})
    const [introduce, setIntroduce] = React.useState<API.initText>()
    const [initText,setInitText] = React.useState<{whatisDescription:string,whatisFormula:string,whatisMeaning:string}>()
    const [title,seTitle] = React.useState<string>('')
    const chartOption:EChartsOption = {
      params: [{
        chartName: 'ETH_Staking_Amount_staked_calc',
        name:'ETH Staked (ETH)',
        color:'#E5E5E5',
        height:'8px',
        series:{
          type: 'bar',
          barCategoryGap:'0%',
          barGap:'0%',
        }
      },
      {
        chartName: 'ETH_Staking_usd_calc',
        name:'ETH Staked (USD)',
        color:'#4D67BF',
        series:{
          type: 'line',
          yAxisIndex: 1,
        },
      }],
      grid:{
        left: "60px",
        top: "20px",
        bottom: "35px",
        right: "60px"
      },
      yAxis: [
        {
          type: 'value',
          name: '',
          axisLabel: {
            show:true,
            formatter: function (value:number, index:number) {
              if(value >= 1000000000000){
                  return (value / 1000000000000).toFixed(2) + 'T'
              }else if(value >= 1000000000){
                  return (value / 1000000000).toFixed(2) + 'B'
              }else if(value >= 1000000){
                  return (value / 1000000).toFixed(2) + 'M'
              }else if(value >= 1000){
                  return (value / 1000).toFixed(2) + 'K'
              }else{
                  return '0';
              }   
            }
          },
          splitLine:{
            lineStyle:{
                color: '#343434'
            }
          }
        },
        {
          type: 'value',
          axisLabel: {
            show:true,
            formatter: function (value:number, index:number) {
              if(value >= 1000000000000){
                  return (value / 1000000000000).toFixed(2) + 'T'
              }else if(value >= 1000000000){
                  return (value / 1000000000).toFixed(2) + 'B'
              }else if(value >= 1000000){
                  return (value / 1000000).toFixed(2) + 'M'
              }else if(value >= 1000){
                  return (value / 1000).toFixed(2) + 'K'
              }else{
                  return '0';
              }   
            }
          },
          splitLine:{
            lineStyle:{
                color: '#3C3C3C'
            }
          }
        }
      ],
      showDataZoom: false,
      transferMoney:true
    }
    const getData1 = async () => {
      const { data } = await getDataChart('1666032986125463559')
      let init = {
        title:data.name,
        whatisDescription: data.whatisDescription,
        whatisFormula: data.whatisFormula,
        whatisMeaning: data.whatisMeaning
      }
      setInitText(init)
      seTitle(data.name)
      setIntroduce(init)
      const rows = JSON.parse(data.responseData).result.rows
      let length = data.initFixedScale
      rows.sort((a:any,b:any) =>  a.day.localeCompare(b.day))
      let currentStaked: any = []
      let stakedUsd: any = []
      let time: any = []
      rows.forEach((item: any,index:number) => {
        if(length && (index > (rows.length - +length)) && index <= rows.length){
          currentStaked.push(Number(item.current_staked).toFixed(2))
          stakedUsd.push(Number(item.staked_usd).toFixed(2))
          //time.push(item.day.slice(5,10))
          time.push(dayjs(item.day.split('.')[0]).format('MM/DD'))
        }
      })
      // const currentStaked = rows.map((item: any) => {
      //     return item.current_staked ? Number(item.current_staked).toFixed(2) : 0
      // })
      // const stakedUsd = rows.map((item: any) => {
      //     return item.staked_usd ? Number(item.staked_usd).toFixed(2) : 0
      // })
      // const time = rows.map((item: any) => {
      //     return item.day.slice(0,7)
      // })
      const LastTime = dayjs(rows[rows.length - 1].day.split('.')[0]).format('MMM D')
      const legend = [
        {
            height: '8px',
            name: 'ETH Staked (ETH)',
            color:'#E5E5E5',
            val: transferMoney(currentStaked[currentStaked.length -1]) || '',
            time: LastTime,
        },
        {
            height: '2px',
            name: 'ETH Staked (USD)',
            color:'#4D67BF',
            val: transferMoney(stakedUsd[stakedUsd.length -1]) || '',
            time: LastTime,
        }
      ]
   
      setLegend(legend)
      const option1:EChartsOption = { 
          color:['#E5E5E5','#4D67BF','#4D8FBF','#4DBFBC','#4DBF60','#BFB64D','#BF8F4D','#BF694D','#BF4D61','#BF4DBB','#7C4DBF'],

          tooltip: {
            trigger: 'axis',
            backgroundColor: '#1E1E1E',
            borderColor: '#1E1E1E',
            padding: 4,
            textStyle: {
              color: '#A5A7AB',
              fontSize: 10
            },
            axisPointer: {
              type: 'line'
            },
            formatter: function (params: any) {
    
              let Paramsss = `<div>${params[0].axisValue}</div>`;
              params.map((item: any) => {
                Paramsss += `<i style="margin-right:4px;display:inline-block;width:6px;height:6px;border-radius:50%;font-size:14px;background:${item.color}"></i>${item.seriesName}: ${transferMoney(item.value)} <br/>`;
              })
              return Paramsss;
            }
          },
          
          xAxis: {
              type: 'category',
              data: time,
              nameTextStyle:{
                color:'#A0A0A0',
                fontWeight:400,
                fontSize: 10
              },
             
              axisLine:{
                lineStyle: {
                  color: '#343434', // 坐标轴线的颜色
                  width: 1, // 坐标轴线的宽度
                  type: 'solid' // 坐标轴线的类型（实线、虚线等）
                }
              },
              axisLabel:{
                showMaxLabel:true,
                color:'#8F8F8F'
              },
              splitLine:{
                show:false
              },
              axisTick: {
                show: false
              },
            },
            yAxis: [
              {
                type: 'value',
                name: '',
                min:Math.min(...currentStaked.slice(0, currentStaked.length - 1)),
                max:Math.max(...currentStaked.slice(0, currentStaked.length - 1)),
                interval:(Math.max(...currentStaked.slice(0, currentStaked.length - 1)) - Math.min(...currentStaked.slice(0, currentStaked.length - 1)))/5,
                axisLabel: {
                  show:true,
                  formatter: function (value:number, index:number) {
                    if(value >= 1000000000000){
                        return (value / 1000000000000).toFixed(2) + 'T'
                    }else if(value >= 1000000000){
                        return (value / 1000000000).toFixed(2) + 'B'
                    }else if(value >= 1000000){
                        return (value / 1000000).toFixed(2) + 'M'
                    }else if(value >= 1000){
                        return (value / 1000).toFixed(2) + 'K'
                    }else{
                        return '0';
                    }   
                  }
                },
                splitLine:{
                  lineStyle:{
                      color: '#343434'
                  }
                }
              },
              {
                type: 'value',
                min:Math.min(...stakedUsd.slice(0, stakedUsd.length - 1)),
                max:Math.max(...stakedUsd.slice(0, stakedUsd.length - 1)),
                interval:(Math.max(...stakedUsd.slice(0, stakedUsd.length - 1)) - Math.min(...stakedUsd.slice(0, stakedUsd.length - 1)))/5,
                axisLabel: {
                  show:true,
                  formatter: function (value:number, index:number) {
                    if(value >= 1000000000000){
                        return (value / 1000000000000).toFixed(2) + 'T'
                    }else if(value >= 1000000000){
                        return (value / 1000000000).toFixed(2) + 'B'
                    }else if(value >= 1000000){
                        return (value / 1000000).toFixed(2) + 'M'
                    }else if(value >= 1000){
                        return (value / 1000).toFixed(2) + 'K'
                    }else{
                        return '0';
                    }   
                  }
                },
                splitLine:{
                  lineStyle:{
                      color: '#3C3C3C'
                  }
                }
              }
            ],
            grid:{
                left: "60px",
                top: "20px",
                bottom: "35px",
                right: "60px"
            },
            series: [
                {
                    name: 'ETH Staked (ETH)',
                    type: 'bar',
                    barCategoryGap:'0%',
                    barGap:'0%',
                    // tooltip: {
                    //   valueFormatter: function (value:number) {
                    //     return value;
                    //   }
                    // },
                    data: currentStaked,
                    
                    // showSymbol:false,
                    // smooth:true
                },
                {
                    name: 'ETH Staked (USD)',
                    type: 'line',
                    yAxisIndex: 1,
                    showSymbol:false,
                    lineStyle:{
                      width:1
                    },
                    smooth:true,
                    // tooltip: {
                    //   valueFormatter: function (value:number) {
                    //     return value;
                    //   }
                    // },
                    data: stakedUsd
                }
              ]
      }
      
      setOptions(option1)

    }
    React.useEffect(() => { 
      if(status){
        getData1() 
      }  
        
    }, [status])
    return (
      <div className='w-full h-full'>
        <Chart option={options} classes='w-full h-[380px]' introduce={introduce} legend={legend} chartOption={chartOption} />
      </div>
    )
}

export default EthAmout