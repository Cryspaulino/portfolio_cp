// import { getskillsBySlug, getSortedskills } from '../../models/skills/skills.js';

// const skillsListPage = async (req, res) => {
//     const validSortOptions = ['name', 'department', 'title'];
//     const sortBy = validSortOptions.includes(req.query.sort) ? req.query.sort : 'department';
//     const skillsList = await getSortedskills(sortBy);

//     res.render('skills/list', {
//         title: 'skills Directory',
//         skills: skillsList,
//         currentSort: sortBy
//     });
// };

// const skillsDetailPage = async (req, res, next) => {
//     const skillsSlug = req.params.skillsSlug;
//     const skillsMember = await getskillsBySlug(skillsSlug);

//     if (Object.keys(skillsMember).length === 0) {
//         const err = new Error(`skills member ${skillsSlug} not found`);
//         err.status = 404;
//         return next(err);
//     }

//     res.render('skills/detail', {
//         title: `${skillsMember.name} - skills Profile`,
//         skills: skillsMember
//     });
// };

// export { skillsDetailPage, skillsListPage}