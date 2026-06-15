import type { LikertValue } from '../types';

interface LikertScaleProps {
  value: LikertValue | undefined;
  onChange: (value: LikertValue) => void;
  questionNumber: number;
  totalInAssessment: number;
}

const LABELS: Record<LikertValue, string> = {
  1: 'Strongly Disagree',
  2: 'Disagree',
  3: 'Neutral',
  4: 'Agree',
  5: 'Strongly Agree',
};

const COLORS: Record<LikertValue, string> = {
  1: 'bg-red-100 border-red-300 text-red-700 hover:bg-red-200',
  2: 'bg-orange-100 border-orange-300 text-orange-700 hover:bg-orange-200',
  3: 'bg-yellow-100 border-yellow-300 text-yellow-700 hover:bg-yellow-200',
  4: 'bg-lime-100 border-lime-300 text-lime-700 hover:bg-lime-200',
  5: 'bg-green-100 border-green-300 text-green-700 hover:bg-green-200',
};

const ACTIVE_COLORS: Record<LikertValue, string> = {
  1: 'bg-red-500 border-red-600 text-white ring-2 ring-red-300',
  2: 'bg-orange-500 border-orange-600 text-white ring-2 ring-orange-300',
  3: 'bg-yellow-500 border-yellow-600 text-white ring-2 ring-yellow-300',
  4: 'bg-lime-500 border-lime-600 text-white ring-2 ring-lime-300',
  5: 'bg-green-500 border-green-600 text-white ring-2 ring-green-300',
};

export default function LikertScale({ value, onChange, questionNumber, totalInAssessment }: LikertScaleProps) {
  const values: LikertValue[] = [1, 2, 3, 4, 5];

  return (
    <div className="w-full">
      <div className="flex justify-between mb-2 px-1">
        <span className="text-xs font-medium text-gray-500">Strongly<br className="sm:hidden"/>Disagree</span>
        <span className="text-xs font-medium text-gray-400">Neutral</span>
        <span className="text-xs font-medium text-gray-500 text-right">Strongly<br className="sm:hidden"/>Agree</span>
      </div>
      <div className="flex justify-between gap-1 sm:gap-2">
        {values.map((v) => (
          <button
            key={v}
            onClick={() => onChange(v)}
            className={`flex-1 py-3 sm:py-4 rounded-xl border-2 font-semibold text-sm sm:text-base transition-all duration-200 ${
              value === v
                ? ACTIVE_COLORS[v]
                : COLORS[v]
            }`}
            aria-label={LABELS[v]}
          >
            <span className="block text-lg sm:text-xl font-bold">{v}</span>
            <span className="hidden sm:block text-[10px] mt-0.5 opacity-75">{LABELS[v].split(' ').pop()}</span>
          </button>
        ))}
      </div>
      {value && (
        <p className="text-center mt-2 text-sm font-medium text-gray-600">
          {LABELS[value]}
        </p>
      )}
    </div>
  );
}