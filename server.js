const express = require("express");
const bcrypt = require("bcrypt-nodejs");
const cors = require('cors');
const knex = require('knex');
require("dotenv").config();

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

const db = knex ({
    client: 'pg',
    connection: {
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false
        }
    }
});

const app = express();
app.use(express.json());
app.use(cors());

const database = {
    users: [
        {
            id: "123",
            name: "John",
            email: "john@gmail.com",
            password: "cookies",
            entries: 0,
            joined: new Date()
        },
        {
            id: "124",
            name: "Sally",
            email: "sally@gmail.com",
            password: "bananas",
            entries: 0,
            joined: new Date()
        }
    ]
}

app.get("/",(req, res) => {
    res.send('it is working!');
})

app.post("/signin", (res, rep) => { signin.handleSignin(res, rep, db, bcrypt) });
app.post("/register", (res, rep) => { register.handleRegister(res, rep, db, bcrypt) });
app.get("/profile/:id", (res, rep) => { profile.handleProfileGet(res, rep, db) });
app.put("/image", (res, rep) => { image.handleImage(res, rep, db, bcrypt) });
app.post("/imageurl", (res, rep) => { image.handleApiCall(res, rep) });


app.listen(process.env.PORT || 3000, () => {
    console.log(`app is running on ${ process.env.PORT || 3000}`);
})
