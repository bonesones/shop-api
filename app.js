const express = require('express');
const app = express();
const jsonfile = require('jsonfile')
const urlencodedParser = require('urlencoded-parser')
const bodyParser = require('body-parser')
const bcrypt = require('bcryptjs');
const { json } = require('body-parser');

const PORT = 3000

const USERS = "./dbs/users.json",
      SHOPPING_CART = "./dbs/shoppingCart.json",
      REVIEWS = "./dbs/reviews.json",
      GOODS = "./dbs/goods.json"

app.listen(PORT, () => console.log('success'))

app.use(bodyParser.urlencoded({ extended: true }));
app.use(urlencodedParser);


const hashPassword = function(password) {
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);
    
    return hashedPassword;
}


// USER ROUTES

app.get('/api/users/:id', (req, res) => {
    const { id: userId } = req.params;

    const idNumber = parseInt(userId);

    jsonfile.readFile(USERS, (err, data) => {
        if(err) throw err;
        const user = data.find(({ id }) => id === idNumber);

        res.status(200).json({
            success: true,
            user
        })
    })
})

app.post('/registration', (req, res) => {
    const { name, surname, role, phone_number, email, password } = req.body;

    const data = jsonfile.readFileSync(USERS);
    data.push({
        id: data.length + 1,
        role,
        full_name: `${name} ${surname}`,
        phone_number,
        email,
        password: hashPassword(password),
        isDelete: false
    })

    jsonfile.writeFile(USERS, data, { spaces: 2 })

    res.status(200).json({
        success: true,
        message: "user added"
    })

})

app.put("/api/users/:id", (req, res) => {

    const { id: userId} = req.params;
    const newData = req.body;

    if(newData.password) {
        newData.password = hashPassword(newData.password)
    }

    const idNumber = parseInt(userId);
    
    const data = jsonfile.readFileSync(USERS);
    let user = data.findIndex(({id}) => id === idNumber);

    if(user === -1) {
        res.status(404).json({
            success: false,
            message: "user not found"
        })
    }

    data[user] = {
        ...data[user],
        ...newData
    }

    jsonfile.writeFileSync(USERS, data, { spaces: 2 });
    
    res.status(200).json({
        success: true,
        message: "user has been edited"
    })
})

app.delete("/api/users/:id", (req, res) => {
    const { id: userId} = req.params;
    const idNumber = parseInt(userId);

    const data = jsonfile.readFileSync(USERS);
    let user = data.findIndex(({id}) => id === idNumber);

    if(user === -1) {
        res.status(404).json({
            success: false,
            message: "user not found"
        })
    }

    data[user] = {
        ...data[user],
        isDelete: true
    }

    jsonfile.writeFileSync(USERS, data, { spaces: 2 });
    
    res.status(200).json({
        success: true,
        message: "user has been deleted"
    })


})

// GOODS ROUTES

app.get('/goods', (req, res) => {
    const goods = jsonfile.readFileSync(GOODS);
    res.status(200).json({
        success: true,
        goods
    })
})

app.get('/api/goods/:id', (req, res) => {
    const { id: userId } = req.params;

    const idNumber = parseInt(userId);

    jsonfile.readFile(GOODS, (err, data) => {
        if(err) throw err;
        const good = data.find(({ id }) => id === idNumber);

        res.status(200).json({
            success: true,
            good
        })
    })
})

app.post('/goods', (req, res) => {
    const { name, image, description, cost } = req.body;
    const receivedData = [name, image, description, cost]

    if(receivedData.some((el) => el === undefined)) {
        res.status(422).json({
            success: 'false',
            message: "incomplete data"
        })
    }

    const data = jsonfile.readFileSync(GOODS);
    data.push({
        id: data.length + 1,
        ...data
    })

    jsonfile.writeFile(GOODS, data, { spaces: 2 })

    res.status(200).json({
        success: true,
        message: "good has been added"
    })
})

app.delete('/good/:id', (req, res) => {
    res.send('delete good')
})

app.put('/good/:id', (req, res) => {
    res.send('edit good')
})

// REVIEWS ROUTES

app.get('/reviews', (req, res) => {
    res.send('get 5 reviews')
})

app.post('/reviews', (req, res) => {
    req.send('post review')
})

app.put('/reviews/:id', (req, res) => {
    res.send('edit review')
})

app.delete('/reviews/:id', (req, res) => {
    res.send('delete review')
})