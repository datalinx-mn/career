interface NavButtonsProps {
  onNext: () => void;
  onBack: () => void;
  isFirst: boolean;
  isLast: boolean;
  isAnswered: boolean;
  isSubmitting: boolean;
}

export default function NavButtons({ onNext, onBack, isFirst, isLast, isAnswered, isSubmitting }: NavButtonsProps) {
  return (
    <div className="flex justify-between items-center mt-6 gap-4">
      <button
        onClick={onBack}
        disabled={isFirst || isSubmitting}
        className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center gap-2 ${
          isFirst
            ? 'text-gray-300 cursor-not-allowed'
            : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100 border border-gray-200'
        }`}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back
      </button>

      <span className={`text-sm font-medium transition-colors duration-300 ${
        isAnswered ? 'text-green-600' : 'text-orange-500'
      }`}>
        {isAnswered ? '✓ Answered' : 'Please select an answer'}
      </span>

      <button
        onClick={onNext}
        disabled={!isAnswered || isSubmitting}
        className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center gap-2 ${
          isAnswered && !isSubmitting
            ? 'bg-primary-600 text-white hover:bg-primary-700 shadow-md hover:shadow-lg active:scale-95'
            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
        }`}
      >
        {isSubmitting ? (
          <>
            <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Processing...
          </>
        ) : isLast ? (
          <>
            Complete Assessment
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </>
        ) : (
          <>
            Next
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </>
        )}
      </button>
    </div>
  );
}