const sequelize = require("../../config/Bd");
const Users = require("../../Model/v1/Users");
const httpStatus = require('http-status');
const bcrypt = require('bcrypt');

//*controllador para crear un usuario
async function saveUser(req, res) {
  try {
    const { userName, email, password } = req.body;


    if (!userName || !email || !password) {
      return res.status(httpStatus.BAD_REQUEST).json({
        status: httpStatus.BAD_REQUEST,
        message: "Campos requeridos: userName, email, password",
        module: "users",
      });
    }


    const newUser = await Users.create({
      userName,
      email,
      password
      
    });

    if (newUser) {
      res.status(httpStatus.CREATED).json({
        status: httpStatus.CREATED,
        message: "Usuario registrado exitosamente",
        module: "users",
        id: newUser.Id,
      });
    } else {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        status: httpStatus.INTERNAL_SERVER_ERROR,
        message: "No se pudo guardar el registro",
        module: "users",
      });
    }
  } catch (error) {
    console.error("Error en saveUser:", error);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: httpStatus.INTERNAL_SERVER_ERROR,
      message: "Error interno en el servidor",
      module: "users",
    });
  }
}

//*controllador para traer usuarios
async function getUsers(req, res) {
  try {
      // Obtener los usuarios, excluyendo ciertos atributos
      const users = await Users.findAll({
          attributes: { exclude: ["id", "createdAt", "updatedAt", "password"] },
      });

      // Convertir cada usuario en un objeto JSON plano para evitar referencias circulares
      const usersPlain = users.map(user => user.toJSON());

      // Enviar la respuesta con los datos de los usuarios
      res.status(httpStatus.OK).json({
          status: httpStatus.OK,
          message: "Usuarios obtenidos exitosamente",
          data: usersPlain, // Usar la versión plana de los usuarios
      });
  } catch (error) {
      console.error(error);
      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
          status: httpStatus.INTERNAL_SERVER_ERROR,
          message: "Error al obtener los usuarios",
      });
  }
}
//*Controlador para actualizar un usuario
async function updateUser(req, res) {
  try {
    const userId = req.params.id;
    const userData = req.body;

    console.log("Datos recibidos para actualización:", userData); // Para revisar lo que se recibe

    const updatedFields = { ...userData };

    if (updatedFields.password) {
      updatedFields.password = await bcrypt.hash(updatedFields.password, 8);
    } else {
      delete updatedFields.password;
    }

    console.log("Campos a actualizar:", updatedFields); // Para verificar los campos antes de la actualización

    const [affectedRows] = await Users.update(updatedFields, {
      where: { Id: userId },
    });

    if (affectedRows === 0) {
      return res.status(httpStatus.NOT_FOUND).json({
        status: httpStatus.NOT_FOUND,
        message: "Usuario no encontrado",
        module: "users",
      });
    }

    res.status(httpStatus.OK).json({
      status: httpStatus.OK,
      message: "Registro actualizado",
      module: "users",
    });
  } catch (error) {
    console.error("Error en updateUser:", error);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: httpStatus.INTERNAL_SERVER_ERROR,
      message: "Error interno en el servidor",
      module: "users",
    });
  }
}

//!Controlador para eliminar un usuario

async function deleteUsers(req, res) {
  try {
    const { id } = req.params;

    const user = await Users.findByPk(id);

    if (!user) {
      return res.status(httpStatus.NOT_FOUND).json({
        status: httpStatus.NOT_FOUND,
        message: "Usuario no encontrado",
        module: "users",
      });
    }

    await user.destroy();

    res.status(httpStatus.OK).json({
      status: httpStatus.OK,
      message: "Usuario eliminado exitosamente",
      module: "users",
    });
  } catch (error) {
    console.error("Error en deleteUsers:", error);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: httpStatus.INTERNAL_SERVER_ERROR,
      message: "Error al eliminar el usuario",
      module: "users",
    });
  }
}
//? Controlador para actualizar  la contraseña/
async function changePassword(req, res) {
  const userId = req.params.id; 
  const { currentPassword, newPassword, confirmPassword } = req.body;

  
  if (!currentPassword || !newPassword || !confirmPassword) {
    return res.status(httpStatus.BAD_REQUEST).json({
      status: httpStatus.BAD_REQUEST,
      message: "Todos los campos son obligatorios",
      module: "users",
    });
  }

  
  if (newPassword !== confirmPassword) {
    return res.status(httpStatus.BAD_REQUEST).json({
      status: httpStatus.BAD_REQUEST,
      message: "Las contraseñas no coinciden",
      module: "users",
    });
  }

  try {
    
    const user = await Users.findByPk(userId);
    
    if (!user) {
      return res.status(httpStatus.NOT_FOUND).json({
        status: httpStatus.NOT_FOUND,
        message: "Usuario no encontrado",
        module: "users",
      });
    }

    
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(httpStatus.BAD_REQUEST).json({
        status: httpStatus.BAD_REQUEST,
        message: "La contraseña actual es incorrecta",
        module: "users",
      });
    }

    
    const hashedPassword = await bcrypt.hash(newPassword, 8);
    user.password = hashedPassword;
    await user.save();

    return res.status(httpStatus.OK).json({
      status: httpStatus.OK,
      message: "Contraseña actualizada exitosamente",
      module: "users",
    });
  } catch (error) {
    console.error("Error en changePassword:", error);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: httpStatus.INTERNAL_SERVER_ERROR,
      message: "Error interno en el servidor",
      module: "users",
    });
  }
}

module.exports = {
    getUsers,
    saveUser,
    updateUser,
    deleteUsers,
    changePassword,
 };