var express = require('express');
const { Pool } = require('pg');
const bodyParser = require('body-parser');
// const methodOverride = require('method-override');


var app = express();


app.set('view engine','ejs');
app.set('views','./views');
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
// app.use(methodOverride('_method'));

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'deloittedb',
    password: 'root',
    port: 5432, // Default PostgreSQL port
});

const insertEmployee = async (employeeData) => {
    const {name, email, dept, password} = employeeData;
    try {
        const query = 'INSERT INTO users (name, email, "DEPARTMENT") VALUES ($1, $2, $3) RETURNING *';
        const values = [name, email, dept];
        const values1 = [name, password];
        const query1 = 'INSERT INTO password (username,password) VALUES ($1 , $2) RETURNING *';
        const result = await pool.query(query, values);
        const result2 = await pool.query(query1,values1);
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
        // const name = req.body['name'];
        // const email = req.body['email'];
        // const dept = req.body['dept'];
        // const {name,email,dept} = req.body;
        // console.log(name,email,dept);
        const newEmployee = await insertEmployee(req.body);
        console.log(newEmployee);
        // res.redirect('/employees');
    } catch (error) {
        res.status(500).send('Error adding employee');
    }
});

app.get('/' , (req,res)=> {
    res.render('login');
})

app.post('/home' , async(req,res) => {
    try{
        const usename = req.body['user-name'];
        const epassword = req.body['password'];
        const query = 'SELECT * FROM password WHERE username=$1';
        const values = [usename];
        const result = await pool.query(query, values);
        if (result.rows.length === 0) {
            return res.status(404).send('User not found');
        }
        const user = result.rows[0];
        if(epassword===user.password){
            const queryi = 'SELECT * FROM users WHERE name=$1';
            const values1 = [usename];
            const emplog = await pool.query(queryi,values1);
            var data = emplog.rows[0];
            res.render('home', {data, emps: null, byname: null});
        }
        else{
            return res.status(401).send('Authentication Failed');
        }
    }
    catch{
        console.error("You are wrong find out what happened!");
    }
});



app.listen(3000);