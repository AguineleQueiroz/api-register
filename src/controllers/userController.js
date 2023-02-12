const express = require('express');
const User = require('../models/User');
const router = express.Router();

router.get('/list', async (request, response) => {  
    try {
        const users = await User.find();
        users.length !== 0 ? response.status(200).send(users) 
                            : response.status(404).send({ message: 'Empty user list.'});
    } catch (error) {
        response.status(500).send({ error: error })
    }  
})

router.get('/search/:id', async (request, response) => {
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

router.patch('/update/:id', async (request, response) => {
    const userID = request.params.id;
    const { name, email, password } = request.body;

    const userUpdated = {
        name,
        email,
        password
    };
   
    try { 
        const isInvalidData = Object.values(userUpdated).some(value => value === '');
        const existUser = await User.findOne({_id:userID})
        if(isInvalidData && existUser) {
            response.status(400).send({message: 'Invalid data received!'});
            return;
        }else if(!isInvalidData && existUser) {
            await User.findByIdAndUpdate(userID, userUpdated);            
            response.status(200).send({message: 'resource updated successfully!'});
            return;
        } else {
            response.status(404).send({ message: 'User not found!'});   
            return;
        }
    } catch (error) {
        response.status(500).send({ error: error })
    }
})

router.delete('/delete/:id', async (request, response) => {
    const userID = request.params.id;
    const user = User.deleteOne({ _id: userID}, err => {
        err ? response.status(400).send({ error: 'The user cannot be deleted.'}) 
            : response.status(200).send({ message: 'Successfully deleted user.' });
    });
})

module.exports = (app) => app.use('/users', router);