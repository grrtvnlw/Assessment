const express = require('express');
const bodyParser = require('body-parser');
const pgp = require('pg-promise')();
const PORT = process.env.PORT || 3000;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.set('view engine', 'ejs');
app.set('views', 'views');

const config = {
  host: 'localhost',
  port: '5432',
  database: 'assessment',
  user: 'postgres',
};

const db = pgp(config);

app.get('/Invoice', (req, res) => {
  db.query('SELECT * FROM invoice ORDER BY id ASC')
  .then((results) => {
    res.json(results);
  });
}); 

app.post('/Invoice', (req, res) => {
  db.one("INSERT INTO invoice VALUES (DEFAULT, ${invoice_number}, ${total}, ${currency}, ${invoice_date}, ${due_date}, ${vendor_name}, ${remittance_address}, 'pending') RETURNING *", req.body)
  .then(() => {
    res.status(200).json({
      message: "invoice submitted successfully"
    });
  })
  .catch((e) => {
    res.status(500).json({
      error: 'Database Error',
    });
  });
});

app.listen(PORT, () => console.log(`Running: http://localhost:${PORT}`));