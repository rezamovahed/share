self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open('share').then(function(cache) {
      return cache.addAll([
        '/',
        '/upload-data?order=desc&offset=0&limit=10',
        '/login',
        '/signup',
        '/gallery',
        '/account',
        '/user/forgot-password',
        '/user/resend-activation',
        '/admin',
        '/admin/uploads',
        '/admin/gallery',
        '/admin/users',
        '/admin/settings',
        '/bower_components/jquery/dist/jquery.min.js',
        '/bower_components/moment/min/moment.min.js',
        '/bower_components/font-awsome/css/all.min.css',
        '/bower_components/font-awsome/webfonts/fa-brands-400.ttf',        '/bower_components/font-awsome/webfonts/fa-brands-400.ttf',
        '/bower_components/font-awsome/webfonts/fa-brands-400.woff'        '/bower_components/font-awsome/webfonts/fa-brands-400.woff',,
        '/bower_components/font-awsome/webfonts/fa-brands-400.woff2        '/bower_components/font-awsome/webfonts/fa-brands-400.woff2',',
        '/bower_components/bootstrap/dist/css/bootstrap.min.css',
        '/bower_components/bootstrap4-toggle/css/bootstrap4-toggle.min.css',
        '/bower_components/bootstrap-select/dist/css/bootstrap-select.min.css',
        '/bower_components/bootstrap-table/dist/bootstrap-table.min.css',
        '/bower_components/tempusdominus-bs4/build/css/tempusdominus-bootstrap-4.min.css',
        '/bower_components/bootstrap-show-password/dist/bootstrap-show-password.min.js',
        '/assets/css/main.css',
        '/bower_components/bootstrap/dist/js/bootstrap.bundle.min.js',
        '/bower_components/bootstrap4-toggle/js/bootstrap4-toggle.min.js',
        '/bower_components/bootstrap-select/dist/js/bootstrap-select.min.js',
        '/bower_components/bootstrap-table/dist/bootstrap-table.min.js',
        '/bower_components/conditionize2.js/jquery.conditionize2.min.js',
        '/assets/js/main.js',
        '/assets/images/logo.png',
        '/favicon.ico'
      ]);
    })
  );
});
self.addEventListener('fetch', function(event) {
  console.log(event.request.url);

  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request);
    })
  );
});
