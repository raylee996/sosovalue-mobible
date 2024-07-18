import React from 'react' 
import * as echarts from 'echarts'
import { getDataChart } from 'http/home'
import dayjs from 'dayjs'
import { EChartsOption } from 'echarts'
import Chart from "components/base/Chart";
import { intlNumberFormat } from 'helper/tools'
type Props = {
  status:boolean,
} 
const FundFlow = ({status} : Props) => {
    const [initText,setInitText] = React.useState<{whatisDescription:string,whatisFormula:string,whatisMeaning:string}>()
    const [title,seTitle] = React.useState<string>('')
    const [legend,setLegend] =  React.useState<API.legend[]>()
    const [options,setOptions] = React.useState<EChartsOption>({})
    const [introduce, setIntroduce] = React.useState<API.initText>()
    const getData = async () => {
        const { data } = await getDataChart('1666032986125463570')
        let length = data.initFixedScale
        const rows = JSON.parse(data.responseData).exchangesList
        const rows1 = JSON.parse(data.responseData).priceList
        let init = {
          title:data.name,
          whatisDescription: data.whatisDescription,
          whatisFormula: data.whatisFormula,
          whatisMeaning: data.whatisMeaning
        }
        setInitText(init)
        seTitle(data.name)
        setIntroduce(init)
        let time: any = []
        let tList: any = []
        let pList: any = []
        
        // rows1.sort((a: any, b: any) => a.timestamp.localeCompare(b.timestamp))
        // rows.sort((a: any, b: any) => a.timestamp.localeCompare(b.timestamp))
        rows1.forEach((item: any,index:number) => {
          if(length && (index > (rows1.length - +length)) && index <= rows1.length){
            time.push(dayjs(item.timestamp).format('YY/MM'))
            pList.push(item.price.toFixed(2))
          }
        })
        rows.forEach((item: any,index:number) => {
          if(length && (index > (rows.length - +length)) && index <= rows.length){
            tList.push(item.exchanges.toFixed(2))
            
          }
          
        })
        const LastTime = dayjs(rows1[rows1.length - 1].timestamp).format('MMM D')
        // time.map((item:any,index:number)=> {
        //   if(index < (time.length - rows.length)){
        //     tList.unshift(0) 
        //   }
        // })
        const legend = [
          {
              height: '2px',
              name: 'Exchange Net Flow Volume',
              color:'#E5E5E5',
              val: intlNumberFormat(tList[tList.length -1]) || '',
              time: LastTime,
          },
          {
              height: '2px',
              name: 'Price',
              color:'#4D67BF',
              val: intlNumberFormat(pList[pList.length -1]) || '',
              time: LastTime,
          }
        ]
     
        setLegend(legend)
        
        
        
        const option:EChartsOption = {
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
                axisTick: {
                  show: false
                },
                axisLabel:{
                  showMaxLabel:true,
                  color:'#8F8F8F'
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
                    show:true,
                  },
                  splitLine:{
                    show:false
                  }
                },
               
              ],
              grid:{
                left: "55px",
                top: "20px",
                bottom: "30px",
                right: "25px"
            },
              series: [
                {
                  name: 'Exchange Net Flow Volume',
                  type: 'line',
                  smooth:true,
                  showSymbol:false,
                  lineStyle:{
                    width:1
                  },
                  //yAxisIndex: 1,
                  // tooltip: {
                  //   valueFormatter: function (value:number) {
                  //     return value;
                  //   }
                  // },
                  data: tList
                },
                {
                  name: 'Price',
                  type: 'line',
                  showSymbol: false,
                  smooth:true,
                  lineStyle:{
                    width:1
                  },
                  //yAxisIndex: 1,
                  // tooltip: {
                  //   valueFormatter: function (value:number) {
                  //     return value;
                  //   }
                  // },
                  data: pList
              },
             
            ]
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
          <Chart option={options} classes='w-full h-[380px]' introduce={introduce} legend={legend} />
      </div>
    )
}

export default FundFlow