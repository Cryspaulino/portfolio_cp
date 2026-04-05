import { getAllProjects, getProjectById } from '../../models/projects/projects.js';
import { getSkillsByProjectId } from '../../models/projects/skills.js';
import { getImagesByProjectId } from '../../models/projects/images.js';

// List page
export const projectsPage = async (req, res) => {
    const projects = await getAllProjects();
    const selectedCategory = req.query.category;

    // get ALL categories (before filtering)
    const allCategories = [...new Set(projects.map(p => p.category))];

    // filter AFTER
    let filtered = projects;
    if (selectedCategory) {
        filtered = projects.filter(p => p.category === selectedCategory);
    }

    // group filtered
    const grouped = {};
    filtered.forEach(p => {
        const category = p.category || 'Other';
        if (!grouped[category]) grouped[category] = [];
        grouped[category].push(p);
    });

    res.render('projects/projects', {
        title: 'Projects',
        groupedProjects: grouped,
        categories: allCategories,
        selectedCategory
    });
};

// Detail page
export const projectDetailPage = async (req, res, next) => {
    const projectId = req.params.id;
    const project = await getProjectById(projectId);

    if (Object.keys(project).length === 0) {
        const err = new Error(`Project ${projectId} not found`);
        err.status = 404;
        return next(err);
    }

    const skills = await getSkillsByProjectId(projectId);
    const images = await getImagesByProjectId(projectId);

    res.render('projects/projectdetails', {
        title: project.name,
        project,
        skills,
        images
    });

};
