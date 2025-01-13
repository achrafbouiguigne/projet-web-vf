  const express = require('express');
  const session = require('express-session');
  const path = require('path');
  const pool = require('./config/db');  // Assuming you have a PostgreSQL database connection pool
  const authRoutes = require('./routes/authRoutes');  // Import routes

  const app = express();
  const port = process.env.PORT || 3000;

  // Set up EJS as the view engine
  app.set('view engine', 'ejs');
  app.set('views', path.join(__dirname, 'views'));

  // Middleware for parsing form data
  app.use(express.urlencoded({ extended: true }));

  // Session management
  app.use(session({
    secret: 'your_secret_key',  // Change this to a strong secret
    resave: false,
    saveUninitialized: true,
  }));

  // Routes for authentication (login, register, etc.)
  app.use('/', authRoutes);  
  app.use(express.static('public'));
  app.use(express.json());

  const reservationRoutes = require('./routes/reservationRoutes'); // Importer les routes de réservation

  // Autres rouates

  app.use('/', reservationRoutes);
  app.get('/api/reservations', async (req, res) => {
    try {
      const result = await pool.query(`
        SELECT r.id, r.terrain, r.date, r.time, u.username
        FROM reservation r
        INNER JOIN users u ON r.user_id = u.id
        ORDER BY r.date, r.time;
      `);
      res.json(result.rows); // Send reservations data as JSON
    } catch (error) {
      console.error('Error fetching reservations:', error);
      res.status(500).send('Internal Server Error');
    }
  });
  

  // All routes will be prefixed with /

  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
