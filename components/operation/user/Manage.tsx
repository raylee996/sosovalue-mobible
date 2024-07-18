import React, { PropsWithChildren } from 'react'
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { useDialog } from 'components/base/Dialog'
import Image from 'next/image'
import TextField from '@mui/material/TextField';
type Props = PropsWithChildren<{
  manageParams?: any,
  handleOk:(name:string,id?:string,isDel?:boolean) => any
}>

 
const Manage = ({manageParams,handleOk} : Props) => {
    const [open, setOpen] = React.useState(false);
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
    const { confirm } = useDialog()
    const [commentText, setCommentText] = React.useState('')
    const [id, setId] = React.useState('')
    const [currentId, setCurrentId] = React.useState('')
    const handleClickOpen = () => {
        setOpen(true);
        
    };
    
    const handleClose = () => {
        setOpen(false);
    };


  

  
  const handleCommit = () => {
    handleOk(commentText)
    handleClose()
  }
  const handleClick = (id:string) => {
    handleOk(commentText,id)
    setCurrentId('')
    handleClose()
  }
  const delHtml = () => {
    return (
      <div className='w-[382px]'>
        <div className='mb-2 w-full'><Image src="/img/svg/Warning.svg" alt="" width={24} height={24} className='mx-auto block'/></div>
        <div className='text-base font-bold text-[#C2C2C2] text-center mb-8'>Are you sure you want to delete this collection list? </div>
        <div className='text-xs text-[#8F8F8F] text-center'>This action will result in the deletion of all pairs within your favorites list.</div>
      </div>
    )
  }
  const handleDel = async(item:any,isDel:boolean) => {
    await new Promise((resolve, reject) => {
      confirm({
          title:`Delete ${item.name}`,
          content:delHtml(),
          onOk() {
              resolve('ok')
              handleOk(commentText,item.id,isDel)
              handleClose()
          }
      })
    })
    
  }


  
    React.useEffect(() => {
        if(manageParams?.isShow){
            handleClickOpen()
        }
    }, [manageParams])
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
            {manageParams?.title}
            </DialogTitle>
            <DialogContent classes={{root:'pb-6'}}>
              {
                manageParams?.type == 'add' && (
                  <>
                  <div className='flex text-xs text-[#8F8F8F] mb-2 justify-between'>
                      <div>{manageParams?.contextText}</div>
                      {/* <div>{manageParams?.number}/20</div> */}
                      <div>{commentText.length}/20</div>
                  </div> 
                  <div className='w-[324px] h-8'>
                      <TextField variant="outlined" placeholder='' size='small' fullWidth
                          onChange={e => setCommentText(e.target.value)}
                          inputProps={{
                            maxLength:20
                          }}
                          InputProps={{
                            
                              className: 'text-[#606060] h-8 leading-8 text-sm p-0 cursor-pointer',
                              classes: { notchedOutline: 'border-1 border-[#404040]', input: 'hide-scrollbar' }
                      }} />
                  </div>
                  </>
                )
              }
              {
                manageParams?.type == 'edit' && (
                  <>
                 <div>
                    <div>
                        <div className='flex items-center w-[324px] bg-[#6A6A6A]/[.16] h-[34px] cursor-not-allowed mb-1 rounded px-4 text-sm text-[#525252]'><Image src="/img/svg/FolderSimpleLock.svg" alt="" width={16} height={16} className='mr-3'/>Default Collection List </div>
                        <div>
                            {
                                manageParams?.list.map((item:any,index:number) => {
                                    if(index>0){
                                        return (
                                            <div key={index} className='flex items-center justify-between w-[324px] bg-[#6A6A6A]/[.16] h-[34px] mb-1 rounded px-4 text-sm text-[#C2C2C2]'>
                                                <div className='flex items-center'>
                                                    <Image src="/img/svg/Dots.svg" alt="" width={16} height={16} />
                                                    <div className={`${currentId == item.id ? 'flex' : 'hidden'}`}>
                                                    <TextField variant="outlined" placeholder='' size='small' fullWidth
                                                        defaultValue={item.name}
                                                        onChange={e => {
                                                          setCommentText(e.target.value) 
                                                          setId(item.id)}
                                                        }
                                                        inputProps={{
                                                          maxLength:20
                                                        }}
                                                        InputProps={{
                                                            className: 'text-[#BBBBBB] h-8 leading-8 text-sm p-0 cursor-pointer',
                                                            classes: { notchedOutline: 'border-none border-[#404040]', input: 'hide-scrollbar' },
                                                            
                                                           
                                                    }} />
                                                    
                                                    </div>
                                                    <div className={`${currentId != item.id ? 'flex' : 'hidden'} pl-[14px]`}>
                                                      {item.name}
                                                    </div>
                                                </div>
                                                <div className={`${currentId != item.id ? 'flex' : 'hidden'} items-center`}>
                                                    <Image src="/img/svg/EditName.svg" alt="" width={16} height={16} className='cursor-pointer m-2' onClick={() => setCurrentId(item.id)}/>
                                                    <Image src="/img/svg/Del.svg" alt="" width={16} height={16} className='cursor-pointer' onClick={() => handleDel(item,true)}/>
                                                </div>
                                                <div className={`${currentId == item.id ? 'flex' : 'hidden'} cursor-pointer  items-center px-0.5 bg-[#C14423] text-sm text-[#C2C2C2]`} onClick={() => handleClick(item.id)}>
                                                    Save <Image src="/img/svg/Vector.svg" alt="" width={16} height={16} className='ml-1' onClick={() => handleDel(item,true)}/>
                                                </div>
                                            </div>
                                        )
                                    }
                                })
                            }
                            
                        </div>
                    </div>
                </div>
                  </>
                )
              }
                
            </DialogContent>
            
            {
                manageParams?.type == 'add' && (
                  <DialogActions classes={{root:'p-6'}}>
              <Button onClick={handleCommit} className='w-[84px] h-[34px] bg-[#C14423] rounded text-sm text-[#C2C2C2] mx-4 normal-case'>
                Confirm
              </Button>
              <Button onClick={handleClose} className='w-[76px] h-[34px] bg-[#292929] rounded text-sm text-[#C2C2C2] border border-solid border-[#404040] mx-0 normal-case'>
                Cancel
              </Button>
              </DialogActions>
            )}
            {
                manageParams?.type == 'edit' && (
                  <DialogActions classes={{root:'px-6 pb-6'}}>
              <Button onClick={handleClose} className='w-[58px] h-[34px] bg-[#292929] rounded text-sm text-[#C2C2C2] border border-solid border-[#404040] mx-0 normal-case'>
                Done
              </Button>
              </DialogActions>
            )}
            
        </Dialog>
    </div>
    )
}

export default Manage