// import db from '../db.js';
// // similar to catalog

// /**
//  * Core function that gets all projects for a specific job.
//  * @param {string} sortBy
//  * @returns {Promise<Array>} Array of section objects with project, skills, and job info
//  */
// const getJobs = async (identifier, identifierType = 'id', sortBy = 'id') => {
//     const whereClause = identifierType === 'id' ? 'p.id = $1' : 'p.slug = $1';

//     /**
//      * Join resume with projects, skills, and jobs to get complete information.
//      * Note: We're using template literals for ORDER BY because PostgreSQL doesn't allow parameterized ORDER BY clauses. The values are whitelisted above, so this is safe.
//      */
//     const query = `
//         SELECT res.id, res.detail, 
//                p.name as project_name, p.description, p.tool,
//                s.action, s.slug as skill_slug,
//                j.position as job_position, j.company as job_company
//         FROM resume res
//         JOIN projects p ON res.project_slug = p.slug
//         JOIN skills s ON res.skill_slug = s.slug
//         JOIN jobs j ON p.job_id = j.id
//         WHERE ${whereClause}
//         ORDER BY ${orderByClause}
//     `;

//     const result = await db.query(query, [identifier]);

//     /**
//      * Transform database column names (snake_case) to JavaScript convention (camelCase).
//      * This is a common pattern when working with databases in JavaScript.
//      */
//     return result.rows.map(item => ({
//         // Resume items
//         id: item.id,
//         detail: item.detail,
//         // Project items
//         pname: item.project_name,
//         pdescription: item.description,
//         ptool: item.tool,
//         // Skills items
//         saction: item.action,
//         sslug: item.skill_slug,
//         // Jobs items
//         job: item.job_position,
//         company: item.job_company
//     }));
// };

// /**
//  * Core function that gets all courses taught by a specific skills member.
//  * Similar pattern to getSectionsByCourse - same logic, different perspective.
//  * 
//  * @param {string|number} identifier - skills ID or slug
//  * @param {string} identifierType - 'id' or 'slug' (default: 'slug')
//  * @param {string} sortBy - Sort option: 'time', 'room', or 'course' (default: 'time')
//  * @returns {Promise<Array>} Array of section objects with course, skills, and department info
//  */
// const getCoursesByskills = async (identifier, identifierType = 'slug', sortBy = 'id') => {
//     // Search by skills ID or skills slug
//     const whereClause = identifierType === 'id' ? 's.id = $1' : 's.slug = $1';

//     // Different sorting options - by time, room, or course code
//     const orderByClause = sortBy === 'id' ? 'res.id' :
//         sortBy === 'project' ? 'p.course_code' :
//             "SUBSTRING(cat.time FROM '(\\d{1,2}):(\\d{2})')::INTEGER";

//     // Same JOIN pattern - resume connects courses to skills
//     const query = `
//         SELECT res.id, res.detail, 
//                p.name as project_name, p.description, p.tool,
//                s.action, s.slug as skill_slug,
//                j.position as job_position, j.company as job_company
//         FROM resume res
//         JOIN projects p ON res.project_slug = p.slug
//         JOIN skills s ON res.skill_slug = s.slug
//         JOIN jobs j ON p.job_id = j.id
//         WHERE ${whereClause}
//         ORDER BY ${orderByClause}
//     `;

//     const result = await db.query(query, [identifier]);

//     return result.rows.map(section => ({
//         id: section.id,
//         time: section.time,
//         room: section.room,
//         courseCode: section.course_code,
//         courseName: section.course_name,
//         description: section.description,
//         creditHours: section.credit_hours,
//         professor: `${section.first_name} ${section.last_name}`,
//         professorSlug: section.skills_slug,
//         professorTitle: section.skills_title,
//         department: section.department_name,
//         departmentCode: section.department_code
//     }));
// };

// /**
//  * Wrapper functions maintain backward compatibility with existing code.
//  * These let us keep the same API while using consolidated core functions internally.
//  * Example: getSectionsByCourseId(5) calls getSectionsByCourse(5, 'id')
//  */
// const getSectionsByCourseId = (courseId, sortBy = 'time') =>
//     getSectionsByCourse(courseId, 'id', sortBy);

// const getSectionsByCourseSlug = (courseSlug, sortBy = 'time') =>
//     getSectionsByCourse(courseSlug, 'slug', sortBy);

// const getCoursesByskillsId = (skillsId, sortBy = 'time') =>
//     getCoursesByskills(skillsId, 'id', sortBy);

// const getCoursesByskillsSlug = (skillsSlug, sortBy = 'time') =>
//     getCoursesByskills(skillsSlug, 'slug', sortBy);

