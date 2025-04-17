function updateCurrentDate() {
    var options = { day: 'numeric', month: 'long', year: 'numeric' };
    var currentDate = new Date().toLocaleDateString('en-US', options);
    document.getElementById('currentDate').innerText = currentDate;
}

window.onload = updateCurrentDate;
