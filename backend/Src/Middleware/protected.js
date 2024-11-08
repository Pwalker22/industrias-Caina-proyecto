const jwt = require("jsonwebtoken");
const httpStatus = require("http-status");
const claveSecreta = "super_secret"; 
const sequelize = require("../config/Bd");

const protectedRoute = (options) => {
  return async (req, res, next) => {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(httpStatus.UNAUTHORIZED).json({
        status: httpStatus.UNAUTHORIZED,
        message: "Debes proporcionar un token.",
      });
    }

    try {
      
      const tokenData = jwt.verify(token, claveSecreta);
      const positionId = tokenData.positionId;

     
      req.user = {
        id: tokenData.userId, 
        positionId,
      };

      
      const permissions = await sequelize.query(
        "CALL permissPosition(:idPosition)",
        {
          replacements: { idPosition: positionId },
          type: sequelize.QueryTypes.SELECT,
        }
      );

     

      next();
    } catch (error) {
      console.error("Error en autenticación:", error);
      return res.status(httpStatus.UNAUTHORIZED).json({
        status: httpStatus.UNAUTHORIZED,
        message: "Token inválido o expirado. Acceso no autorizado.",
      });
    }
  };
};

module.exports = protectedRoute;
