const express = require('express');
const app = express();
const path = require('path');
const gameRoutes = require('./routes/game');

app.use(express.static(
    path.join(__dirname, 'public')
));

app.listen(3000, () => {
    console.log('Server is listening at http://localhost:3000/ Let\'s play a game');
});

gameRoutes(app);