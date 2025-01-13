// reservationRoutes.js
const express = require('express');
const router = express.Router();
const pool = require('../config/db');  // Database configuration
const { ensureAuthenticated } = require('../controllers/authController');  // Authentication middleware

// Route for adding a reservation
router.post('/api/reservations', ensureAuthenticated, async (req, res) => {
    const { terrain, date, time } = req.body;  // Extract data from request body
    const user_id = req.session.user.id;  // Get user ID from session

    // Log the data to verify it
    console.log("Reservation data received:", { user_id, terrain, date, time });

    try {
        const query = 'INSERT INTO reservation (user_id, terrain, date, time) VALUES ($1, $2, $3, $4) RETURNING *';
        const result = await pool.query(query, [user_id, terrain, date, time]);

        // Log the result of the query to verify the insertion
        console.log("Inserted reservation:", result.rows[0]);

        res.status(201).json({ message: 'Réservation ajoutée avec succès', reservation: result.rows[0] });
    } catch (err) {
        console.error('Erreur lors de l\'ajout de la réservation:', err);
        res.status(500).json({ message: 'Erreur lors de l\'ajout de la réservation' });
    }
});
// Route for deleting all reservations for the authenticated user
router.delete('/api/reservations', ensureAuthenticated, async (req, res) => {
  const user_id = req.session.user.id; // Get user ID from session

  try {
      // Delete reservations for the user
      const query = 'DELETE FROM reservation WHERE user_id = $1';
      const result = await pool.query(query, [user_id]);

      console.log(`Deleted ${result.rowCount} reservations for user_id: ${user_id}`);

      res.status(200).json({
          message: `${result.rowCount} réservation(s) supprimée(s) avec succès.`,
      });
  } catch (err) {
      console.error('Erreur lors de la suppression des réservations:', err);
      res.status(500).json({ message: 'Erreur lors de la suppression des réservations' });
  }
});
// Route pour récupérer les réservations d'un utilisateur spécifique
router.get('/api/my-reservations', ensureAuthenticated, async (req, res) => {
  const user_id = req.session.user.id; // ID de l'utilisateur connecté

  try {
      const query = 'SELECT * FROM reservation WHERE user_id = $1 ORDER BY date, time';
      const result = await pool.query(query, [user_id]);

      res.status(200).json({
          message: 'Réservations récupérées avec succès',
          reservations: result.rows, // Liste des réservations
      });
  } catch (err) {
      console.error('Erreur lors de la récupération des réservations:', err);
      res.status(500).json({ message: 'Erreur lors de la récupération des réservations' });
  }
});




// Route for displaying all reservations


module.exports = router;
