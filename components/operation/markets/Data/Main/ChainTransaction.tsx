import React, { useEffect } from 'react'
import { getDataChart } from 'http/home'
import { useAsyncEffect } from 'ahooks'
import { EChartsOption } from 'echarts'
import dayjs from 'dayjs'
import Chart from "components/base/Charts";
import { intlNumberFormat } from 'helper/tools'
type Props = {
  status:boolean,
  classes?: string;
} 
const ActiveAddress = ({status, classes} : Props) => {
  const [legend,setLegend] =  React.useState<API.legend[]>()
  const [options,setOptions] = React.useState<EChartsOption>({})
  const [introduce, setIntroduce] = React.useState<API.initText>()
  const [chartSelect, setChartSelect] = React.useState('BTC');
  const [initText, setInitText] = React.useState<{ whatisDescription: string, whatisFormula: string, whatisMeaning: string }>()
  const [title,seTitle] = React.useState<string>('')
  const [chartOption,setChartOption] = React.useState<EChartsOption>({
    params: [{
      chartName: 'transactions_on_chains_btc',
      name:'Address',
      color:'#D9D957',
      series:{
        type:'line',
      }
    }],
    yAxis: [
      {
        type: 'value',
        name: '',
        axisLabel: {
          show: true
        },
        splitLine: {
          lineStyle: {
            color: '#343434'
          }
        }
      }
    ],
    grid:{
      left: "68px",
      top: "20px",
      bottom: "80px",
      right: "35px"
    },
    showDataZoom: true,
  })
  const handleChange = async (value:string) => {
    setChartSelect(value);
    if (value == 'BTC') {
      const chartParams:EChartsOption = {
        params: [{
          chartName: 'transactions_on_chains_btc',
          name:'Transactions',
          color:'#D9D957',
          series:{
            type:'line',
          }
        }],
        yAxis: [
          {
            type: 'value',
            name: '',
            axisLabel: {
              show: true
            },
            splitLine: {
              lineStyle: {
                color: '#343434'
              }
            }
          }
        ],
        grid:{
          left: "68px",
          top: "20px",
          bottom: "80px",
          right: "35px"
        },
        showDataZoom: true,
      }
      setChartOption(chartParams)
      /*
      const { data } = await getDataChart('1666032986125463568')


      const rows = JSON.parse(data.responseData).transactionsList as { transactions: number; timestamp: number; }[]

      const dateXAxis: string[] = []
      const vData: number[] = []
      rows.forEach(({ transactions, timestamp }) => {
        dateXAxis.push(dayjs(timestamp).format('YY/MM'))
        vData.push(transactions)
      })
      const LastTime = dayjs(rows[rows.length - 1].timestamp).format('MMM D')
      const legend = [
        {
            height: '2px',
            name: 'Transactions',
            color:'#D9D957',
            val: intlNumberFormat(vData[vData.length -1]) || '',
            time: LastTime,
        },
      ]
 
      setLegend(legend)
      //const chart = echarts.init(chartDivRef.current!, 'black')
      const option: EChartsOption = {
        color:['#D9D957','#63E6E2','#24A148','#DA1E28','#ED8139','#FB6E77','#FF79C9','#A471E3','#74188B','#41535B','#D4D7D6'],
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
          data: dateXAxis,
          nameTextStyle: {
            color: '#A0A0A0',
            fontWeight: 400,
            fontSize: 10
          },
          axisTick: {
            show: false
          },
          axisLine: {

          },
          axisLabel:{
            showMaxLabel:true
          },
          splitLine: {
            show: false
          }
        },
        yAxis: [
          {
            type: 'value',
            name: '',
            axisLabel: {
              show: true
            },
            splitLine: {
              lineStyle: {
                color: '#3C3C3C'
              }
            }
          }
        ],
        grid: {
          left: "68px",
          top: "20px",
          bottom: "80px",
          right: "28px"
        },
        series: [

          {
            name: 'Transactions',
            showSymbol:false,
            smooth:true,
            type: 'line',
            lineStyle:{
              width:1
            },
            data: vData
          }],
          dataZoom: [
              {
                  type: 'inside',
                  zoomLock: true,
                  start:91,
                  end:100
              },
              {
                type: 'slider',
                height:24,
                backgroundColor:'rgba(174, 174, 174, 0.10)',
                dataBackground :{
                    lineStyle:{
                        color:"#404040"
                    },
                    areaStyle:{
                        color:"#292929"
                    },
                },
                selectedDataBackground:{
                    lineStyle:{
                        color:"#2174FF"
                    },
                    areaStyle:{
                        color:"#2174FF"
                    },
                },
                fillerColor :'rgba(33, 116, 255, .15)',
                borderColor:'transparent',
                handleSize: '100%',
                handleStyle:{
                    color: 'rgba(41, 41, 41, 1)',
                    borderColor :'rgba(64, 64, 64, 1)',
                    borderWidth:2,
                    borderJoin: 'miter',
                    borderMiterLimit :10
                },
                moveHandleSize:0,
                showDetail:false,
            }
          ]
      }
      setOptions(option)
      */
    } else {
      const chartParams:EChartsOption = {
        params: [{
          chartName: 'transactions_on_chains_eth',
          name:'Transactions',
          color:'#D9D957',
          series:{
            type:'line',
          }
        }],
        yAxis: [
          {
            type: 'value',
            name: '',
            axisLabel: {
              show: true
            },
            splitLine: {
              lineStyle: {
                color: '#343434'
              }
            }
          }
        ],
        grid:{
          left: "68px",
          top: "20px",
          bottom: "80px",
          right: "35px"
        },
        showDataZoom: true,
      }
      setChartOption(chartParams)
      /*
      const { data } = await getDataChart('1666032986125463569')
      const rows = JSON.parse(data.responseData).transactionsList as { transactions: number; timestamp: number; }[]

      const dateXAxis: string[] = []
      const vData: number[] = []
      rows.forEach(({ transactions, timestamp }) => {
        dateXAxis.push(dayjs(timestamp).format('YY/MM'))
        vData.push(transactions)
      })
      const LastTime = dayjs(rows[rows.length - 1].timestamp).format('MMM D')
      const legend = [
        {
            height: '2px',
            name: 'Transactions',
            color:'#D9D957',
            val: intlNumberFormat(vData[vData.length -1]) || '',
            time: LastTime,
        },
      ]
 
      setLegend(legend)
      //const chart = echarts.init(chartDivRef.current!, 'black')
      const option: EChartsOption = {
        color:['#D9D957','#63E6E2','#24A148','#DA1E28','#ED8139','#FB6E77','#FF79C9','#A471E3','#74188B','#41535B','#D4D7D6'],
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
          data: dateXAxis,
          nameTextStyle: {
            color: '#A0A0A0',
            fontWeight: 400,
            fontSize: 10
          },
          axisTick: {
            show: false
          },
          axisLine: {

          },
          axisLabel:{
            showMaxLabel:true
          },
          splitLine: {
            show: false
          }
        },
        yAxis: [
          {
            type: 'value',
            name: '',
            axisLabel: {
              show: true
            },
            splitLine: {
              lineStyle: {
                color: '#3C3C3C'
              }
            }
          }
        ],
        grid: {
          left: "68px",
          top: "20px",
          bottom: "80px",
          right: "28px"
        },
        series: [

          {
            name: 'Transactions',
            showSymbol:false,
            smooth:true,
            type: 'line',
            lineStyle:{
              width:1
            },
            data: vData
          }],
          dataZoom: [
              {
                  type: 'inside',
                  zoomLock: true,
                  start:91,
                  end:100
              },
              {
                type: 'slider',
                height:24,
                backgroundColor:'rgba(174, 174, 174, 0.10)',
                dataBackground :{
                    lineStyle:{
                        color:"#404040"
                    },
                    areaStyle:{
                        color:"#292929"
                    },
                },
                selectedDataBackground:{
                    lineStyle:{
                        color:"#2174FF"
                    },
                    areaStyle:{
                        color:"#2174FF"
                    },
                },
                fillerColor :'rgba(33, 116, 255, .15)',
                borderColor:'transparent',
                handleSize: '100%',
                handleStyle:{
                    color: 'rgba(41, 41, 41, 1)',
                    borderColor :'rgba(64, 64, 64, 1)',
                    borderWidth:2,
                    borderJoin: 'miter',
                    borderMiterLimit :10
                },
                moveHandleSize:0,
                showDetail:false,
            }
          ]
      }
      setOptions(option)
      */
    }



  };
  useAsyncEffect(async () => {
    if(status){
    const { data } = await getDataChart('1666032986125463568')
    let init = {
      title:data.name,
      whatisDescription: data.whatisDescription,
      whatisFormula: data.whatisFormula,
      whatisMeaning: data.whatisMeaning
    }
    setInitText(init)
    seTitle(data.name)
    setIntroduce(init)
    /*
    const rows = JSON.parse(data.responseData).transactionsList as { transactions: number; timestamp: number; }[]

    const dateXAxis: string[] = []
    const vData: number[] = []
    rows.forEach(({ transactions, timestamp }) => {
      dateXAxis.push(dayjs(timestamp).format('YY/MM'))
      vData.push(transactions)
    })
    const LastTime = dayjs(rows[rows.length - 1].timestamp).format('MMM D')
      const legend = [
        {
            height: '2px',
            name: 'Transactions',
            color:'#D9D957',
            val: intlNumberFormat(vData[vData.length -1]) || '',
            time: LastTime,
        },
      ]

    setLegend(legend)
    //const chart = echarts.init(chartDivRef.current!, 'black')
    const option: EChartsOption = {
      color:['#D9D957','#63E6E2','#24A148','#DA1E28','#ED8139','#FB6E77','#FF79C9','#A471E3','#74188B','#41535B','#D4D7D6'],
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
            Paramsss += `<i style="margin-right:4px;display:inline-block;width:6px;height:6px;border-radius:50%;font-size:14px;background:${item.color}"></i>${item.seriesName}: ${item.value} <br/>`;
          })
          return Paramsss;
        }
      },
      
      xAxis: {
        type: 'category',
        data: dateXAxis,
        nameTextStyle: {
          color: '#A0A0A0',
          fontWeight: 400,
          fontSize: 10
        },
        axisTick: {
          show: false
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
        splitLine: {
          show: false
        }
      },
      yAxis: [
        {
          type: 'value',
          name: '',
          axisLabel: {
            show: true
          },
          splitLine: {
            lineStyle: {
              color: '#343434'
            }
          }
        }
      ],
      grid: {
        left: "68px",
        top: "20px",
        bottom: "80px",
        right: "28px"
      },
      series: [

        {
          name: 'Transactions',
          type: 'line',
          showSymbol:false,
          smooth:true,
          lineStyle:{
            width:1
          },
          data: vData
        }],
        dataZoom: [
            {
                type: 'inside',
                zoomLock: true,
                start:91,
                end:100
            },
            {
              type: 'slider',
              height:24,
              backgroundColor:'rgba(174, 174, 174, 0.10)',
              dataBackground :{
                  lineStyle:{
                      color:"#404040"
                  },
                  areaStyle:{
                      color:"#292929"
                  },
              },
              selectedDataBackground:{
                  lineStyle:{
                      color:"#2174FF"
                  },
                  areaStyle:{
                      color:"#2174FF"
                  },
              },
              fillerColor :'rgba(33, 116, 255, .15)',
              borderColor:'transparent',
              handleSize: '100%',
              handleStyle:{
                  color: 'rgba(41, 41, 41, 1)',
                  borderColor :'rgba(64, 64, 64, 1)',
                  borderWidth:2,
                  borderJoin: 'miter',
                  borderMiterLimit :10
              },
              moveHandleSize:0,
              showDetail:false,
          }
        ]
    }
    setOptions(option)
    */
  }


  }, [status])

  return (
    <div className='w-full h-block bg-block-color rounded-lg'>
      
      <Chart option={options}  classes={classes || 'w-full h-[390px]'} introduce={introduce} legend={legend} chartSelect={chartSelect} handleChange={handleChange} chartOption={chartOption}/>

    </div>
  )
}

export default ActiveAddress