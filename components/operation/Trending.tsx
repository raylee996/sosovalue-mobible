import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import Image from 'next/image';

const Trending = ({title}: {title: string}) => {
    return (
        <div className="w-[300px]">
            <div className='text-[#313131] font-medium text-xl'>
                {title}
            </div>
            <List>
                {
                    ['Solana', 'Isreal', 'TikTok', 'polygon', 'South Korea'].map((name, i) => {
                        return (
                            <ListItem disablePadding key={i}>
                                <ListItemButton className='flex justify-between items-center h-8 p-0'>
                                    <div className='flex items-center'>
                                        <span className='bg-primary w-6 h-6 rounded-xl text-white flex justify-center items-center'>{i + 1}</span>
                                        <span className='text-base text-[#313131] font-medium ml-[10px]'>{name}</span>
                                    </div>
                                    <span className='text-[#D8D8D8] text-xs flex items-center'>
                                        <Image src='/img/fire.svg' width={15} height={15} alt=''/><span className='ml-1'>999+</span>
                                    </span>
                                </ListItemButton>
                            </ListItem>
                        )
                    })
                }
            </List>
        </div>
    )
}

export default Trending