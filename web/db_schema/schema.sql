-- AcademiaOS Veritabanı Şeması (Evrensel)
-- Bu dosyayı Supabase SQL Editor'de çalıştırarak boş veritabanını kurun.

-- Temizlik (Geliştirme sırasında sıfırdan başlamak için)
DROP TABLE IF EXISTS scores CASCADE;
DROP TABLE IF EXISTS assignments CASCADE;
DROP TABLE IF EXISTS enrollments CASCADE;
DROP TABLE IF EXISTS students CASCADE;
DROP TABLE IF EXISTS courses CASCADE;

-- 1. DERSLER (Courses)
CREATE TABLE courses (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    code text NOT NULL, -- Örn: GIT119
    name text NOT NULL, -- Örn: Görsel İletişim Tasarımı
    semester text NOT NULL, -- Örn: 2025-GUZ
    created_at timestamptz DEFAULT now()
);

-- 2. ÖĞRENCİLER (Students)
-- Okuldaki tüm öğrencilerin havuzu.
CREATE TABLE students (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    student_no text UNIQUE NOT NULL, -- Benzersiz ID (Öğrenci No)
    full_name text NOT NULL,
    email text,
    created_at timestamptz DEFAULT now()
);

-- 3. KAYITLAR (Enrollments)
-- Hangi öğrenci hangi dersi alıyor?
CREATE TABLE enrollments (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    course_id uuid REFERENCES courses(id) ON DELETE CASCADE NOT NULL,
    student_id uuid REFERENCES students(id) ON DELETE CASCADE NOT NULL,
    feedback text, -- Hoca Notu
    UNIQUE(course_id, student_id) -- Bir öğrenci aynı derse iki kere kaydedilemez
);

-- 4. ÖDEV TANIMLARI (Assignments)
-- Bir dersin ödev başlıkları (Sütunlar)
CREATE TABLE assignments (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    course_id uuid REFERENCES courses(id) ON DELETE CASCADE NOT NULL,
    name text NOT NULL, -- Örn: "Ödev 1"
    category text DEFAULT 'Homework', -- 'Homework', 'Final'
    weight numeric DEFAULT 0, -- Ağırlık (0.1 = %10)
    max_score numeric DEFAULT 100,
    created_at timestamptz DEFAULT now()
);

-- 5. NOTLAR (Scores)
-- Öğrencinin aldığı puanlar (Hücreler)
CREATE TABLE scores (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    assignment_id uuid REFERENCES assignments(id) ON DELETE CASCADE NOT NULL,
    student_id uuid REFERENCES students(id) ON DELETE CASCADE NOT NULL,
    value numeric DEFAULT 0,
    UNIQUE(assignment_id, student_id)
);
