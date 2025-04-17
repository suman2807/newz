document.getElementById('toggleSidebar').addEventListener('click', function() {
    var sidebar = document.querySelector('.sidebar');
    var toggleIcon = this.querySelector('i');
    var toggleText = this.childNodes[1]; // Assuming text node is the second child

    sidebar.classList.toggle('open'); // Toggle 'open' class on sidebar

    if (sidebar.classList.contains('open')) {
        toggleIcon.className = 'fa-solid fa-circle-arrow-down'; // Change to arrow down icon
        toggleText.nodeValue = ' Close'; // Change text to 'Close'
    } else {
        toggleIcon.className = 'fa-solid fa-circle-arrow-up'; // Change to arrow up icon
        toggleText.nodeValue = ' Open'; // Change text to 'Open'
    }
});
