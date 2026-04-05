let jwt = require("jsonwebtoken");
let userController = require("../controllers/users");
let roleModel = require("../schemas/roles");

module.exports = {
  checkLogin: async function (req, res, next) {
    let token;
    if (req.cookies.token) {
      token = req.cookies.token;
    } else if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) return res.status(403).send("ban chua dang nhap");

    try {
      const result = jwt.verify(token, "secret");
      if (result && result.exp * 1000 > Date.now()) {
        req.userId = result.id;
        return next();
      }
      return res.status(403).send("ban chua dang nhap");
    } catch (error) {
      return res.status(401).send({ message: "Token khong hop le" });
    }
  },

  checkRole: function (...requiredRole) {
    return async function (req, res, next) {
      try {
        if (!req.userId) {
          return res.status(403).send({ message: "ban chua dang nhap" });
        }

        const user = await userController.FindUserById(req.userId);
        if (!user) {
          return res.status(403).send({ message: "khong tim thay user" });
        }

        let currentRole = null;

        if (user.role && typeof user.role === "object" && user.role.name) {
          currentRole = user.role.name;
        } else if (user.role) {
          const roleDoc = await roleModel.findById(user.role);
          currentRole = roleDoc ? roleDoc.name : null;
        }

        if (!currentRole) {
          return res
            .status(403)
            .send({ message: "user chua duoc gan role hop le" });
        }

        if (requiredRole.includes(currentRole)) return next();
        return res.status(403).send({ message: "ban khong co quyen" });
      } catch (error) {
        return res.status(500).send({ message: "Loi phan quyen", error: error.message });
      }
    };
  },
};