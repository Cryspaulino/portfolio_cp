import { Router } from 'express';
import contactRoutes from './forms/contact.js';
import registrationRoutes from './forms/registration.js';

const router = Router();

// Add contact-specific styles to all contact routes
// router.use('/contact', (req, res, next) => {
//     res.addStyle('<link rel="stylesheet" href="/css/contact.css">');
//     next();
// });

// // Add registration-specific styles to all registration routes
// router.use('/register', (req, res, next) => {
//     res.addStyle('<link rel="stylesheet" href="/css/registration.css">');
//     next();
// });

// // Contact form routes
// router.use('/contact', contactRoutes);

// Registration routes
router.use('/register', registrationRoutes);

// Home and basic pages
router.get('/', homePage);
// router.get('/about', aboutPage);

// Demo page with special middleware
// router.get('/demo', addDemoHeaders, demoPage);

// Route to trigger a test error
router.get('/test-error', testErrorPage);

export default router;