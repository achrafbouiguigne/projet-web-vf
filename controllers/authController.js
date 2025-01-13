const bcrypt = require('bcryptjs');  
const pool = require('../config/db');  


const registerUser = async (req, res) => {
  const { username, password } = req.body;

  try {
  
    const checkUserQuery = 'SELECT * FROM users WHERE username = $1';
    const result = await pool.query(checkUserQuery, [username]);

    if (result.rows.length > 0) {
      return res.status(400).send('Username already exists');
    }

    
    const hashedPassword = await bcrypt.hash(password, 10);

   
    const insertUserQuery = 'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id, username';
    const newUser = await pool.query(insertUserQuery, [username, hashedPassword]);

    
    req.session.user = newUser.rows[0];

   
    res.redirect('/dashboard');
  } catch (err) {
    console.error('Error registering user:', err);
    res.status(500).send('Error registering user');
  }
};

const loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {

    const result = await pool.query('SELECT id, username, password FROM users WHERE username = $1', [username]);

    if (result.rows.length > 0) {
      const user = result.rows[0];

    
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        
        req.session.user = user;

        
        return res.redirect('/dashboard');
      } else {
        
        res.status(401).send('Invalid username or password');
      }
    } else {
      
      res.status(401).send('Invalid username or password');
    }
  } catch (err) {
    console.error('Error logging in user:', err);
    res.status(500).send('Error logging in user');
  }
};


const ensureAuthenticated = (req, res, next) => {
  if (req.session.user) {
    return next();  
  }
  res.redirect('/login');  
};

module.exports = {
  registerUser,
  loginUser,
  ensureAuthenticated,
};
