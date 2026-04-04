let userModel = require('../schemas/users')
let bcrypt = require('bcrypt')

// Function to generate random 16-character password
function generateRandomPassword(length = 16) {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < length; i++) {
        password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return password;
}

module.exports = {
    CreateAnUser: async function (username, password, email, role,
        avatarUrl, fullName, status, loginCount
    ) {
        let newUser = new userModel({
            username: username,
            password: password,
            email: email,
            role: role,
            avatarUrl: avatarUrl,
            fullName: fullName,
            status: status,
            loginCount: loginCount
        })
        await newUser.save();
        return newUser;
    },
    CreateUserWithRandomPassword: async function (username, email, role,
        avatarUrl = "https://i.sstatic.net/l60Hf.png",
        fullName = ""
    ) {
        const randomPassword = generateRandomPassword(16);
        let newUser = new userModel({
            username: username,
            password: randomPassword,
            email: email,
            role: role,
            avatarUrl: avatarUrl,
            fullName: fullName,
            status: false,
            loginCount: 0
        })
        await newUser.save();
        return {
            user: newUser,
            plainPassword: randomPassword
        };
    },
    QueryByUserNameAndPassword: async function (username, password) {
        let getUser = await userModel.findOne({ username: username });
        if (!getUser) {
            return false;
        }
        if (bcrypt.compareSync(password, getUser.password)) {
            return getUser;
        }
        return false;

    },
    FindUserById: async function (id) {
        return await userModel.findOne({
            _id: id,
            isDeleted: false
        }).populate('role')
    }, FindUserById: async function (id) {
        return await userModel.findOne({
            _id: id,
            isDeleted: false
        }).populate('role')
    },
    FindUserByEmail: async function (email) {
        return await userModel.findOne({
            email: email,
            isDeleted: false
        })
    },
    FindUserByToken: async function (token) {
        let user = await userModel.findOne({
            forgotpasswordToken: token,
            isDeleted: false
        })
        if (!user || user.forgotpasswordTokenExp < Date.now()) {
            return false
        }
        return user
    }
}