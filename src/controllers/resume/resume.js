// Update these imports:
import { getAllCourses, getCourseBySlug } from '../../models/resume/skills.js';
import { getSectionsByCourseSlug } from '../../models/resume/projects.js';

// Route handler for the resume skills page
const catalogPage = async (req, res) => {
    // Model functions are async, so we must await them
    const courses = await getAllCourses();

    res.render('/catalog/list', {
        title: 'Course Catalog',
        courses: courses
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

    // Get sections (course offerings) separately from the catalog
    // Pass the sortBy parameter directly to the model - PostgreSQL handles the sorting
    const sortBy = req.query.sort || 'time';

    res.render('/catalog/detail', {
        title: `${course.courseCode} - ${course.name}`,
        course: course,
        sections: sections,
        currentSort: sortBy
    });
};

export { catalogPage, courseDetailPage };