-- Database seed file for resume info
-- This file creates tables and inserts all initial data

BEGIN;

Drop existing tables (in reverse dependency order)
DROP TABLE IF EXISTS education CASCADE;
DROP TABLE IF EXISTS projects CASCADE;
DROP TABLE IF EXISTS skills CASCADE;
DROP TABLE IF EXISTS jobs CASCADE;

-- Create jobs table
CREATE TABLE jobs (
    id INTEGER PRIMARY KEY,
    position VARCHAR(40) UNIQUE NOT NULL,
    company VARCHAR(80) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create skills table
CREATE TABLE skills (
    id SERIAL PRIMARY KEY,
    -- name VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    job_id INTEGER NOT NULL,
    slug VARCHAR(30) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (job_id) REFERENCES jobs(id)
);

-- Create projects table
CREATE TABLE projects (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    tool VARCHAR(100),
    job_id INTEGER NOT NULL,
    slug VARCHAR(200) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (job_id) REFERENCES jobs(id)
);

-- Create education table
CREATE TABLE education (
    id INTEGER PRIMARY KEY,
    title VARCHAR(80) UNIQUE NOT NULL,
    job_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (job_id) REFERENCES jobs(id)
);

-- Insert jobs
INSERT INTO jobs (id, position, company) VALUES
    (0, 'Web and Programming Senior Lead', 'BYU Pathway'),
    (1, 'Business Analytics TA', 'BYU Idaho')

-- Insert skills: Skills that helped me in those jobs
INSERT INTO skills (id , description, job_id, slug) VALUES
    (0, 'Listening to students', 0, 'listener'),
    (1, 'Creating new apps using Microsoft services', 0, 'proactive')
    (2, 'Grading students in a timely manner and providing good feedback', 1, 'feedback')

-- Insert projects
INSERT INTO projects (id, name, description, tool, job_id, slug) VALUES
    (0, 'QA Tool', 'App that helps keep track of tutoring reports to improve the quality offered by our team to students.', 'PowerApps' 0, 'qa-tool'),
    (1, 'Landing Page Lists', 'Updating and cleaning landing page information to ensure proper data processing.', 'Sharepoint Lists and Microsoft Bookings', 0, 'landing-page'),
    (2, 'Adventure Works', 'Applying Business Analytics skills to simplify the decision making process of a big investment.', 'PowerBI', 1, 'adventureworks')

-- Insert education
INSERT INTO education (id, title, job_id) VALUES
    (0, 'Software Engineering Major', 0),
    (1, 'Business Analytics Minor', 1)


COMMIT;