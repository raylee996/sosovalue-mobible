import NiceModal, { useModal } from '@ebay/nice-modal-react';
import Drawer from '@mui/material/Drawer';
import ButtonBase from '@mui/material/ButtonBase'

import { muiDrawerV5 } from 'helper/niceModal';
import TokenBarSvg from 'components/icons/navigate/token-bar.svg'
import LangSvg from 'components/icons/lang.svg'
import IndicatorsSvg from 'components/icons/navigate/indicators.svg'

const mock = [
  { key: '1', name: 'Token Bar', icon: <TokenBarSvg /> },
  { key: '2', name: 'Macro', icon: <LangSvg /> },
  { key: '3', name: 'Indicators', icon: <IndicatorsSvg /> },
]

interface Props {
}

const Index = NiceModal.create((props: Props) => {
  const modal = useModal()

  return (
    <Drawer anchor='bottom' {...muiDrawerV5(modal)} sx={{
      '.MuiBackdrop-root': {
        backdropFilter: 'blur(2px)',
      }
    }}>
      <div className='bg-dropdown-White-800 p-3 flex-col justify-start items-start gap-2 flex'>
        {mock.map((x) => (
          <ButtonBase key={x.key} className='w-full h-10 px-4 rounded-lg justify-start gap-2 flex'>
            {x.icon} {x.name}
          </ButtonBase>
        ))}
      </div>
    </Drawer>
  )
})

export default Index
