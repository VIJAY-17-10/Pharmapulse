import React from 'react';
import { ShieldAlert, AlertTriangle } from 'lucide-react';

export const DisclaimerBanner: React.FC = () => {
  return (
    <div className="bg-amber-50/90 border border-amber-200/90 rounded-xl p-3.5 sm:px-4 text-xs text-amber-900 shadow-sm flex items-start gap-3">
      <div className="p-1 rounded bg-amber-100 text-amber-800 flex-shrink-0 mt-0.5">
        <ShieldAlert className="w-4 h-4" />
      </div>
      <div className="flex-1 leading-relaxed">
        <strong className="font-semibold block sm:inline mr-1 text-amber-950">
          Public Health Decision-Support Notice:
        </strong>
        PharmaPulse is an early-warning decision-support prototype. A detected demand anomaly does not confirm disease, outbreak, or causation. Signals indicate <em>“Potential anomaly detected — verification recommended”</em> and require cross-validation using authorized epidemiological and clinical surveillance data.
      </div>
    </div>
  );
};
