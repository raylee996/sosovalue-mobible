import React from 'react'
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import Info from './Info';
import Team from '../Team';
import Investors from './Investors';
import TokenModel from './TokenModel';
import DevelopmentProcess from './DevelopmentProcess';
import { getDevelopmentProcess } from 'http/detail';

const tabs = [
    {
        title: 'Info',
        index: 0
    },
    {
        title: 'Team',
        index: 1
    },
    {
        title: 'Investors',
        index: 2
    },
    {
        title: 'Token Model',
        index: 3
    },
]
const CommentBlock = ({ currencySymbolInfo, originalCurrencyDetail }: { currencySymbolInfo?: API.CurrencySymbolInfo; originalCurrencyDetail?: API.OriginalCurrencyDetail }) => {
    const [tabIndex, setTabIndex] = React.useState(tabs[0].index)
    const [devProcess, setDevProcess] = React.useState<API.DevelopmentProcess[]>()
    const currencyDetailInfo = React.useMemo(() => {
        if (originalCurrencyDetail) {
            const { individuals, investors, organizations, tokenModel, ...rest } = originalCurrencyDetail
            return {
                individuals: individuals ? JSON.parse(individuals) : [],
                investors: investors ? JSON.parse(investors) : [],
                organizations: organizations ? JSON.parse(organizations) : [],
                tokenModel: tokenModel ? JSON.parse(tokenModel) : [],
                ...rest
            } as API.CurrencyDetail
        }
    }, [originalCurrencyDetail])
    const hasTeam = React.useMemo(() => {
        return currencyDetailInfo?.individuals.length || currencyDetailInfo?.organizations.length
    }, [currencyDetailInfo])
    return (
        <div>
            <div className='bg-[#292929]'>
                <List className='flex py-0'>
                    <ListItem disablePadding className='w-auto'>
                        <ListItemButton className={`text-white ${tabIndex === 0 ? 'bg-[#1E1E1E]' : ''}`} onClick={() => setTabIndex(0)}>
                            <span className='text-xs'>Info</span>
                        </ListItemButton>
                    </ListItem>
                    {
                        !!hasTeam && (
                            <ListItem disablePadding className='w-auto'>
                                <ListItemButton className={`text-white ${tabIndex === 1 ? 'bg-[#1E1E1E]' : ''}`} onClick={() => setTabIndex(1)}>
                                    <span className='text-xs'>Team</span>
                                </ListItemButton>
                            </ListItem>
                        )
                    }
                    {
                        !!currencyDetailInfo?.investors.length && (
                            <ListItem disablePadding className='w-auto'>
                                <ListItemButton className={`text-white ${tabIndex === 2 ? 'bg-[#1E1E1E]' : ''}`} onClick={() => setTabIndex(2)}>
                                    <span className='text-xs'>Investors</span>
                                </ListItemButton>
                            </ListItem>
                        )
                    }
                    {
                        !!currencyDetailInfo?.tokenModel.length && (
                            <ListItem disablePadding className='w-auto'>
                                <ListItemButton className={`text-white ${tabIndex === 3 ? 'bg-[#1E1E1E]' : ''}`} onClick={() => setTabIndex(3)}>
                                    <span className='text-xs'>Token Model</span>
                                </ListItemButton>
                            </ListItem>
                        )
                    }
                </List>
            </div>
            <div className='bg-[#1E1E1E]'>
                {
                    tabIndex === 0 ? <Info currencyDetailInfo={currencyDetailInfo} />
                        // : tabIndex === 1 ? <Team currencyDetailInfo={currencyDetailInfo} />
                            : tabIndex === 2 ? <Investors currencyDetailInfo={currencyDetailInfo} />
                                // : tabIndex === 3 ? <TokenModel currencyDetailInfo={currencyDetailInfo} />
                                    // : tabIndex === 4 ? <DevelopmentProcess devProcess={devProcess}/>
                                    : null
                }
            </div>
        </div>
    )
}

export default CommentBlock