import Switch from '@mui/material/Switch';
import { styled } from '@mui/material/styles';

const Toggle = styled(Switch)(({ theme }) => ({
  width: 44,
  height: 24,
  padding: 0,
  display: 'flex',
  alignItems: 'center',
  '&:active': {
    '& .MuiSwitch-thumb': {
      width: 20,
    },
    '& .MuiSwitch-switchBase.Mui-checked': {
      transform: 'translateX(20px)',
    },
  },
  '& .MuiSwitch-switchBase': {
    padding: 2,
    '&.Mui-checked': {
      transform: 'translateX(20px)',
      color: '#fff',
      '& + .MuiSwitch-track': {
        opacity: 1,
        backgroundColor: 'var(--accent-600)',
      },
    },
  },
  '& .MuiSwitch-thumb': {
    boxShadow: '0 2px 4px 0 rgb(0 35 11 / 20%)',
    width: 20,
    height: 20,
    borderRadius: 20 / 2,
    transition: theme.transitions.create(['width'], { duration: 250 }),
  },
  '& .MuiSwitch-track': {
    borderRadius: 24 / 2,
    opacity: 1,
    backgroundColor: 'var(--primary-100-700)',
    boxSizing: 'border-box',
  },
}));

export default Toggle
