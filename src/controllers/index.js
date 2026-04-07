// Route handlers for static pages
const testErrorPage = (req, res, next) => {
    const err = new Error('This is a test error');
    err.status = 500;
    next(err);
};

// const demoPage = (req, res) => {
//     res.render('demo', { title: 'Middleware Demo Page' });
// };


export { testErrorPage };