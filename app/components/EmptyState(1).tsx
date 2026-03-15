import { Inbox } from 'lucide-react';

interface Props {
  message?: string;
  title?: string;
}

export default function EmptyState({ message = "We couldn't find any items here.", title = "No Data Available" }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center w-full">
      <div className="w-20 h-20 bg-brand-yellow/10 rounded-full flex items-center justify-center mb-6">
        <Inbox className="w-10 h-10 text-brand-yellow" />
      </div>
      <h3 className="text-xl font-bold text-neutral-900 mb-2">{title}</h3>
      <p className="text-neutral-500 max-w-sm mx-auto">{message}</p>
    </div>
  );
}
