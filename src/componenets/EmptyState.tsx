import { ReactNode } from 'react';
import { Inbox } from 'lucide-react';

interface EmptyStateProps {
  message: string;
  icon?: ReactNode;
  action?: ReactNode;
}

const EmptyState: React.FC<EmptyStateProps> = ({ message, icon, action }) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center text-white bg-white/5 border border-white/10 rounded-2xl shadow-lg">
      <div className="text-indigo-400 mb-4">
        {icon || <Inbox size={48} />}
      </div>
      <h2 className="text-xl font-semibold mb-2">{message}</h2>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
};

export default EmptyState;
