import db from '../db.js';

export const getImagesByProjectId = async (projectId) => {
  const query = `
    SELECT image_path
    FROM project_images
    WHERE project_id = $1
  `;

  const result = await db.query(query, [projectId]);

  return result.rows.map(img => ({
    path: img.image_path
  }));
};