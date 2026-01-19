interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md' | 'lg';
}

const getStatusConfig = (status: string) => {
  switch (status) {
    case 'PUBLISHED':
      return {
        label: 'Open',
        colors: 'bg-amber-100 text-amber-800 border-amber-200',
        icon: '🔄'
      };
    case 'UNDER_REVIEW':
      return {
        label: 'In Progress',
        colors: 'bg-blue-100 text-blue-800 border-blue-200',
        icon: '⚡'
      };
    case 'COMPLETED':
      return {
        label: 'Completed',
        colors: 'bg-green-100 text-green-800 border-green-200',
        icon: '✅'
      };
    case 'DRAFT':
      return {
        label: 'Draft',
        colors: 'bg-gray-100 text-gray-800 border-gray-200',
        icon: '📝'
      };
    default:
      return {
        label: status,
        colors: 'bg-gray-100 text-gray-800 border-gray-200',
        icon: '❓'
      };
  }
};

const getSizeClasses = (size: 'sm' | 'md' | 'lg') => {
  switch (size) {
    case 'sm':
      return 'px-2 py-1 text-xs';
    case 'md':
      return 'px-3 py-1.5 text-sm';
    case 'lg':
      return 'px-4 py-2 text-base';
    default:
      return 'px-3 py-1.5 text-sm';
  }
};

export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const config = getStatusConfig(status);
  const sizeClasses = getSizeClasses(size);
  
  return (
    <span className={`
      inline-flex items-center gap-1.5 rounded-full font-medium border
      ${config.colors} ${sizeClasses}
    `}>
      <span className="leading-none">{config.icon}</span>
      {config.label}
    </span>
  );
}