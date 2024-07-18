import React,{useRef} from "react"
import { Button, LinearProgress, TextField } from '@mui/material';
import Paper from '@mui/material/Paper';
import Image from "next/image";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MenuList from 'components/base/Menu'
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import Search from "components/operation/SelectToken"
import {sourcePlat} from 'http/home'
import dayjs, { Dayjs } from 'dayjs';
import DateRangePicker from 'components/base/DateRangePicker';
import useNotistack from 'hooks/useNotistack';
import { config } from "process";
import Autocomplete from 'components/base/Autocomplete'
import InputAdornment from '@mui/material/InputAdornment';
import {  globalSearch } from 'http/home';
import useLoading from "hooks/useLoading"
type Props = {
    cryptoes:API.SearchCrypto[],
    selectToken?:API.SearchCrypto,
    search:any,
    source:string[],
    credibility:string,
    sector:any,
    filter:any,
    sourceConfig:any,
    sectorConfig:any,
    dateRange: any,
    dateRangeChange:(val:any) => any,
    getFilterItem:(val:any) => any,
    changeFilter:(val:any) => any,
    changeToken:(val:any) => any,
    changeSearch:(val:any) => any,
    sectorChange:(val:any) => any,
    changeCredibility:(val:any) => any,
    changeSource:(val:any) => any,
    changeTime:(startTime:any,endTime:any) => any,
} 

