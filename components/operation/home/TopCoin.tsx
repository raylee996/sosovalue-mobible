import React, { useEffect } from 'react'
import Image from "next/image"
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Button } from "@mui/material"
import ArrowIcon from "components/svg/Arrow"
import Link from "next/link";
import { top10 } from 'http/index'
import { formatDecimal, transferMoney } from 'helper/tools'
const TopCoin = () => {
    const [top,setTop] = React.useState<API.top10[]>()
    const getData = async () => {
        const {data} = await top10({orderItems:[{ asc: true, column: "sort" }],pageNum:1,pageSize:10})
        setTop(data.list)
    }
    useEffect(() => {
        getData()
        
    }, [])
    return (
        <div>
            <div className="text-primary text-xl font-bold mb-3 mt-6">Top 10 by 24H Change %</div>
            <div className="bg-block-color border border-solid border-[#404040] rounded-lg px-3 pt-3">
                <TableContainer>
                    <Table className="min-w-0">
                        <TableHead>
                            <TableRow>
                                <TableCell
                                    variant="head" align='left'
                                    className='h-7 p-0 text-sm text-[#8F8F8F] border-0'
                                >
                                    #
                                </TableCell>
                                <TableCell
                                    variant="head" align='left'
                                    className='h-7 p-0 text-sm text-[#8F8F8F] border-0 px-1'
                                >
                                    Coin
                                </TableCell>
                                <TableCell
                                    variant="head" align='left'
                                    className='h-7 p-0 text-sm text-[#8F8F8F] border-0 px-1'
                                >
                                    Name
                                </TableCell>
                                <TableCell
                                    variant="head" align='right'
                                    className='h-7 p-0 text-sm text-[#8F8F8F] border-0 px-1 whitespace-nowrap'
                                >
                                    Price
                                    <Image className="ml-1" src='/img/svg/ArrowDown.svg' width={12} height={12} alt="" />
                                </TableCell>
                                <TableCell
                                    variant="head" align='right'
                                    className='h-7 p-0 text-sm text-[#8F8F8F] border-0 px-1 whitespace-nowrap'
                                >
                                    Change %
                                </TableCell>
                                <TableCell
                                    variant="head" align='right'
                                    className='h-7 p-0 text-sm text-[#8F8F8F] border-0 px-1 whitespace-nowrap'
                                >
                                    24H Volume
                                </TableCell>
                                <TableCell
                                    variant="head" align='right'
                                    className='h-7 p-0 text-sm text-[#8F8F8F] border-0 px-1 whitespace-nowrap'
                                >
                                    MarketCap
                                </TableCell>
                                <TableCell
                                    variant="head" align='right'
                                    className='h-7 p-0 text-sm text-[#8F8F8F] border-0 px-1 whitespace-nowrap'
                                >
                                    1M ROI
                                </TableCell>
                                <TableCell
                                    variant="head" align='right'
                                    className='h-7 p-0 text-sm text-[#8F8F8F] border-0 px-1 whitespace-nowrap'
                                >
                                    1Y ROI
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {top && top.map((row, index) => (
                                <TableRow
                                    key={index}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell
                                        align='left'
                                        className='h-7 p-0 text-xs text-[#C2C2C2] border-0'
                                    >
                                        {index+1}
                                    </TableCell>
                                    <TableCell
                                        align='left'
                                        className='h-7 p-0 text-sm text-[#C2C2C2] font-bold border-0'
                                    >
                                        <div className="flex items-center">
                                            <Image className="mr-1" src={row.iconUrl || '/img/svg/CoinVertical.svg'} width={16} height={16} alt="" />
                                            {row.curerencyName.toUpperCase()}
                                        </div>
                                    </TableCell>
                                    <TableCell
                                        align='left'
                                        className='h-7 p-0 text-xs text-[#C2C2C2] border-0 truncate'
                                    >
                                        {row.currencyAliasName}
                                    </TableCell>
                                    <TableCell
                                        align='right'
                                        className='h-7 p-0 text-xs text-[#F4F4F4] font-bold border-0'
                                    >
                                        {row.currencyAmt ? '$' + formatDecimal(`${row.currencyAmt.toFixed(18).replace(/.?0+$/, "")}`) : '-'}
                                    </TableCell>
                                    <TableCell
                                        align='right'
                                        className='h-7 p-0 text-xs text-[#8F8F8F] border-0'
                                    >
                                        <span className={row.changePercent > 0 ? 'text-rise' : 'text-fall'}>
                                            {row.changePercent ? `${row.changePercent > 0 ? '+' : '-'}${Number(row.changePercent * 100 ).toFixed(2)}%` : '-'}
                                        </span>
                                    </TableCell>
                                    <TableCell
                                        align='right'
                                        className='h-7 p-0 text-xs text-[#8F8F8F] border-0'
                                    >
                                        {'$' + transferMoney(row.volume)}
                                    </TableCell>
                                    <TableCell
                                        align='right'
                                        className='h-7 p-0 text-xs text-[#8F8F8F] border-0'
                                    >
                                        {'$' + transferMoney(row.marketCap)}
                                    </TableCell>
                                    <TableCell
                                        align='right'
                                        className='h-7 p-0 text-xs text-[#8F8F8F] border-0'
                                    >
                                        <span className={row.moRoi > 0 ? 'text-rise' : 'text-fall'}>
                                            {row.moRoi ? `${Number(row.moRoi).toFixed(2)}%` : '-'}
                                        </span>
                                    </TableCell>
                                    <TableCell
                                        align='right'
                                        className='h-7 p-0 text-xs text-[#8F8F8F] border-0'
                                    >
                                        <span className={row.yeRoi > 0 ? 'text-rise' : 'text-fall'}>
                                            {row.yeRoi ? `${Number(row.yeRoi).toFixed(2)}%` : '-'}
                                        </span>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <Link href='/quotes'>
                    <Button className="normal-case text-primary text-sm py-3 leading-[18px]" fullWidth endIcon={<ArrowIcon className="text-primary text-base -rotate-90" viewBox="0 0 13 12" />}>View More</Button>
                </Link>
            </div>
        </div>
    )
}

export default TopCoin