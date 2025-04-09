const express = require('express');
const multer = require('multer');
const cors = require('cors')
const path = require('path')
require('dotenv').config()
const app = express()

const PORT = process.env.PORT || 5000

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Генерируем уникальное имя файла
    },
});

const upload = multer({ storage });

app.use(cors());
app.use('/uploads', express.static('uploads'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/teachers', require('./routes/teacher.routes'));
app.use('/api/students', upload.single('file'), require('./routes/student.routes')); // Добавляем Multer
app.use('/api/groups', require('./routes/group.routes'));
app.use('/api/users', require('./routes/user.routes'));
app.use('/api/courses', require('./routes/course.routes')); // Добавляем маршруты для курсов
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));