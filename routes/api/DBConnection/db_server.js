
const sql = require('mssql');
// Create a configuration object for the MSSQL Server database

const config = {
  // server: '192.168.0.18',
  server: '192.168.0.150',
  database: 'projectdetails',
  user: 'sa',
  // password: 'Admin159',
  password: 'Tiller_@159',
  options: {
    encrypt: false,
    trustServerCertificate: true
  }
};

// Create a connection pool for the MSSQL Server database
const pool = new sql.ConnectionPool(config);

// Connect to the MSSQL Server database
pool.connect().then(() => {
  console.log('Connected to myDatabase');
}).catch(err => {
  console.log(err);
});


// Endpoint to switch the active database context


module.exports = pool; 