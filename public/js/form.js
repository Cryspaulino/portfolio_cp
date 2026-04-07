const btn = document.getElementById('addProjectBtn');
const formContainer = document.getElementById('addProjectFormContainer');

btn.addEventListener('click', () => {
    formContainer.style.display = formContainer.style.display === 'none' ? 'block' : 'none';
});