require('dotenv').config();
const mysql = require('mysql2/promise');
const fs = require('fs').promises;
const bcrypt = require('bcrypt');

async function setupDatabase() {
  let connection;
  try {
    // Read the SQL file
    const sqlFile = await fs.readFile('setup.sql', 'utf8');

    // Create a connection to MySQL
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    });

    // Create database if it doesn't exist
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`);

    // Close the initial connection
    await connection.end();

    // Create a new connection with the database selected
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    // Split the SQL file into individual commands
    const commands = sqlFile.split(';').filter(cmd => cmd.trim() !== '');

    // Execute each command
    for (const command of commands) {
      if (command.trim()) {
        await connection.query(command);
      }
    }

    // Hash the password for the admin user
   const saltRounds = 10;
   const hashedPassword = await bcrypt.hash('admin123', saltRounds);

    // Insert the admin user with the hashed password
   //await connection.query(
      //'INSERT IGNORE INTO admins (username, email, password) VALUES (?, ?, ?)',
     // ['admin', 'admin@example.com', hashedPassword]
   // );

    console.log('Database setup completed successfully');
  } catch (error) {
    console.error('Error setting up database:', error);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

setupDatabase();
