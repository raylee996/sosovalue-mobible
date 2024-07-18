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
type Props = {
    selectToken:string,
    changeToken:(val:any) => any,
} 
const Search = ({selectToken,changeToken}:Props) => {
    
    const [text, setText] = useState('')
    const keyword = useDebounce(text, { wait: 500 })
    const [cryptoes, setCryptoes] = useState<API.SearchCrypto[]>([])
    const [mode, setMode] = useState(0)
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const open = Boolean(anchorEl);
    const containerRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const cryptoToDetail = async (crypto: API.SearchCrypto) => {
        changeToken(crypto.fullName)
        handleClose()
        //const { data } = await findDefaultSymbolByCurrencyIds([crypto.id])
        //router.push(`/trade/${data[0].baseAsset}-${data[0].quoteAsset}-${data[0].exchangeName.toUpperCase()}`)
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
            })
        } else {
            setMode(0)
            setCryptoes([])
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
                </div>
            )
        })
    }
    return (
        <div>
            <Button
                className='bg-transparent border-0 flex items-center justify-between px-2 w-full h-[34px] text-xs text-[#8F8F8F]' 
                id="demo-customized-button"
                aria-controls={open ? 'demo-customized-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                variant="contained"
                disableElevation
                onClick={handleClick}
                endIcon={<Image src='/img/svg/CaretDown.svg' width={16} height={16} className="mr-1" alt='' />}
            >
                {selectToken ? selectToken : 'Select'}
            </Button>
            {/* <Button onClick={handleClick} className='capitalize text-sm text-[#8F8F8F] rounded w-full h-8 justify-start border-[#404040]' variant='outlined' startIcon={<Image src='/img/svg/search.svg' width={20} height={20} alt='' />}>Search</Button> */}
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
                                        renderCryptoes(cryptoes)
                                    }
                                </div>
                            </div>
                        </Slide>
                        
                    </div>
                </div>
            </Popover>
        </div>
    )
}

export default Search