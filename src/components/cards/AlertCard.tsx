import React from 'react';
import { Zap } from 'lucide-react';

interface AlertCardProps {
  title: string;
  description: string;
  amount: number;
  actionLabel?: string;
  onAction?: () => void;
}

export default function AlertCard({
  title,
  description,
  amount,
  actionLabel = 'Pay Now',
  onAction,
}: AlertCardProps) {
  return (
    <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-6 rounded-3xl text-white shadow-lg shadow-indigo-200">
      <div className="flex justify-between items-start mb-4">
        <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
          <Zap className="w-5 h-5 text-white" />
        </div>
        <span className="text-xs bg-white/20 px-2 py-1 rounded backdrop-blur-sm">Alert</span>
      </div>
      <h4 className="font-bold text-lg mb-1">{title}</h4>
      <p className="text-indigo-100 text-sm mb-4">{description}</p>
      <div className="flex justify-between items-center">
        <span className="font-bold text-2xl">¥{amount.toLocaleString()}</span>
        <button
          onClick={onAction}
          className="text-xs bg-white text-indigo-600 px-3 py-1.5 rounded-full font-bold hover:bg-indigo-50 transition"
        >
          {actionLabel}
        </button>
      </div>
    </div>
  );
}
