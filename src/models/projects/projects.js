import db from '../db.js';

/**
 * Get all projects with optional sorting
 */
export const getAllProjects = async () => {
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
            p.name;
    `;

    const result = await db.query(query);

    return result.rows.map(p => ({
        id: p.id,
        name: p.name,
        description: p.description,
        category: p.category
    }));
};

/**
 * Core function (like getCourse)
 */
const getProject = async (identifier, identifierType = 'id') => {
    const whereClause =
        identifierType === 'id' ? 'p.id = $1' : 'p.name = $1';

    const query = `
        SELECT p.id, p.name, p.description,
               c.name AS category
        FROM projects p
        LEFT JOIN categories c ON p.category_id = c.id
        WHERE ${whereClause}
    `;

    const result = await db.query(query, [identifier]);

    if (result.rows.length === 0) return {};

    const p = result.rows[0];

    return {
        id: p.id,
        name: p.name,
        description: p.description,
        category: p.category
    };
};

/**
 * Wrappers (same pattern as courses.js)
 */
export const getProjectById = (id) => getProject(id, 'id');
export const getProjectByName = (name) => getProject(name, 'name');