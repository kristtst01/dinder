import { Link } from "react-router";

export function WeekplanCard({
  title,
  author,
  onClick,
}: {
  title: string;
  author: string;
  onClick?: () => void;
}) {
  return (
    <Link to="/weekplanner" className="block h-full">
    <div
      onClick={onClick}
      className="cursor-pointer bg-white rounded-2xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition"
    >
      <h2 className="text-xl font-semibold text-gray-900 mb-1">{title}</h2>
      <p className="text-gray-500 text-sm">av {author}</p>
    </div>
    </Link>
  );
}
