const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const port = 3001;

//CORS, peab olema kindlasti enne express.json-i!
app.use(cors());

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());

//SQLite ühendus, taskide andmebaas nimega- todos
const db = new sqlite3.Database('./todos.db', (err) => {
  if (err) {
    console.error('Error opening database:', err);
  } else {
    console.log('Connected to SQLite database');
  }
});

//SQLite tabeli loomine (kui seda veel pole)
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS todos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    task TEXT NOT NULL,
    completed BOOLEAN DEFAULT 0
  )`);
});

//API route-wrapper
const router = express.Router();


//API lõpp-punkt
router.get('/', (req, res) => {
  res.send('To-do App Backend');
});

router.post('/tasks', (req, res) => {
  const { task } = req.body;
  const sql = `INSERT INTO todos (task) VALUES (?)`;
  db.run(sql, [task], function (err) {
    if (err) {
      return res.status(500).send('Error adding task');
    }
    res.status(201).send({ id: this.lastID, task });
  });
 });
// GET: kõik ülesanded
router.get('/tasks', (req, res) => {
  db.all('SELECT * FROM todos', [], (err, rows) => {
    if (err) {
      return res.status(500).send('Error fetching tasks');
    }
    res.json(rows);
  });
});

//PUT: Uuenda ülesande staatust - see funktsionaalsus ei ole hetkel kasutusel
router.put('/tasks/:id', (req, res) => {
  const { id } = req.params;
  const { completed } = req.body;
    
  if (typeof completed !== 'boolean') {
    return res.status(400).send('Invalid value for completed');
  }
    
  const sql = `UPDATE todos SET completed = ? WHERE id = ?`;
  db.run(sql, [completed ? 1 : 0, id], function (err) {
    if (err) {
      return res.status(500).send('Error updating task status');
    }
    res.send({ id, completed });
  });
});

// DELETE: Kustuta ülesanne
router.delete('/tasks/:id', (req, res) => {
  const { id } = req.params;
  const sql = `DELETE FROM todos WHERE id = ?`;
  db.run(sql, [id], function (err) {
    if (err) {
      return res.status(500).send('Error deleting task');
    }
    res.status(204).send();
  });
});

// Kasuta kõiki ülaltoodud route’e /api prefixiga
app.use('/api', router);
  
// Serveri käivitamine
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
  