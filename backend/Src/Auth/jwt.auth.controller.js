const httpStatus = require("http-status");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs"); 
const Users = require("../Model/v1/Users");

dotenv.config();

//* Controlador para validar credenciales
async function login(req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(httpStatus.UNAUTHORIZED).json({
                status: httpStatus.UNAUTHORIZED,
                message: "Correo y contraseña son obligatorios"
            });
        }

    
        const user = await Users.findOne({
            where: { email: email }
        });

        if (!user) {
            return res.status(httpStatus.NOT_FOUND).json({
                message: "Usuario no encontrado"
            });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(httpStatus.UNAUTHORIZED).json({
                message: "Contraseña incorrecta"
            });
        }

        const token = jwt.sign(
            {
                userId: user.Id,
                positionId: user.fkRole
            },
            process.env.JWT_SECRET || "super_secret", 
            {
                expiresIn: "4h"
            }
        );

        return res.status(httpStatus.OK).json({
            token,
            userId: user.Id,
            positionId: user.fkRole
        });

    } catch (error) {
        console.error("Error en login:", error);
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            status: httpStatus.INTERNAL_SERVER_ERROR,
            message: "Error interno del servidor"
        });
    }
}

module.exports = {
    login
};
