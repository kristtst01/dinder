import { Link } from 'react-router-dom';

export function WeekplanCard({
  id,
  title,
  createdAt,
}: {
  id: string;
  title: string;
  createdAt: string;
}) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <Link to={`/weekplans/${id}`} className="block h-full">
      <div className="cursor-pointer bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-5 hover:shadow-md transition">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">{title}</h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm">{formatDate(createdAt)}</p>
      </div>
    </Link>
  );
}
