import { useState, useEffect, useContext } from 'react'
import dayjs from 'dayjs'
import { useRouter } from 'next/router';
import { sendUserMessage } from 'http/analytics'
import { userAgentObj } from 'helper/tools'
import { getUserData } from 'helper/storage'
import UAParser from 'ua-parser-js';

const useAnalyze = () => {
    const [errorMessage, setErrorMessage]  = useState('')
    const router = useRouter()
    const analyzePage = ['/','/news','/indicators','/backpack','/trade/[currency]']
    useEffect(() => {
        const startTime = dayjs().unix() * 1000
        const index = analyzePage.indexOf(router.pathname)
        return () => {
            const parser = new UAParser()
            const endTime = dayjs().unix() * 1000
            if(index != -1 && getUserData()){
                const userData = JSON.parse(getUserData() || '')
                let actionId = 1
                if(router.pathname == '/') actionId = 2
                // if(router.pathname == '/news') actionId = 2
                // if(router.pathname == '/indicators') actionId = 3
                // if(router.pathname == '/backpack') actionId = 4
                // if(router.pathname == '/trade/[currency]') actionId = 5
        
                const params = {
                    actionClassify: 1,
                    actionId:actionId,
                    createTime:startTime,
                    module:actionId,
                    spendTime:(endTime - startTime) / 1000,
                    userBrowser:parser.getBrowser().name,
                    userDevice:parser.getDevice().vendor || parser.getOS().name,
                    userId:userData.id,
                    userName:userData.username
                }
                if(endTime != startTime){
                    sendUserMessage(params as any).then(res => {
                        if(!res.data) setErrorMessage('error')  
                    }) 
                }
            }  
        }
        
    }, [router.pathname])
    return {
        errorMessage
    }
}

export default useAnalyze