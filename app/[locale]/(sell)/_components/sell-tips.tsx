"use client";

import {
  Lightbulb,
  CheckCircle,
  Circle,
  ArrowRight,
} from "@phosphor-icons/react";

interface TipItem {
  text: string;
  completed: boolean;
}

const defaultTips: TipItem[] = [
  { text: "Use natural lighting for photos", completed: true },
  { text: "Include measurements and details", completed: true },
  { text: "Show any flaws honestly", completed: false },
];

interface SellTipsProps {
  tips?: TipItem[];
}

export function SellTips({ tips = defaultTips }: SellTipsProps) {
  return (
    <div className="rounded-xl bg-linear-to-br from-zinc-900 to-zinc-800 p-4 text-white">
      <div className="flex items-center gap-2 mb-2.5">
        <Lightbulb className="h-4 w-4 text-amber-400" weight="duotone" />
        <span className="text-sm font-semibold">Seller Tips</span>
      </div>
      <ul className="space-y-2 text-sm text-zinc-300">
        {tips.map((tip, index) => (
          <li key={index} className="flex items-start gap-2">
            {tip.completed ? (
              <CheckCircle className="h-3.5 w-3.5 text-green-400 mt-0.5 shrink-0" weight="fill" />
            ) : (
              <Circle className="h-3.5 w-3.5 text-zinc-500 mt-0.5 shrink-0" />
            )}
            <span>{tip.text}</span>
          </li>
        ))}
      </ul>
      <div className="mt-3 pt-3 border-t border-zinc-700">
        <a
          href="#"
          className="inline-flex items-center gap-1 text-xs font-medium text-zinc-400 hover:text-white transition-colors"
        >
          View seller guide
          <ArrowRight className="h-3 w-3" />
        </a>
      </div>
    </div>
  );
}
