import { useState } from 'react';

import { BEMClassHelper } from '@/helpers/BEMClassHelper';
import '@/molecules/tabPanel/TabPanel.scss';

interface TabPanelProps {
  tabs: {
    label: string;
    content: JSX.Element;
  }[];
}

export function TabPanel({ tabs }: TabPanelProps) {
  const [currentTab, setCurrentTab] = useState(0);

  return (
    <div className="tabPanel">
      <div className="tabPanel__button-container">
        {tabs?.map((tab, index) => (
          <button
            className={BEMClassHelper(
              'tabPanel',
              'button',
              currentTab === index ? ['active'] : [],
            )}
            key={tab.label}
            onClick={() => {
              setCurrentTab(index);
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {tabs[currentTab].content}
    </div>
  );
}
