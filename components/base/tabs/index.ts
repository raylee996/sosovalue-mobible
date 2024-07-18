import React from "react";
import BaseTabs from './Tabs';
import TabItem from './TabItem';
import type { TabItemProps } from './type';

type TabsType = typeof BaseTabs & { Item: React.FC<TabItemProps> };

const Tabs = BaseTabs as TabsType 
Tabs.Item = TabItem;

export default Tabs;
