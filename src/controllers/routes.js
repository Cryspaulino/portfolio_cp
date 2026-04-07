import { Router } from 'express';
import { testErrorPage } from './index.js';
import projectsRoutes from './projects/projects.js';
import registrationRoutes from './forms/registration.js';
import feedbackRoutes from './forms/feedback.js';
import loginRoutes from './forms/login.js';
import { processLogout, showDashboard } from './forms/login.js';
import { requireLogin } from '../middleware/auth.js';

const router = Router();

/* Add project-specific styles to all project routes */
router.use('/projects', (req, res, next) => {
    res.addStyle('<link rel="stylesheet" href="/css/projects.css">');
    res.addStyle('<link rel="stylesheet" href="/css/forms.css">')
    res.addStyle('<link rel="stylesheet" href="/css/modals.css">')
    next();
});

router.use('/errors', (req, res, next) => {
    res.addStyle('<link rel="stylesheet" href="/css/errors.css">');
    next();
});

router.use('/projects', projectsRoutes);
router.use('/feedback', feedbackRoutes);

router.get('/projects', projectsRoutes);
router.get('/projects/:id', projectsRoutes);

router.get('/projects/add', projectsRoutes);
router.post('/projects/add', projectsRoutes);

router.use('/register', registrationRoutes);


router.get('/test-error', testErrorPage);

// Login routes (form and submission)
router.use('/login', loginRoutes);

// Authentication-related routes at root level
router.get('/logout', processLogout);
router.get('/dashboard', requireLogin, showDashboard);

export default router;