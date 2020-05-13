const express = require('express');

const router = express.Router();

/**
 * Routes
 */
const uploadRoutes = require('./upload');
const deleteRoutes = require('./delete');
const linkRoutes = require('./link');

router.get('/', (req, res) => {
  res.json({
    endpoints: [
      { method: 'GET', path: '/api/v1' },
      { method: 'POST', path: '/api/v1/upload' },
      { method: 'POST', path: '/api/v1/link' },
      { method: 'GET', path: '/api/v1/delete' }
    ],
    status: 200
  });
});

router.use('/upload', uploadRoutes);
router.use('/delete', deleteRoutes);
router.use('/link', linkRoutes);

module.exports = router;
