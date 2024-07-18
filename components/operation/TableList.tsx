/* eslint-disable react/display-name */
import React, { ComponentPropsWithoutRef, forwardRef } from 'react'
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { TableVirtuoso, TableComponents } from 'react-virtuoso';
import Link from 'next/link'
import IconButton from '@mui/material/IconButton';
import Image from 'next/image'
import { relative } from 'path';
interface ColumnData {
  dataKey?: string;
  label?: string;
  numeric?: any;
  width?: number;
  handleClick?: (data:any) => void
  renderCell?: (value: any, index: number, row: any) => React.ReactNode 
}
export type Props<T = any, U = any> = {
  rows: U[];
  columns: ColumnData[];

  handleClick: (key:string, orderBy:string) => void

}
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#0D0D0D',
    color: '#8F8F8F',
    border: '0',
    fontSize: 14,
    padding: '0px 0px',
    height:'24px',
    lineHeight: '20px',
    fontWeight:'400',
    fontStyle: 'normal',
    overflowWrap: 'break-word',
    fontFamily:'JetBrains Mono'
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 12,
    backgroundColor: 'transparent',
    color: '#C2C2C2',
    border: '0',
    padding: '0px 0px',
    height:'30.5px',
    lineHeight: '30.5px',
    fontWeight:'500',
    fontStyle: 'normal',
    fontFamily:'JetBrains Mono',
  },

  [`&.${tableCellClasses.body} a`]: {
    padding: '0px 0px',
    // maxWidth:'100px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  [`&.${tableCellClasses.body} a span`]: {
    justifyContent: 'flex-end',
    
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
  
}));
const VirtuosoTableComponents: TableComponents<API.MarketCap> = {
  Scroller: React.forwardRef<HTMLDivElement>((props, ref) => (
    <TableContainer component={Paper} {...props} ref={ref}/>
  )),
  Table: (props:any) => (
    <Table {...props} sx={{ borderCollapse: 'separate', tableLayout: 'fixed' }} />
  ),
  TableHead: forwardRef((props: ComponentPropsWithoutRef<'thead'>, ref) => (
    <TableHead ref={ref} {...props} />
  )),
  TableRow: ({ item: _item, ...props }) => <TableRow {...props} key={_item.id} classes={{root: 'table-tr'}} />,
  TableBody: React.forwardRef<HTMLTableSectionElement>((props, ref) => (
    <TableBody {...props} ref={ref} />
  )),
};


