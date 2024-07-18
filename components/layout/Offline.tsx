import React from 'react';
import Header from "components/header";
import NavigateWrap from './NavigateWrap';
import NetworkTips from './NetworkTips';
import Retry from './Retry';

export default function Offline() {
  return (
    <NavigateWrap className="h-screen">
      <div className="pb-[82px] h-full flex flex-col items-stretch overflow-y-auto">
        <NetworkTips />
        <Header />
        <Retry/>
      </div>
    </NavigateWrap>
  )
}
