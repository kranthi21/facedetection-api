const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const app = express();
const knex = require('knex');
const register = require('./controllers/register');
const image = require('./controllers/image');

const db = knex({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      port : '5432', //5050 
      user : 'postgres',
      password : 'test',
      database : 'face-detection'
    }
});


// db.select()
//   .from('users')
//   .then(console.log)

app.use(express.json());
app.use(cors());

app.get('/',(req, res) => {
    res.json("app onboard")
})

app.post('/',(req, res) => {
    res.send("this is working");
})


app.post('/signin', (req, res) => {
    const {email, password} = req.body;
    if(!email || !password){
        return res.status(400).json('input field are empty');
    }
    db.select('email','hash').from('login')
    .where('email','=',email)
    .then(data => {
        const isValid = bcrypt.compareSync(password, data[0].hash)
        if(isValid){
            db.select('*')
            .from('users')
            .where('email', '=', email)
            .then(user => {
                res.json(user[0])
            })
            .catch(err => res.status(400).json("error getting user"))
        }
        else{
            res.status(400).json("wrong password")
        }
    })
    .catch(err => res.status(400).json("No Such User found Try with other email "))
})

app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt)}) // includeing db, bcrypt is dependency injecting  

app.get('/profile/:id', (req, res) => {
    const {id} = req.params;
    db.select('*')
    .from('users')
    .where({id}) // same as {id: id} feature of ES6
    .then(user => {
        user.length > 0 ? res.json(user[0]) : res.status(400).json("No User Found");
    })
    .catch(err => res.status(400).json("Error Getting user"));
})

app.put('/image', (req, res) => {image.handleImage(req, res, db)} );
app.post('/imageUrl', (req, res) => {image.handleAPI1(req, res)});

app.listen(3000, ()=>{
    console.log ('app is onboard');
})



/*
/ --> this is working
/sigin --> POST = success/fail
/register --> POST = user
/profile/:userId --> GET = user
/image --> PUT --> user
*/ 