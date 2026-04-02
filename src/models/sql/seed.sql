BEGIN;

-- 🔻 Drop tables (in correct dependency order)
DROP TABLE IF EXISTS project_images CASCADE;
DROP TABLE IF EXISTS project_skills CASCADE;
DROP TABLE IF EXISTS projects CASCADE;
DROP TABLE IF EXISTS skills CASCADE;
DROP TABLE IF EXISTS jobs CASCADE;
DROP TABLE IF EXISTS categories CASCADE;

-- 🔹 Categories (Work, School, Personal)
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL
);

-- 🔹 Jobs (optional context)
CREATE TABLE jobs (
  id SERIAL PRIMARY KEY,
  company VARCHAR(80) NOT NULL,
  position VARCHAR(80) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 🔹 Projects (core table)
CREATE TABLE projects (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  category_id INTEGER,
  job_id INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (category_id)
    REFERENCES categories(id)
    ON DELETE SET NULL,

  FOREIGN KEY (job_id)
    REFERENCES jobs(id)
    ON DELETE SET NULL
);

-- 🔹 Skills (reusable)
CREATE TABLE skills (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL
);

-- 🔹 Join table (many-to-many)
CREATE TABLE project_skills (
  project_id INTEGER,
  skill_id INTEGER,

  PRIMARY KEY (project_id, skill_id),

  FOREIGN KEY (project_id)
    REFERENCES projects(id)
    ON DELETE CASCADE,

  FOREIGN KEY (skill_id)
    REFERENCES skills(id)
    ON DELETE CASCADE
);

-- 🔹 Project images (stored in /public)
CREATE TABLE project_images (
  id SERIAL PRIMARY KEY,
  project_id INTEGER NOT NULL,
  image_path TEXT NOT NULL,

  FOREIGN KEY (project_id)
    REFERENCES projects(id)
    ON DELETE CASCADE
);

-- =====================================
-- 🌱 Seed Data
-- =====================================

-- Categories
INSERT INTO categories (name) VALUES
('Work'),
('School'),
('Personal');

-- Jobs
INSERT INTO jobs (company, position) VALUES
('BYU Pathway', 'Web and Programming Senior Lead'),
('BYU Idaho', 'Business Analytics TA');

-- Projects
INSERT INTO projects (name, description, category_id, job_id) VALUES
('Landing Page Lists', 'Cleaned and maintained landing page data.', 1, 1),
('QA Tool', 'Built internal QA tool using Microsoft stack.', 1, 1),
('Adventure Works', 'Analyzed large dataset for business insights.', 2, 2);

-- Skills
INSERT INTO skills (name) VALUES
('SQL'),
('Power BI'),
('Data Cleaning'),
('PowerApps');

-- Project ↔ Skills
INSERT INTO project_skills (project_id, skill_id) VALUES
(1, 3), -- Landing Page Lists → Data Cleaning
(2, 4), -- QA Tool → PowerApps
(3, 1), -- Adventure Works → SQL
(3, 2); -- Adventure Works → Power BI

-- Images (stored in /public/images/)
INSERT INTO project_images (project_id, image_path) VALUES
(1, '/images/landing-page.png'),
(2, '/images/qa-tool.png'),
(3, '/images/adventure-works.png');

COMMIT;