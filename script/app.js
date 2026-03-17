window.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('.fade-up').forEach(function(el) {
    el.style.opacity = '1';
    el.style.transform = 'none';
  });
});

$(document).ready(function() {
  $.getJSON("data.json", function(data) {
    $('.my-name').text(data.name);
    $('.experience').text(data.experience);
    $('.total-projects').text(data.totalProjects);
    $('.total-companies').text(data.totalCompanies);

  });
});