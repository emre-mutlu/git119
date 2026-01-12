-- Migration to add average_score and letter_grade to enrollments table

ALTER TABLE enrollments ADD COLUMN average_score numeric DEFAULT 0;
ALTER TABLE enrollments ADD COLUMN letter_grade text DEFAULT '-';
