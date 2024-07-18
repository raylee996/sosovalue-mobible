import { useEffect } from 'react'
import { useRouter } from 'next/router'
import dayjs from 'dayjs'

require('dayjs/locale/zh-cn')
require('dayjs/locale/zh-tw')
require('dayjs/locale/ja')

const useDayjsLocale = () => {
  const router = useRouter()

  useEffect(() => {
    if (router.locale == 'zh') {
      dayjs.locale('zh-cn')
    } else if (router.locale == 'tc') {
      dayjs.locale('zh-tw')
    } else if (router.locale == 'ja') {
      dayjs.locale('ja')
    } else {
      dayjs.locale('en')
    }
  }, [router.locale])
}

export default useDayjsLocale
