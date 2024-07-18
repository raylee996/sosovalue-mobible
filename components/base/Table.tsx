import { ReactNode } from "react"

export interface Col {
  title: ReactNode
  dataIndex: string
  render?: (value: any, record: any, index: number) => ReactNode
}

interface Props {
  rowKey: string
  columns: Col[]
  dataSource: any[]
  className?: string
  thRender?: (col: Col, index: number) => ReactNode
  onRowClick?: (row: any) => void
}

const Table = (props: Props) => {
  const { rowKey, columns, dataSource, className, thRender, onRowClick } = props

  return (
    <table className={`w-full border-collapse ${className}`}>
      <thead>
        <tr>
          {columns.map((x, i) => (
            <th key={x.dataIndex} className="p-0 box-content border-primary-100-700 border-0 border-t border-b border-solid">
              {thRender ? thRender(x, i) : x.title}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {dataSource.map((row) => (
          <tr
            key={row[rowKey]}
            className={`${onRowClick ? 'active:scale-[0.98]' : ''}`}
            onClick={() => onRowClick?.(row)}
          >
            {columns.map(({ dataIndex, render }, index) => (
              <td key={dataIndex} className="p-0">
                {render ? render(row[dataIndex], row, index) : row[dataIndex]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default Table
