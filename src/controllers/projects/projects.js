import { Router } from 'express';
import { getAllProjects, getProjectById, addProjectToDb, getAllJobs, getAllCategories } from '../../models/projects/projects.js';
import { getSkillsByProjectId } from '../../models/projects/skills.js';
import { getImagesByProjectId } from '../../models/projects/images.js';
import { body, validationResult } from 'express-validator';
// import { requireLogin } from '../../middleware/auth.js';

const router = Router();

const projectValidation = [
    body('name')
        .trim()
        .isLength({ min: 2 })
        .withMessage('Project name must be at least 2 characters'),
    body('description')
        .trim()
        .isLength({ min: 5 })
        .withMessage('Description must be at least 5 characters'),
    body('category_id')
        .notEmpty()
        .withMessage('Category is required'),
    body('job_id')
        .notEmpty()
        .withMessage('Job association is required')
];

const projectsPage = async (req, res) => {
    try {
        const projects = await getAllProjects();
        const jobs = await getAllJobs();
        const selectedCategory = req.query.category || null;

        const allCategories = [...new Set(projects.map(p => p.category))];

        const filtered = selectedCategory
            ? projects.filter(p => p.category === selectedCategory)
            : projects;

        const groupedProjects = {};
        filtered.forEach(p => {
            const category = p.category || 'Other';
            if (!groupedProjects[category]) groupedProjects[category] = [];
            groupedProjects[category].push(p);
        });

        res.render('projects/projects', {
            title: 'Projects',
            groupedProjects,
            categories: allCategories,
            selectedCategory,
            jobs
        });
    } catch (error) {
        console.error('Error loading projects page:', error);
        req.flash('error', 'Unable to load projects');
        res.redirect('/projects');
    }
};

const showAddForm = async (req, res) => {
    try {
        const jobs = await getAllJobs();
        const categories = await getAllCategories();
        res.render('projects/projects', { categories, jobs, title: 'Projects List' });
    } catch (error) {
        console.error('Error displaying add project form:', error);
        req.flash('error', 'Unable to load form');
        res.redirect('/projects');
    }
};

const addProject = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        errors.array().forEach(error => req.flash('error', error.msg));
        return res.redirect('/projects/projects');
    }

    const { name, description, category_id, job_id } = req.body;

    try {
        await addProjectToDb({
            name,
            description,
            category_id: parseInt(category_id),
            job_id: parseInt(job_id)
        });
        req.flash('success', 'Project added successfully!');
        res.redirect('/projects');
    } catch (error) {
        console.error('Error adding project:', error);
        req.flash('error', 'Unable to save project');
        res.redirect('/projects/projects');
    }
};

const projectDetailPage = async (req, res, next) => {
    const projectId = req.params.id;

    try {
        const project = await getProjectById(projectId);

        if (!project || Object.keys(project).length === 0) {
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
    } catch (error) {
        console.error('Error loading project details:', error);
        req.flash('error', 'Unable to load project details');
        res.redirect('/projects');
    }
};

router.get('/projects', projectsPage);

router.get('/projects', showAddForm);
router.post('/projects', projectValidation, addProject);

router.get('/:id', projectDetailPage);

export default router;