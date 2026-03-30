-- Database seed file for resume info
-- This file creates tables and inserts all initial data

-- GUIDE: 
-- departments = jobs
-- courses = projects
-- faculty = skills
-- catalog = resume

BEGIN;

-- Drop existing tables (in reverse dependency order)
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

-- Create resume table
CREATE TABLE resume (
    id INTEGER PRIMARY KEY,
    project_slug VARCHAR(250) NOT NULL,
    skill_slug VARCHAR(200) NOT NULL,
    detail VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(project_slug, skill_slug, detail)
);

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

-- Insert jobs
INSERT INTO jobs (id, position, company) VALUES
    (0, 'Web and Programming Senior Lead', 'BYU Pathway'),
    (1, 'Business Analytics TA', 'BYU Idaho');

-- Insert projects
INSERT INTO projects (name, description, tool, job_id, slug) VALUES
    ('Landing Page Lists', 'Updating and cleaning landing page information to ensure proper data processing.', 'Sharepoint Lists and Microsoft Bookings', 0, 'landingpage'),
    ('Adventure Works', 'Applying Business Analytics skills to simplify the decision making process of a big investment.', 'PowerBI', 1, 'adventureworks');

-- Insert skills: Skills that helped me in those jobs
INSERT INTO skills (description, job_id, slug) VALUES
    ('Listening to user experience with apps', 0, 'listener'),
    ('Creating new apps using Microsoft services', 0, 'proactive'),
    ('Grading students in a timely manner and providing good feedback', 1, 'feedback');

-- Insert resume
INSERT INTO resume (project_slug, skill_slug, detail) VALUES
    ('landingpage', 'proactive', 'Improving processes'),
    ('landingpage', 'listener', 'Improving user experience')
    ('adventureworks', 'feedback', 'Adopting feedback');


COMMIT;