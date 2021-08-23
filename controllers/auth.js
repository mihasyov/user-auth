const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const keys = require('../config/keys')


module.exports.login = async (req, res) => {
    const {email, password} = req.body;
    const candidate = await User.findOne({email});
    if(candidate) {

        // user exists, compare password
        const passwordResult = bcrypt.compareSync(password, candidate.password);
        if(passwordResult) {
            // generate token
            const token = jwt.sign({
                email: candidate.email,
                name: candidate.name,
                userId: candidate._id
            }, keys.jwt, {expiresIn: '1h'})
            res.status(200).json({success: true, token: `Bearer ${token}`})
        } else {
            res.status(401).json({
                success: false,
                message: 'Invalid password'
            })
        }

    } else {
        res.status(404).json({
            success: false,
            message: 'user not found'
        })
    }
}

module.exports.register = async (req, res) => {
    const {name, email, password} = req.body;
    const candidate = await User.findOne({email});
    if(candidate) {
        // user already exists
        res.status(400).json({
            success: false,
            message: 'User already exists'
        })
    } else {
        // create user
        const salt = bcrypt.genSaltSync(8);
        const user = new User({ name, email, password: bcrypt.hashSync(password, salt) });
        // generate token
        const token = jwt.sign({
            email,
            name,
            userId: user._id
        }, keys.jwt, {expiresIn: '1h'})


        try {
            await user.save();
            res.status(201).json({success: true, token: `Bearer ${token}`});
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message || 'User save failure'
            })
        }
    }

};