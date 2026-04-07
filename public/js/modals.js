function openModal(src) {
    const modal = document.getElementById('imageModal');
    const img = document.getElementById('modalImg');

    img.src = src;
    modal.style.display = 'flex';
}

function closeModal(e) {
    if (!e || e.target.id === 'imageModal' || e.target.className === 'close') {
        document.getElementById('imageModal').style.display = 'none';
    }
}

document.querySelectorAll('.image-list img')
    .forEach(img => {
        img.addEventListener('click', () => openModal(img.src));
    });
