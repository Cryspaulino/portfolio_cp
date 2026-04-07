import db from '../db.js';

/**
 * Retrieves all projects from the database, including their categories.
 * 
 * Projects are ordered by category (Work → School → Personal → Others)
 * and then by project name.
 * 
 * @returns {Promise<Array>} Array of project records
 */
const getAllProjects = async () => {
    const query = `
        SELECT p.id, p.name, p.description,
               c.name AS category
        FROM projects p
        LEFT JOIN categories c ON p.category_id = c.id
        ORDER BY 
            CASE c.name
                WHEN 'Work' THEN 1
                WHEN 'School' THEN 2
                WHEN 'Personal' THEN 3
                ELSE 4
            END,
            p.name
    `;
    const result = await db.query(query);
    return result.rows;
};

/**
 * Retrieves a single project by ID or name.
 * 
 * @param {string|number} identifier - The project ID or name
 * @param {string} identifierType - Either 'id' or 'name' (default: 'id')
 * @returns {Promise<Object>} Project record, or empty object if not found
 */
const getProject = async (identifier, identifierType = 'id') => {
    const whereClause = identifierType === 'id' ? 'p.id = $1' : 'p.name = $1';
    const query = `
        SELECT p.id, p.name, p.description,
               c.name AS category
        FROM projects p
        LEFT JOIN categories c ON p.category_id = c.id
        WHERE ${whereClause}
    `;
    const result = await db.query(query, [identifier]);
    return result.rows[0] || {};
};

/**
 * @param {Object} project - Project data
 * @param {string} project.name - Project name
 * @param {string} project.description - Project description
 * @param {string} project.category - Category name
 * @returns {Promise<Object>} The newly created project record
 */
const addProjectToDb = async ({ name, description, category_id, job_id }) => {
    const query = `
        INSERT INTO projects (name, description, category_id)
        VALUES ($1, $2, $3)
        RETURNING id, name, description, category_id
    `;
    const result = await db.query(query, [name, description, category_id]);
    return result.rows[0];
};
/**
 * @returns {Promise<Array>} Array of job records
 */
const getAllJobs = async () => {
    const query = `
        SELECT id, company, position
        FROM jobs
        ORDER BY company
    `;
    const result = await db.query(query);
    return result.rows;
};

const getAllCategories = async () => {
    const result = await db.query(`
        SELECT id, name
        FROM categories
        ORDER BY name
    `);
    return result.rows;
};

const getProjectById = (id) => getProject(id, 'id');
const getProjectByName = (name) => getProject(name, 'name');

export {
    getAllProjects,
    getProjectById,
    getProjectByName,
    addProjectToDb,
    getAllJobs,
    getAllCategories
};