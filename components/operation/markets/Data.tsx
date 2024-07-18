import React from 'react'
import * as echarts from 'echarts'
import { getDataChart } from 'http/home'
const Data = () => {
    const chartDiv = React.useRef<HTMLDivElement>(null)
    const chartDiv1 = React.useRef<HTMLDivElement>(null)
    const chartDiv2 = React.useRef<HTMLDivElement>(null)
    const getData = async () => {
        const { data } = await getDataChart('1666032986125463557')
        const rows = JSON.parse(data.responseData).result.rows
        rows.sort((a:any,b:any) =>  a.time.localeCompare(b.time))
        let volumeerc1155:any = []
        let volumeerc721:any = []
        let time:any = []
        rows.forEach((item: any) => {
            if(item.token_standard && item.token_standard ==='erc1155'){
                volumeerc1155.push(item.volume.toFixed(2))
            } 
            if(item.token_standard && item.token_standard ==='erc721'){
                volumeerc721.push(item.volume.toFixed(2))
            } 
            if(!item.token_standard){
                time.push(item.time.slice(5,10))
            } 
        })
        
        const option = {
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                type: 'shadow'
              }
            },
            
            grid: {
              left: '4%',
              right: '4%',
              bottom: '3%',
              containLabel: true
            },
            xAxis: [
              {
                type: 'category',
                data: time
              }
            ],
            yAxis: [
              {
                type: 'value',
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
            series: [
              
              {
                name: 'erc721',
                type: 'bar',
                stack: 'volume',
                data: volumeerc721
              },
              {
                name: 'erc1155',
                type: 'bar',
                stack: 'volume',
                data: volumeerc1155
              },
            ]
          };
        const chart = echarts.init(chartDiv.current!, 'black')
        if(chartDiv.current){
          chart.setOption(option)
        }
        
        return () => {
          echarts.dispose(chart);
        };
    }
    const getData1 = async () => {
      const { data } = await getDataChart('1666032986125463555')
      const rows = JSON.parse(data.responseData).result.rows
      rows.sort((a:any,b:any) =>  a.time.localeCompare(b.time))
      let openSea:any = []
      let blur:any = []
      let gem:any = []
      let AlphaSharks:any = []

      let time:any = []
        rows.forEach((item: any) => {
            if(item.name && item.name ==="OpenSea"){
                openSea.push(item.total_trades)
                time.push(item.time.slice(5,10))
            } 
            if(item.name && item.name ==="Blur"){
                blur.push(item.total_trades)
            } 
            if(item.name && item.name ==="Gem"){
                gem.push(item.total_trades)
            } 
            if(item.name && item.name ==="Alpha Sharks"){
                AlphaSharks.push(item.total_trades)
            }  
        })
      
      const option1 = {
          color:['#519ABA','#8DC149','#CBCB41','#E37933'],
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
                    name: 'openSea',
                    type: 'bar',
                    stack: 'trades',
                    tooltip: {
                      valueFormatter: function (value:number) {
                        return value;
                      }
                    },
                    data: openSea
                },
                {
                    name: 'blur',
                    type: 'bar',
                    stack: 'trades',
                    tooltip: {
                      valueFormatter: function (value:number) {
                        return value;
                      }
                    },
                    data: blur
                },
                {
                    name: 'gem',
                    type: 'bar',
                    stack: 'trades',
                    tooltip: {
                      valueFormatter: function (value:number) {
                        return value;
                      }
                    },
                    data: gem
                },
                {
                    name: 'Alpha Sharks',
                    type: 'bar',
                    stack: 'trades',
                    tooltip: {
                      valueFormatter: function (value:number) {
                        return value;
                      }
                    },
                    data: AlphaSharks
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
      const { data } = await getDataChart('1666032986125463556')
      const rows = JSON.parse(data.responseData).result.rows
      rows.sort((a:any,b:any) =>  a.time.localeCompare(b.time))
      
      const traders = rows.map((item: any) => {
          return item.traders
      })
      const time = rows.map((item: any) => {
          return item.time.slice(5,10)
      })
      const option2 = {
        color:['#519ABA'],
        
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
          left: '4%',
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
        series: [
          {
            name: 'traders',
            type: 'bar',
            data: traders
          }
          
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
        <div className='bg-[#292929] relative w-[500px] h-[366px] mb-0.5'>
            <div className='absolute left-0 top-[12px] p-3 flex h-4 leading-4 text-sm justify-between items-center w-full'>
                <div className='text-[#E5E5E5]'>DAILY Volume</div>
            </div>
            <div ref={chartDiv} className="w-[500px] h-[366px]">

            </div>
        </div>
        <div className='bg-[#292929] relative w-[500px] h-[366px] mb-0.5'>
            <div className='absolute left-0 top-[12px] p-3 flex h-4 leading-4 text-sm justify-between items-center w-full'>
                <div className='text-[#E5E5E5]'>DAILY Trades</div>
            </div>
            <div ref={chartDiv1} className="w-[500px] h-[366px]">

            </div>
        </div>

        <div className='bg-[#292929] relative w-[500px] h-[366px] '>
            <div className='absolute left-0 top-[12px] p-3 flex h-4 leading-4 text-sm justify-between items-center w-full'>
                <div className='text-[#E5E5E5]'>DAILY Traders</div>
            </div>
            <div ref={chartDiv2} className="w-[500px] h-[366px]">

            </div>
        </div>
        </div>
    )
}

export default Data