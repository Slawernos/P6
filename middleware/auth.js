const jwt = require('jsonwebtoken')
const express = require('express')


module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        jwt.verify(token, process.env.SUPERSECRET, (err, decoded) => {
            const userId = decoded.user;
            if (err) {
                throw 'invalid user ID';
            } else {
                next();
            }
        })
    }
    catch (err) {
        res.status(401).json({ message: err.message  });
    }

}

