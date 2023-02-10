const express = require('express');
const User = require('../models/User');
const router = express.Router();
const { validityIdMongoDbFormat } = require('../utils/utilities')

router.get('/', async (request, response) => {  
    try {
        const users = await User.find();
        response.status(200).send(users);
    } catch (error) {
        response.status(500).send({ error: error })
    }  
})

router.get('/:id', async (request, response) => {
    const id = request.params.id;
    try {
        const searchUser = await User.findById(id);
        !searchUser ? response.status(404).send({ message: 'User not found!'}) 
        : response.status(200).send(searchUser);
    } catch (error) {
        response.status(500).send({ error: error })
    }
})

router.post('/register', async (request, response) => {
    const { name, email, password} = request.body;
    
    const user = { 
        name, 
        email, 
        password
    };

    try {
        
        if (!name || !email || !password) {
            return response.status(422).send({ alert: 'Fill in the fields correctly.'})
        }                
        
        if (await User.findOne({ email })) {
            return response.status(400).send({ error: 'User already exists.' })
        }

        await User.create(user);
        user.password = undefined;
        return response.status(201).send({ message: 'User created with success!' });
    
    } catch (error) {
        return response.status(400).send({ error: 'Registration failed!' });
    }
})


module.exports = (app) => app.use('/users', router);