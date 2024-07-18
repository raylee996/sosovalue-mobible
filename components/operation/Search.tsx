import { useEffect, useRef, useState } from 'react'
import Button from '@mui/material/Button'
import Image from 'next/image'
import Popover from '@mui/material/Popover';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import { useDebounce } from 'ahooks';
import { findDefaultSymbolByCurrencyIds, globalSearch } from 'http/home';
import IconButton from '@mui/material/IconButton';
import Slide from '@mui/material/Slide';
import Collects from './Collects';
import { useRouter } from 'next/router';
import { recoverExchangeName } from 'helper/tools';

const Search = () => {
    const router = useRouter()
    const [text, setText] = useState('')
    const keyword = useDebounce(text, { wait: 500 })
    const [cryptoes, setCryptoes] = useState<API.SearchCrypto[]>([])
    const [pairs, setPairs] = useState<API.SearchPair[]>([])
    const [mode, setMode] = useState(0)
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const open = Boolean(anchorEl);
    const containerRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)
    const [collectParams, setCollectParams] = useState<any>()
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };
    const switchMode = (mode: number) => {
        setMode(mode)
    }
    const collectCoin = (name: string) => {
        setCollectParams({
            isShow: true,
            coin: name,
            page: 'home'
        })
    }
    const collectPair = (pair: API.SearchPair) => {
        const leftData = {
            id: pair.id,
            exchangeId: pair.exchangeId,
            label: pair.symbol,
            exchangeName: pair.exchangeName,
            leftData: true,
            all: true,
            checked: true
        }
        setCollectParams({
            isShow: true,
            leftData: [leftData],
            page: 'backpack'
        })
    }
    const cryptoToDetail = async (crypto: API.SearchCrypto) => {
        const { data } = await findDefaultSymbolByCurrencyIds([crypto.id])
        router.push(`/trade/${data[0].baseAsset}-${data[0].quoteAsset}-${data[0].exchangeName.toUpperCase()}`)
    }
    const pairToDetail = (pair: API.SearchPair) => {
        router.push(`/trade/${pair.symbol.split('/').join('-')}-${pair.exchangeName.toUpperCase()}`)
    }
    const clear = () => {
        if (keyword) {
            setText('')
        } else {
            setAnchorEl(null)
        }
    }
    useEffect(() => {
        if (keyword) {
            globalSearch({ category: ['crypto', 'pairs'], keyword, pageNum: 1, pageSize: 100 }).then(res => {
                setMode(0)
                setCryptoes(res.data.crypto?.list || [])
                setPairs(res.data.pairs?.list || [])
            })
        } else {
            setMode(0)
            setCryptoes([])
            setPairs([])
        }
    }, [keyword])
    const renderCryptoes = (cryptoes: API.SearchCrypto[]) => {
        return cryptoes.map((item) => {
            const { fullName, name, iconUrl, id, sort } = item
            return (
                <div key={id} className='flex items-center justify-between h-[52px] cursor-pointer' onClick={() => cryptoToDetail(item)}>
                    <span className='flex items-center'>
                        <Image src={iconUrl || '/img/svg/CoinVertical.svg'} width={32} height={32} alt='' />
                        <span className='text-sm font-bold text-[#C2C2C2] mx-2 truncate max-w-[200px]'>{fullName}</span>
                        <span className='text-xs text-[#8F8F8F]'>{name}</span>
                    </span>
                    <div className='flex items-center'>
                        <span className='text-xs text-[#8F8F8F] px-1 bg-[rgba(106,106,106,0.16)] rounded mr-2'>#{sort}</span>
                        <IconButton className='group' onClick={(e) => {
                            e.stopPropagation()
                            collectCoin(name)
                        }}>
                            <i className="w-5 h-5 bg-[url('/img/svg/FolderSimpleStar.svg')] bg-cover group-hover:hidden"></i>
                            <i className="w-5 h-5 bg-[url('/img/svg/FolderSimpleStar-white.svg')] bg-cover hidden group-hover:inline-block"></i>
                        </IconButton>
                    </div>
                </div>
            )
        })
    }
    const renderPairs = (pairs: API.SearchPair[]) => {
        return pairs.map((item) => {
            const { baseCurrencyIcon, symbol, exchangeName, id } = item
            return (
                <div key={id} className='flex items-center justify-between h-[52px] cursor-pointer' onClick={() => pairToDetail(item)}>
                    <span className='flex items-center'>
                        <Image src={baseCurrencyIcon || '/img/svg/CoinVertical.svg'} width={32} height={32} alt='' />
                        <span className='text-sm font-bold text-[#C2C2C2] mx-2'>{symbol}</span>
                        <span className='text-xs text-[#8F8F8F]'>{recoverExchangeName(exchangeName)}</span>
                    </span>
                    <IconButton className='group' onClick={(e) => {
                        e.stopPropagation()
                        collectPair(item)
                    }}>
                        <i className="w-5 h-5 bg-[url('/img/svg/FolderSimpleStar.svg')] bg-cover group-hover:hidden"></i>
                        <i className="w-5 h-5 bg-[url('/img/svg/FolderSimpleStar-white.svg')] bg-cover hidden group-hover:inline-block"></i>
                    </IconButton>
                </div>
            )
        })
    }
    return (
        <div>
            <Button onClick={handleClick} className='capitalize text-sm text-[#8F8F8F] rounded w-[200px] h-8 justify-start border-[#404040]' variant='outlined' startIcon={<Image src='/img/svg/search.svg' width={20} height={20} alt='' />}>Search</Button>
            <Popover
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                TransitionProps={{
                    onTransitionEnd: () => {
                        if (open) {
                            inputRef.current?.focus()
                        } else {
                            setText('')
                        }
                    }
                }}
                classes={{ paper: 'shadow-area w-[460px] h-[627px] bg-[#0D0D0D] rounded-lg' }}
            >
                <div className='h-full flex flex-col items-stretch'>
                    <div className='relative'>
                        <TextField
                            value={text} onChange={e => setText(e.target.value)}
                            className='w-full bg-transparent h-10 border-0 border-b border-solid border-[#343434]'
                            placeholder='Search' inputRef={inputRef} autoComplete='off'
                            InputProps={{
                                classes: {
                                    root: 'h-full',
                                    notchedOutline: 'border-0',
                                    input: 'text-[#8F8F8F] text-base py-0 h-full pr-12'
                                },
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Image src='/img/svg/search-gray.svg' width={20} height={20} alt='' />
                                    </InputAdornment>
                                )
                            }} />
                        <IconButton onClick={clear} className='absolute right-0.5 top-1/2 -translate-y-1/2'><Image src='/img/svg/X.svg' width={20} height={20} alt='' /></IconButton>
                    </div>
                    <div className='flex-1 h-0 overflow-y-auto'>
                        <Slide direction="right" in={mode === 0} container={containerRef.current} unmountOnExit>
                            <div className='pl-[14px]'>
                                <div>
                                    {
                                        !!cryptoes.length && (
                                            <div className='text-[#8F8F8F] text-xs leading-8'>Coin</div>
                                        )
                                    }
                                    {
                                        renderCryptoes(cryptoes.slice(0, 5))
                                    }
                                    {
                                        cryptoes.length > 5 && (
                                            <Button onClick={() => switchMode(1)} className='text-[#8F8F8F] text-xs capitalize justify-start px-0' fullWidth endIcon={<Image className='ml-4' src='/img/svg/Down.svg' width={16} height={16} alt='' />}>See All ({cryptoes.length}) </Button>
                                        )
                                    }
                                </div>
                                {
                                    !!cryptoes.length && <i className='block border-0 border-b border-solid border-[#343434] my-4 mr-2'></i>
                                }
                                <div>
                                    {
                                        !!pairs.length && (
                                            <div className='text-[#8F8F8F] text-xs leading-8'>Pairs</div>
                                        )
                                    }
                                    {
                                        renderPairs(pairs.slice(0, 3))
                                    }
                                    {
                                        pairs.length > 3 && (
                                            <Button onClick={() => switchMode(2)} className='text-[#8F8F8F] text-xs capitalize justify-start px-0' fullWidth endIcon={<Image className='ml-4' src='/img/svg/Down.svg' width={16} height={16} alt='' />}>See All ({pairs.length}) </Button>
                                        )
                                    }
                                </div>
                            </div>
                        </Slide>
                        <Slide direction="left" in={mode === 1 || mode === 2} container={containerRef.current} unmountOnExit>
                            <div className='pl-[14px]'>
                                <Button onClick={() => setMode(0)} className='text-[#8F8F8F] text-xs capitalize justify-start h-8  px-0' fullWidth startIcon={<Image src='/img/svg/arrow-left.svg' width={16} height={16} alt='' />}>Back</Button>
                                <div className='text-[#8F8F8F] text-xs leading-8'>{mode === 1 ? 'Coin' : 'Pairs'}</div>
                                {mode === 1 ? renderCryptoes(cryptoes) : mode === 2 ? renderPairs(pairs) : null}
                            </div>
                        </Slide>
                    </div>
                </div>
            </Popover>
            <Collects collectParams={collectParams} />
        </div>
    )
}

export default Search