const express = require('express');
const router = express.Router();
const db = require('../db');

// Kõigi ülesannete lugemine
router.get('/', (req, res) => {
    db.getAllTodos((err, todos) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.status(200).json(todos);
        }
    });
});

// Ülesande lisamine
router.post('/', (req, res) => {
    const { task } = req.body;
    if (!task) {
        return res.status(400).json({ error: 'Task is required' });
    }
    db.addTodo(task, (err, todo) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.status(201).json(todo);
        }
    });
});

// Ülesande staatuse uuendamine
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { done } = req.body;
    if (done === undefined) {
        return res.status(400).json({ error: 'Done status is required' });
    }
    db.updateTodo(id, done, (err, todo) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.status(200).json(todo);
        }
    });
});

// Ülesande kustutamine
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    db.deleteTodo(id, (err, result) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.status(200).json(result);
        }
    });
});

module.exports = router;
