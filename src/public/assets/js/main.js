$(document).ready(() => {
  // Navbar Hover dropdown
  $('nav li.dropdown').hover(
    function() {
      $(this)
        .find('.dropdown-menu')
        .stop(true, true)
        .delay(100)
        .fadeIn(100);
    },
    function() {
      $(this)
        .find('.dropdown-menu')
        .stop(true, true)
        .delay(100)
        .fadeOut(100);
    }
  );
  // hide the alert
  setInterval(() => {
    $('.alert.alert-timeout').hide();
  }, 15000);
});
