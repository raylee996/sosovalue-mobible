import { useEffect, useRef } from "react";
import useTelegramStore from "store/useTelegramStore";
import { parseUA } from "helper/tools";
import { setTelegramStorage } from "helper/storage";

const overflow = 1;

/**
 * 用于修复安卓下的TMA的滚动问题
 */
const useTgMobileRepairer = (scrollableEl: (HTMLElement | (() => HTMLElement))) => {
	const { isTelegram } = useTelegramStore();
	const tsRef = useRef<number>()

	const setupDocument = (enable: boolean) => {
		if (enable) {
			document.documentElement.classList.add('html')
			document.body.style.marginTop = `${overflow}px`
			document.body.style.height = window.innerHeight + overflow + "px"
			document.body.style.paddingBottom = `${overflow}px`
			window.scrollTo(0, overflow)
		} else {
			document.body.style.removeProperty('margin-top')
			document.body.style.removeProperty('height')
			document.body.style.removeProperty('padding-bottom')
			window.scrollTo(0, 0)
		}
	}
	// TODO: 安卓下的TMA才会reload，主要用于弹窗类型的滚动场景。后续需要优化
	const resetTgRepair = () => {
		if (!isTelegram || !parseUA().isAndroid || !scrollableEl) return;
		setTelegramStorage({ isTelegram: true });
		window.location.reload();
	}
	useEffect(() => {
		if (!isTelegram || !parseUA().isAndroid || !scrollableEl) return;
		const _scrollableEl  = typeof scrollableEl === 'function' ? scrollableEl() : scrollableEl;

		setupDocument(true);
		const onTouchStart = (e: TouchEvent) => {
			tsRef.current = e.touches[0].clientY
		}
		const onTouchMove = (e: TouchEvent) => {
			if (_scrollableEl) {
				const scroll = _scrollableEl.scrollTop
				const te = e.changedTouches[0].clientY
				if (scroll <= 0 && tsRef.current! < te) {
					e.preventDefault()
				}
			} else {
				e.preventDefault()
			}
		}

		const onScroll = () => {
			if (window.scrollY < overflow) {
				window.scrollTo(0, overflow)
				if (_scrollableEl) {
					_scrollableEl.scrollTo(0, 0)
				}
			}
		}

		return () => {
			setupDocument(false)
			setTelegramStorage({ isTelegram: true });
			document.documentElement.removeEventListener('touchstart', onTouchStart)
			document.documentElement.removeEventListener('touchmove', onTouchMove)
			window.removeEventListener('scroll', onScroll)
		}
	}, [isTelegram, scrollableEl])

	return { resetTgRepair }
}

export default useTgMobileRepairer;
