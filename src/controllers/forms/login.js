import { validationResult } from 'express-validator';
import { findUserByEmail, verifyPassword } from '../../models/forms/login.js';
import { Router } from 'express';
import { loginValidation } from '../../middleware/validation/forms.js';

const router = Router();

const showLoginForm = (req, res) => {
    res.render('forms/login/form', { 
        title: 'User Login' 
    });
};

const processLogin = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        errors.array().forEach(error => {
            req.flash('error', error.msg);
        });

        console.error('Validation errors:', errors.array());

        return res.redirect('/login');
    }

    const { email, password } = req.body;

    try {
        const user = await findUserByEmail(email);

        if (!user) {
            console.error('User not found:', email);
            req.flash('error', 'Invalid email or password');
            return res.redirect('/login');
        }

        const passwordMatch = await verifyPassword(password, user.password);

        if (!passwordMatch) {
            console.error('Invalid password for:', email);
            req.flash('error', 'Invalid email or password');
            return res.redirect('/login');
        }

        delete user.password;

        req.session.user = user;

        req.flash('success', 'Welcome back!');
        // res.redirect('/dashboard');

    } catch (error) {
        console.error('Login error:', error);
        req.flash('error', 'An error occurred. Please try again.');
        res.redirect('/login');
    }
};

export const processLogout = (req, res) => {
    if (!req.session) {
        return res.redirect('/');
    }

    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
            res.clearCookie('connect.sid');
            return res.redirect('/');
        }

        res.clearCookie('connect.sid');
        res.redirect('/');
    });
};

/**
 * Display protected dashboard.
 */
export const showDashboard = (req, res) => {
    const user = req.session.user;
    const sessionData = req.session;

    // SECURITY CHECK
    if (user && user.password) {
        console.error('Security error: password found in user object');
        delete user.password;
    }
    if (sessionData.user && sessionData.user.password) {
        console.error('Security error: password found in sessionData.user');
        delete sessionData.user.password;
    }

    res.render('dashboard', {
        title: 'Dashboard',
        user,
        sessionData
    });
};

router.get('/', showLoginForm);
router.post('/', loginValidation, processLogin);

export default router;