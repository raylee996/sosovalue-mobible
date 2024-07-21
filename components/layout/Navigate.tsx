import NiceModal from "@ebay/nice-modal-react";
import ExpIcon from "components/svg/navigate/ExpIcon";
import ExpIconActive from "components/svg/navigate/ExpIconActive";
import ResearchIcon from "components/svg/navigate/ResearchIcon";
import ResearchIconActive from "components/svg/navigate/ResearchIconActive";
import HomeIcon from "components/svg/navigate/HomeIcon";
import HomeIconActive from "components/svg/navigate/HomeIconActive";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import ButtonBase from "@mui/material/ButtonBase";
import { UserContext } from "store/UserStore";
import Image from "next/image";
import { useTranslation } from "next-i18next";
import Audio from "components/base/Audio";
import { useNavigateEvent } from "store/DirtyStore";
import useHoldUp from "hooks/useHoldUp";

import ChartSvg from 'components/icons/navigate/chart.svg'
import ChartFillSvg from 'components/icons/navigate/chart-fill.svg'
import FeedsSvg from 'components/icons/navigate/feeds.svg'
import FeedsFillSvg from 'components/icons/navigate/feeds-fill.svg'
import StarSvg from 'components/icons/navigate/star.svg'
import StarFillSvg from 'components/icons/navigate/star-fill.svg'
import UserSvg from 'components/icons/user.svg'
import ExpSvg from 'components/icons/navigate/exp.svg'
import { getToken } from "helper/storage";
import { useNetwork } from "hooks/useNetwork";
// import DashboardSvg from 'components/icons/navigate/dashboard.svg'
// import DashboardFillSvg from 'components/icons/navigate/dashboard-fill.svg'
// import MoreSvg from 'components/icons/navigate/more.svg'
// import NavMoreModal from './NavMoreModal'

const Navigate = () => {
  const [localActive, setLocalActive] = useState()
  const [hasToken, setHasToken] = useState(true)
  const { user, authModal } = useContext(UserContext);
  const holdUp = useHoldUp()
  const { emitClickHome, emitClickResearch } = useNavigateEvent();
  const { t } = useTranslation("common");

  const router = useRouter();
  const isResearch =
    router.pathname === "/research" && !authModal?.showLoginSignUp;
  const isPortfolio =
    router.pathname === "/portfolio" && !authModal?.showLoginSignUp;
  const isSearch = router.pathname === "/search" && !authModal?.showLoginSignUp;
  const isHome = router.pathname === "/" && !authModal?.showLoginSignUp;
  const isExp = router.pathname === "/exp" || authModal?.showLoginSignUp;

  const toHome = () => {
    if (authModal?.open) {
      authModal.closeModal();
    }
    if (router.pathname !== "/") {
      router.push("/");
    } else {
      emitClickHome();
    }
  };
  const toResearch = () => {
    if (authModal?.open) {
      authModal.closeModal();
    }
    if (router.pathname !== "/research") {
      router.push("/research");
    } else {
      emitClickResearch();
    }
  };
  const toSearch = () => {
    if (authModal?.open) {
      authModal.closeModal();
    }
    if (router.pathname !== "/search") {
      router.push("/search");
    }
  };

  const activeNav = !authModal?.showLoginSignUp ? router.pathname : (localActive || '_login')

  const navList = [
    { name: t("Home"), path: '/', icon: <ChartSvg />, activeIcon: <ChartFillSvg /> },
    { name: t("Feeds"), path: '/research', icon: <FeedsSvg />, activeIcon: <FeedsFillSvg /> },
    // 登录失败 || 未登录 => token不存在 隐藏
    // { name: t("Portfolio"), path: '/portfolio', hidden: !hasToken, icon: <StarSvg />, activeIcon: <StarFillSvg /> },
    // 已登录，即user不为null || token存在且user为null，即登录中 隐藏
    // { name: t("Login"), path: '_login', hidden: user !== null || (hasToken && user === null), icon: <UserSvg className="text-xl" />, activeIcon: null },
    { name: t("Portfolio"), path: '/portfolio', icon: <StarSvg />, activeIcon: <StarFillSvg /> },
    { name: t("Exp"), path: '/exp', checkAuth: true, icon: <ExpSvg />, activeIcon: null },
    // { name: t("Dashboard"), path: '/dashboard', icon: <DashboardSvg />, activeIcon: <DashboardFillSvg /> },
    // { name: t("More"), path: '', icon: <MoreSvg />, activeIcon: null },
  ]
  
  const handleNavClick = ({ path }: any) => {
    setLocalActive(path)
    // 关闭登录弹窗
    if (authModal?.open && ['/', '/research'].includes(path)) {
      authModal?.closeModal();
    }
    // 记录事件
    if (path === router.pathname) {
      switch (path) {
        case '/':
          emitClickHome();
          break;
        case '/research':
          emitClickResearch();
        default:
          break;
      }
    }
    // NiceModal.show(NavMoreModal)
    if (['_login'].includes(path)/*  || (!user && ['/exp'].includes(path)) */) {
      authModal?.openSignupModal()
    } else {
      router.push(path);
    }
  }

  useEffect(() => {
    setHasToken(!!getToken());
  }, [user]);

  return (
    <div className={`bg-background-primary-White-900 px-1 py-2 border-0 border-t border-solid border-primary-100-700 justify-between gap-1 flex ${holdUp ? 'pb-6' : ''}`}>
      {navList.map((item) => {
        const isActive = item.path === activeNav
        return (
          <ButtonBase
            key={item.name}
            onClick={() => handleNavClick(item)}
            className={`
              ${isActive ? 'bg-hover-50-700 text-accent-600 dark:text-white' : 'text-secondary-700-100'}
              min-w-[70px] px-2 py-1.5 rounded-lg flex-col justify-between items-center gap-1 inline-flex
            `}
          >
            {isActive ? (item.activeIcon || item.icon) : item.icon}
            <span className="text-[10px] leading-3">{item.name}</span>
          </ButtonBase>
        )
      })}
    </div>
  );
};

export default Navigate;
