import { Link, useParams } from 'react-router-dom';

export default function PaymentPage() {
  const { formId } = useParams<{ formId: string }>();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-primary-50 flex items-center justify-center px-4 py-8">
      <div className="max-w-lg w-full">
        <div className="card-animate bg-white rounded-3xl shadow-xl border border-gray-100 p-8 sm:p-12 text-center">
          {/* Report Ready Icon */}
          <div className="w-20 h-20 bg-gradient-to-br from-teal-400 to-primary-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3">
            Your Report is Ready! 🎉
          </h1>
          <p className="text-gray-500 mb-6">
            Your personalized AI career report has been generated. Pay <strong>€9.99</strong> once to unlock it and receive it via email.
          </p>

          {/* Price Box */}
          <div className="bg-gradient-to-br from-teal-50 to-primary-50 rounded-2xl p-6 mb-6 border border-teal-100">
            <p className="text-sm text-teal-600 font-medium mb-1">One-time payment</p>
            <p className="text-4xl font-extrabold text-gray-900">€9.99</p>
            <p className="text-xs text-gray-400 mt-1">VAT included</p>
          </div>

          {/* Payment Placeholder */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6 mb-6">
            <div className="text-3xl mb-2">🔒</div>
            <h3 className="font-bold text-yellow-800 mb-1">Payment Processing Coming Soon</h3>
            <p className="text-sm text-yellow-700">
              A professional payment integration (QPay) will be added here shortly.
              Your assessment has been saved and your report is ready.
            </p>
            <div className="mt-4 inline-block px-6 py-3 bg-gray-200 text-gray-500 rounded-xl font-semibold cursor-not-allowed">
              Pay €9.99 — Coming Soon
            </div>
            <p className="text-xs text-yellow-600 mt-2">
              Form reference: {formId ? formId.substring(0, 12) + '...' : 'N/A'}
            </p>
          </div>

          <div className="bg-blue-50 rounded-xl p-4 text-left text-sm text-blue-700 mb-6">
            <p className="font-medium mb-1">📧 What you'll get in your report:</p>
            <ul className="list-disc list-inside text-blue-600 space-y-0.5">
              <li>Top 10 career matches based on your profile</li>
              <li>Future salary projections for each career</li>
              <li>Market demand insights and growth trends</li>
              <li>Personalized recommendations for education paths</li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/"
              className="px-8 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-all"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}