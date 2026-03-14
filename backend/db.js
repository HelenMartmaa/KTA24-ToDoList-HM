const sqlite3 = require('sqlite3').verbose();  // Importige sqlite3 moodul

// Loome ühenduse andmebaasiga
const db = new sqlite3.Database('./todo.db', (err) => {
    if (err) {
        console.error('Error opening database', err.message);
    } else {
        console.log('Connected to the SQLite database.');
    }
});

// Ekspordime ühenduse, et seda saaksime kasutada teistes failides
module.exports = db;

// Create (Lisa uus ülesanne)
const addTodo = (task, callback) => {
    const sql = 'INSERT INTO todos (task, done) VALUES (?, ?)';
    db.run(sql, [task, false], function(err) {
        if (err) {
            console.error(err.message);
            callback(err, null);
        } else {
            callback(null, { id: this.lastID, task: task, done: false });
        }
    });
};

// Read (Loe kõik ülesanded)
const getAllTodos = (callback) => {
    const sql = 'SELECT * FROM todos';
    db.all(sql, [], (err, rows) => {
        if (err) {
            console.error(err.message);
            callback(err, null);
        } else {
            callback(null, rows);
        }
    });
};

// Update (Uuenda ülesande staatust)
const updateTodo = (id, done, callback) => {
    const sql = 'UPDATE todos SET done = ? WHERE id = ?';
    db.run(sql, [done, id], function(err) {
        if (err) {
            console.error(err.message);
            callback(err, null);
        } else {
            callback(null, { id: id, done: done });
        }
    });
};

// Delete (Kustuta ülesanne)
const deleteTodo = (id, callback) => {
    const sql = 'DELETE FROM todos WHERE id = ?';
    db.run(sql, [id], function(err) {
        if (err) {
            console.error(err.message);
            callback(err, null);
        } else {
            callback(null, { id: id });
        }
    });
};

// Ekspordime need funktsioonid, et neid saaks kasutada mujal
module.exports = {
    addTodo,
    getAllTodos,
    updateTodo,
    deleteTodo
};
