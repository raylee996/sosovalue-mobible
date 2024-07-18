import React from 'react'
import * as echarts from 'echarts'
import Main from '../markets/Data/Main'

const option = {
    xAxis: {
        type: 'category',
        data: ['2014', '2015', '2016', '2017', '2018', '2019', '2020']
    },
    yAxis: {
        type: 'value'
    },
    series: [
        {
            data: [150, 230, 224, 218, 135, 147, 260],
            showSymbol: false,
            type: 'line'
        }
    ]
}

const Data = () => {
    // const chartDiv = React.useRef<HTMLDivElement>(null)
    // React.useEffect(() => {
    //     const chart = echarts.init(chartDiv.current!, 'black')
    //     chart.setOption(option)
    // }, [])
    return <Main status={true}/>
}

export default Data