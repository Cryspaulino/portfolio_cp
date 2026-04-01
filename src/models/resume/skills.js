import db from '../db.js';
// similar to catalog

/**
 * Core function that gets all projects for a specific job.
 * Works with either project ID or slug - this pattern reduces code duplication.
 * 
 * @param {string|number} identifier - Project ID or slug
 * @param {string} identifierType - 'id' or 'slug' (default: 'slug')
 * @param {string} sortBy
 * @returns {Promise<Array>} Array of section objects with project, skills, and job info
 */
const getJobs = async (identifier, identifierType = 'id', sortBy = 'id') => {
    const whereClause = identifierType === 'id' ? 'p.id = $1' : 'p.slug = $1';

    /**
     * Join resume with projects, skills, and jobs to get complete information.
     * Note: We're using template literals for ORDER BY because PostgreSQL doesn't allow parameterized ORDER BY clauses. The values are whitelisted above, so this is safe.
     */
    const query = `
        SELECT res.id, res.detail, 
               p.name as project_name, p.description, p.tool,
               s.action, s.slug as skill_slug,
               j.position as job_position, j.company as job_company
        FROM resume res
        JOIN projects p ON res.project_slug = p.slug
        JOIN skills s ON res.skill_slug = s.slug
        JOIN jobs j ON p.job_id = j.id
        WHERE ${whereClause}
        ORDER BY ${orderByClause}
    `;

    const result = await db.query(query, [identifier]);

    /**
     * Transform database column names (snake_case) to JavaScript convention (camelCase).
     * This is a common pattern when working with databases in JavaScript.
     */
    return result.rows.map(item => ({
        // Resume items
        id: item.id,
        detail: item.detail,
        // Project items
        pname: item.project_name,
        pdescription: item.description,
        ptool: item.tool,
        // Skills items
        saction: item.action,
        sslug: item.skill_slug,
        // Jobs items
        job: item.job_position,
        company: item.job_company
    }));
};

/**
 * Core function that gets all courses taught by a specific skills member.
 * Similar pattern to getSectionsByCourse - same logic, different perspective.
 * 
 * @param {string|number} identifier - skills ID or slug
 * @param {string} identifierType - 'id' or 'slug' (default: 'slug')
 * @param {string} sortBy - Sort option: 'time', 'room', or 'course' (default: 'time')
 * @returns {Promise<Array>} Array of section objects with course, skills, and department info
 */
const getCoursesByskills = async (identifier, identifierType = 'slug', sortBy = 'id') => {
    // Search by skills ID or skills slug
    const whereClause = identifierType === 'id' ? 's.id = $1' : 's.slug = $1';

    // Different sorting options - by time, room, or course code
    const orderByClause = sortBy === 'id' ? 'res.id' :
        sortBy === 'project' ? 'p.course_code' :
            "SUBSTRING(cat.time FROM '(\\d{1,2}):(\\d{2})')::INTEGER";

    // Same JOIN pattern - resume connects courses to skills
    const query = `
        SELECT res.id, res.detail, 
               p.name as project_name, p.description, p.tool,
               s.action, s.slug as skill_slug,
               j.position as job_position, j.company as job_company
        FROM resume res
        JOIN projects p ON res.project_slug = p.slug
        JOIN skills s ON res.skill_slug = s.slug
        JOIN jobs j ON p.job_id = j.id
        WHERE ${whereClause}
        ORDER BY ${orderByClause}
    `;

    const result = await db.query(query, [identifier]);

    return result.rows.map(section => ({
        id: section.id,
        time: section.time,
        room: section.room,
        courseCode: section.course_code,
        courseName: section.course_name,
        description: section.description,
        creditHours: section.credit_hours,
        professor: `${section.first_name} ${section.last_name}`,
        professorSlug: section.skills_slug,
        professorTitle: section.skills_title,
        department: section.department_name,
        departmentCode: section.department_code
    }));
};

/**
 * Wrapper functions maintain backward compatibility with existing code.
 * These let us keep the same API while using consolidated core functions internally.
 * Example: getSectionsByCourseId(5) calls getSectionsByCourse(5, 'id')
 */
const getSectionsByCourseId = (courseId, sortBy = 'time') =>
    getSectionsByCourse(courseId, 'id', sortBy);

const getSectionsByCourseSlug = (courseSlug, sortBy = 'time') =>
    getSectionsByCourse(courseSlug, 'slug', sortBy);

const getCoursesByskillsId = (skillsId, sortBy = 'time') =>
    getCoursesByskills(skillsId, 'id', sortBy);

const getCoursesByskillsSlug = (skillsSlug, sortBy = 'time') =>
    getCoursesByskills(skillsSlug, 'slug', sortBy);

export {
    getSectionsByCourseId,
    getSectionsByCourseSlug,
    getCoursesByskillsId,
    getCoursesByskillsSlug
};