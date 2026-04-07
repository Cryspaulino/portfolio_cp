import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import { emailExists, saveUser, getAllUsers } from '../../models/forms/registration.js';
import { registrationValidation } from '../../middleware/validation/forms.js';

const router = Router();

const showRegistrationForm = (req, res) => {
    res.render('forms/registration/form', {
        title: 'User Registration'
    });
};

const processRegistration = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        errors.array().forEach(error => {
            req.flash('error', error.msg);
        });
        res.redirect('/register');
    }

    const { name, email, password } = req.body;
    
    try {
        const emailCall = await emailExists(email);

        if (emailCall) {
            req.flash('warning', 'An account already exists')
            res.redirect('/register');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        saveUser(name, email, hashedPassword)
        req.flash('success', 'Your information was saved successfully!')
        res.redirect('/register/list')
        
    } catch (error) {
        console.error('Oh oh! There was an error saving your information: ', error);
        req.flash('error', 'Unable to submit your message')
        res.redirect('/register');
    }
};

const showAllUsers = async (req, res) => {
    let users = [];

    try {
        users = await getAllUsers();
    } catch (error) {
        console.error('There was an error')
        if (!errors.isEmpty()) {
            console.log(users)
        }
    }

    res.render('forms/registration/list', {
        title: 'Registered Users', 
        users
    });
};

router.get('/', showRegistrationForm);

router.post('/', registrationValidation, processRegistration);

router.get('/list', showAllUsers);

export default router;