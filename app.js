var express = require('express');
const { Pool } = require('pg');
const bodyParser = require('body-parser');
// const methodOverride = require('method-override');


var app = express();


app.set('view engine','ejs');
app.set('views','./views');
// app.use(express.urlencoded({ extended: false }));
// app.use(express.json());
// app.use(methodOverride('_method'));

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'deloittedb',
    password: 'root',
    port: 5432, // Default PostgreSQL port
});

const insertEmployee = async (employeeData) => {
    const {name, email, dept} = employeeData;
    try {
        const query = 'INSERT INTO users (name, email, DEPARTMENT) VALUES ($1, $2, $3) RETURNING *';
        const values = [name, email, dept];
        const result = await pool.query(query, values);
        return result.rows[0];
    } catch (error) {
        console.error('Error inserting employee', error);
        throw error;
    }
};

app.get('/register',async(req,res) => {
    res.render('register');
});

app.post('/register', async (req, res) => {
    try {
        const {name,email,dept} = req.body;
        console.log({name,email,dept});
        const newEmployee = await insertEmployee({name,email,dept});
        console.log(newEmployee);
        res.redirect('/employees');
    } catch (error) {
        res.status(500).send('Error adding employee');
    }
});

app.listen(3000);
