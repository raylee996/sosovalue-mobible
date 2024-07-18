import React from "react";


export default function removeTouchMove () {

    const remove = (e:any) => {
        if(e._isScroller) return
        e.preventDefault()
        
    }
    React.useEffect(() => {
        
        document.addEventListener('touchmove',(e) => {
            remove(e)
        })
        return () => {
            document.removeEventListener('touchmove',remove)
        }
    }, [])
}