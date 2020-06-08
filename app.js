const express = require('express');
const bodyParser = require('body-parser');
const pgp = require('pg-promise')();
const PORT = process.env.PORT || 3000;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(express.static('public'));

const config = {
  host: 'localhost',
  port: '5432',
  database: 'assessment',
  user: 'postgres',
};

const db = pgp(config);

app.get('/Invoice', (req, res) => {
  db.query("SELECT * FROM invoice WHERE status = 'pending' ORDER BY id ASC")
  .then((results) => {
    // console.log(results)
    res.render('index', {
      title: 'Assessment',
      results: results
    });
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

app.put('/Invoice/:id', (req, res) => {
  db.result("UPDATE invoice SET status = 'Approved' WHERE invoice_number = ${id} RETURNING *", req.params)
  db.query("SELECT * FROM invoice WHERE status = 'pending' ORDER BY id ASC")
  .then((result) => {
    console.log(result)
    res.render('index', {
      title: 'Assessment',
      results: result
    })
  })
  .catch((e) => {
    res.status(500).json({
      error: 'Database Error',
    });
  });
});

app.listen(PORT, () => console.log(`Running: http://localhost:${PORT}`));