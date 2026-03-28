import { body, validationResult } from 'express-validator';
import { findUserByEmail, verifyPassword } from '../../models/forms/login.js';
import { Router } from 'express';

const router = Router();

const loginValidation = [
    body('email')
        .trim()
        .isEmail()
        .withMessage('Please provide a valid email address')
        .normalizeEmail(),

    body('password')
        .isLength({ min: 8 })
        .withMessage('Password is required')
];

const showLoginForm = (req, res) => {
    res.render('forms/login/form', {
        title: 'User Login',
    });
};

const processLogin = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        console.error('There was an error during the validation process.')
        return res.redirect('/login');
    }

    const { email, password } = req.body;

    try {
        const findEmail = await findUserByEmail(email);
        if (!findEmail.includes(email)) {
            req.flash('error', 'User not found');

            res.redirect('/login');
        }

        const checkPassword = await verifyPassword(password,user.password);

        if (!checkPassword.includes(value)) {
            req.flash('error', 'Invalid password');
            res.redirect('/login');
        }

        delete user.password;

        await verifyPassword(password, user.password);
        req.flash('success', user, 'You were succesfully logged in');

        req.session.user = user
        res.redirect('/dashboard');


    } catch (error) {
        console.error('Oh oh! There was an error logging you in');
        req.flash('error', 'Unable to submit your information')
        res.redirect('/login');
    }
};

/**
 * Handle user logout.
 * 
 * NOTE: connect.sid is the default session cookie name since we did not specify a custom name when creating the session in server.js.
 */
const processLogout = (req, res) => {
    // First, check if there is a session object on the request
    if (!req.session) {
        // If no session exists, there's nothing to destroy,
        // so we just redirect the user back to the home page
        return res.redirect('/');
    }

    // Call destroy() to remove this session from the store (PostgreSQL in our case)
    req.session.destroy((err) => {
        if (err) {
            // If something goes wrong while removing the session from the database:
            console.error('Error destroying session:', err);

            /**
             * Clear the session cookie from the browser anyway, so the client
             * does not keep sending an invalid session ID.
             */
            res.clearCookie('connect.sid');

            /** 
             * Normally we would respond with a 500 error since logout did not fully succeed.
             * Example: return res.status(500).send('Error logging out');
             * 
             * Since this is a practice site, we will redirect to the home page anyway.
             */
            return res.redirect('/');
        }

        // If session destruction succeeded, clear the session cookie from the browser
        res.clearCookie('connect.sid');

        // Redirect the user to the home page
        res.redirect('/');
    });
};

/**
 * Display protected dashboard (requires login).
 */
const showDashboard = (req, res) => {
    const user = req.session.user;
    const sessionData = req.session;

    if (user && user.password) {
        console.error('Security error: password found in user object');
        delete user.password;
    }
    if (sessionData.user && sessionData.user.password) {
        console.error('Security error: password found in sessionData.user');
        delete sessionData.user.password;
    }

    // TODO: Render the dashboard view (dashboard)
    // TODO: Pass title: 'Dashboard', user, and sessionData to template
};

router.get('/', showLoginForm);
router.post('/', loginValidation, processLogin);

export default router;
export { processLogout, showDashboard };