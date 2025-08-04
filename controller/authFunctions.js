const { removeListener } = require("../database/member");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require('dotenv').config()
const Member = require("../database/member");

const memberSignup = async (req, role, res) => {

    try {

        let nameNotTaken = await validateMemberName(req.name);
        if (!nameNotTaken) {
            return res.status(400).json({
                message: `${role} is already registered  `
            });
        }
        let emailNotRegistered = await validateEmail(req.email);
        if (!emailNotRegistered) {
            return res.status(400).json({
                message: "Email is already registered"
            });
        }

        const password = await bcrypt.hash(req.password, 12);
        const newMember = new Member({
            ...req,
            password,
            role
        });

        await newMember.save();
        return res.status(201).json({
            message: "You are now successfully registered. Please login",
        });
    } catch (err) {
        return res.status(500).json({
            message: `${err.message}`
        });
    }
};

const validateMemberName = async (name) => {
    let member = await Member.findOne({ name });
    return member ? false : true;
};


const validateEmail = async email => {
    let member = await Member.findOne({ email });
    return member ? false : true;
}

const memberLogin = async (req, role, res) => {
    let { name, password } = req;
    console.log(name, password);
    const member = await Member.findOne({ name });
    if (!member) {
        return res.status(400).json({
            message: `${role} not found`
        });
    }

    if (member.role !== role) {
        return res.status(400).json({
            message: "You are not authorized to login as this role"
        });
    }
    let isMatch = await bcrypt.compare(password, member.password);
    if (isMatch) {
        let token = jwt.sign(
            {
                role: member.role,
                name: member.name,
                email: member.email
            },

            process.env.APP_SECRET,
            { expiresIn: "3 days" }
        );

        let result = {
            name: member.name,
            role: member.role,
            email: member.email,
            token: token,
            expiresIn: 168
        };

        return res.status(200).json({
            ...result,
            message: "You are now logged in"
        });
    } else {
        return res.status(400).json({
            message: "Invalid credentials"
        });
    }
};

const memberAuth = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.status(403).json({
        message: "Missing Token"
    });
    const token = authHeader.split(' ')[1];
    jwt.verify(
        token,
        process.env.APP_SECRET,
        (err, decoded) => {
            if (err) return res.status(403).json({
                message: "Wrong Token"
            });
            console.log(decoded.name);
            req.name = decoded.name;
            next();
        },
    );
}

const checkRole = roles => async (req, res, next) => {
    let { name } = req;
    const member = await Member.findOne({ name });
    !roles.includes(member.role)
        ? res.status(403).json("Sorry you do not have access to this route")
        : next();
}

module.exports = {
    memberSignup,
    memberLogin,
    checkRole,
    memberAuth
}