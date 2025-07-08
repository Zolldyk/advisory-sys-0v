-- Insert admin user (password: admin123)
INSERT INTO users (matric_number, email, password_hash, role, name) VALUES 
('ADMIN001', 'admin@university.edu', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', 'System Administrator')
ON CONFLICT (email) DO NOTHING;

-- Insert sample courses
INSERT INTO courses (code, title, credits) VALUES 
('CSC101', 'Introduction to Computer Science', 3),
('CSC201', 'Data Structures and Algorithms', 4),
('CSC301', 'Database Systems', 3),
('CSC401', 'Software Engineering', 4),
('MTH101', 'Calculus I', 3),
('MTH201', 'Linear Algebra', 3),
('PHY101', 'Physics I', 4),
('ENG101', 'Technical Writing', 2)
ON CONFLICT (code) DO NOTHING;
