export type Course = {
  id: string;
  code: string;
  name: string;
  semester: string;
};

export type Student = {
  id: string;
  student_no: string;
  full_name: string;
  email: string;
};

export type Assignment = {
  id: string;
  course_id: string;
  name: string;
  category: 'Homework' | 'Final' | 'Midterm';
  weight: number;    // 0 to 1
  max_score: number; // usually 100
};

export type Score = {
  id: string;
  assignment_id: string;
  student_id: string;
  value: number;
};

// Frontend'de tabloyu çizerken kullanacağımız birleşik tip
export type StudentRow = Student & {
  scores: Record<string, number>; // assignment_id -> score
  average: number;
  letter_grade: string;
  feedback?: string;
};