const credibilityList = ['All Feeds','Important','Official']
const dateRangeList = [
    {
        startTime:'',
        endTime:'',
        value:'All'
    },
    {
        startTime:dayjs(dayjs(new Date()).format('YYYY-MM-DD')).unix()* 1000 - 365 * 24 * 60 * 60 * 1000,
        endTime:dayjs(new Date()).unix()* 1000,
        value:'1Y'
    },
    {
        startTime:dayjs(dayjs(new Date()).format('YYYY-MM-DD')).unix()* 1000 - 90 * 24 * 60 * 60 * 1000,
        endTime:dayjs(new Date()).unix()* 1000,
        value:'90D'
    },
    {
        startTime:dayjs(dayjs(new Date()).format('YYYY-MM-DD')).unix()* 1000 - 30 * 24 * 60 * 60 * 1000,
        endTime:dayjs(new Date()).unix()* 1000,
        value:'30D'
    },
    {
        startTime:dayjs(dayjs(new Date()).format('YYYY-MM-DD')).unix()* 1000 - 7 * 24 * 60 * 60 * 1000,
        endTime:dayjs(new Date()).unix()* 1000,
        value:'7D'
    },
    {
        startTime:dayjs(dayjs(new Date())).unix()* 1000 - 24 * 60 * 60 * 1000,
        endTime:dayjs(new Date()).unix()* 1000,
        value:'24H'
    },
    
    
    
    
]
const CalendarBlock = ({source,sector,search, dateRange,dateRangeChange,filter,sourceConfig,sectorConfig,changeSource,sectorChange,getFilterItem,changeFilter,changeTime,selectToken,credibility,changeToken,changeSearch,changeCredibility}:Props) => {
    const { error, success } = useNotistack()
    const [sourceNum, setSourceNum] = React.useState<any>()
    const [all,setAll] = React.useState<number>()
    const [title, setTitle] = React.useState<string>('')
    const [close,setClose] = React.useState<boolean>(false)
    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
    const open = Boolean(anchorEl);
    // const [dateRange, setDateRange] = React.useState<Dayjs[]>([])
    const [contentEditable, setContentEditable] = React.useState<boolean>(false)
    const [filterList, setFilterList]= React.useState<string[]>([])
    const [showFilter, setShowFilter] = React.useState<boolean>(false)
    const [checked, setChecked] = React.useState<string[]>([]);
    const [sourceText, setSourceText] = React.useState<string[]>([])
    const [sourceFilterText, setFilterSourceText] = React.useState<string>('')
    const [cryptoes, setCryptoes] = React.useState<API.SearchCrypto[]>([])
    const Loading = useLoading()
    const [sectorList, setSectorList] = React.useState<any>([])
    const [cryptoesParams,setCryptoesParams] = React.useState<API.SearchCrypto>()
    const [platformCurrencyMap, setPlatformCurrencyMap] = React.useState<Record<string, ReadonlyArray<API.PlatformCurrency>>>({})
    const [filterText, setFilterText] = React.useState<string>('')
    const inputRef = useRef<HTMLInputElement>(null)
    const [dateRangeText, setDateRangeText] = React.useState<string>('All')
    const [changeName, setChangeName] = React.useState<boolean[]>([false,false,false,false,false])
    const [currentFilterText, setCurrentFilterText] = React.useState<string>('')
    const [filterIndex,setFilterIndex] = React.useState<number>()
    // const dateRangeNode = React.useMemo(() => {
    //     if (dateRange.length) {
    //       const [startDate, endDate] = dateRange
    //       const str = startDate.format('MMMM DD, YYYY') + ' - ' + endDate.format('MMMM DD, YYYY')
    //       return <Button onClick={() => setDateRange([])} className='text-xs text-[#8F8F8F] capitalize' endIcon={<Image src='/img/svg/X.svg' width={20} height={20} alt='' />}>{str}</Button>
    //     }
    //   }, [dateRange])
    // const dateRangeChange = (dateRange: Dayjs[]) => {
    //     const [startDate, endDate] = dateRange
    //     changeTime(startDate.unix() * 1000,endDate.unix() * 1000)
    //     setDateRange(dateRange)
    // }
    const changeInput = (event:React.ChangeEvent<HTMLInputElement>) => {
        event.stopPropagation()
        event.preventDefault()
        setChangeName([false,false,false,false,false])
        setFilterIndex(6) 
        setShowFilter(true)
        changeSearch(event?.target.value)
    }
    const clickCredibility = (item:string) => {
        
        setChangeName([false,false,false,false,false])
        setFilterIndex(6)
        setShowFilter(true)
        changeCredibility(item)
    }
    const changeCheck = (event:React.ChangeEvent<HTMLInputElement>,label:string) => {
        event.stopPropagation()
        event.preventDefault()
        let sourceList = [...source]
        let sourceLabel = [...sourceText]
        let checkedList = [...checked]
        if(sourceLabel.indexOf(label) == -1){
            sourceLabel.push(label)
        }else{
            sourceLabel.splice(sourceLabel.indexOf(label), 1)
        }
        if(sourceList.indexOf(event?.target.value) == -1){
            sourceList.push(event?.target.value)
        }else{
            sourceList.splice(sourceList.indexOf(event?.target.value), 1)
        }
        if(checkedList.indexOf(event?.target.value) == -1){
            checkedList.push(event?.target.value)
        }else{
            checkedList.splice(checkedList.indexOf(event?.target.value), 1)
        }
        if(sourceList.length == 0){
            changeSource(['0'])
        }else{
            changeSource(sourceList)
        }
        setSourceText(sourceLabel)
        setChecked(checkedList)
        if(sourceLabel.length > 0){
            setFilterSourceText('From ' + sourceLabel.join(' & '))
        }else{
            setFilterSourceText('')
        }
        setShowFilter(true)
        
        setChangeName([false,false,false,false,false])
        setFilterIndex(6)
        
    }
    const getSourceNum = async () => {
        // const res = await sourcePlat({useType:1,pageSize:1,weight:0.1})
        // const allNum = Object.values(res.data).reduce((a,b) => +a +  +b)
        // setAll(allNum)
        // setSourceNum(res.data)
    }
    const saveFilter = () => {
        // let selectTokenText =  selectToken ? selectToken.name.toUpperCase() + ',' : ''
        // let searchText =  search ? search + ',' : ''
        // let credibilityText =  credibility ? credibility + ',' : ''
        // let dateRangeText =  dateRange.startTime && dateRange.endTime && ',' + dayjs(dateRange.startTime).format('YYYY-MM-DD') + ' ~ ' + dayjs(dateRange.endTime).format('YYYY-MM-DD')
        // if(!selectToken && !sector && sourceText.length ==0) return false
        //let change = false
        let filterList = filter &&  JSON.parse(filter) 
        if(filterList.length > 4){
            error('Only up to 5 filter conditions can be saved')
            return false
        } 
        // filterList.map(item => {
        //     if(selectToken)
        // })
        let fl = filterList ? [...filterList] : []
        fl.push({
            selectToken,
            search,
            credibility,
            sourceText,
            dateRange,
            title:''
        })
        changeFilter(fl)
        //console.log(JSON.parse(filter))
        //setShowFilter(false)
        success('success')
    }
    const deleteItem = (item:any,index:number) => {
        event?.stopPropagation()
        let filterList = filter &&  JSON.parse(filter) 
        
        let fl = filterList ? [...filterList] : []
        fl.splice(index, 1)
        changeFilter(fl)
    }
    const filterNews = (item:any,index=0,title='') => {
        let sourceList:any = []
        sourceConfig.map((i:any) => {
            item.sourceText.forEach((items:string) => {
                if(items === i.label){
                    sourceList.push(i.value)
                }
            });
        })
        
        setChecked(sourceList)
        setFilterSourceText('From ' + item.sourceText.join(' & '))
        getFilterItem(item)
        setFilterIndex(index)
        setContentEditable(false)
       
    }
    const resetFilter = () => {
        //changeFilter('')
        const sourceList = sourceConfig.map((item:any) => item.value)
        changeToken(null)
        changeSearch('')
        
        changeCredibility('All Feeds')
        dateChange({
            startTime:'',
            endTime:'',
            value:'All'
        })
        changeSource(sourceList)
        setShowFilter(false)
    }
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        event.stopPropagation()
        event.preventDefault()
        setChangeName([false,false,false,false,false])
        setFilterIndex(6)
        setShowFilter(true)
        if(event.target.checked){
            const sourceList = sourceConfig.map((item:any) => item.value)
            const sourceLabel = sourceConfig.map((item:any) => item.label)
            setChecked(sourceConfig.map((item:any) => item.value))
            changeSource(sourceList)
            setSourceText(sourceLabel)
            if(sourceLabel.length > 0){
                setFilterSourceText('From ' + sourceLabel.join(' & '))
            }else{
                setFilterSourceText('')
            }
        }else{
            //error('One must be selected')
            setChecked([])
            changeSource(['0'])
            setSourceText([])
            setFilterSourceText('')
        } 
       
    };

   
    const children = (
        <Box sx={{ display: 'flex', flexDirection: 'column', ml: 0 }}>
        {
            sourceConfig.map((item:any, index:number) => {
                return (
                    <div key={index}  className="flex items-center">
                        <FormControlLabel 
                        control={<Checkbox checked={checked.indexOf(item.value) != -1} value={item.value} onChange={(e) => changeCheck(e,item.label)} classes={{'checked': 'text-[#FF4F20]'}} className="text-[#8F8F8F] font-normal"/>}   
                        label={item.label} 
                        classes={{"label":'text-[#F4F4F4] font-bold text-[13px]'}} />
                        <span className="text-[#8F8F8F] font-bold text-xs">
                            {sourceNum && Reflect.has(sourceNum,item.value)  ? sourceNum[item.value] : '0'} 
                        </span>
                    </div>
                )
            })
        }
        </Box>
    );
    
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const dateChange = async (item: any) => {
        
        setChangeName([false,false,false,false,false])
        setShowFilter(true)
        setFilterIndex(6)
        setDateRangeText(item.value)
        dateRangeChange(item)
        handleClose()
    }
    const changeFilterName = (item:any,index:number) => {
        let currentNameList = [false,false,false,false,false]
        currentNameList[index] = true
        setChangeName(currentNameList)
        setTitle(item.title)
        
    }
    React.useEffect( () => {
        
        globalSearch({ category: ['crypto', 'pairs'], pageNum: 1, pageSize: 1000 }).then(res => { 
            setCryptoes(res.data.crypto?.list || [])
        })
        getSourceNum()
    },[])
    React.useEffect(() => {
        let sourceLabel:any = []
        sourceConfig.map((item:any) => {
            source.map((items:any) => {
                if(items == item.value) sourceLabel.push(item.label)
            })
        })
        setSourceText(sourceLabel)
        if(sourceLabel.length > 0){
            setFilterSourceText('From ' + sourceLabel.join(' & '))
        }else{
            setFilterSourceText('')
        }
        setChecked(source)
    },[source])
    React.useEffect(() => {
        setSectorList([])
        let sectorList:any = []
        sectorConfig.map((item:any) => {
            if(search && item.label.toUpperCase().indexOf(search?.toUpperCase()) != -1) sectorList.push(item)
        })
        setSectorList(sectorList)
    },[search])
    React.useEffect(() => {
        // console.log(selectToken)
        // console.log(source.length)
        // console.log(search)
        // console.log(credibility)
        // console.log(dateRange.value)
        let selectTokenText =  selectToken ? selectToken.name.toUpperCase() + ',' : ''
        let searchText =  search ? search + ',' : ''
        let credibilityText =  credibility ? credibility + ',' : ''
        let dateRangeText =  dateRange.startTime && dateRange.endTime && ',' + dayjs(dateRange.startTime).format('YYYY-MM-DD') + ' ~ ' + dayjs(dateRange.endTime).format('YYYY-MM-DD')
       setFilterText(selectTokenText + searchText + credibilityText + sourceFilterText + dateRangeText)
    },[selectToken,search,sourceFilterText,credibility,dateRange])
    React.useEffect( () => {
        cryptoes.length > 0 && sourceConfig.length > 0 && sectorConfig.length > 0 && Loading.close()
    },[cryptoes,sourceConfig,sectorConfig])
    
    return (
        <Loading.Component>
        <div className="h-full flex flex-col items-stretch">
            <div className="flex justify-between items-center h-9">
                <div className="text-[#FFFFFF] text-base font-bold">Filter {( selectToken != null || source.length !== 5 ||  (search !==undefined && search !=='') || credibility !== 'All Feeds' || dateRange.value !== 'All') &&  <span className="text-xs text-[#FF4F20] ml-3 font-normal cursor-pointer" onClick={resetFilter}>Reset</span>}</div>
                {(selectToken != null || source.length !== 5 ||  (search !==undefined && search !=='') || credibility !== 'All Feeds' || dateRange.value !== 'All') && <div className="text-[#C2C2C2] text-xs font-bold cursor-pointer" onClick={saveFilter}><Image src='/img/svg/FloppyDisk.svg' className='align-middle mr-1' alt="" width={20} height={20}/>Save Filter </div>}
            </div>
             <div className="border-0 border-b border-solid border-[#242424] pb-3 pt-1 ">
                {
                    
                    filter && JSON.parse(filter).map((item:any,index:number) => {
                        return (
                            <div className="mt-2 flex" key={index}>
                                <div onClick={() => filterNews(item,index)} className={`${filterIndex === index ? 'bg-[#FF4F20]/[.15] border border-solid border-[#FF4F20]' : ''} group cursor-pointer bg-[#2F2F2F]  py-1 rounded text-[#C2C2C2] text-xs relative w-full`} onDoubleClick={() => changeFilterName(item,index)} >
                                    <div className="px-2 py-1 hidden group-hover:block text-xs text-[#F4F4F4] bg-[#1A1A1A] rounded absolute left-2/4 -top-7 -ml-[89px] h-6 w-[178px] shadow-[0_0_3px_0_rgba(255,255,255,0.1)_inset,0_0px_3px_0_rgba(0,0,0,0.55),0_8px_40px_0_rgba(0,0,0,0.25)]">Double click to rename</div>
                                    { !changeName[index] && !item.title && <div className="pl-2 py-1 pr-7 "> {item.selectToken ? item.selectToken.name.toUpperCase() + ',' : ''}
                                    {item.search ? item.search + ',' : ''} 
                                    {item.credibility ? item.credibility + ',' : ''}
                                    {item.sourceText.length > 0 ? 'From ' + item.sourceText.join(' & ') : ''} 
                                    {item.dateRange.startTime && item.dateRange.endTime && ',' + dayjs(item.dateRange.startTime).format('YYYY-MM-DD') + ' ~ ' + dayjs(item.dateRange.endTime).format('YYYY-MM-DD')}
                                    <Image src='/img/svg/deleteFilter.svg' onClick={() => deleteItem(item,index)} className='align-top ml-2 opacity-30 cursor-pointer absolute right-0 h-full top-0 w-6 px-1' alt="" width={16} height={16}/></div>
                                    }
                                    { !changeName[index] && item.title && <div className="pl-2 py-1 pr-7 text-xs"> {item.title} <Image src='/img/svg/deleteFilter.svg' onClick={() => deleteItem(item,index)} className='align-top ml-2 opacity-30 cursor-pointer absolute right-0 h-full top-0 w-6 px-1' alt="" width={16} height={16}/></div>
                                    }
                                    { changeName[index] && 
                                    <>
                                        <TextField
                                        fullWidth
                                        multiline
                                        onKeyDown={(event:any) => {
                                            if (event.keyCode === 13) {
                                                event.stopPropagation()
                                                event.preventDefault()
                                                setFilterIndex(6) 
                                                                                            
                                                let changNameList = [false,false,false,false,false]
                                                let fl:any = JSON.parse(filter)                                             
                                                fl.splice(index,1,{
                                                    selectToken,
                                                    search,
                                                    credibility,
                                                    sourceText,
                                                    dateRange,
                                                    title:event.target.value
                                                })
                                                changeFilter(fl)
                                                setTitle('')
                                                // changNameList[index] = true
                                                setChangeName(changNameList)
                                            }
                                        }}
                                        inputProps={{
                                            maxLength:100
                                        }}
                                        value={title}
                                        onInput={(e:any) => setTitle(e.target.value)}
                                        className="w-full"
                                        InputProps={{
                                            className: 'border-0 w-full pl-2 py-1 pr-14 text-[#C2C2C2] text-xs',
                                            classes: { notchedOutline: 'border-none', input: 'hide-scrollbar' },
                                            endAdornment: (
                                                <InputAdornment position="start">
                                                    <Image src='/img/svg/deleteFilter.svg' onClick={(e) => {
                                                        e.stopPropagation()
                                                        e.preventDefault()
                                                        setFilterIndex(6) 
                                                        setChangeName([false,false,false,false,false])}
                                                    } className='align-top bg-transparent ml-2 opacity-30 cursor-pointer absolute right-0 h-full top-0 w-6 px-1' alt="" width={16} height={16}/>
                                                </InputAdornment>
                                            )
                                        }}
                                        
                                        placeholder='' autoComplete='on'
                                        />
                                        <div className="absolute right-7 cursor-pointer top-0 text-[#FF4F20] text-xs h-full flex items-center" onClick={(event) => {
                                            event.stopPropagation()
                                            event.preventDefault()
                                            setFilterIndex(6) 
                                                                                        
                                            let changNameList = [false,false,false,false,false]
                                            let fl:any = JSON.parse(filter)                                             
                                            fl.splice(index,1,{
                                                selectToken,
                                                search,
                                                credibility,
                                                sourceText,
                                                dateRange,
                                                title:title
                                            })
                                            changeFilter(fl)
                                            setTitle('')
                                            // changNameList[index] = true
                                            setChangeName(changNameList)
                                        }}>Done</div>
                                        </>
                                        // <Image src='/img/svg/deleteFilter.svg' onClick={() => deleteItem(item,index)} className='align-top ml-2 opacity-30 cursor-pointer absolute right-0 h-full top-0 w-6 px-1' alt="" width={16} height={16}/>
                                    
                                    }
                                </div>
                            </div>
                        )
                    })
                }
                {/* {
                    (showFilter) && (
                    <div className="mt-2 flex">
                        <div className="bg-[#2F2F2F] px-2 py-1 rounded text-[#C2C2C2] text-xs"> {filterText} </div>
                    </div>
                    )
                } */}
                
            </div>
            
            {/* <div>
            <Autocomplete<API.PlatformCurrency>   fullWidth
                isOptionEqualToValue={(option, value) => option.id === value.id}
                onChange={async (event, option) => {
                    // let symbolDoROS = null
                    // if(option?.name && option?.platformId) symbolDoROS = await getCoinSymbol(option?.name.toUpperCase(),option?.platformId)
                    // let platformCurrencyDoROS = symbolDoROS ? { ...option,symbolDoROS,symbolDoVOS:symbolDoROS} : option
                    // setFieldValue(`platformCurrencyDoROS.${index}`, platformCurrencyDoROS)
                }}
                filterOptions={(options, state) => {
                    const value = state.inputValue.toLowerCase()
                    return state.inputValue ? options.filter(option => option.name.toLowerCase().includes(value) || option.fullName?.toLowerCase().includes(value)) : []
                }} 
                renderOption={(props, option, state) => {
                    return <li {...props} key={option.id} className='flex items-center justify-between h-full px-4 cursor-pointer hover:bg-gray-200'>
                        <span>
                            <Chip component='span' className='bg-[#D0E2FF]' label={option.fullName} size='small' />
                            <Chip component='span' className='bg-[#9EF0F0] ml-2' label={option.name} size='small' />
                            {option.platformAlias && <Chip component='span' className='bg-[#A7F0BA] ml-2' label={option.platformAlias} size='small' />}
                        </span>
                        {state.selected && <CheckRoundedIcon/>}
                    </li>
                }}
                options={platformCurrencyMap[id] || []} getOptionLabel={option => option.name || ''}
                renderInput={(params) => <TextField {...params} label="" />}
                label={name} size="small" />
            </div> */}
            <div className="py-3">
                <div className="text-sm text-[#F4F4F4] font-bold mb-3">
                    Select Token
                </div>
                <div className="relative">
                    <Autocomplete 
                        fullWidth
                        value={selectToken}
                        isOptionEqualToValue={(option, value) => option?.name.toUpperCase() === value?.name.toUpperCase()}
                        classes={{input:'text-white text-xs',noOptions:'bg-[#0D0D0D] shadow-[0_0_8px_0_rgba(0,0,0,0.36)] text-sm text-[#C2C2C2]'}}
                        sx={{'& .MuiOutlinedInput-notchedOutline': {border: '0'}}}
                        onChange={(event, option:any) => {
                            event.stopPropagation()
                            event.preventDefault()
                            setFilterIndex(6) 
                            setCryptoesParams(option || null)
                            changeToken(option || null)
                            setShowFilter(true)
                            
                        }}
                        onBlur={() =>setClose(false)}
                        onFocus={(event) =>{
                            event.stopPropagation()
                            event.preventDefault()
                            setFilterIndex(6) 
                            setChangeName([false,false,false,false,false])
                            setClose(true)
                        }}
                        // filterOptions={(options, state) => {
                        //     const value = state.inputValue.toLowerCase()
                        //     return state.inputValue ? options.filter(option => option.name.toLowerCase().includes(value) || option.fullName?.toLowerCase().includes(value)) : []
                        // }} 
                        renderOption={(props, option, state) => {

                            return <li {...props} key={option.id} className='flex items-center p-2 mx-2 cursor-pointer hover:bg-[#6A6A6A]/[.16]'>
                                <Image src={option.iconUrl ? option.iconUrl : '/img/svg/CoinVertical.svg'} width={20} height={20} className="mr-4" alt='' />
                                <span className="text-sm text-[#C2C2C2] mr-4">{option?.name.toUpperCase()}</span>
                                    {/* <Chip component='span' className='bg-[#9EF0F0] ml-2' label={option.name} size='small' />
                                    <Chip component='span' className='bg-[#D0E2FF]' label={option.fullName} size='small' /> */}
                                <span className="text-xs text-[#8F8F8F]">{option?.fullName}</span>
                            </li>
                        }}
                        clearIcon={<Image src='/img/svg/deleteFilter.svg' width={18} height={18} alt='' />}
                        popupIcon={<Image src='/img/svg/CaretDown.svg' width={18} height={18} alt='' />}
                        options={cryptoes || []} getOptionLabel={option => option?.name.toUpperCase() || ''}
                        renderInput={(params) => <TextField placeholder="e.g. BTC, ETH (optional)" {...params} label="" className="border border-solid border-[#404040] rounded relative z-10 bg-transparent"/>}
                        label='111' size="small"
                    />
                    {/* {
                        close && <div className="w-[20px] cursor-pointer h-9 absolute right-1 top-0 z-10 flex items-center" onClick={() => {
                            changeToken(null)
                            setShowFilter(false)
                            setClose(false)
                        }} >
                            <div className="w-[20px] cursor-pointer h-9 absolute right-1 top-0 flex items-center" 
                           >
                            <Image src='/img/svg/deleteFilter.svg' width={14} height={14} className="mr-1 " alt='' />
                            </div>
                        </div>
                    }
                    {
                        !close && <Image src='/img/svg/CaretDown.svg' width={14} height={14} className="mr-1 absolute right-1 top-3" alt='' />
                    } */}
                </div>
                {/* <div className='text-[#E5E5E5] w-full relative flex items-center justify-between'>
                    <Button onClick={handleClick} className='bg-[#2B2B2B] border border-solid border-[#404040] flex items-center justify-between px-2 w-full h-[34px] text-xs text-[#8F8F8F]' endIcon={<Image src='/img/svg/CaretDown.svg' width={16} height={16} className="mr-1" alt='' />}>{coin}</Button>
                    <Menu
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        classes={{
                        paper: 'w-[442px] absolute left-0 top-0 rounded-lg bg-[#333333] shadow-[0_0_2px_0_rgba(0,0,0,0.24),0_8px_16px_0_rgba(0,0,0,0.28)]',
                        list: 'py-0'
                        }}
                    > 
                        <MenuItem className='font-bold text-sm text-[#C6C6C6]' onClick={() => handleChange('BTC')}>BTC</MenuItem>
                        <MenuItem className='font-bold text-sm text-[#C6C6C6]' onClick={() => handleChange('ETH')}>ETH</MenuItem>
                    </Menu>
                </div> */}
                {/* <div className="mb-1 bg-[#2B2B2B] border border-solid border-[#404040] rounded ">
                    <MenuList cryptoes={cryptoes}/> <Search selectToken={selectToken} changeToken={changeToken}/>
                </div> */}
            </div>
             {/*<div className="py-3">
               
                <div className="text-[13px] text-[#FF4F20] font-bold mb-3">
                    Search Keyword
                </div>
                 <div className="relative">
                    <Autocomplete 
                        fullWidth
                        value={search}
                        isOptionEqualToValue={(option, value) => option.label === value.label}
                        classes={{input:'text-[#8F8F8F] text-xs',noOptions:'bg-[#0D0D0D] shadow-[0_0_8px_0_rgba(0,0,0,0.36)] text-sm text-[#C2C2C2]'}}
                        onChange={(event, option:any) => {
                            setCryptoesParams(option || null)
                            changeToken(option)
                            sectorChange(option)
                        }}
                        onBlur={(event:any) => {
                            console.log(event.target?.value)
                        }}
                        onChange={(event:any) => changeInput(event)}
                        onBlur={(event:any) => changeInput(event)}
                        renderOption={(props, option:any, state) => {
                            return <li {...props} key={option.value} className='flex items-center p-2 mx-2 cursor-pointer hover:bg-[#6A6A6A]/[.16]'>
                                <span className="text-sm text-[#C2C2C2] mr-4">{option.label}</span>
                            </li>
                        }}
                        options={sectorConfig || []} getOptionLabel={(option:any) => option?.label || ''}
                        renderInput={(params) => <TextField {...params} label="" className="border border-solid border-[#404040] rounded" />}
                        label='111' size="small"
                    />
                    <Image src='/img/svg/CaretDown.svg' width={18} height={18} className="mr-1 absolute right-1 top-2" alt='' />
                </div>
            </div> */}
            <div className="py-3 border-0">
                <div className="text-sm text-[#F4F4F4] font-bold mb-3">
                    Search Keyword
                </div>
                <div className="mb-1 relative">
                    <Paper
                    component="form"
                    sx={{ p: '0 4px 0 15px', display: 'flex', alignItems: 'center', height: 34, margin: '0 0px 0 0px', background: 'transparent', border: '1px solid #404040' }}
                    >
                        {
                            <InputBase
                            sx={{ ml: 0, flex: 1, color: '#fff', fontSize: '12px', width: '80px' }}
                            placeholder="e.g. DeFi, DAO (optional)"
                            value={search ? search : ''}
                            inputProps={{ 'aria-label': 'Search' }}
                            onInput={changeInput}
                            onBlur={(event:any) => changeInput(event)}
                            onFocus={(event) => {
                                event.stopPropagation()
                                event.preventDefault()
                                setChangeName([false,false,false,false,false])
                                setFilterIndex(6) 
                            }}
                            onKeyDown={(event:any) => {
                                if (event.keyCode === 13) {
                                    
                                    changeInput(event)
                                }
                            }}
                        />
                        }
                        <IconButton type="button" sx={{ p: '0px' }} aria-label="search">
                            <SearchIcon sx={{ fontSize: '18px', m: '0px 0px 0 8px', color: '#8D8D8D' }} />
                        </IconButton>
                    </Paper>
                    {
                        search && sectorList && search != sectorList[0]?.label  &&
                        <div className="absolute left-0 top-11 z-10 w-full p-2 rounded-lg bg-[#0D0D0D] shadow-[0_0_8px_0_rgba(0,0,0,0.36)]">
                        {
                            sectorList.map((item:any) => {
                                return (
                                    <div key={item.label} className="p-2 text-[#C2C2C2] font-bold hover:bg-[#6A6A6A]/[.16] cursor-pointer text-sm" onClick={() => {
                                        changeSearch(item.label)
                                    }}>
                                       #{item.label}
                                    </div>
                                )
                            })
                        }
                    </div>
                    }
                </div>
            </div>
            <div className="py-3 border-0">
                <div className="text-sm text-[#F4F4F4] font-bold mb-3">
                    Credibility
                </div>
                <div className="flex items-center justify-between bg-[#6A6A6A]/[.16]">
                    {
                        credibilityList.map(item => {
                            return (
                                <div key={item} className={`flex-1 cursor-pointer ${item === credibility ? 'bg-[#6A6A6A]/[.16] #00000005 rounded font-bold border border-solid border-[#000000]/[.02] shadow-[0_1_0.75px_0_rgba(0,0,0,0.05),0_0.25px_0.25px_0_rgba(0,0,0,0.15)]' : '' } text-xs text-[#FFFFFF] py-2 text-center`} onClick={() => clickCredibility(item)}>{item}</div>
                            )
                        })
                    }
                </div>
            </div>
            <div className="py-3 border-0">
                <div className="text-sm text-[#F4F4F4] font-bold pt-1">
                    Source
                </div>
                <div>
                    <FormControlLabel
                        label="All"
                        classes={{"label":'text-[#F4F4F4] font-bold text-[13px]'}}
                        control={
                        <Checkbox
                            checked={checked.length == sourceConfig.length}
                            indeterminate={checked.length < sourceConfig.length && checked[0] != '0'}
                            onChange={handleChange}
                            classes={{'checked': 'text-[#FF4F20]'}} className="text-[#8F8F8F] font-normal"
                        />
                        }
                    />
                    <span className="text-[#8F8F8F] font-bold text-xs">
                        {all}
                    </span>
                    {children}
                </div>
                {/* <div className="flex items-center justify-between pb-1">
                    <FormGroup>
                        <div className="flex items-center">
                            <FormControlLabel control={<Checkbox classes={{'checked': 'text-[#FF4F20]'}} className="text-[#8F8F8F] font-normal"/>} label="All" classes={{"label":'text-[#F4F4F4] font-bold text-[13px]'}} /><span className="text-[#8F8F8F] font-bold text-xs">{all}</span>
                        </div>
                        {
                            sourceConfig.map((item:any, index:number) => {
                                return (
                                    <div key={index}  className="flex items-center">
                                        <FormControlLabel control={<Checkbox onChange={(e) => changeCheck(e,item.label)} classes={{'checked': 'text-[#FF4F20]'}} value={item.value} className="text-[#8F8F8F] font-normal"/>}   label={item.value} classes={{"label":'text-[#F4F4F4] font-bold text-[13px]'}} /><span className="text-[#8F8F8F] font-bold text-xs">{sourceNum && Reflect.has(sourceNum,item.value)  ? sourceNum[item.value] : '0'}</span>
                                    </div>
                                )
                            })
                        }
                    </FormGroup>
                </div> */}
            </div>
            {/* <div className="py-4 flex items-center justify-between">
                <div className="text-[13px] text-[#FF4F20] font-bold">
                    Period
                </div>
                <div className="">
                    <div className='text-[#E5E5E5] w-full relative flex items-center justify-between'>
                    <Button onClick={handleClick} className='capitalize border-0 flex items-center justify-between px-2 w-full h-[34px] text-xs text-[#8F8F8F]' endIcon={<Image src='/img/svg/CaretDown.svg' width={16} height={16} className="mr-1" alt='' />}>{dateRange.value}</Button>
                    <Menu
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        classes={{
                        paper: 'w-[442px] absolute left-0 top-0 rounded-lg bg-[#333333] shadow-[0_0_2px_0_rgba(0,0,0,0.24),0_8px_16px_0_rgba(0,0,0,0.28)]',
                        list: 'py-0'
                        }}
                    > 
                        {
                            dateRangeList.map(item => {
                                return (
                                    <MenuItem key={item.value} className='font-bold text-sm text-[#C6C6C6]' onClick={() => dateChange(item)}>{item.value}</MenuItem>
                                )
                            })
                        }
                    </Menu>
                </div>
                </div>
            </div> */}
            <div className="py-3 border-0">
                <div className="text-sm text-[#F4F4F4] font-bold mb-3">
                    Period
                </div>
                <div className="flex items-center justify-between bg-[#6A6A6A]/[.16]">
                    {
                        dateRangeList.map(item => {
                            return (
                                <div key={item.value} className={`flex-1 cursor-pointer ${item.value === dateRangeText ? 'bg-[#6A6A6A]/[.16] #00000005 rounded font-bold border border-solid border-[#000000]/[.02] shadow-[0_1_0.75px_0_rgba(0,0,0,0.05),0_0.25px_0.25px_0_rgba(0,0,0,0.15)]' : '' } text-xs text-[#FFFFFF] py-2 text-center`} onClick={() => dateChange(item)}>{item.value}</div>
                            )
                        })
                    }
                </div>
            </div>
        </div>
        </Loading.Component>
    )
}

export default CalendarBlock