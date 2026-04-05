import { Router } from 'express';
import { homePage, testErrorPage } from './index.js';
import { projectsPage, projectDetailPage } from './projects/projects.js';

const router = Router();

// Home
router.get('/', homePage);

// Projects
router.get('/projects', projectsPage);
router.get('/projects/:id', projectDetailPage);

// Test
router.get('/test-error', testErrorPage);

export default router;