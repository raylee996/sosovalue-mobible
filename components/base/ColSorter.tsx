interface Props {
  sort: string | false // 'ASC' | 'DESC'
  className?: string
}

const ColSorter = (props: Props) => {
  const { sort, className = '' } = props

  return (
    <svg className={className} width="10" height="14" viewBox="0 0 10 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g>
        <path
          d="M9.00008 5L5.33341 1L1.66675 5"
          stroke={sort === 'ASC' ? 'var(--accent-600)' : 'var(--secondary-500-300)'}
          strokeWidth="2"
          strokeMiterlimit="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M1.66667 9L5.33333 13L9 9"
          stroke={sort === 'DESC' ? 'var(--accent-600)' : 'var(--secondary-500-300)'}
          strokeWidth="2"
          strokeMiterlimit="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  )
}

export default ColSorter
