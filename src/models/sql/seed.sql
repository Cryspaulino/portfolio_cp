-- Database seed file for resume info
-- GUIDE: 
-- departments = jobs
-- courses = projects
-- faculty = skills
-- catalog = resume

-- NEW GUIDE:
-- DEPARTMENTS = PROJECTS
-- COURSES = SKILLS
-- CATALOG = JOBS

BEGIN;

-- Drop existing tables (in reverse dependency order)
-- DROP TABLE IF EXISTS resume CASCADE;
DROP TABLE IF EXISTS projects CASCADE;
DROP TABLE IF EXISTS skills CASCADE;
DROP TABLE IF EXISTS jobs CASCADE;

-- Create jobs table
-- CREATE TABLE jobs (
--     id INTEGER PRIMARY KEY,
--     position VARCHAR(40) UNIQUE NOT NULL,
--     company VARCHAR(80) UNIQUE NOT NULL,
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );

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

-- Create jobs table
CREATE TABLE jobs (
    id SERIAL PRIMARY KEY,
    project_slug VARCHAR(250) NOT NULL,
    skill_slug VARCHAR(200) NOT NULL,
    detail VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(project_slug, skill_slug, detail)
);


-- Insert projects
INSERT INTO projects (id, name, tool) VALUES
    (0, 'Landing Page Lists', 'Sharepoint Lists and Microsoft Bookings'),
    (1, 'Adventure Works', 'PowerBI');

-- Insert skills: Skills that helped me in those jobs
INSERT INTO skills (action, project_id, slug) VALUES
    ('Updating and cleaning landing page information to ensure proper data processing.', 0, 'clean-data'),
    ('Creating new apps using Microsoft services', 0, 'proactive'),
    ('Applying Business Analytics skills to simplify the decision making process of a big investment.', 1, 'analysis');

-- Insert jobs
INSERT INTO jobs (position, company, skill_slug) VALUES
    ('Web and Programming Senior Lead', 'BYU Pathway', 'landingpage', 'clean-data'),
    ('Business Analytics TA', 'BYU Idaho', 'adventureworks', 'analysis');
    -- ('adventureworks', 'feedback', 'Adopting feedback');



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


-- -- Insert jobs
-- INSERT INTO jobs (id, position, company, start_date) VALUES
--     (0, 'Web and Programming Senior Lead', 'BYU Pathway', 'May 2025'),
--     (1, 'Business Analytics TA', 'BYU Idaho', 'September 2025');

-- -- Insert projects
-- INSERT INTO projects (name, description, tool, job_id, slug) VALUES
--     ('Landing Page Lists', 'Sharepoint Lists and Microsoft Bookings', 0, 'landingpage'),
--     ('Adventure Works', 'Applying Business Analytics skills to simplify the decision making process of a big investment.', 'PowerBI', 1, 'adventureworks');

-- -- Insert skills: Skills that helped me in those jobs
-- INSERT INTO skills (action, job_id, slug) VALUES
--     ('Updating and cleaning landing page information to ensure proper data processing.', 0, 'clean-data'),
--     ('Creating new apps using Microsoft services', 0, 'proactive'),
--     ('')
--     ('Grading students in a timely manner and providing good feedback', 1, 'feedback');

-- -- Insert resume
-- INSERT INTO resume (project_slug, skill_slug, detail) VALUES
--     ('landingpage', 'proactive', 'Improving processes'),
--     ('landingpage', 'listener', 'Improving user experience'),
--     ('adventureworks', 'feedback', 'Adopting feedback');


COMMIT;