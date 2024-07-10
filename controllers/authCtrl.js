const user = require('../db/models/user');
const bcrypt = require("bcrypt");
const { generateToken } = require("../utils/handlers");

const signup = async (req, res, next) => {
    const body = req.body;

    if(!['1', '2'].includes(body.userType)) {
        return res.status(400).json({ status: 'fail', message: 'Invalid userType' });
    }

    const newUser = await user.create({
        userType: body.userType,
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        password: body.password,
        confirmPassword: body.confirmPassword
    })

    const result = newUser.toJSON();
    delete result.password;
    delete result.deletedAt;

    result.token = generateToken({
        id: result.id
    })

    if(!result) {
        return res.status(400).json({ status: 'fail', message: 'Failed to create user' });
    }

    res.status(201).json({ status:'success', message: 'User created successfully', data: result });
}

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                status: 'fail',
                message: 'Please provide email and password'
            });
        }

        const result = await user.findOne({ where: { email } });
        if (!result) {
            return res.status(404).json({ status: 'fail', message: 'User not found' });
        }

        const passwordMatch = await bcrypt.compare(password, result.password);
        if (!passwordMatch) {
            return res.status(401).json({ status: 'fail', message: 'Invalid credentials' });
        }

        const userObj = result.toJSON();
        delete userObj.password;
        delete userObj.deletedAt;

        userObj.token = generateToken({
            id: userObj.id
        });

        res.status(200).json({ status: 'success', message: 'Logged in successfully', data: userObj });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
};



module.exports = { signup, login }