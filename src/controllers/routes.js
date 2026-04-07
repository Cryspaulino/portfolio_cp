import { Router } from 'express';
import projectsRoutes from './projects/projects.js';
import registrationRoutes from './forms/registration.js';
import { testErrorPage } from './index.js';

const router = Router();

/**
 * Add project-specific styles to all project routes
 */
// router.use('/projects', (req, res, next) => {
//     res.addStyle('<link rel="stylesheet" href="/css/projects.css">');
//     next();
// });

// Projects listing and details

router.use('/projects', projectsRoutes);

router.get('/projects', projectsRoutes);
router.get('/projects/:id', projectsRoutes);

router.get('/projects/add', projectsRoutes);
router.post('/projects/add', projectsRoutes);

router.use('/register', registrationRoutes);

router.get('/test-error', testErrorPage);

export default router;