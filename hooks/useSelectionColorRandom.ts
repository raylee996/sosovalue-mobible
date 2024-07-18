import React from "react";

const cssVars = ['--colors-sky', '--colors-green', '--colors-red', '--colors-purple', '--colors-pink', '--colors-orange', '--colors-yellow']

export default function useSelectionColorRandom () {
    const setSelectionColorRandom = () => {
        document.body.style.setProperty('--selectionColor', `var(${cssVars[Math.floor(Math.random() * cssVars.length)]})`)
    }
    React.useEffect(() => {
        document.addEventListener('mousedown', setSelectionColorRandom)
        setSelectionColorRandom()
        return () => {
            document.removeEventListener('mousedown', setSelectionColorRandom)
        }
    }, [])
}