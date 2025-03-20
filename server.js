const express = require('express');
const mysql = require('mysql2'); // Use mysql2 for better compatibility
const cors = require('cors');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json()); 

// MySQL Database Connection
require('dotenv').config({ path: 'user.env' });
const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER, 
    password: process.env.DB_PASSWORD, 
    database: process.env.DB_NAME
});

// Connect to the MySQL database
db.connect((err) => {
    if (err) {
        console.error('Database connection error:', err);
        return;
    }
    console.log('Connected to the MySQL database.');
});

// Function to calculate BMI and nutrient needs based on BMI and goal
app.post('/recommend', (req, res) => {
    const { height, weight, age, gender, goal } = req.body;

    // Calculate BMI: weight (kg) / (height (m) * height (m))
    const heightInMeters = height / 100;
    const bmi = (weight / (heightInMeters * heightInMeters)).toFixed(2);

    // Determine BMI category
    let bmiCategory;
    if (bmi < 18.5) {
        bmiCategory = 'Underweight';
    } else if (bmi >= 18.5 && bmi < 24.9) {
        bmiCategory = 'Normal';
    } else if (bmi >= 25 && bmi < 29.9) {
        bmiCategory = 'Overweight';
    } else {
        bmiCategory = 'Obese';
    }

    // Query to get nutrient intake data based on BMI category and goal
    const query = `SELECT protein, carbs, fat, calories FROM intake_data WHERE bmi_category = ? AND goal = ?;`;

    db.query(query, [bmiCategory, goal], (err, results) => {
        if (err) {
            console.error('Query error:', err);
            return res.status(500).json({ error: 'Database query failed.' });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'No nutrient data found for this BMI category and goal.' });
        }

        res.json({ results: results[0], bmi, bmiCategory });
    });
});

// Catch-all route for undefined endpoints
app.use((req, res) => {
    console.log(`Requested URL: ${req.url}`);
    res.status(404).json({ message: 'Endpoint not found.' });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
