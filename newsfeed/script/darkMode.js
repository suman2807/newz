document.getElementById('toggleMode').addEventListener('change', function() {
    if (this.checked) {
        document.body.classList.add('dark-mode'); // Add dark mode class
    } else {
        document.body.classList.remove('dark-mode'); // Remove dark mode class
    }
});
