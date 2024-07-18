import React from 'react'
import * as echarts from 'echarts'
import { getDataChart } from 'http/home'



const FundFlow = () => {
    const chartDiv = React.useRef<HTMLDivElement>(null)
    const chartDiv1 = React.useRef<HTMLDivElement>(null)
    const chartDiv2 = React.useRef<HTMLDivElement>(null)
    const getData = async () => {
        const { data } = await getDataChart('1666032986125463558')
        const rows = JSON.parse(data.responseData).result.rows
        rows.sort((a:any,b:any) =>  a.time.localeCompare(b.time))
        
        const depositList = rows.map((item: any) => {
            return item.deposit ? Number(item.deposit).toFixed(2) : 0
        })
        const netDeposit = rows.map((item: any) => {
            return item.net_deposit ? Number(item.net_deposit).toFixed(2) : 0
        })
        const time = rows.map((item: any) => {
            return item.time.slice(2,7)
        })
        const withdrawal = rows.map((item: any) => {
            return item.withdrawal ? Number(item.withdrawal).toFixed(2) : 0
        })
        const option = {
            color:['#519ABA','#747474', '#FFFFFF'],
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                type: 'cross',
                crossStyle: {
                  color: '#999'
                }
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
                boundaryGap : ['20%', '20%'],
                axisLine:{
                  
                },
                axisLabel:{
                 
                },
                splitLine:{
                  show:false
                }
              },
              yAxis: [
                {
                  type: 'value',
                  name: '',
                  axisLabel: {
                    show:false
                  },
                  splitLine:{
                    show:false
                  }
                },
                {
                  type: 'value',
                  name: '',
                  axisLabel: {
                    show:false
                  },
                  splitLine:{
                    show:false
                  }
                }
              ],
              grid:{
                  left: "18px",
                  top: "50px",
                  bottom: "30px",
                  right: "18px"
              },
              series: [
                  {
                      name: 'Deposit(ETH)',
                      type: 'bar',
                      z:"-1",
                      barGap: '-100%',
                      tooltip: {
                        valueFormatter: function (value:number) {
                          return value;
                        }
                      },
                      data: depositList
                  },
                  {
                      name: 'Withdrawal(ETH)',
                      type: 'bar',
                      tooltip: {
                        valueFormatter: function (value:number) {
                          return value;
                        }
                      },
                      data: withdrawal
                  },
                  {
                      name: 'Net Deposit(ETH)',
                      type: 'scatter',
                      yAxisIndex: 1,
                      tooltip: {
                        valueFormatter: function (value:number) {
                          return value;
                        }
                      },
                      symbol:'circle',
                      symbolSize: 3,
                      data: netDeposit
                  }]
        }
        const chart = echarts.init(chartDiv.current!, 'black')
        if(chartDiv.current){
          chart.setOption(option)
        }
        return () => {
          echarts.dispose(chart);
        };
    }
    const getData1 = async () => {
      const { data } = await getDataChart('1666032986125463559')
      const rows = JSON.parse(data.responseData).result.rows
      rows.sort((a:any,b:any) =>  a.day.localeCompare(b.day))
      const currentStaked = rows.map((item: any) => {
          return item.current_staked ? Number(item.current_staked).toFixed(2) : 0
      })
      const stakedUsd = rows.map((item: any) => {
          return item.staked_usd ? Number(item.staked_usd).toFixed(2) : 0
      })
      const time = rows.map((item: any) => {
          return item.day.slice(2,7)
      })
      const option1 = {
          color:['#747474','#519ABA'],
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              crossStyle: {
                color: '#999'
              }
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
              boundaryGap : ['20%', '20%'],
              axisLine:{
                
              },
              axisLabel:{
               
              },
              splitLine:{
                show:false
              }
            },
            yAxis: [
              {
                type: 'value',
                name: '',
                axisLabel: {
                  show:false
                },
                splitLine:{
                  lineStyle:{
                      color: '#3C3C3C'
                  }
                }
              },
              {
                type: 'value',
                name: '',
                axisLabel: {
                  show:false
                },
                splitLine:{
                  lineStyle:{
                      color: '#3C3C3C'
                  }
                }
              }
            ],
            grid:{
                left: "18px",
                top: "50px",
                bottom: "30px",
                right: "18px"
            },
            series: [
                {
                    name: 'ETH Staked (ETH)',
                    type: 'bar',
                    tooltip: {
                      valueFormatter: function (value:number) {
                        return value;
                      }
                    },
                    data: currentStaked
                },
                {
                    name: 'ETH Staked (USD)',
                    type: 'line',
                    yAxisIndex: 1,
                    tooltip: {
                      valueFormatter: function (value:number) {
                        return value;
                      }
                    },
                    data: stakedUsd
                }]
      }
      const chart1 = echarts.init(chartDiv1.current!, 'black')
      if(chartDiv1.current){
        chart1.setOption(option1)
      }
      return () => {
        echarts.dispose(chart1);
      };
    }
    const getData2 = async () => {
      const { data } = await getDataChart('1666032986125463560')
      const rows = JSON.parse(data.responseData).result.rows
      rows.sort((a:any,b:any) =>  a.day.localeCompare(b.day))
      console.log(JSON.parse(data.responseData))
      
      const nonStaked = rows.map((item: any) => {
          return item.staking_ratio_raw ? Number(item.staking_ratio_raw).toFixed(2) : 0
      })
      const staked = rows.map((item: any) => {
          return 1-item.staking_ratio_raw ? Number(1-item.staking_ratio_raw).toFixed(2) : 0
      })
      const time = rows.map((item: any) => {
          return item.day.slice(2,7)
      })
      const option2 = {
        color:['#747474','#519ABA',],
        
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            data: time
          }
        ],
        yAxis: [
          {
            type: 'value',
            splitLine:{
              show:false
            },
            axisLabel: {
              show:false
            },
          }
        ],
        series: [
          {
            name: 'Staked',
            type: 'bar',
            stack:'Staked',
            areaStyle: {},
            data: staked
          },
          {
            name: 'Non-Staked',
            type: 'bar',
            stack:'Staked',
            areaStyle: {},
            data: nonStaked
          },
          
          
        ]
      };
      const chart2 = echarts.init(chartDiv2.current!, 'black')
      if(chartDiv2.current){
        chart2.setOption(option2)
      }
      return () => {
        echarts.dispose(chart2);
      };
    }
    React.useEffect(() => {
        getData()  
        getData1() 
        getData2()
        
        
    }, [])
    return (
      <div className='h-[calc(100vh-78px)] overflow-y-auto' id='hidden-scroll'>
        <div className='bg-[#292929] relative w-[500px] h-[345px] mb-0.5'>
            <div className='absolute left-0 top-[12px] p-3 flex h-4 leading-4 text-sm justify-between items-center w-full'>
              <div className='text-[#E5E5E5]'>Bitcoin: Total Transfer Volume to Exchanges [BTC] - All Exchanges</div>
            </div>
            <div ref={chartDiv} className="w-[500px] h-[345px]">

            </div>
        </div>
        <div className='bg-[#292929] relative w-[500px] h-[360px] mb-0.5'>
            <div className='absolute left-0 top-[12px] p-3 flex h-4 leading-4 text-sm justify-between items-center w-full'>
              <div className='text-[#E5E5E5]'>amount of staked ETH - Ethereum Staking Ratio and Beacon Chain ETH Balance</div>
            </div>
            <div ref={chartDiv1} className="w-[500px] h-[360px]">

            </div>
        </div>

        <div className='bg-[#292929] relative w-[500px] h-[335px] '>
            <div className='absolute z-10 left-0 top-[12px] p-3 flex h-4 leading-4 text-sm justify-between items-center w-full'>
              <div className='text-[#E5E5E5]'>estimated staking ratio - Ethereum Staking Ratio and Beacon Chain ETH Balance</div>
            </div>
            <div ref={chartDiv2} className="w-[500px] h-[335px]">

            </div>
        </div>
      </div>
    )
}

export default FundFlow