let jwt = require('jsonwebtoken')
let userController = require('../controllers/users')
module.exports = {
    checkLogin: async function (req, res, next) {
        let token;
        if (req.cookies.token) {
            token = req.cookies.token;
        } else if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            // Bearer <token>
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(403).send("ban chua dang nhap");
        }

        try {
            let result = jwt.verify(token, 'secret');
            if (result && result.exp * 1000 > Date.now()) {
                req.userId = result.id;
                next();
            } else {
                res.status(403).send("ban chua dang nhap")
            }
        } catch (error) {
            return res.status(401).send({ message: "Token khong hop le" });
        }
    },
    checkRole: function (...requiredRole) {
        return async function (req, res, next) {
            let userId = req.userId;
            let user = await userController.FindUserById(userId);
            let currentRole = user.role.name;
            if (requiredRole.includes(currentRole)) {
                next();
            } else {
                res.status(403).send({ message: "ban khong co quyen" });
            }
        }
    }
}