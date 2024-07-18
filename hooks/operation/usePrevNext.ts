import { useMemo, useState } from "react"

export const usePrevNext = (length: number) => {
    const [step, setStep] = useState(0)
    const prev = () => {
        if (hasPrev) {
            setStep(step - 1)
        }
    }
    const next = () => {
        if (hasNext) {
            setStep(step + 1)
        }
    }
    const hasPrev = step > 0
    const hasNext = step < length - 1
    return useMemo(() => ({ step, hasNext, hasPrev, prev, next }), [step, length])
}