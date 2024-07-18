import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Menu, { MenuProps } from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import EditIcon from '@mui/icons-material/Edit';
import Divider from '@mui/material/Divider';
import ArchiveIcon from '@mui/icons-material/Archive';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import Image from 'next/image'
type Props ={
  cryptoes:API.SearchCrypto[],
  selectToken:string,
  changeToken:(val:any) => any,
}
const StyledMenu = styled((props: MenuProps) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
    {...props}
  />
))(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: 8,
    marginTop: 0,
    minWidth: 440,
    border:'1px solid #404040',
    background:'#0D0D0D',
    color:
      theme.palette.mode === 'light' ? 'rgb(55, 65, 81)' : theme.palette.grey[300],
    boxShadow:
      'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
    '& .MuiMenu-list': {
      padding: '8px',
    },
    '& .MuiMenuItem-root': {
      '& .MuiSvgIcon-root': {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      '&:active': {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity,
        ),
      },
    },
  },
}));

const CustomizedMenus = ({cryptoes,selectToken,changeToken}:Props) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleChange = () => {
    
    handleClose()
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
        option
      </Button>
      <StyledMenu
        id="demo-customized-menu"
        MenuListProps={{
          'aria-labelledby': 'demo-customized-button',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        //onChange={(event) => changeToken(event?.target)}
      >
        {
          cryptoes.map(item => {
            return (
              <MenuItem key={item.id} onClick={handleChange} disableRipple className='p-2'>
                {item.iconUrl && <Image src={item.iconUrl} alt="" width={32} height={32} className='mr-4' />}
                <span className='mr-4 text-[#C2C2C2] text-sm font-bold'>{item.name}</span>
                <span className='text-[#8F8F8F] text-xs font-normal'>{item.fullName}</span>
              </MenuItem>
            )
          })
        }
        
      </StyledMenu>
    </div>
  );
}
export default CustomizedMenus