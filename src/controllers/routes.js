import { Router } from 'express';
import { homePage, testErrorPage } from './index.js';
import { projectPage, skillDetailPage } from './projects/projects.js';
// import registrationRoutes from './forms/registration.js';
// import contactRoutes from './forms/contact.js';

const router = Router();

// Home
router.get('/', homePage);

// Projects
router.get('/projects', projectPage);
router.get('/projects/:slugId', skillDetailPage);

router.get('/test-error', testErrorPage);

export default router;


// Add contact-specific styles to all contact routes
// router.use('/contact', (req, res, next) => {
//     res.addStyle('<link rel="stylesheet" href="/css/contact.css">');
//     next();
// });

// // Contact form routes
// router.use('/contact', contactRoutes);

// Registration routes
// router.use('/register', registrationRoutes);