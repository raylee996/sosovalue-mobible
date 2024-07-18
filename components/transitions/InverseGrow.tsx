import { Transition, TransitionStatus } from 'react-transition-group';
import React, { useRef } from 'react';

const duration = 225;

const defaultStyle = {
    transition: `opacity ${duration}ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, transform 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms`,
    opacity: 0,
}

const transitionStyles = {
    entering: { opacity: 0, transform: 'scale(1.25)' },
    entered: { opacity: 1 },
    exiting: { opacity: 0, transform: 'scale(1.25)' },
    exited: { opacity: 0 },
};
export default React.forwardRef<HTMLDivElement, React.PropsWithChildren<{ in?: boolean }>>(function InverseGrow({ in: inProp, children, ...props }, ref) {
    const nodeRef = useRef(null);
    return (
        <Transition nodeRef={nodeRef} in={inProp} timeout={duration} {...props}>
            {state => {
                return React.cloneElement(children as React.ReactElement, {
                    ref: nodeRef,
                    style: {
                        ...defaultStyle,
                        ...transitionStyles[state as Exclude<TransitionStatus, 'unmounted'>]
                    }
                })
            }}
        </Transition>
    );
})