// export {
//     getSectionsByCourseId,
//     getSectionsByCourseSlug,
//     getCoursesByskillsId,
//     getCoursesByskillsSlug
// };




// ***************************************************************************************************************************************************************
// -- Database seed file for resume info
// -- GUIDE: 
// -- departments = jobs
// -- courses = projects
// -- faculty = skills
// -- catalog = resume

// -- NEW GUIDE:
// -- DEPARTMENTS = PROJECTS
// -- COURSES = SKILLS
// -- CATALOG = JOBS

// BEGIN;

// -- Drop existing tables (in reverse dependency order)
// -- DROP TABLE IF EXISTS resume CASCADE;
// DROP TABLE IF EXISTS projects CASCADE;
// DROP TABLE IF EXISTS skills CASCADE;
// DROP TABLE IF EXISTS jobs CASCADE;

// -- Create jobs table
// -- CREATE TABLE jobs (
// --     id INTEGER PRIMARY KEY,
// --     position VARCHAR(40) UNIQUE NOT NULL,
// --     company VARCHAR(80) UNIQUE NOT NULL,
// --     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
// --     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
// -- );

// -- Create skills table
// CREATE TABLE skills (
//     id SERIAL PRIMARY KEY,
//     -- name VARCHAR(200) NOT NULL,
//     description TEXT NOT NULL,
//     job_id INTEGER NOT NULL,
//     slug VARCHAR(30) UNIQUE NOT NULL,
//     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//     FOREIGN KEY (job_id) REFERENCES jobs(id)
// );

// -- Create projects table
// CREATE TABLE projects (
//     id SERIAL PRIMARY KEY,
//     name VARCHAR(100) NOT NULL,
//     description TEXT NOT NULL,
//     tool VARCHAR(100),
//     job_id INTEGER NOT NULL,
//     slug VARCHAR(200) UNIQUE NOT NULL,
//     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//     FOREIGN KEY (job_id) REFERENCES jobs(id)
// );

// -- Create jobs table
// CREATE TABLE jobs (
//     id SERIAL PRIMARY KEY,
//     project_slug VARCHAR(250) NOT NULL,
//     skill_slug VARCHAR(200) NOT NULL,
//     detail VARCHAR(100) UNIQUE NOT NULL,
//     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//     UNIQUE(project_slug, skill_slug, detail)
// );


// -- Insert jobs
// INSERT INTO jobs (id, position, company) VALUES
//     (0, 'Web and Programming Senior Lead', 'BYU Pathway'),
//     (1, 'Business Analytics TA', 'BYU Idaho');

// -- Insert skills: Skills that helped me in those jobs
// INSERT INTO skills (action, job_id, slug) VALUES
//     ('Updating and cleaning landing page information to ensure proper data processing.', 0, 'clean-data'),
//     ('Creating new apps using Microsoft services', 0, 'proactive'),
//     ('Applying Business Analytics skills to simplify the decision making process of a big investment.', 1, 'analysis');

// -- Insert projects
// INSERT INTO projects (name, tool, skill_slug) VALUES
//     ('Landing Page Lists', 'Sharepoint Lists and Microsoft Bookings', 'clean-data'),
//     ('QA Tool', 'PowerApps', 'proactive')
//     ('Adventure Works', 'PowerBI', 'analysis');

// -- Feedback form table
// CREATE TABLE IF NOT EXISTS feedback_form (
//     id SERIAL PRIMARY KEY,
//     subject VARCHAR(255) NOT NULL,
//     message TEXT NOT NULL,
//     submitted TIMESTAMP DEFAULT CURRENT_TIMESTAMP
// );

// -- Users table for registration system
// CREATE TABLE IF NOT EXISTS users (
//     id SERIAL PRIMARY KEY,
//     name VARCHAR(255) NOT NULL,
//     email VARCHAR(255) UNIQUE NOT NULL,
//     password VARCHAR(255) NOT NULL,
//     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
// );


// -- -- Insert jobs
// -- INSERT INTO jobs (id, position, company, start_date) VALUES
// --     (0, 'Web and Programming Senior Lead', 'BYU Pathway', 'May 2025'),
// --     (1, 'Business Analytics TA', 'BYU Idaho', 'September 2025');

// -- -- Insert projects
// -- INSERT INTO projects (name, description, tool, job_id, slug) VALUES
// --     ('Landing Page Lists', 'Sharepoint Lists and Microsoft Bookings', 0, 'landingpage'),
// --     ('Adventure Works', 'Applying Business Analytics skills to simplify the decision making process of a big investment.', 'PowerBI', 1, 'adventureworks');

