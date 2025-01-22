// Handle mobile menu toggle
document.querySelector('.menu-toggle').addEventListener('click', function() {
    document.querySelector('.sidebar').classList.toggle('active');
});

// Close sidebar when clicking outside on mobile
document.addEventListener('click', function(event) {
    const sidebar = document.querySelector('.sidebar');
    const menuToggle = document.querySelector('.menu-toggle');
    
    if (!sidebar.contains(event.target) && !menuToggle.contains(event.target)) {
        sidebar.classList.remove('active');
    }
});

// Handle active menu item
function setActivePage(pageName) {
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
        if (item.dataset.page === pageName) {
            item.classList.add('active');
        }
    });
}

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    // Get current page from URL or set default
    const currentPage = window.location.pathname.split('/').pop().replace('.html', '') || 'dashboard';
    setActivePage(currentPage);
});



function handleCancel() {
    if (confirm('Are you sure you want to cancel? All changes will be lost.')) {
        window.history.back();
    }
  }