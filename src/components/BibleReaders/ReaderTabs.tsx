import clsx from 'clsx';

interface ReaderTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const ReaderTabs = ({ activeTab, onTabChange }: ReaderTabsProps) => {
  const tabs = [
    { id: 'bible', label: 'Bible' },
    { id: 'cross_refs', label: 'Bookmarks' },
    { id: 'search', label: 'Search' },
    { id: 'histoy', label: 'History' },
  ];
  
  return (
    <div className='multi_layout_main_reader_top !h-[2rem]'>
      {tabs.map(tab => (
        <div 
          key={tab.id}
          className={clsx({ 'bg-[#1673A1] !text-[#ffffff]': activeTab === tab.id })}
          onClick={() => onTabChange(tab.id)}
        >
          {tab.label}
        </div>
      ))}
    </div>
  );
};

export default ReaderTabs;
