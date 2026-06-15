import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAssessment } from '../context/AssessmentContext';
import { QUESTIONS_BY_ASSESSMENT, QUESTIONS, TOTAL_QUESTIONS } from '../data/questions';
import type { AssessmentType, LikertValue } from '../types';
import ProgressBar from '../components/ProgressBar';
import QuestionCard from '../components/QuestionCard';
import NavButtons from '../components/NavButtons';
import { submitForm } from '../api/client';

export default function AssessmentForm() {
  const navigate = useNavigate();
  const { state, dispatch } = useAssessment();

  const [email, setEmail] = useState(state.email);
  const [showEmailPrompt, setShowEmailPrompt] = useState(false);
  const [emailError, setEmailError] = useState('');

  // Derived state
  const currentQuestion = QUESTIONS[state.currentQuestionIndex];
  const currentAssessment = currentQuestion?.assessment as AssessmentType;
  const currentAssessmentQuestions = QUESTIONS_BY_ASSESSMENT[currentAssessment] || [];
  const questionNumberInAssessment = currentAssessmentQuestions.findIndex(q => q.id === currentQuestion?.id) + 1;
  const isFirst = state.currentQuestionIndex === 0;
  const isLast = state.currentQuestionIndex === TOTAL_QUESTIONS - 1;
  const currentValue = currentQuestion ? state.answers[currentQuestion.id] as LikertValue | undefined : undefined;
  const isAnswered = currentQuestion ? currentQuestion.id in state.answers : false;

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleAnswer = useCallback((value: LikertValue) => {
    if (currentQuestion) {
      dispatch({ type: 'ANSWER_QUESTION', payload: { questionId: currentQuestion.id, value } });
    }
  }, [currentQuestion, dispatch]);

  const handleNext = useCallback(() => {
    if (!currentQuestion) return;

    if (isLast) {
      setShowEmailPrompt(true);
    } else {
      dispatch({ type: 'NEXT_QUESTION' });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentQuestion, isLast, dispatch]);

  const handleBack = useCallback(() => {
    dispatch({ type: 'PREV_QUESTION' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [dispatch]);

  const handleSubmit = async () => {
    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address');
      return;
    }
    setEmailError('');
    dispatch({ type: 'SET_SUBMITTING', payload: true });
    dispatch({ type: 'SET_EMAIL', payload: email });

    try {
      // Submit the form to the backend
      const formResult = await submitForm({
        email,
        answers: state.answers,
      });

      // Store the form ID and navigate to payment page
      dispatch({ type: 'SET_FORM_SUBMITTED', payload: { formId: formResult.id } });
      navigate(`/payment/${formResult.id}`);
    } catch (err: any) {
      dispatch({
        type: 'SET_ERROR',
        payload: err?.response?.data?.detail || 'Something went wrong. Please try again.',
      });
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showEmailPrompt) return;
      if (e.key === 'ArrowRight' && isAnswered) {
        handleNext();
      } else if (e.key === 'ArrowLeft' && !isFirst) {
        handleBack();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handleBack, isFirst, isAnswered, showEmailPrompt]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Progress */}
        <ProgressBar
          currentIndex={state.currentQuestionIndex}
          totalQuestions={TOTAL_QUESTIONS}
          answeredCount={Object.keys(state.answers).length}
          currentAssessment={currentAssessment}
        />

        {/* Error */}
        {state.error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm font-medium">
            {state.error}
          </div>
        )}

        {/* Question Card */}
        {currentQuestion && !showEmailPrompt && (
          <QuestionCard
            key={currentQuestion.id}
            question={currentQuestion}
            value={currentValue}
            onChange={handleAnswer}
            questionNumber={questionNumberInAssessment}
            totalInAssessment={currentAssessmentQuestions.length}
            totalOverall={TOTAL_QUESTIONS}
          />
        )}

        {/* Navigation */}
        {!showEmailPrompt && (
          <NavButtons
            onNext={handleNext}
            onBack={handleBack}
            isFirst={isFirst}
            isLast={isLast}
            isAnswered={!!isAnswered}
            isSubmitting={state.isSubmitting}
          />
        )}

        {/* Email Prompt */}
        {showEmailPrompt && (
          <div className="card-animate bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sm:p-8">
            <div className="text-center mb-6">
              <div className="text-4xl mb-3">🎉</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                You've completed all questions!
              </h2>
              <p className="text-gray-500">
                Enter your email to submit your assessment and continue to payment.
                Your personalized AI career report costs just <strong>€9.99</strong>.
              </p>
            </div>

            <div className="max-w-md mx-auto">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setEmailError('');
                }}
                placeholder="you@email.com"
                className={`w-full px-4 py-3 rounded-xl border-2 text-gray-800 text-lg
                  focus:outline-none focus:ring-2 transition-all duration-200
                  ${emailError
                    ? 'border-red-300 focus:ring-red-200 focus:border-red-400'
                    : 'border-gray-200 focus:ring-primary-200 focus:border-primary-400'
                  }`}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              />
              {emailError && (
                <p className="text-red-500 text-sm mt-1">{emailError}</p>
              )}

              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => {
                    setShowEmailPrompt(false);
                    dispatch({ type: 'GO_TO_QUESTION', payload: 0 });
                  }}
                  className="flex-1 px-6 py-3 rounded-xl font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all"
                >
                  Review Answers
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={state.isSubmitting}
                  className="flex-1 px-6 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-teal-500 to-primary-600 hover:from-teal-600 hover:to-primary-700 shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
                >
                  {state.isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Submitting...
                    </span>
                  ) : (
                    'Submit & Continue — €9.99'
                  )}
                </button>
              </div>

              <p className="text-xs text-gray-400 text-center mt-4">
                Your data is secure and will never be shared. Secure payment processing.
              </p>
            </div>
          </div>
        )}

        {/* Assessment Info */}
        <div className="mt-6 text-center text-xs text-gray-400">
          <p>Use ← and → arrow keys to navigate · Your progress is saved locally</p>
        </div>
      </div>
    </div>
  );
}