const TableList = ({ rows, columns,handleClick }: Props) => {

  const [currentSort, setCurrentSort] = React.useState('marketCap')
  const [orderBy, setOrderBy] = React.useState('DESC')
  const sort = (key:string, orderByVal:string) => {
    if(key == 'id' || key == 'coin' || key == 'name' || key == 'price' ) return
    let value = orderByVal
    if(value == 'DESC'){
      value = 'ASC'
      setOrderBy('ASC')
      
    }else{
      value = 'DESC'
      setOrderBy('DESC')
    }
    if(key != currentSort){
      value = 'DESC'
      setOrderBy('DESC')
    }
    
    // if(key == currentSort && orderBy != 'DESC'){
    //   setOrderBy('DESC')
    // }
    // if(key == currentSort && orderBy != 'ASC'){
    //   setOrderBy('ASC')
    // }
    
    setCurrentSort(key)
    handleClick(key,value)
    
    
    
    //
    // if(key == currentSort){
    //   if(orderBy == 'DESC'){
    //     setOrderBy('ASC')
    //   }else{
    //     setOrderBy('DESC')
    //   }
    // }else{
    //   setOrderBy('DESC')
    // }
    //handleClick(key,orderByVal)
    // if(orderBy == 'DESC' && key == currentSort){
    //   setOrderBy('ASC')
    // }
    // if(orderBy == 'ASC' && key == currentSort){
    //   setOrderBy('DESC')
    // }
    
    
    
    
  }
  function fixedHeaderContent() {
    return (
      <TableRow classes={{root: 'bg-[#fff]'}}>
        {/* {columns.map((column:any) => ( 
          <StyledTableCell
            key={column.dataKey}
            variant="head"
            align={column.numeric || false ? 'right' : 'left'}
            style={{ width: column.width }}
            sx={{
              backgroundColor: 'background.paper',
            }}
          >
            {column.label}
          </StyledTableCell>
        ))} */}
        
          {columns.map((column:any) => {
            
              return (
                <StyledTableCell
                key={column.dataKey}
                variant="head"

                align={column.numeric} 
                style={{ width: column.width }}
               
                sx={{
                  backgroundColor: 'background.paper',
                  position:'relative',
                  
                }}

                onClick={() => sort(column.dataKey,orderBy)}

              >
                <div className={(column.dataKey != 'id' && column.dataKey != 'coin' && column.dataKey != 'name' && column.dataKey != 'price') ? `cursor-pointer` : ``} >
                

                {(column.dataKey != 'id' && column.dataKey != 'coin' && column.dataKey != 'name' && column.dataKey != 'price' && column.dataKey == currentSort ) &&  orderBy == 'DESC' ? <Image src='/img/svg/ArrowDown.svg' style={{verticalAlign: '-2px',marginLeft:'2px'}} alt="" width={14} height={14} /> : ''}
                {(column.dataKey != 'id' && column.dataKey != 'coin' && column.dataKey != 'name' && column.dataKey != 'price' && column.dataKey == currentSort ) &&  orderBy == 'ASC' ? <Image src='/img/svg/ArrowDown.svg' style={{transform: 'rotate(180deg)',verticalAlign: '-2px',}} alt="" width={14} height={14} /> : ''} 
                {column.label} 
                </div>

                
                {/* {
                  column.dataKey != 'id' && column.dataKey != 'coin' && column.dataKey != 'name' && column.dataKey != 'price' && orderBy == 'DESC' ? 
                  (column.dataKey == currentSort ? <Image src='/img/svg/ArrowDown.svg' style={{transform: 'rotate(180deg)',verticalAlign: '-3px',marginLeft:'2px'}} alt="" width={16} height={16} /> : <Image src='/img/svg/ArrowDown.svg' style={{verticalAlign: '-3px',marginLeft:'2px'}} alt="" width={16} height={16} />) : 
                  ''
                }
                {
                  column.dataKey != 'id' && column.dataKey != 'coin' && column.dataKey != 'name' && column.dataKey != 'price' && orderBy == 'ASC' ? <Image src='/img/svg/ArrowDown.svg' style={{verticalAlign: '-3px',marginLeft:'2px'}} alt="" width={16} height={16} /> : ''
                } */}
              </StyledTableCell>
              )
            // else{
            //   return (
            //     <StyledTableCell
            //     key={column.dataKey}
            //     variant="head"
            //     align={column.numeric || false ? 'right' : 'left'}
            //     style={{ width: column.width }}
            //     sx={{
            //       backgroundColor: 'background.paper',
            //     }}
            //   >
            //     {column.label}
            //   </StyledTableCell>
            //   )
            // }
            
          })}
        
      </TableRow>
    );
  }
  function rowContent(_index: number, row: any) {
    return (
      <React.Fragment>
        {columns.map((column) => (
          
            <StyledTableCell
              key={column.dataKey}
              align={column.numeric}
              
            >
             
              { (row.baseAsset && row?.quoteAsset && row?.exchangeName) ?
                // (<Link href={`/trade/${row?.symbolsDoVO?.id}`} className='no-underline text-[#BBBBBB] block w-full'>
                //   {column.renderCell ?  column.renderCell(row[column.dataKey as keyof typeof row], _index, row) : row[column.dataKey as keyof typeof row]}
                // </Link>)
                (column.dataKey == 'name' ? <Link href={`/trade/${row?.baseAsset}-${row?.quoteAsset}-${row?.exchangeName.toUpperCase()}`} className='no-underline text-[#BBBBBB] block w-full h-full '>
                    {column.renderCell ?  column.renderCell(row[column.dataKey as keyof typeof row], _index, row) : row[column.dataKey as keyof typeof row]} 
                </Link>: <Link href={`/trade/${row?.baseAsset}-${row?.quoteAsset}-${row?.exchangeName.toUpperCase()}`} className='no-underline text-[#BBBBBB] block w-full h-full'>
                    {column.renderCell ?  column.renderCell(row[column.dataKey as keyof typeof row], _index, row) : row[column.dataKey as keyof typeof row]} 
                </Link>)
                :
                (
                  (column.dataKey == 'name' ? (<div>
                    {column.renderCell ?  column.renderCell(row[column.dataKey as keyof typeof row], _index, row) : row[column.dataKey as keyof typeof row]}
                  </div>) : (<div>
                    {column.renderCell ?  column.renderCell(row[column.dataKey as keyof typeof row], _index, row) : row[column.dataKey as keyof typeof row]}
                  </div>)
                  )
                )
              }
              
            </StyledTableCell>
        ))}
      </React.Fragment>
    );
  }
  return (
      <TableVirtuoso
          data={rows}
          id='table_report'
          components={VirtuosoTableComponents}
          fixedHeaderContent={fixedHeaderContent}
          itemContent={rowContent}
          className='rounded-none bg-block-color overflow-x-auto'
      />
  )
}

export default TableList