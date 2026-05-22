require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('node:path');

const app = express();
app.disable('x-powered-by');

// middleware
const FRONTEND_URL = process.env.FRONTEND_URL;
if (FRONTEND_URL) {
    app.use(cors({ origin: FRONTEND_URL, credentials: true }));
}
const cookieParser = require('cookie-parser');
app.use(express.json());
app.use(cookieParser());

// serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// routes
const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes');
const userRoutes = require('./routes/userRoutes');
const uploadRoutes = require('./routes/uploadRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/users', userRoutes);
app.use('/api/uploads', uploadRoutes);

// serve frontend static files (optional integration)
const frontendPath = path.join(__dirname, '..', 'frontend');
app.use(express.static(frontendPath));
app.use((req, res, next) => {
    if (req.path.startsWith('/api/')) {
        return next();
    }
    return res.sendFile(path.join(frontendPath, 'index.html'));
});

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ MongoDB Database Connected Successfully'))
    .catch((err) => console.log('❌ Database Connection Error: ', err));

app.get('/', (req, res) => {
    res.send('Social Media API is running...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});

