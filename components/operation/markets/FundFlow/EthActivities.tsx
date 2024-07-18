import React from 'react'
import * as echarts from 'echarts'
import { getDataChart } from 'http/home'
import { EChartsOption } from 'echarts'
import Chart from "components/base/Charts";
import dayjs from 'dayjs'
import { intlNumberFormat } from 'helper/tools'
type Props = {
  status:boolean,
} 
const EthActivities = ({status} : Props) => {
    const [initText,setInitText] = React.useState<{whatisDescription:string,whatisFormula:string,whatisMeaning:string}>()
    const [title,seTitle] = React.useState<string>('')
    const [legend,setLegend] =  React.useState<API.legend[]>()
    const [options,setOptions] = React.useState<EChartsOption>({})
    const [introduce, setIntroduce] = React.useState<API.initText>()
    const chartOption:EChartsOption = {
      params: [{
        chartName: 'ETH_Staking_Activities_Over_Time_deposit',
        name:'Deposit(ETH)',
        color:'#24A148',
        height: '8px',
        series:{
          type:'bar',
          z:-1,
          barGap: '-100%',
        }
      },
      {
        chartName: 'ETH_Staking_Activities_Over_Time_withdrawal',
        name:'Withdrawal(ETH)',
        height: '8px',
        color:'#DA1E28',
        series:{
          type:'bar',
        }
      },
      {
        chartName: 'ETH_Staking_Activities_Over_Time_net_deposit',
        name:'Net Deposit(ETH)',
        color:'#5783D9',
        height: '8px',
        radius: '8px',
        series:{
          type:'scatter',
          symbol:'circle',
          symbolSize: 3,
        }
      },
      ],
      grid:{
        left: "75px",
        top: "20px",
        bottom: "30px",
        right: "35px"
      },
      yType:'value',
      showDouble:false,
      showDataZoom: false
    }
    const getData = async () => {

        const { data } = await getDataChart('1666032986125463558')
        const rows = JSON.parse(data.responseData).result.rows
        
        let init = {
          title:data.name,
          whatisDescription: data.whatisDescription,
          whatisFormula: data.whatisFormula,
          whatisMeaning: data.whatisMeaning
        }
        setInitText(init)
        seTitle(data.name)
        setIntroduce(init)
        let length = data.initFixedScale
        rows.sort((a:any,b:any) =>  a.time.localeCompare(b.time))
        let depositList: any = []
        let netDeposit: any = [] 
        let withdrawal: any = []
        let time: any = []
        rows.forEach((item: any,index:number) => {
          if(length && (index > (rows.length - +length)) && index <= rows.length){
            depositList.push(Number(item.deposit).toFixed(2))
            netDeposit.push(Number(item.net_deposit).toFixed(2))
            withdrawal.push(Number(item.withdrawal).toFixed(2))
            //time.push(item.time.slice(5,10))
            time.push(dayjs(item.time.split('.')[0]).format('MM/DD'))
          }
        })
        const LastTime = dayjs(rows[rows.length - 1].time.split('.')[0]).format('MMM D')
        // const depositList = rows.map((item: any) => {
        //     return item.deposit ? Number(item.deposit).toFixed(2) : 0
        // })
        // const netDeposit = rows.map((item: any) => {
        //     return item.net_deposit ? Number(item.net_deposit).toFixed(2) : 0
        // })
        // const time = rows.map((item: any) => {
        //     return item.time.slice(5,10)
        // })
        // const withdrawal = rows.map((item: any) => {
        //     return item.withdrawal ? Number(item.withdrawal).toFixed(2) : 0
        // })
        const legend = [
          {
              height: '8px',
              name: 'Deposit(ETH)',
              color:'#24A148',
              val:intlNumberFormat(depositList[depositList.length -1]) || '',
              time: LastTime,
              
          },
          {
            height: '8px',
            name: 'Withdrawal(ETH)',
            color:'#DA1E28',
            val: intlNumberFormat(withdrawal[withdrawal.length -1]) || '',
            time: LastTime,
          },
          {
            height: '8px',
            name: 'Net Deposit(ETH)',
            color:'#5783D9',
            val: intlNumberFormat(netDeposit[netDeposit.length -1]) || '',
            time: LastTime,
            radius: '8px'
          },
          // {
          //     height: '8px',
          //     name: '24h Vol',
          //     color:'#3F3F3F',
          //     val: pList[pList.length -1] || ''
          // }
        ]
     
        setLegend(legend)
        const option:EChartsOption = {
            color:['#24A148','#DA1E28','#5783D9','#DA1E28','#ED8139','#FB6E77','#FF79C9','#A471E3','#74188B','#41535B','#D4D7D6'],

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
                  Paramsss += `<i style="margin-right:4px;display:inline-block;width:6px;height:6px;border-radius:50%;font-size:14px;background:${item.color}"></i>${item.seriesName}: ${intlNumberFormat(item.value)} <br/>`;
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
               }
              },
              yAxis: [
                {
                  type: 'value',
                  name: '',
                  axisLabel: {
                    show:true
                  },
                  splitLine:{
                    show:false
                  }
                },
                {
                  type: 'value',
                  name: '',
                  axisLabel: {
                    show:true
                  },
                  splitLine:{
                    show:false
                  }
                },
                {
                  type: 'value',
                  name: '',
                  axisLabel: {
                    show:true
                  },
                  splitLine:{
                    show:false
                  }
                }
              ],
              grid:{
                  left: "75px",
                  top: "20px",
                  bottom: "30px",
                  right: "25px"
              },
              series: [
                  {
                      name: 'Deposit(ETH)',
                      type: 'bar',
                      z:-1,
                      barGap: '-100%',
                      //yAxisIndex: 1,
                      // tooltip: {
                      //   valueFormatter: function (value:number) {
                      //     return value;
                      //   }
                      // },
                      data: depositList
                  },
                  {
                      name: 'Withdrawal(ETH)',
                      type: 'bar',
                      //yAxisIndex: 1,
                      // tooltip: {
                      //   valueFormatter: function (value:number) {
                      //     return value;
                      //   }
                      // },
                      data: withdrawal
                  },
                  {
                      name: 'Net Deposit(ETH)',
                      type: 'scatter',
                      //yAxisIndex: 1,
                      // tooltip: {
                      //   valueFormatter: function (value:number) {
                      //     return value;
                      //   }
                      // },
                      symbol:'circle',
                      symbolSize: 3,
                      data: netDeposit
                  }]
        }
        
        setOptions(option)
        
    }
    React.useEffect(() => {
      if(status){
        getData()  
      }
    }, [status])
    return (
      <div className='w-full h-full'>
        <Chart option={options} classes='w-full h-[380px]' introduce={introduce} legend={legend} chartOption={chartOption}/>
      </div>
    )
}

export default EthActivities