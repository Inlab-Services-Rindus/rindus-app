import { TabPanel } from '@/ui/components/molecules/tabPanel/TabPanel';

import { render, fireEvent } from '@testing-library/react';

describe.skip('TabPanel', () => {
  const tabs = [
    {
      label: 'Tab 1',
      content: <div>Tab 1 content</div>,
    },
    {
      label: 'Tab 2',
      content: <div>Tab 2 content</div>,
    },
  ];

  it('should render the first tab by default', () => {
    const { getByText } = render(<TabPanel tabs={tabs} />);

    expect(getByText('Tab 1 content')).toBeInTheDocument();
  });

  it('should switch tabs when clicking on a tab label', () => {
    const { getByText } = render(<TabPanel tabs={tabs} />);

    fireEvent.click(getByText('Tab 2'));

    expect(getByText('Tab 2 content')).toBeInTheDocument();
  });
});
