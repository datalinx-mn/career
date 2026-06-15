import type { Question, LikertValue } from '../types';
import LikertScale from './LikertScale';

interface QuestionCardProps {
  question: Question;
  value: LikertValue | undefined;
  onChange: (value: LikertValue) => void;
  questionNumber: number;
  totalInAssessment: number;
  totalOverall: number;
}

export default function QuestionCard({ question, value, onChange, questionNumber, totalInAssessment, totalOverall }: QuestionCardProps) {
  return (
    <div className="card-animate bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sm:p-8">
      {/* Question Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="inline-block px-3 py-1 bg-primary-100 text-primary-700 text-xs font-semibold rounded-full">
            {question.assessment}
          </span>
          <span className="inline-block px-3 py-1 bg-teal-50 text-teal-700 text-xs font-medium rounded-full">
            {question.category}
          </span>
        </div>
        <p className="text-sm text-gray-400 font-medium">
          Q{questionNumber} of {totalInAssessment}
        </p>
        <h2 className="text-lg sm:text-xl font-bold text-gray-800 mt-1 leading-relaxed">
          {question.text}
        </h2>
      </div>

      {/* Likert Scale */}
      <LikertScale
        value={value}
        onChange={onChange}
        questionNumber={questionNumber}
        totalInAssessment={totalInAssessment}
      />
    </div>
  );
}