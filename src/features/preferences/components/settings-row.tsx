// Reusable Components
interface SettingRowProps {
  icon: React.ReactNode;
  label: string;
  subtitle?: string;
  control: React.ReactNode;
}

export function SettingRow({ icon, label, subtitle, control }: SettingRowProps) {
  return (
    <div className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg">
      <div className="flex items-center space-x-3 flex-1">
        <div className="text-gray-600 dark:text-white">{icon}</div>
        <div>
          <p className="font-medium text-gray-900 dark:text-white">{label}</p>
          {subtitle && (
            <p className="text-xs text-gray-500 dark:text-gray-300 mt-0.5">{subtitle}</p>
          )}
        </div>
      </div>
      <div>{control}</div>
    </div>
  );
}

export default SettingRow;
