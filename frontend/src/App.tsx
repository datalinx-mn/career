import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AssessmentProvider } from './context/AssessmentContext';
import { TOTAL_QUESTIONS } from './data/questions';
import Header from './components/Header';
import LandingPage from './pages/LandingPage';
import AssessmentForm from './pages/AssessmentForm';
import PaymentPage from './pages/PaymentPage';

function App() {
  return (
    <Router>
      <AssessmentProvider totalQuestions={TOTAL_QUESTIONS}>
        <div className="min-h-screen bg-gray-50">
          <Header />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/assessment" element={<AssessmentForm />} />
            <Route path="/payment/:formId" element={<PaymentPage />} />
          </Routes>
        </div>
      </AssessmentProvider>
    </Router>
  );
}

export default App;