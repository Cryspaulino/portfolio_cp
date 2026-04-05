import db from '../db.js';

/**
 * Core function (like catalog pattern)
 */
const getSkillsByProject = async (identifier, identifierType = 'id') => {
    const whereClause =
        identifierType === 'id' ? 'p.id = $1' : 'p.name = $1';

    const query = `
        SELECT s.name,
               p.name AS project_name
        FROM project_skills ps
        JOIN skills s ON ps.skill_id = s.id
        JOIN projects p ON ps.project_id = p.id
        WHERE ${whereClause}
        ORDER BY s.name
    `;

    const result = await db.query(query, [identifier]);

    return result.rows.map(row => ({
        project: row.project_name,
        skill: row.name
    }));
};

/**
 * Wrappers (same pattern as catalog.js)
 */
export const getSkillsByProjectId = (id) =>
    getSkillsByProject(id, 'id');

export const getSkillsByProjectName = (name) =>
    getSkillsByProject(name, 'name');