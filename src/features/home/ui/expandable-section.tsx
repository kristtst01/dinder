import { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ExpandableSectionProps<T> {
  title: string;
  items: T[];
  renderItem: (item: T) => React.ReactNode;
  initialCarouselCount?: number;
}

export function ExpandableSection<T>({
  title,
  items,
  renderItem,
  initialCarouselCount = 10,
}: ExpandableSectionProps<T>) {
  const [isGridMode, setIsGridMode] = useState(false);
  const [visibleCount, setVisibleCount] = useState(initialCarouselCount);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const displayedItems = isGridMode ? items.slice(0, visibleCount) : items.slice(0, initialCarouselCount);
  const hasMore = isGridMode && visibleCount < items.length;

  const handleScroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    
    const container = scrollContainerRef.current;
    // Calculate width of 3 cards plus gaps (3 cards * width + 2 gaps of 12px)
    const cardWidth = (container.clientWidth - 24) / 3; // 24px = 2 gaps between 3 cards
    const scrollAmount = (cardWidth * 3) + 24; // 3 cards + 2 gaps
    
    if (direction === 'left') {
      container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    } else {
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleShowMore = () => {
    setVisibleCount(prev => Math.min(prev + 8, items.length));
  };

  const toggleMode = () => {
    setIsGridMode(!isGridMode);
    if (!isGridMode) {
      setVisibleCount(initialCarouselCount);
    }
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
          {title}
        </h3>
        <button
          onClick={toggleMode}
          className="px-4 py-2 text-sm font-medium text-orange-500 hover:text-orange-600 dark:text-orange-400 dark:hover:text-orange-300 transition-colors"
        >
          {isGridMode ? 'Collapse' : 'View All'}
        </button>
      </div>

      {/* Carousel Mode */}
      {!isGridMode && (
        <div 
          className="relative group"
          onMouseEnter={() => {
            setShowLeftArrow(true);
            setShowRightArrow(true);
          }}
          onMouseLeave={() => {
            setShowLeftArrow(false);
            setShowRightArrow(false);
          }}
        >
          {/* Left Arrow */}
          <button
            onClick={() => handleScroll('left')}
            className={`absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 p-3 rounded-full shadow-lg transition-all duration-200 ${
              showLeftArrow ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          </button>

          {/* Carousel Container */}
          <div
            ref={scrollContainerRef}
            className="flex gap-3 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-4 transition-all duration-300 scrollbar-hide"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            {displayedItems.map((item, index) => (
              <div
                key={index}
                className="flex-none snap-start scale-90 origin-top"
                style={{ width: 'calc((100% - 24px) / 3)' }}
              >
                {renderItem(item)}
              </div>
            ))}
          </div>

          {/* Right Arrow */}
          <button
            onClick={() => handleScroll('right')}
            className={`absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 p-3 rounded-full shadow-lg transition-all duration-200 ${
              showRightArrow ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
            aria-label="Scroll right"
          >
            <ChevronRight className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          </button>
        </div>
      )}

      {/* Grid Mode */}
      {isGridMode && (
        <div className="transition-all duration-300">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {displayedItems.map((item, index) => (
              <div key={index}>
                {renderItem(item)}
              </div>
            ))}
          </div>

          {/* Show More Button */}
          {hasMore && (
            <div className="flex justify-center mt-8">
              <button
                onClick={handleShowMore}
                className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
              >
                Show More
              </button>
            </div>
          )}
        </div>
      )}

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
