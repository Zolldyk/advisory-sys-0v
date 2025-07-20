-- Clear existing data
DELETE FROM course_registrations;
DELETE FROM messages;
DELETE FROM courses;
DELETE FROM users;

-- Insert sample users with different roles
INSERT INTO users (id, matric_number, email, password_hash, role, name, created_at) VALUES
-- Students
('550e8400-e29b-41d4-a716-446655440001', 'STU001', 'john.doe@student.edu', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'student', 'John Doe', NOW()),
('550e8400-e29b-41d4-a716-446655440002', 'STU002', 'jane.smith@student.edu', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'student', 'Jane Smith', NOW()),
('550e8400-e29b-41d4-a716-446655440003', 'STU003', 'mike.johnson@student.edu', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'student', 'Mike Johnson', NOW()),

-- Sample Admin (for testing - password is 'password123')
('550e8400-e29b-41d4-a716-446655440010', NULL, 'admin@university.edu', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', 'System Administrator', NOW()),

-- Sample Student Advisor (for testing - password is 'password123')
('550e8400-e29b-41d4-a716-446655440011', NULL, 'advisor@university.edu', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'advisor', 'Academic Advisor', NOW());

-- Insert sample courses
INSERT INTO courses (id, course_code, course_name, credits, semester, year, max_students, created_at) VALUES
('650e8400-e29b-41d4-a716-446655440001', 'CS101', 'Introduction to Computer Science', 3, 'Fall', 2024, 30, NOW()),
('650e8400-e29b-41d4-a716-446655440002', 'MATH201', 'Calculus II', 4, 'Fall', 2024, 25, NOW()),
('650e8400-e29b-41d4-a716-446655440003', 'ENG102', 'English Composition', 3, 'Fall', 2024, 20, NOW()),
('650e8400-e29b-41d4-a716-446655440004', 'PHYS101', 'General Physics I', 4, 'Fall', 2024, 35, NOW()),
('650e8400-e29b-41d4-a716-446655440005', 'HIST101', 'World History', 3, 'Fall', 2024, 40, NOW());

-- Insert sample course registrations
INSERT INTO course_registrations (id, student_id, course_id, status, registered_at) VALUES
('750e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440001', 'registered', NOW()),
('750e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440002', 'registered', NOW()),
('750e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440002', '650e8400-e29b-41d4-a716-446655440001', 'registered', NOW());

-- Insert sample messages
INSERT INTO messages (id, sender_id, recipient_id, subject, content, sent_at) VALUES
('850e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440001', 'Welcome to the System', 'Welcome to the Student Advisory System. Please let me know if you have any questions about course registration.', NOW()),
('850e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440010', 'Course Registration Question', 'Hi, I have a question about registering for advanced mathematics courses. What are the prerequisites?', NOW() - INTERVAL '1 hour');
