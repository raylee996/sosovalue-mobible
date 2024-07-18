import React, { useCallback, useRef, useState } from "react";

export interface UseControlledProps<T = unknown> {
    /**
     * 双向绑定时保留原始值
     */
    controlled: T | undefined;
    /**
     * 非双向绑定时的默认值
     */
    default: unknown;
    onChange?: (value: T) => void;
}
/**
 * 主要用于外部未传入需要受控的属性时，可以自己内部接管，比如：input 的 value
 * 
 * @example
 * ```ts
 * const Input: React.FC<{ value?: string }> = ({ value: valueProp }) => {
 *      const [ value, setValue ] = useControlled({ default: false, controlled: valueProp });
 *      
 *      return <input value={value} />
 * }
 * 
 * ```
 */
export function useControlled<T = unknown>(
    props: UseControlledProps<T>,
): [T, (newValue: T) => void] {
    const { controlled, default: defaultProp, onChange } = props;
    // isControlled 在hooks依赖项列表中被忽略，因为它永远不应该改变。
    const { current: isControlled } = useRef(controlled !== undefined);
    const [valueState, setValue] = useState(defaultProp);
    const value = isControlled ? controlled : valueState;

    const setValueIfUncontrolled = useCallback((newValue: T) => {
        if (!isControlled) {
            setValue(newValue);
        }
        typeof onChange === 'function' && onChange(newValue);
    }, []);

    return [value as T, setValueIfUncontrolled];
}
