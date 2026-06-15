import { Link } from 'react-router-dom';
import { ASSESSMENTS } from '../data/questions';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-teal-50/30 to-primary-50/20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal-100 text-teal-700 rounded-full text-sm font-medium mb-6">
            <span className="w-2 h-2 bg-teal-500 rounded-full animate-pulse" />
            AI-Powered Career Intelligence
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
            Discover Your Ideal{' '}
            <span className="bg-gradient-to-r from-teal-500 to-primary-600 bg-clip-text text-transparent">
              Career Path
            </span>
            <br />
            in Under 10 Minutes
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto mb-8 leading-relaxed">
            Take five scientifically validated assessments — RIASEC, MBTI, Big Five, Multiple Intelligence, and Career Matching — and get a personalized AI report with your top 10 career matches, salary projections, and demand insights.
          </p>
          <Link
            to="/assessment"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-teal-500 to-primary-600 text-white text-lg font-bold rounded-2xl shadow-xl hover:shadow-2xl hover:from-teal-600 hover:to-primary-700 transition-all duration-300 active:scale-95"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Start Your Career Assessment
          </Link>
          <p className="text-sm text-gray-400 mt-4">No account needed · Takes ~8-10 minutes · €9.99 one-time</p>
        </div>

        {/* Assessments Grid */}
        <div className="mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 text-center mb-8">
            Five Scientifically Validated Assessments
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {ASSESSMENTS.map((a) => (
              <div key={a.key} className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="text-3xl mb-3">{a.icon}</div>
                <h3 className="font-bold text-gray-800 mb-2">{a.label}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{a.description}</p>
                <div className="mt-3 flex items-center gap-2 text-xs text-gray-400">
                  <span className="font-medium text-primary-600">{a.questionCount} questions</span>
                  <span>·</span>
                  <span>{a.categories.length} categories</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-lg border border-gray-100">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 text-center mb-10">
            How It Works
          </h2>
          <div className="grid sm:grid-cols-4 gap-6">
            {[
              { step: '1', title: 'Take Assessments', desc: 'Answer 290+ questions across 5 evidence-based assessments' },
              { step: '2', title: 'AI Analysis', desc: 'Our AI matches your profile against the international O*NET database' },
              { step: '3', title: 'Unlock Your Report', desc: 'Pay €9.99 to unlock your detailed career report' },
              { step: '4', title: 'Plan Your Future', desc: 'Use your personalized insights to make informed career decisions' },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-primary-500 rounded-2xl flex items-center justify-center text-white font-bold text-xl mx-auto mb-4 shadow-md">
                  {item.step}
                </div>
                <h3 className="font-bold text-gray-800 mb-1">{item.title}</h3>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-16 text-sm text-gray-400">
          <p>Powered by O*NET database · AI-generated insights · GDPR compliant</p>
        </div>
      </div>
    </div>
  );
}