import { getAllSkills, getSkillBySlug } from '../../models/projects/skills.js';
// import { getSectionsByCourseSlug } from '../../models/catalog/catalog.js';

// -- MOST RECENT GUIDE:
// -- DEPARTMENTS = JOBS
// -- COURSES = SKILLS
// -- CATALOG = PROJECTS

// Route handler for the resume skills page
const projectPage = async (req, res) => {
    const projects = await getAllSkills();

    res.render('projects/projects', {
        title: 'Projects',
        projects: projects
    });
};

// Route handler for individual course detail pages
const skillDetailPage = async (req, res, next) => {
    const skillSlug = req.params.slugId;
    const skill = await getSkillBySlug(skillSlug);

    if (Object.keys(skill).length === 0) {
        const err = new Error(`Skill ${skillSlug} not found`);
        err.status = 404;
        return next(err);
    }

    // Get sections (course offerings) separately from the resume
    // Pass the sortBy parameter directly to the model - PostgreSQL handles the sorting
    // const sortBy = req.query.sort || 'time';

    res.render('projects/projectdetails', {
        title: `${skill.skillCode} - ${skill.action}`,
        skill: skill,
        // sections: sections,
        // currentSort: sortBy
    });
};

export { projectPage, skillDetailPage };