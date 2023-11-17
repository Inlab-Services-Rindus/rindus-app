import { useState } from 'react';

import { AnimatePresence, motion } from 'framer-motion';

import { BEMClassHelper } from '@/ui/helpers/BEMClassHelper';

import '@/ui/components/molecules/tabPanel/TabPanel.scss';

interface TabPanelProps {
  tabs: {
    label: string;
    content: JSX.Element;
  }[];
}

export function TabPanel({ tabs }: TabPanelProps) {
  const [currentTab, setCurrentTab] = useState(0);

  return (
    <div className="tabPanel" data-testid="tab-panel">
      <div className="tabPanel__button-container">
        {tabs?.map((tab, index) => (
          <button
            className={BEMClassHelper(
              'tabPanel',
              'button',
              currentTab === index && ['active'],
            )}
            key={tab.label}
            onClick={() => {
              setCurrentTab(index);
            }}
          >
            {currentTab === index && (
              <motion.span
                layoutId="bubble"
                className="tabPanel__button-overlay"
                style={{ borderRadius: '32px' }}
                transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
              />
            )}
            {tab.label}
          </button>
        ))}
      </div>
      <AnimatePresence>
        <motion.div
          key={currentTab}
          initial={{ opacity: 0, x: currentTab === 0 ? '-100%' : '100%' }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ type: 'spring', bounce: 0.2, duration: 0.8 }}
        >
          {tabs[currentTab].content}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
