import express from 'express'
import 'dotenv/config'
import db from './db/db.js';
const  app  = express();

const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send("Hello world, this is Echo, mini social media platform application")
});

app.listen(port, () => {
    db();
    console.log(`server is running on http://localhost:${port}`)
})