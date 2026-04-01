import { getAllProjects, getProjectBySlug } from '../../models/resume/projects.js';

// Route handler for the resume skills page
const resumePage = async (req, res) => {
    const projects = await getAllProjects();

    res.render('/resume/projects', {
        title: 'Projects',
        projects: projects
    });
};

// Route handler for individual course detail pages
const projectDetailPage = async (req, res, next) => {
    const projectSlug = req.params.slugId;
    const project = await getProjectBySlug(projectSlug);

    if (Object.keys(course).length === 0) {
        const err = new Error(`Course ${courseSlug} not found`);
        err.status = 404;
        return next(err);
    }

    // Get sections (course offerings) separately from the resume
    // Pass the sortBy parameter directly to the model - PostgreSQL handles the sorting
    // const sortBy = req.query.sort || 'time';

    res.render('/resume/skills', {
        title: `${course.courseCode} - ${course.name}`,
        course: course,
        sections: sections,
        // currentSort: sortBy
    });
};

export { resumePage, courseDetailPage };