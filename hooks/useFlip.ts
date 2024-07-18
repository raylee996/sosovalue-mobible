import React from 'react'
import { isBrowser } from 'helper/tools'

type Props = {
    selector: string;
    deps: React.DependencyList;
    transition?: string;
}

const useFlip = ({ selector, deps, transition }: Props) => {
    const domData = React.useRef<{
        domList: HTMLDivElement[],
        rects: { left: any, top: any }[]
    }>({ domList: [], rects: [] })
    const run = () => {
        const domList = [...(document.querySelectorAll(selector) as any as HTMLDivElement[])]
        const rects = domList.map(div => {
            const { left, top } = div.getBoundingClientRect()
            return { left, top }
        })
        domData.current = {
            domList,
            rects
        }
    }
    if (isBrowser) {
        React.useLayoutEffect(() => {
            domData.current.domList.forEach((div, index) => {
                const oldRect = domData.current.rects[index]
                const { left, top } = div.getBoundingClientRect()
                div.style.transition = ''
                div.style.transform = `translate(${oldRect.left - left}px,${oldRect.top - top}px)`
                requestAnimationFrame(() => {
                    div.style.transition = transition || 'transform .2s ease'
                    div.style.transform = `translate(0, 0)`

                })
            })
        }, deps)
    }
    React.useEffect(() => {
        return () => {
            domData.current = { domList: [], rects: [] }
        }
    }, deps)

    return {
        run
    }
}

export default useFlip