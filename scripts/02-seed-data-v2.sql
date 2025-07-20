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
INSERT INTO courses (code, title, credits, description) VALUES
('CSC101', 'Introduction to Computer Science', 3, 'Basic concepts of computer science and programming'),
('MAT101', 'Calculus I', 4, 'Differential and integral calculus'),
('PHY101', 'General Physics I', 4, 'Mechanics, heat, and sound'),
('ENG101', 'English Composition', 3, 'Academic writing and communication skills'),
('CHE101', 'General Chemistry I', 4, 'Basic principles of chemistry');

-- Insert a sample student (password: student123)
INSERT INTO users (matric_number, email, password_hash, name, role) VALUES
('STU001', 'student@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'John Student', 'student');

-- Note: Admin and advisor accounts should be created through the registration forms
-- Default admin code is: ADMIN2024

-- Insert sample course registrations
INSERT INTO course_registrations (id, student_id, course_id, status, registered_at) VALUES
('750e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'CSC101', 'registered', NOW()),
('750e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', 'MAT101', 'registered', NOW()),
('750e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440002', 'CSC101', 'registered', NOW());

-- Insert sample messages
INSERT INTO messages (id, sender_id, recipient_id, subject, content, sent_at) VALUES
('850e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440001', 'Welcome to the System', 'Welcome to the Student Advisory System. Please let me know if you have any questions about course registration.', NOW()),
('850e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440010', 'Course Registration Question', 'Hi, I have a question about registering for advanced mathematics courses. What are the prerequisites?', NOW() - INTERVAL '1 hour');