// -- -- Insert skills: Skills that helped me in those jobs
// -- INSERT INTO skills (action, job_id, slug) VALUES
// --     ('Updating and cleaning landing page information to ensure proper data processing.', 0, 'clean-data'),
// --     ('Creating new apps using Microsoft services', 0, 'proactive'),
// --     ('')
// --     ('Grading students in a timely manner and providing good feedback', 1, 'feedback');

// -- -- Insert resume
// -- INSERT INTO resume (project_slug, skill_slug, detail) VALUES
// --     ('landingpage', 'proactive', 'Improving processes'),
// --     ('landingpage', 'listener', 'Improving user experience'),
// --     ('adventureworks', 'feedback', 'Adopting feedback');


// COMMIT;



// **************************************************************************************************
// **************************************************************************************************
// **************************************************************************************************



// -- Database seed file for resume info
// -- GUIDE: 
// -- departments = jobs
// -- courses = projects
// -- faculty = skills
// -- catalog = resume

// BEGIN;

// -- Drop existing tables (in reverse dependency order)
// DROP TABLE IF EXISTS education CASCADE;
// DROP TABLE IF EXISTS resume CASCADE;
// DROP TABLE IF EXISTS projects CASCADE;
// DROP TABLE IF EXISTS skills CASCADE;
// DROP TABLE IF EXISTS jobs CASCADE;

// -- Create jobs table
// CREATE TABLE jobs (
//     id INTEGER PRIMARY KEY,
//     position VARCHAR(40) UNIQUE NOT NULL,
//     company VARCHAR(80) UNIQUE NOT NULL,
//     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
// );

// -- Create skills table
// CREATE TABLE skills (
//     id SERIAL PRIMARY KEY,
//     -- name VARCHAR(200) NOT NULL,
//     description TEXT NOT NULL,
//     job_id INTEGER NOT NULL,
//     slug VARCHAR(30) UNIQUE NOT NULL,
//     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//     FOREIGN KEY (job_id) REFERENCES jobs(id)
// );

// -- Create projects table
// CREATE TABLE projects (
//     id SERIAL PRIMARY KEY,
//     name VARCHAR(100) NOT NULL,
//     description TEXT NOT NULL,
//     tool VARCHAR(100),
//     job_id INTEGER NOT NULL,
//     slug VARCHAR(200) UNIQUE NOT NULL,
//     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//     FOREIGN KEY (job_id) REFERENCES jobs(id)
// );

// -- Create resume table
// CREATE TABLE resume (
//     id INTEGER PRIMARY KEY,
//     project_slug VARCHAR(250) NOT NULL,
//     skill_slug VARCHAR(200) NOT NULL,
//     detail VARCHAR(100) UNIQUE NOT NULL,
//     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//     UNIQUE(project_slug, skill_slug, detail)
// );

// -- Feedback form table
// CREATE TABLE IF NOT EXISTS feedback_form (
//     id SERIAL PRIMARY KEY,
//     subject VARCHAR(255) NOT NULL,
//     message TEXT NOT NULL,
//     submitted TIMESTAMP DEFAULT CURRENT_TIMESTAMP
// );

// -- Users table for registration system
// CREATE TABLE IF NOT EXISTS users (
//     id SERIAL PRIMARY KEY,
//     name VARCHAR(255) NOT NULL,
//     email VARCHAR(255) UNIQUE NOT NULL,
//     password VARCHAR(255) NOT NULL,
//     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
// );

// -- Insert jobs
// INSERT INTO jobs (id, position, company) VALUES
//     (0, 'Web and Programming Senior Lead', 'BYU Pathway'),
//     (1, 'Business Analytics TA', 'BYU Idaho');

// -- Insert projects
// INSERT INTO projects (name, description, tool, job_id, slug) VALUES
//     ('Landing Page Lists', 'Updating and cleaning landing page information to ensure proper data processing.', 'Sharepoint Lists and Microsoft Bookings', 0, 'landingpage'),
//     ('Adventure Works', 'Applying Business Analytics skills to simplify the decision making process of a big investment.', 'PowerBI', 1, 'adventureworks');

// -- Insert skills: Skills that helped me in those jobs
// INSERT INTO skills (description, job_id, slug) VALUES
//     ('Listening to user experience with apps', 0, 'listener'),
//     ('Creating new apps using Microsoft services', 0, 'proactive'),
//     ('Grading students in a timely manner and providing good feedback', 1, 'feedback');

// -- Insert resume
// INSERT INTO resume (project_slug, skill_slug, detail) VALUES
//     ('landingpage', 'proactive', 'Improving processes'),
//     ('landingpage', 'listener', 'Improving user experience')
//     ('adventureworks', 'feedback', 'Adopting feedback');


// COMMIT;