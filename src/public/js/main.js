$(document).ready(function () {
  // Navbar Hover dropdown
  $('nav li.dropdown').hover(function () {
    $(this).find('.dropdown-menu').stop(true, true).delay(100).fadeIn(100);
  }, function () {
    $(this).find('.dropdown-menu').stop(true, true).delay(100).fadeOut(100);
  });

  $("#show_hide_password_1 a").on('click', function (event) {
    event.preventDefault();
    if ($('#show_hide_password_1 input').attr("type") == "text") {
      $('#show_hide_password_1 input').attr('type', 'password');
      $('#show_hide_password_1 i').addClass("fa-eye-slash");
      $('#show_hide_password_1 i').removeClass("fa-eye");
    } else if ($('#show_hide_password_1 input').attr("type") == "password") {
      $('#show_hide_password_1 input').attr('type', 'text');
      $('#show_hide_password_1 i').removeClass("fa-eye-slash");
      $('#show_hide_password_1 i').addClass("fa-eye");
    }
  });
  $("#show_hide_password_2 a").on('click', function (event) {
    event.preventDefault();
    if ($('#show_hide_password_2 input').attr("type") == "text") {
      $('#show_hide_password_2 input').attr('type', 'password');
      $('#show_hide_password_2 i').addClass("fa-eye-slash");
      $('#show_hide_password_2 i').removeClass("fa-eye");
    } else if ($('#show_hide_password_2 input').attr("type") == "password") {
      $('#show_hide_password_2 input').attr('type', 'text');
      $('#show_hide_password_2 i').removeClass("fa-eye-slash");
      $('#show_hide_password_2 i').addClass("fa-eye");
    }
  });
  $("#show_hide_password_3 a").on('click', function (event) {
    event.preventDefault();
    if ($('#show_hide_password_3 input').attr("type") == "text") {
      $('#show_hide_password_3 input').attr('type', 'password');
      $('#show_hide_password_3 i').addClass("fa-eye-slash");
      $('#show_hide_password_3 i').removeClass("fa-eye");
    } else if ($('#show_hide_password_3 input').attr("type") == "password") {
      $('#show_hide_password_3 input').attr('type', 'text');
      $('#show_hide_password_3 i').removeClass("fa-eye-slash");
      $('#show_hide_password_3 i').addClass("fa-eye");
    }
  });
  $("#show_hide_password_4 a").on('click', function (event) {
    event.preventDefault();
    if ($('#show_hide_password_4 input').attr("type") == "text") {
      $('#show_hide_password_4 input').attr('type', 'password');
      $('#show_hide_password_4 i').addClass("fa-eye-slash");
      $('#show_hide_password_4 i').removeClass("fa-eye");
    } else if ($('#show_hide_password_4 input').attr("type") == "password") {
      $('#show_hide_password_4 input').attr('type', 'text');
      $('#show_hide_password_4 i').removeClass("fa-eye-slash");
      $('#show_hide_password_4 i').addClass("fa-eye");
    }
  });
});
