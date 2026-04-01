// Update these imports:
import { getAllCourses, getCourseBySlug } from '../../models/resume/skills.js';
import { getSectionsByCourseSlug } from '../../models/resume/projects.js';

// Route handler for the resume skills page
const resumePage = async (req, res) => {
    const projects = await getAllCourses();

    res.render('/resume/projects', {
        title: 'Course resume',
        projects: projects
    });
};

// Route handler for individual course detail pages
const courseDetailPage = async (req, res, next) => {
    const courseSlug = req.params.slugId;
    const course = await getCourseBySlug(courseSlug);
    const sections = await getSectionsByCourseSlug(courseSlug, sortBy);

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