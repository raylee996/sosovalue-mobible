import React from 'react'
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import Image from 'next/image'
import { getArticleList } from 'http/home'
import Link from 'next/link';
import { formatDate } from 'helper/tools';
import dayjs from 'dayjs';
import Button from '@mui/material/Button'
import Grow from '@mui/material/Grow'
import { useInfiniteScroll } from 'ahooks';
import useLoading from "hooks/useLoading"
type Props = React.PropsWithChildren<{
    post: API.Article;
}>

const Post = ({ post }: Props) => {

    const { title, category, realiseTime, content, source, sourceLink, matchedCurrencies } = post
    const [showReadMore, setShowReadMore] = React.useState(false)
    const [collapse, setCollapse] = React.useState(false)
    const wrapRef = React.useRef<HTMLDivElement>(null)
    const childrenRef = React.useRef<HTMLDivElement>(null)
    const specHeight = category === 2 || category === 3 ? 72 : 80
    const readMore = () => {
        setCollapse(!collapse)
    }
    const style = React.useMemo<React.CSSProperties>(() => {
        if (showReadMore) {
            return {
                height: `${collapse ? childrenRef.current?.offsetHeight : specHeight}px`
            }
        } else {
            return {
                height: childrenRef.current?.offsetHeight + 'px'
            }
        }
    }, [collapse, showReadMore])
    React.useEffect(() => {
        if (childrenRef.current!.offsetHeight > specHeight) {
            setShowReadMore(true)
        }
    }, [])
    return (
        <div className="relative border-0 border-b-2 border-solid border-black p-3">
            <div ref={wrapRef} style={style} className="overflow-hidden transition-[height] ease-in">
                <div className='text-[#CCCCCC] text-sm font-medium break-all' ref={childrenRef}>
                    <div>{category === 2 || category === 3 ? title : content}</div>
                    {
                        (category === 2 || category === 3) && (
                            <div className='text-xs text-[#808080] mt-1'>
                                {content}
                            </div>
                        )
                    }
                </div>
            </div>
            <div className='flex items-center justify-between mt-2 text-[#BBBBBB] text-xs'>
                <span className='flex items-center'>
                    <span className='text-xs text-[#A0A0A0]'>
                        {formatDate(realiseTime)}
                    </span>
                </span>
                <div>
                    {
                        source && <Link href={sourceLink} target='_blank' className='text-xs text-[#8F8F8F]'>@{source}</Link>
                    }
                    {
                        showReadMore && (
                            <Button onClick={readMore} variant='text' className="capitalize text-xs text-[#A0A0A0]"
                                endIcon={<Image className={` transition-transform ease-in ${collapse && ' rotate-180'}`} src='/img/svg/Down.svg' width={14} height={14} alt="" />}>
                                {
                                    collapse ? 'Less' : 'More'
                                }
                            </Button>
                        )
                    }
                </div>
            </div>
        </div>
    )
}

const tabs = [
    {
        title: 'Flash',
        category: 5
    },
    {
        title: 'Articles',
        category: 6
    }
]

const PostBlock = () => {
    const Loading = useLoading()
    const containerRef = React.useRef<HTMLDivElement>(null)
    const [category, setCategory] = React.useState(tabs[0].category)
    const { data } = useInfiniteScroll<Required<API.ListResponse<API.Article>>>(
        async data => {
            if (category !== 0) {
                const res = await getArticleList({ pageNum: data ? Number(data.pageNum) + 1 : 1, pageSize: 10, category })
                const list = res.data.list || []
                Loading.close()
                return { ...res.data, list }
            } 
            return {
                list: [],
                total: 0,
                totalPage: 0,
                pageNum: 1,
                pageSize: 10
            }
        },
        {
            target: containerRef.current,
            reloadDeps: [category],
            isNoMore: (data) => {
                return Number(data?.pageNum) >= Number(data?.totalPage)
            },
        },
    )
    const tabChange = (newCategory: number) => {
        if(newCategory !== category) {
            containerRef.current?.scrollTo({top: 0})
        }
        setCategory(newCategory)
    }
    return (
        <div className='h-full flex flex-col items-stretch'>
            <div>
                <List className='flex py-0 px-3'>
                    {
                        tabs.map(({ title, category: itemCategory }) => (
                            <ListItem disablePadding key={itemCategory} className='w-auto'>
                                <ListItemButton className={`px-0 mr-4 ${itemCategory === category ? 'text-primary' : 'text-[#8D8D8D]'}`} onClick={() => tabChange(itemCategory)}>
                                    <span className='text-sm'>{title}</span>
                                </ListItemButton>
                            </ListItem>
                        ))
                    }
                </List>
            </div>
            <div ref={containerRef} className='flex-1 h-0 overflow-y-auto'>
                <Loading.Component>
                    <div>
                        {
                            !!data?.list.length ? data.list.map(({ title, category, realiseTime, content, source, sourceLink, matchedCurrencies }, index) => (
                                <div className='mx-3 py-3 border-0 border-b-[1px] border-solid border-[#343434]' key={index}>
                                    <div className='text-[#CCCCCC] text-sm font-medium text-justify'>
                                        <Link href={sourceLink} referrerPolicy='no-referrer' target='_blank' className=' no-underline'>
                                            <div className='hover:text-[#FF4F20] cursor-pointer'>{title || content}</div>
                                        </Link>
                                        {
                                            title && content && category !== 5 && (
                                                <div className='text-xs text-[#808080] mt-1 line-clamp-4'>
                                                    {content}
                                                </div>
                                            )
                                        }
                                    </div>
                                    <div className='flex items-center justify-between mt-2 text-[#BBBBBB] text-xs'>
                                        <span className='mr-4'>
                                            {formatDate(realiseTime)}
                                        </span>
                                        <span className='flex items-center text-xs text-[#A0A0A0]'>

                                            <span className='flex items-center text-[#8F8F8F]'>
                                                {
                                                    source ? <Link referrerPolicy='no-referrer' href={sourceLink} target='_blank' className='text-xs text-[#8F8F8F]'>
                                                        @{source.length >= 20 ? `${source.slice(0, 20)}...` : source}
                                                        <Image src='/img/svg/ArrowSquareOut.svg' className='ml-1 align-top' alt="" width={16} height={16} />
                                                    </Link> : <Link referrerPolicy='no-referrer' href={sourceLink} target='_blank' className='text-xs text-[#8F8F8F]'>
                                                        @Source
                                                        <Image src='/img/svg/ArrowSquareOut.svg' className='ml-1 align-top' alt="" width={16} height={16} />
                                                    </Link>
                                                }
                                            </span>
                                        </span>
                                    </div>
                                </div>
                            )) : (
                                <div className='flex items-center justify-center py-14'>
                                    <span className='text-[#CCCCCC] text-xl font-bold mt-4'>No results</span>
                                </div>
                            )
                        }
                    </div>
                </Loading.Component>
            </div>
        </div>
    )
}

export default PostBlock