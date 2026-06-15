import { useAssessment } from '../context/AssessmentContext';
import { TOTAL_QUESTIONS } from '../data/questions';
import { Link, useLocation } from 'react-router-dom';

export default function Header() {
  const { answeredCount } = useAssessment();
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 bg-gradient-to-br from-teal-400 to-primary-600 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-teal-600 to-primary-700 bg-clip-text text-transparent">
            CareerMind AI
          </span>
        </Link>

        {!isHome && (
          <div className="text-sm text-gray-500">
            <span className="font-medium text-primary-600">{answeredCount}</span> questions answered
          </div>
        )}
      </div>
    </header>
  );
}