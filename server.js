// Підключаємо змінні середовища
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const app = express();
const PORT = 3000;

// Middleware для парсингу JSON
app.use(express.json());

// Підключення до MongoDB Atlas
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB Atlas'))
    .catch(err => console.error('Error connecting to MongoDB Atlas:', err));

// Створення схеми для користувачів
const userSchema = new mongoose.Schema({
    name: String,
    email: String
});

// Створення моделі для користувачів
const User = mongoose.model('User', userSchema);

// Маршрут для отримання даних з будь-якого документа з БД
app.get('/', async (req, res) => {
    try {
        const document = await User.findOne(); // Отримуємо перший документ з колекції
        res.json(document || { message: 'No data found' });
    } catch (err) {
        res.status(500).json({ message: 'Error fetching data', error: err });
    }
});

// Маршрут для отримання всіх користувачів
app.get('/users', async (req, res) => {
    try {
        const users = await User.find(); // Отримуємо всіх користувачів з БД
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching users', error: err });
    }
});

// Маршрут для отримання користувача за id
app.get('/users/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id); // Пошук користувача за id
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Error fetching user', error: err });
    }
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
