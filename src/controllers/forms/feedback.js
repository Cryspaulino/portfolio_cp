import { Router } from 'express';
import { createContactForm, getAllContactForms } from '../../models/forms/feedback.js';
import { contactValidation } from '../../middleware/validation/forms.js';

const router = Router();

const showContactForm = (req, res) => {
    res.render('forms/feedback/form', {
        title: 'Feedback'
    });
};

const handleContactSubmission = async (req, res) => {
    const errors = await contactValidation(req);

    if (!errors.isEmpty()) {
        errors.array().forEach(error => {
            req.flash('error', error.msg);
        });
        return res.redirect('/feedback');
    }

    try {
        const { subject, message } = req.body;
        // Save to database
        await createContactForm(subject, message);
        // Inside your validation error check
        req.flash('success', 'Thank you for leaving helpful insights!');
        res.redirect('/feedback');
    } catch (error) {
        console.error('Error saving your message:', error);
        req.flash('error', 'Unable to submit your message. Please try again later.');
        res.redirect('/feedback');
    }
};

const showContactResponses = async (req, res) => {
    let contactForms = [];

    try {
        contactForms = await getAllContactForms();
    } catch (error) {
        console.error('Error retrieving feedback forms:', error);
    }

    res.render('forms/feedback/responses', {
        title: 'Feedback Form Submissions',
        contactForms
    });
};

router.get('/', showContactForm);
// router.post('/',
//     [
//         body('subject')
//             .trim()
//             .isLength({ min: 2 })
//             .withMessage('Subject must be at least 2 characters'),
//         body('message')
//             .trim()
//             .isLength({ min: 10 })
//             .withMessage('Message must be at least 10 characters')
//     ],
//     handleContactSubmission
// );

router.get('/responses', showContactResponses);

export default router;