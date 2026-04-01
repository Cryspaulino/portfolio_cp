-- Database seed file for resume info

-- MOST RECENT GUIDE:
-- DEPARTMENTS = JOBS
-- COURSES = SKILLS
-- CATALOG = PROJECTS

BEGIN;

-- Drop existing tables (in reverse dependency order)
DROP TABLE IF EXISTS projects CASCADE;
DROP TABLE IF EXISTS skills CASCADE;
DROP TABLE IF EXISTS jobs CASCADE;

-- Create jobs table
CREATE TABLE jobs (
    id INTEGER PRIMARY KEY,
    position VARCHAR(80) UNIQUE NOT NULL,
    company VARCHAR(80) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create skills table
CREATE TABLE skills (
    id SERIAL PRIMARY KEY,
    action TEXT NOT NULL,
    job_id INTEGER NOT NULL,
    slug VARCHAR(30) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (job_id) REFERENCES jobs(id)
);

-- Create projects table
CREATE TABLE projects (
    id SERIAL PRIMARY KEY,
    name VARCHAR(80) NOT NULL,
    tool VARCHAR(100),
    skill_slug VARCHAR(200) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(skill_slug, name, tool)
);

INSERT INTO jobs (id, position, company) VALUES
    (0, 'Web and Programming Senior Lead', 'BYU Pathway'),
    (1, 'Business Analytics TA', 'BYU Idaho');

INSERT INTO skills (action, job_id, slug) VALUES
    ('Updating and cleaning landing page information to ensure proper data processing.', 0, 'clean-data'),
    ('Creating new apps using Microsoft services', 0, 'proactive'),
    ('Applying Business Analytics skills to simplify the decision making process of a big investment.', 1, 'analysis');

INSERT INTO projects (name, tool, skill_slug) VALUES
    ('Landing Page Lists', 'Sharepoint Lists and Microsoft Bookings', 'clean-data'),
    ('QA Tool', 'PowerApps', 'proactive'),
    ('Adventure Works', 'PowerBI', 'analysis');



-- Feedback form table
CREATE TABLE IF NOT EXISTS feedback_form (
    id SERIAL PRIMARY KEY,
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    submitted TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Users table for registration system
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

COMMIT;