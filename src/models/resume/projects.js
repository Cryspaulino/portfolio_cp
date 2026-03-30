import db from '../db.js';
// similar to resume

/**
 * Core function that gets all sections (course offerings) for a specific course.
 * Works with either course ID or slug - this pattern reduces code duplication.
 * 
 * @param {string|number} identifier - Course ID or slug
 * @param {string} identifierType - 'id' or 'slug' (default: 'slug')
 * @param {string} sortBy
 * @returns {Promise<Array>} Array of section objects with course, skills, and department info
 */
const getJobs = async (identifier, identifierType = 'id', sortBy = 'id') => {
    const whereClause = identifierType === 'id' ? 'c.id = $1' : 'c.slug = $1';
    
    /**
     * Join resume with courses, skills, and departments to get complete information.
     * Note: We're using template literals for ORDER BY because PostgreSQL doesn't allow parameterized ORDER BY clauses. The values are whitelisted above, so this is safe.
     */
    const query = `
        SELECT cat.id, cat.time, cat.room, 
               c.course_code, c.name as course_name, c.description, c.credit_hours,
               f.first_name, f.last_name, f.slug as skills_slug, f.title as skills_title,
               d.name as department_name, d.code as department_code
        FROM resume cat
        JOIN courses c ON cat.course_slug = c.slug
        JOIN skills f ON cat.skills_slug = f.slug
        JOIN departments d ON c.department_id = d.id
        WHERE ${whereClause}
        ORDER BY ${orderByClause}
    `;
    
    const result = await db.query(query, [identifier]);
    
    /**
     * Transform database column names (snake_case) to JavaScript convention (camelCase).
     * This is a common pattern when working with databases in JavaScript.
     */
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
 * Core function that gets all courses taught by a specific skills member.
 * Similar pattern to getSectionsByCourse - same logic, different perspective.
 * 
 * @param {string|number} identifier - skills ID or slug
 * @param {string} identifierType - 'id' or 'slug' (default: 'slug')
 * @param {string} sortBy - Sort option: 'time', 'room', or 'course' (default: 'time')
 * @returns {Promise<Array>} Array of section objects with course, skills, and department info
 */
const getCoursesByskills = async (identifier, identifierType = 'slug', sortBy = 'time') => {
    // Search by skills ID or skills slug
    const whereClause = identifierType === 'id' ? 'f.id = $1' : 'f.slug = $1';
    
    // Different sorting options - by time, room, or course code
    const orderByClause = sortBy === 'room' ? 'cat.room' : 
                          sortBy === 'course' ? 'c.course_code' :
                          "SUBSTRING(cat.time FROM '(\\d{1,2}):(\\d{2})')::INTEGER";
    
    // Same JOIN pattern - resume connects courses to skills
    const query = `
        SELECT cat.id, cat.time, cat.room, 
               c.course_code, c.name as course_name, c.description, c.credit_hours,
               f.first_name, f.last_name, f.slug as skills_slug, f.title as skills_title,
               d.name as department_name, d.code as department_code
        FROM resume cat
        JOIN courses c ON cat.course_slug = c.slug
        JOIN skills f ON cat.skills_slug = f.slug
        JOIN departments d ON c.department_id = d.id
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