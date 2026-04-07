BEGIN;

DROP TABLE IF EXISTS project_images CASCADE;
DROP TABLE IF EXISTS project_skills CASCADE;
DROP TABLE IF EXISTS projects CASCADE;
DROP TABLE IF EXISTS skills CASCADE;
DROP TABLE IF EXISTS jobs CASCADE;
DROP TABLE IF EXISTS categories CASCADE;

CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE jobs (
  id SERIAL PRIMARY KEY,
  company VARCHAR(80) NOT NULL,
  position VARCHAR(80) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE projects (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  stage VARCHAR(20) DEFAULT 'idea',
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

CREATE TABLE skills (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL
);

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

CREATE TABLE project_images (
  id SERIAL PRIMARY KEY,
  project_id INTEGER NOT NULL,
  image_path TEXT NOT NULL,

  FOREIGN KEY (project_id)
    REFERENCES projects(id)
    ON DELETE CASCADE
);

INSERT INTO categories (name) VALUES
('Work'),
('School'),
('Personal');

INSERT INTO jobs (company, position) VALUES
('BYU Pathway', 'Web and Programming Senior Lead'),
('BYU Idaho', 'Business Analytics TA'),
('', '');

INSERT INTO projects (name, description, stage, category_id, job_id) VALUES
('Landing Pages Lists', 'Cleaned and maintained landing page data', 'Completed', 1, 1),
('QA Tool', 'Built internal QA tool using Microsoft stack', 'Completed', 1, 1),
('Adventure Works', 'Analyzed large dataset for business insights to select if owner should merge or not his company', 'Completed', 2, 2),
('Self Quizlet', 'Made small program to review class concepts and be quizzed in preparation for exams', 'Completed', 3, 3);

INSERT INTO skills (name) VALUES
-- ('SQL'),
('Power BI'),
('Cleaning Data'),
('Analyzing Data'),
('User Experience'),
('PowerApps'),
('Proactive'),
('Creative');

INSERT INTO project_skills (project_id, skill_id) VALUES
-- Landing Page Lists
(1, 2),
-- QA Tool
(2, 3),
(2, 5),
(2, 4), 
-- Adventure Works
(3, 1),
(3, 3),
-- Self Quizlet
(4, 7);

INSERT INTO project_images (project_id, image_path) VALUES
(2, '/images/qa_form.png'),
(2, '/images/qa_record.png'),
(4, '/images/selfquiz_cards.png'),
(4, '/images/selfquiz_quiz.png');

-- Roles table for role-based access control
CREATE TABLE IF NOT EXISTS roles (
    id SERIAL PRIMARY KEY,
    role_name VARCHAR(50) UNIQUE NOT NULL,
    role_description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

COMMIT;