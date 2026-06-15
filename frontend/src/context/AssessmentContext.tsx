import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import type { AssessmentAnswers, LikertValue } from '../types';

interface AssessmentState {
  email: string;
  answers: AssessmentAnswers;
  currentQuestionIndex: number;
  isSubmitting: boolean;
  submittedFormId: string | null;
  error: string | null;
}

type AssessmentAction =
  | { type: 'SET_EMAIL'; payload: string }
  | { type: 'ANSWER_QUESTION'; payload: { questionId: string; value: LikertValue } }
  | { type: 'GO_TO_QUESTION'; payload: number }
  | { type: 'NEXT_QUESTION' }
  | { type: 'PREV_QUESTION' }
  | { type: 'SET_SUBMITTING'; payload: boolean }
  | { type: 'SET_FORM_SUBMITTED'; payload: { formId: string } }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'RESET' };

const initialState: AssessmentState = {
  email: '',
  answers: {},
  currentQuestionIndex: 0,
  isSubmitting: false,
  submittedFormId: null,
  error: null,
};

function assessmentReducer(state: AssessmentState, action: AssessmentAction): AssessmentState {
  switch (action.type) {
    case 'SET_EMAIL':
      return { ...state, email: action.payload };
    case 'ANSWER_QUESTION':
      return {
        ...state,
        answers: { ...state.answers, [action.payload.questionId]: action.payload.value },
      };
    case 'GO_TO_QUESTION':
      return { ...state, currentQuestionIndex: action.payload };
    case 'NEXT_QUESTION':
      return { ...state, currentQuestionIndex: state.currentQuestionIndex + 1 };
    case 'PREV_QUESTION':
      return { ...state, currentQuestionIndex: Math.max(0, state.currentQuestionIndex - 1) };
    case 'SET_SUBMITTING':
      return { ...state, isSubmitting: action.payload };
    case 'SET_FORM_SUBMITTED':
      return { ...state, submittedFormId: action.payload.formId, isSubmitting: false };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isSubmitting: false };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

interface AssessmentContextType {
  state: AssessmentState;
  dispatch: React.Dispatch<AssessmentAction>;
  answeredCount: number;
  progressPercent: number;
}

const AssessmentContext = createContext<AssessmentContextType | undefined>(undefined);

export function AssessmentProvider({ children, totalQuestions }: { children: ReactNode; totalQuestions: number }) {
  const [state, dispatch] = useReducer(assessmentReducer, initialState);
  const answeredCount = Object.keys(state.answers).length;
  const progressPercent = Math.round((answeredCount / totalQuestions) * 100);

  return (
    <AssessmentContext.Provider value={{ state, dispatch, answeredCount, progressPercent }}>
      {children}
    </AssessmentContext.Provider>
  );
}

export function useAssessment(): AssessmentContextType {
  const ctx = useContext(AssessmentContext);
  if (!ctx) throw new Error('useAssessment must be used within AssessmentProvider');
  return ctx;
}