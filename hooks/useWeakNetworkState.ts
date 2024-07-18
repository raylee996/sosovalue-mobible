import React, { useEffect, useRef, useState } from 'react';

export default function useWeakNetworkState() {
  const [weakNetworkState, setWeakNetworkState] = useState(false);
  const changeNetworkStateTimer = useRef<NodeJS.Timeout | null>(null);
  
	useEffect(() => {
		// @ts-ignore
		const connection = window.navigator.connection;

		if (connection) {
      const changeNetworkState = () => {
        // NetworkInformation 接口的 effectiveType 只读属性返回连接的有效类型，为 slow-2g、2g、3g 或 4g 之一。该值是使用最近观察到的往返时间和下行链路值的组合来确定的
        if (connection.effectiveType === '4g' || connection.effectiveType === '3g') {
          setWeakNetworkState(false);
        } else {
          setWeakNetworkState(true);
        }
      }
			const connectionChange = () => {
        if (changeNetworkStateTimer.current) {
          clearTimeout(changeNetworkStateTimer.current);
        }
        // 1秒内网络抖动不重置状态
        changeNetworkStateTimer.current = setTimeout(() => {
          changeNetworkState();
          changeNetworkStateTimer.current = null;
        }, 1000);
			}

			connection.addEventListener('change', connectionChange);

      changeNetworkState();

			return () => {
				connection.removeEventListener('change', connectionChange);
			}
		}
	}, []);

  return {weakNetworkState};
}
