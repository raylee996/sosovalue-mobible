import React, { PropsWithChildren } from 'react'
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import Image from 'next/image'
type Props = PropsWithChildren<{
    collectParams?: any,
    handleOk:(symbolIdList:string[],userBackpackIdList:string[]) => void
}>

    function not(a: readonly number[], b: readonly number[]) {
        return a.filter((value) => b.indexOf(value) === -1);
    }
  
    function intersection(a: readonly any[], b: readonly any[]) {
        return a.filter((value) => b.indexOf(value) !== -1);
    }
    
    function union(a: readonly number[], b: readonly number[]) {
        return [...a, ...not(b, a)];
    }
const Collect = ({collectParams,handleOk} : Props) => {
    const [open, setOpen] = React.useState(false);
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    const handleClickOpen = () => {
        setOpen(true);
    };
    
    const handleClose = () => {
        setOpen(false);
    };
    const numberOfChecked = (items: readonly number[],position:string) =>
    position == 'left' ? intersection(leftSelect, items).length : intersection(rightSelect, items).length;

  const handleToggleAll = (items: readonly number[],position:string) => () => {
    if (numberOfChecked(items,position) === items.length) {
      if(position == 'left'){
        setLeftSelect(not(checked, items))
      }else{
        setRightSelect(not(checked, items))
      }
    } else {
      if(position == 'left'){
        setLeftSelect(union(checked, items))
      }else{
        setRightSelect(union(checked, items))
      }
    }
  };


  const customList = (title: React.ReactNode, items: readonly any[],position:string,currentBackpack:string) => {
    return (
    
    <Card classes={{root:'bg-[#141414] shadow-none'}}>
      {
        collectParams?.page && collectParams?.page== 'backpack' ? (
          <CardHeader
            sx={{ px: 2, py: 1 }}
            title={title}
            classes={{root:' text-[#8F8F8F] p-0 mb-2', title:'text-xs'}}
            //subheader={`${numberOfChecked(items,position)}/${items.length} selected`}
          />
        ) :
        (
          <CardHeader
            sx={{ px: 2, py: 1 }}
            avatar={
              <Checkbox
                onClick={handleToggleAll(items?.map(item => item.id),position)}
                checked={numberOfChecked(items?.map(item => item.id),position) === items.length && items.length !== 0}
                indeterminate={
                  numberOfChecked(items,position) !== items.length && numberOfChecked(items,position) !== 0
                }
                color='info'
                disabled={items.length === 0}
                classes={{root:'text-[#ADADAD]'}}
                inputProps={{
                  'aria-label': 'all items selected',
                }}
              />
            }
            title={title}
            classes={{root:' text-[#8F8F8F] p-0 mb-2', title:'text-xs'}}
            //subheader={`${numberOfChecked(items,position)}/${items.length} selected`}
          />
          
        )
      }
      
      <Divider />
      <List
        sx={{
          width: 200,
          height: 230,
          bgcolor: '#141414',
          overflow: 'auto',
          padding:0,
        }}
        dense
        component="div"
        role="list"
      >
        {items.map((value: any) => {
          const labelId = `transfer-list-all-item-${value}-label`;

          return (
            <ListItem
              key={value.id}
              role="listitem"
              button
              onClick={handleToggle(value.id,position)}
              classes={{root: 'p-0'}}
            >
              <ListItemIcon>
                <Checkbox
                  checked={value.checked ? true : position == 'left' ? leftSelect.indexOf(value.id) !== -1 : rightSelect.indexOf(value.id) !== -1}
                  tabIndex={-1}
                  disableRipple
                  classes={{root:'text-[#ADADAD]'}}
                  inputProps={{
                    'aria-labelledby': labelId,
                  }}
                />
              </ListItemIcon>
              <div>
                <ListItemText id={labelId} primary={`${value.label}`} classes={{root:'text-sm text-[#F4F4F4] font-bold'}}/>
                {value.exchangeName && <ListItemText id={labelId} primary={`${value.exchangeName}`}  classes={{root:'text-xs text-[#8F8F8F]'}}/>}
              </div>
            </ListItem>
          );
        })}
      </List>
    </Card>
  )};

  const [checked, setChecked] = React.useState<readonly any[]>([]);
  const [leftSelect, setLeftSelect] = React.useState<any[]>([]);
  const [rightSelect, setRightSelect] = React.useState<any[]>([]);
  const [left, setLeft] = React.useState<readonly any[]>([{ id: 0, value: 0},{ id: 1, value: 1},{ id: 2, value: 2},{ id: 3, value: 3}]);
  const [right, setRight] = React.useState<readonly any[]>([{ id: 4, value: 4},{ id: 5, value: 5},{ id: 6, value: 6},{ id: 7, value: 7}]);
  const collect = collectParams
  const leftChecked = intersection(checked, left);
  const rightChecked = intersection(checked, right);

  const handleToggle = (value: number,position:string) => () => {
    
    const currentIndex = position == 'left' ? leftSelect.indexOf(value) : rightSelect.indexOf(value);
    const newChecked = position == 'left' ? [...leftSelect] : [...rightSelect];
    
    if (currentIndex === -1) {
      newChecked.push(value);
      
    } else {
      newChecked.splice(currentIndex, 1);
    }
    
    //setChecked(newChecked);
    if(position == 'left'){
      setLeftSelect(newChecked)
    }else{
      setRightSelect(newChecked)
    }
  };
  const handleCommit = () => {
    if(collectParams?.page == 'backpack'){
      leftSelect.push(collectParams.leftData[0].id)
    }
   
    handleOk(leftSelect,rightSelect)
    setRightSelect([])
    handleClose()
  }
    React.useEffect(() => {
      if(collectParams?.isShow){
          handleClickOpen()
          collectParams.leftData && setLeft(collectParams.leftData)
          collectParams.rightData && setRight(collectParams.rightData)
      }
      if(collectParams?.currentBackpack){
        setRightSelect(collectParams?.currentBackpack)
      }
    }, [collectParams])
    return (
    <div>
        <Dialog
            fullScreen={fullScreen}
            open={open}
            onClose={handleClose}
            aria-labelledby="responsive-dialog-title"
            classes={{paper:'bg-[#141414] shadow-[0_0_8px_0_rgba(0,0,0,0.36)] rounded-lg'}}
        >
            <DialogTitle id="responsive-dialog-title" classes={{root:'text-[#fff] p-6 text-base'}}>
            {collectParams?.title}
            </DialogTitle>
            <DialogContent>
            <Grid container spacing={2} justifyContent="center" alignItems="center">
              <Grid item>{customList(collectParams?.leftTitle, left,'left',collectParams?.currentBackpack)}</Grid>
              <Grid item>
                <Grid container direction="column" alignItems="center">
                    <Image src="/img/svg/ArrowFatLineRight.svg" alt="" width={32} height={32} className='m-1' />
                </Grid>
              </Grid>
              <Grid item>{customList(collectParams?.rigthTitle, right,'right',collectParams?.currentBackpack)}</Grid>
            </Grid>
            </DialogContent>
            <DialogActions classes={{root:'p-6'}}>
              <Button onClick={handleCommit} className='w-[84px] h-[34px] bg-[#C14423] rounded text-sm text-[#C2C2C2] mx-4 normal-case'>
                Confirm
              </Button>
              <Button onClick={handleClose} className='w-[76px] h-[34px] bg-[#292929] rounded text-sm text-[#C2C2C2] border border-solid border-[#404040] mx-0 normal-case'>
                Cancel
              </Button>
            </DialogActions>
        </Dialog>
    </div>
    )
}

export default Collect