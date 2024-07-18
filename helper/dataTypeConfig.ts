import dayjs, { Dayjs } from 'dayjs';

export type FormatData = {
    time: Dayjs;
    value: number
}

// { xxx: [ {time: '1508284800000', value: '696021404.3079604'}] }
type DataType0 = Record<string, Record<string, string>[]>

//{totalMarketCap: 1686950016, totalVolume24H: 0, symbol: 'USD', timestamp: '2013-04-30T00:00:00.000Z'}
type DataType1 = Record<string, any>[]

//[{timestamp: 1517414400, fgi: 30}]
type DataType2 = Record<string, any>[]

//[{date: '2011/02/01', avg: 0.1365, ahr999: 4.441692296429609, value: '0.626'}]
type DataType3 = Record<string, any>[]

// {priceList: [{timestamp: '2010-07-17T08:00:00.000Z', price: 0.049510000000000005}]}
type DataType4 = Record<string, Record<string, any>[]>

// {result: {rows: [{day: "2023-08-21 00:00:00.000 UTC", time: "2023-08-19 00:00:00.000 UTC", xxx: xxx}]}}
type DataType5 = {result: { rows: Record<string, any>[] }}

// { xxx: [ {value: 5.27, time: '1692230400'}] }
type DataType6 = Record<string, Record<string, any>[]>

// { xxx: [{value: 697000, time: '2023-06'}] }
type DataType7 = Record<string, Record<string, any>[]>

// { xxx: [{value: 1, time: '1970-Qtr1'}] }
type DataType8 = Record<string, Record<string, any>[]>

// { xxx: [{value: -1.2, time: '2022'}] }
type DataType9 = Record<string, Record<string, any>[]>

const splitFieldName = (fieldName: string) => {
    const keys = fieldName.split('.')
    return [keys.slice(0, keys.length - 1).join('.'), keys[keys.length - 1]]
}

const createFormatData0 = ({ fieldName, timeName, name }: API.IndicatorTreeData, data: DataType0): FormatData[] => {
    const [keyName, valueKeyName] = splitFieldName(fieldName)
    const [sameKeyName, timeKeyName] = splitFieldName(timeName)
    const finalData = data[keyName] || []
    return finalData.map(item => ({
        time: dayjs(+item[timeKeyName]),
        value: +item[valueKeyName]
    }))
}

const createFormatData1 = ({ fieldName, timeName, name }: API.IndicatorTreeData, data: DataType1): FormatData[] => {
    return data.map(item => ({
        time: dayjs(item[timeName]),
        value: item[fieldName]
    }))
}

const createFormatData2 = ({ fieldName, timeName, name }: API.IndicatorTreeData, data: DataType2): FormatData[] => {
    return data.map(item => ({
        time: dayjs.unix(item[timeName]),
        value: item[fieldName]
    }))
}

const createFormatData3 = ({ fieldName, timeName, name }: API.IndicatorTreeData, data: DataType3): FormatData[] => {
    return data.map(item => ({
        time: dayjs(item[timeName], 'YYYY/MM/DD'),
        value: item[fieldName]
    }))
}

const createFormatData4 = ({ fieldName, timeName, name }: API.IndicatorTreeData, data: DataType4): FormatData[] => {
    const [keyName, valueKeyName] = splitFieldName(fieldName)
    const [sameKeyName, timeKeyName] = splitFieldName(timeName)
    const finalData = data[keyName] || []
    return finalData.map(item => ({
        time: dayjs(item[timeKeyName]),
        value: item[valueKeyName]
    }))
}

const createFormatData5 = ({ fieldName, timeName, name }: API.IndicatorTreeData, data: DataType5): FormatData[] => {
    const finalData = data.result.rows || []
    return finalData.map(item => ({
        time: dayjs(item[timeName].split('.')[0]),
        value: item[fieldName]
    }))
}

const createFormatData6 = ({ fieldName, timeName, name }: API.IndicatorTreeData, data: DataType6): FormatData[] => {
    const [keyName, valueKeyName] = splitFieldName(fieldName)
    const [sameKeyName, timeKeyName] = splitFieldName(timeName)
    const finalData = data[keyName] || []
    return finalData.map(item => ({
        time: dayjs.unix(+item[timeKeyName]),
        value: item[valueKeyName]
    }))
}

const createFormatData7 = ({ fieldName, timeName, name }: API.IndicatorTreeData, data: DataType7): FormatData[] => {
    const [keyName, valueKeyName] = splitFieldName(fieldName)
    const [sameKeyName, timeKeyName] = splitFieldName(timeName)
    const finalData = data[keyName] || []
    return finalData.map(item => ({
        time: dayjs(item[timeKeyName], 'YYYY-MM'),
        value: item[valueKeyName]
    }))
}

const createFormatData8 = ({ fieldName, timeName, name }: API.IndicatorTreeData, data: DataType8): FormatData[] => {
    const [keyName, valueKeyName] = splitFieldName(fieldName)
    const [sameKeyName, timeKeyName] = splitFieldName(timeName)
    const finalData = data[keyName] || []
    const qtrDate = ['01-01', '04-01', '07-01', '10-01']
    return finalData.map(item => {
        const [year, qtr] = item[timeKeyName].split('-')
        const date = qtrDate[(+qtr.replace('Qtr', '')) - 1]
        return {
            time: dayjs(`${year}-${date}`, 'YYYY-MM-DD'),
            value: item[valueKeyName]
        }
    })
}
const createFormatData9 = ({ fieldName, timeName, name }: API.IndicatorTreeData, data: DataType9): FormatData[] => {
    const [keyName, valueKeyName] = splitFieldName(fieldName)
    const [sameKeyName, timeKeyName] = splitFieldName(timeName)
    const finalData = data[keyName] || []
    return finalData.map(item => ({
        time: dayjs(item[timeKeyName], 'YYYY'),
        value: item[valueKeyName]
    }))
}

const dataTypeConfig: Record<number, (indicatorTreeData: API.IndicatorTreeData, data: any) => FormatData[]> = {
    0: createFormatData0,
    1: createFormatData1,
    2: createFormatData2,
    3: createFormatData3,
    4: createFormatData4,
    5: createFormatData5,
    6: createFormatData6,
    7: createFormatData7,
    8: createFormatData8,
    9: createFormatData9,
}

export default dataTypeConfig