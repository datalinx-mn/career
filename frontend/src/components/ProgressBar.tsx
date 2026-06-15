import { ASSESSMENTS } from '../data/questions';
import type { AssessmentType } from '../types';

interface ProgressBarProps {
  currentIndex: number;
  totalQuestions: number;
  answeredCount: number;
  currentAssessment: AssessmentType;
}

export default function ProgressBar({ currentIndex, totalQuestions, answeredCount, currentAssessment }: ProgressBarProps) {
  const percent = Math.round((answeredCount / totalQuestions) * 100);
  const assessment = ASSESSMENTS.find(a => a.key === currentAssessment);
  const assessmentIndex = ASSESSMENTS.findIndex(a => a.key === currentAssessment);
  const totalAssessments = ASSESSMENTS.length;

  return (
    <div className="w-full mb-6">
      {/* Step Indicator */}
      <div className="flex items-center justify-between mb-3">
        {ASSESSMENTS.map((a, i) => (
          <div key={a.key} className="flex items-center">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold transition-all duration-300 ${
              i < assessmentIndex
                ? 'bg-teal-500 text-white'
                : i === assessmentIndex
                ? 'bg-primary-600 text-white ring-2 ring-primary-300 ring-offset-2'
                : 'bg-gray-200 text-gray-500'
            }`}>
              {i < assessmentIndex ? '✓' : i + 1}
            </div>
            {i < totalAssessments - 1 && (
              <div className={`hidden sm:block w-8 md:w-16 h-1 mx-1 rounded ${
                i < assessmentIndex ? 'bg-teal-400' : 'bg-gray-200'
              }`} />
            )}
          </div>
        ))}
      </div>

      {/* Labels */}
      <div className="hidden sm:flex justify-between mb-4 text-xs text-gray-500">
        {ASSESSMENTS.map((a, i) => (
          <span key={a.key} className={`font-medium ${
            i === assessmentIndex ? 'text-primary-700' : ''
          }`}>
            {a.label.split(' ')[0]}
          </span>
        ))}
      </div>

      {/* Main Progress Bar */}
      <div className="bg-gray-100 rounded-full h-3 overflow-hidden shadow-inner">
        <div
          className="h-full rounded-full bg-gradient-to-r from-teal-400 via-primary-500 to-primary-600 transition-all duration-500 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>

      {/* Stats */}
      <div className="flex justify-between mt-2 text-sm text-gray-600">
        <span className="font-medium text-primary-700">
          {assessment?.icon} {assessment?.label.split(' ').slice(1).join(' ') || 'Assessment'}
        </span>
        <span className="text-gray-500">
          <span className="font-bold text-primary-600">{answeredCount}</span> / {totalQuestions} answered
          {' · '}
          <span className="font-bold text-teal-600">{percent}%</span>
        </span>
      </div>
    </div>
  );
}