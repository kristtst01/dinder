import { ChevronDown, ChevronRight } from 'lucide-react';

interface ExpandableSectionProps {
  title: string;
  icon: React.ReactNode;
  expanded?: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

export function ExpandableSection({
  title,
  icon,
  expanded,
  onToggle,
  children,
}: ExpandableSectionProps) {
  return (
    <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700"
      >
        <div className="flex items-center space-x-3">
          <div className="text-gray-600 dark:text-white">{icon}</div>
          <span className="font-bold text-gray-900 dark:text-white">{title}</span>
        </div>
        {expanded ? (
          <ChevronDown className="w-5 h-5 text-gray-400" />
        ) : (
          <ChevronRight className="w-5 h-5 text-gray-400" />
        )}
      </button>
      {expanded && (
        <div className="px-4 pb-4 border-t border-gray-100 dark:border-gray-700">
          <div className="pt-4">{children}</div>
        </div>
      )}
    </section>
  );
}
