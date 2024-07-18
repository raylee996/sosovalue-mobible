import React, { useEffect, useState } from 'react';
import { cn } from 'helper/cn';
import { splitNum } from 'helper/tools';

type Props = {
    total: number;
    rate: number;
    unit?: string;
    className?: string;
}

const Counter = ({ total, className, unit, rate }: Props) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let start = 0;
        const end = total;
        const duration = 2000; // 2 seconds
        const increment = end / (duration / 50); // Calculate the increment

        const timer = setInterval(() => {
            start += increment;
            if (start >= end) {
                clearInterval(timer);
                setCount(end);
            } else {
                setCount(Math.floor(start));
            }
        }, 50);

        return () => clearInterval(timer);
    }, [total]);

    return (
        <div className={cn(className)}>{unit}{splitNum(count * rate)}+</div>
    );
};

export default Counter;
