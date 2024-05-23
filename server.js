const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { createServer } = require('http');
const { Server } = require('socket.io');
const User = require('./models/User');

const app = express();
const PORT = 5500;
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/colaUsuarios', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Conectado a MongoDB'))
    .catch(err => console.error('Error al conectar a MongoDB:', err));

io.on('connection', (socket) => {
    console.log('Un usuario se ha conectado:', socket.id);

    socket.on('addUser', async (userId) => {
        const newUser = new User({ id: userId });
        await newUser.save();
        io.emit('queueUpdated');
    });

    socket.on('serveUser', async () => {
        const user = await User.findOne().sort({ _id: 1 });
        if (user) {
            await User.findByIdAndDelete(user._id);
            io.emit('queueUpdated');
        }
    });

    socket.on('disconnect', () => {
        console.log('Un usuario se ha desconectado:', socket.id);
    });
});

app.get('/users', async (req, res) => {
    const users = await User.find().sort({ _id: 1 });
    res.send(users);
});

httpServer.listen(PORT, () => {
    console.log(`Server is Started at port: ${PORT}`);
});
