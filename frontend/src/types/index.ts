export interface Question {
  id: string;
  assessment: AssessmentType;
  category: string;
  text: string;
}

export type AssessmentType = 'RIASEC' | 'MBTI' | 'BIG5' | 'MI' | 'CM';

export interface AssessmentInfo {
  key: AssessmentType;
  label: string;
  description: string;
  icon: string;
  questionCount: number;
  categories: string[];
}

export type LikertValue = 1 | 2 | 3 | 4 | 5;

export interface Answer {
  questionId: string;
  value: LikertValue;
}

export interface AssessmentAnswers {
  [questionId: string]: LikertValue;
}

export interface FormData {
  email: string;
  answers: AssessmentAnswers;
}

export interface FormSubmitResponse {
  id: string;
  status: string;
  email: string;
}

export interface ReportResponse {
  id: string;
  status: 'pending' | 'processing' | 'ready';
  email: string;
}