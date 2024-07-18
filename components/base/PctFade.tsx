import BgFadeAnimate from "./BgFadeAnimate"

interface Props {
  pct: string | number
  multiples?: number // 倍数
}

const PctFade = (props: Props) => {
  const { pct, multiples = 1 } = props
  const _pct = +pct

  return (
    <>
      {_pct > 0 && (
        <span className="text-success-600-500">
          <BgFadeAnimate value={_pct}>
            +{(_pct * multiples).toFixed(2)}%
          </BgFadeAnimate>
        </span>
      )}
      {_pct < 0 && (
        <span className="text-error-600-500">
          <BgFadeAnimate value={_pct}>
            {(_pct * multiples).toFixed(2)}%
          </BgFadeAnimate>
        </span>
      )}
      {_pct === 0 && (
        <span className="ml-2.5 text-primary-900-White">0.00%</span>
      )}
      {isNaN(_pct) && (
        <span>{pct}</span>
      )}
    </>
  )
}

export default PctFade
