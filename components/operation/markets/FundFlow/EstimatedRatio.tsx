import React from 'react'
import * as echarts from 'echarts'
import { getDataChart } from 'http/home'
import { EChartsOption } from 'echarts'
import Chart from "components/base/Charts";
import dayjs from 'dayjs'
type Props = {
  status:boolean,
  classes?: string;
} 
const EstimatedRatio = ({status, classes} : Props) => {
    const [legend,setLegend] =  React.useState<API.legend[]>()
    const [options,setOptions] = React.useState<EChartsOption>({})
    const [introduce, setIntroduce] = React.useState<API.initText>()
    const [initText,setInitText] = React.useState<{whatisDescription:string,whatisFormula:string,whatisMeaning:string}>()
    const [title,seTitle] = React.useState<string>('')
    const chartOption:EChartsOption = {
      params: [{
        chartName: 'ETH_Staking_Ratio_staked_calc',
        name:'Staking',
        color:'#E5E5E5',
        height:'8px',
        series:{
          type: 'bar',
          stack:'Staked',
          barGap:'0%',
          barCategoryGap:'0%',
        }
      },
      {
        chartName: 'ETH_Staking_Ratio_staked_calc_non',
        type:'non',
        name:'Non-Staked',
        color:'#4D67BF',
        height:'8px',
        series:{
          type: 'bar',
          stack:'Staked',
          barGap:'0%',
          barCategoryGap:'0%',
        },
      }],
      grid:{
        left: "40px",
        top: "20px",
        bottom: "35px",
        right: "40px"
      },
      showDataZoom: false,
    }
    const getData2 = async () => {
      const { data } = await getDataChart('1666032986125463560')
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
      let staked: any = []
      let nonStaked: any = []
      let time: any = []
      rows.forEach((item: any,index:number) => {
        if(length && (index > (rows.length - +length)) && index <= rows.length){
          staked.push(Number(item.staking_ratio_raw).toFixed(2))
          nonStaked.push(Number(1-item.staking_ratio_raw).toFixed(2))
          //time.push(item.day.slice(5,10))
          time.push(dayjs(item.day.split('.')[0]).format('MM/DD'))
        }
        //  return item.staking_ratio_raw ? Number(item.staking_ratio_raw).toFixed(2) : 0
      })
      const LastTime = dayjs(rows[rows.length - 1].day.split('.')[0]).format('MMM D')
      // rows.forEach((item: any) => {
      //     return 1-item.staking_ratio_raw ? Number(1-item.staking_ratio_raw).toFixed(2) : 0
      // })
      // rows.forEach((item: any) => {
      //     return item.day.slice(0,7)
      // })
      const legend = [
        {
            height: '8px',
            name: 'Staking',
            color:'#E5E5E5',
            val: staked[staked.length -1] || '',
            time: LastTime,
        },
        {
          height: '8px',
          name: 'Non-Staked',
          color:'#4D67BF',
          val: nonStaked[nonStaked.length -1] || '',
          time: LastTime,
        }
      ]
   
      setLegend(legend)
      const option2:EChartsOption = {
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
              Paramsss += `<i style="margin-right:4px;display:inline-block;width:6px;height:6px;border-radius:50%;font-size:14px;background:${item.color}"></i>${item.seriesName}: ${item.value} <br/>`;
            })
            return Paramsss;
          }
        },
        grid:{
          left: "32px",
          top: "20px",
          bottom: "35px",
          right: "32px"
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            data: time,
            axisLabel:{
              showMaxLabel:true,
              color:'#8F8F8F'
            },
            axisTick: {
              show: false
            },
          }
        ],
        yAxis: [
          {
            type: 'value',
            // splitLine:{
            //   show:false
            // },
            axisLabel: {
              show:true
            },
            splitLine:{
              lineStyle:{
                  color: '#343434'
              }
            }
          }
        ],
        series: [
          {
            name: 'Staked',
            type: 'bar',
            stack:'Staked',
            barGap:'0%',
            barCategoryGap:'0%',
            //areaStyle: {},
            data: staked,
            //showSymbol:false,
            //smooth:true
          },
          {
            name: 'Non-Staked',
            type: 'bar',
            //showSymbol:false,
            //smooth:true,
            stack:'Staked',
            barGap:'0%',
            barCategoryGap:'0%',
            // areaStyle: {},
            data: nonStaked
          },
          
          
        ]
      };
      
      //const chart2 = echarts.init(chartDiv2.current!, 'black')
      setOptions(option2)
      
    }
    React.useEffect(() => {
      if(status){
        getData2()
      }
        
    }, [status])
    return (
      <div className='w-full h-full'>
        <Chart option={options}  classes={classes || 'w-full h-[380px]'} introduce={introduce} legend={legend} chartOption={chartOption}/>
      </div>
    )
}

export default EstimatedRatio