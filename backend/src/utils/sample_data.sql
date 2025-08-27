-- Requires that an admin user exists with email 'admin@example.com'
-- Run with: psql -U <user> -h <host> -d <db> -f backend/src/utils/sample_data.sql

-- 1
INSERT INTO questions (question_text, option_a, option_b, option_c, option_d, correct_answer, created_by)
SELECT 'What does HTTP stand for?',
             'HyperText Transfer Protocol',
             'High Transfer Text Process',
             'Hyperlink Transfer Protocol',
             'Hyper Transfer Text Protocol',
             'A', u.id
FROM users u
WHERE u.email='admin@example.com'
    AND NOT EXISTS (
        SELECT 1 FROM questions q WHERE q.question_text = 'What does HTTP stand for?'
    );

-- 2
INSERT INTO questions (question_text, option_a, option_b, option_c, option_d, correct_answer, created_by)
SELECT 'What is the capital of Japan?',
             'Tokyo','Beijing','Seoul','Bangkok','A', u.id
FROM users u
WHERE u.email='admin@example.com'
    AND NOT EXISTS (
        SELECT 1 FROM questions q WHERE q.question_text = 'What is the capital of Japan?'
    );

-- 3
INSERT INTO questions (question_text, option_a, option_b, option_c, option_d, correct_answer, created_by)
SELECT 'What is 2 + 2 * 3?',
             '8','12','6','10','A', u.id
FROM users u
WHERE u.email='admin@example.com'
    AND NOT EXISTS (
        SELECT 1 FROM questions q WHERE q.question_text = 'What is 2 + 2 * 3?'
    );

-- 4
INSERT INTO questions (question_text, option_a, option_b, option_c, option_d, correct_answer, created_by)
SELECT 'Which of the following is a JavaScript library?',
             'Laravel','Django','React','Rails','C', u.id
FROM users u
WHERE u.email='admin@example.com'
    AND NOT EXISTS (
        SELECT 1 FROM questions q WHERE q.question_text = 'Which of the following is a JavaScript library?'
    );

-- 5
INSERT INTO questions (question_text, option_a, option_b, option_c, option_d, correct_answer, created_by)
SELECT 'CSS stands for?',
             'Cascading Style Sheets','Computer Style Sheets','Creative Style System','Colorful Style Sheets','A', u.id
FROM users u
WHERE u.email='admin@example.com'
    AND NOT EXISTS (
        SELECT 1 FROM questions q WHERE q.question_text = 'CSS stands for?'
    );

-- 6
INSERT INTO questions (question_text, option_a, option_b, option_c, option_d, correct_answer, created_by)
SELECT 'Which gas makes up most of Earth''s atmosphere?',
             'Oxygen','Nitrogen','Carbon Dioxide','Hydrogen','B', u.id
FROM users u
WHERE u.email='admin@example.com'
    AND NOT EXISTS (
        SELECT 1 FROM questions q WHERE q.question_text = 'Which gas makes up most of Earth''s atmosphere?'
    );

-- 7
INSERT INTO questions (question_text, option_a, option_b, option_c, option_d, correct_answer, created_by)
SELECT 'Who painted the Mona Lisa?',
             'Vincent van Gogh','Pablo Picasso','Leonardo da Vinci','Michelangelo','C', u.id
FROM users u
WHERE u.email='admin@example.com'
    AND NOT EXISTS (
        SELECT 1 FROM questions q WHERE q.question_text = 'Who painted the Mona Lisa?'
    );

-- 8
INSERT INTO questions (question_text, option_a, option_b, option_c, option_d, correct_answer, created_by)
SELECT 'Which file extension is primarily used for TypeScript?',
             '.js','.ts','.tsx','.ty','B', u.id
FROM users u
WHERE u.email='admin@example.com'
    AND NOT EXISTS (
        SELECT 1 FROM questions q WHERE q.question_text = 'Which file extension is primarily used for TypeScript?'
    );

-- 9
INSERT INTO questions (question_text, option_a, option_b, option_c, option_d, correct_answer, created_by)
SELECT 'Which Git command is used to create a local copy of a remote repository?',
             'git copy','git clone','git pull','git fetch','B', u.id
FROM users u
WHERE u.email='admin@example.com'
    AND NOT EXISTS (
        SELECT 1 FROM questions q WHERE q.question_text = 'Which Git command is used to create a local copy of a remote repository?'
    );

-- 10
INSERT INTO questions (question_text, option_a, option_b, option_c, option_d, correct_answer, created_by)
SELECT 'Which HTTP status code indicates a resource was successfully created?',
             '200 OK','201 Created','204 No Content','400 Bad Request','B', u.id
FROM users u
WHERE u.email='admin@example.com'
    AND NOT EXISTS (
        SELECT 1 FROM questions q WHERE q.question_text = 'Which HTTP status code indicates a resource was successfully created?'
    );
