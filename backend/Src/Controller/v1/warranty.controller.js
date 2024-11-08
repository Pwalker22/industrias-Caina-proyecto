const sequelize = require("../../config/Bd");
const Warranty = require("../../Model/v1/Warranty");
const httpStatus = require("http-status");
const Module = "Warranty";

//? Controlador para traer todas las garantías
async function getWarranties(req, res) {
    try {
        const warranties = await Warranty.findAll({
            attributes: { exclude: ["Id"] },
        });

        res.status(httpStatus.OK).json({
            status: httpStatus.OK,
            message: "Garantías obtenidas correctamente",
            data: warranties,
            Module: Module,
        });
    } catch (error) {
        console.error(error);
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            status: httpStatus.INTERNAL_SERVER_ERROR,
            message: "Error al obtener las garantías",
            Module: Module,
        });
    }
};

//? Controlador para crear una garantía
const createWarranty = async (req, res) => {
    console.log(req.body); // Ver los datos que recibes
    try {
        const { description, clientNumber, brand, fkuser, place } = req.body;

        // Validaciones
        if (!description || !clientNumber || !brand || !fkuser || !place) {
            return res.status(httpStatus.BAD_REQUEST).json({
                status: httpStatus.BAD_REQUEST,
                message: 'Todos los campos son obligatorios.',
                Module: Module,
            });
        }

        const newWarranty = await Warranty.create({
            description,
            clientNumber,
            brand,
            fkuser,
            place 
        });

        res.status(httpStatus.CREATED).json({
            status: httpStatus.CREATED,
            message: 'Garantía creada exitosamente',
            data: newWarranty,
            Module: Module,
        });
    } catch (error) {
        console.error("Error al intentar guardar:", error); 
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            status: httpStatus.INTERNAL_SERVER_ERROR,
            message: 'Error al crear la garantía',
            error: error.message,
            Module: Module,
        });
    }
};

//? Controlador para actualizar una garantía
const updateWarranty = async (req, res) => {
    try {
        const warrantyId = req.params.id;
        const { description, clientNumber, brand, fkuser, place } = req.body;

        
        const warranty = await Warranty.findOne({
            where: { Id: warrantyId }
        });

        if (!warranty) {
            return res.status(httpStatus.NOT_FOUND).json({
                status: httpStatus.NOT_FOUND,
                message: 'Garantía no encontrada',
                Module: Module,
            });
        }

        
        warranty.description = description || warranty.description;
        warranty.clientNumber = clientNumber || warranty.clientNumber;
        warranty.brand = brand || warranty.brand;
        warranty.fkuser = fkuser || warranty.fkuser;
        warranty.place = place || warranty.place; 

        await warranty.save();

        res.status(httpStatus.OK).json({
            status: httpStatus.OK,
            message: 'Garantía actualizada exitosamente',
            data: warranty,
            Module: Module,
        });
    } catch (error) {
        console.error(error);
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            status: httpStatus.INTERNAL_SERVER_ERROR,
            message: 'Error al actualizar la garantía',
            error: error.message,
            Module: Module,
        });
    }
};

//? Controlador para eliminar una garantía
const deleteWarranty = async (req, res) => {
    try {
        const warrantyId = req.params.id;
        const warranty = await Warranty.findOne({
            where: { Id: warrantyId },
        });

        if (!warranty) {
            return res.status(httpStatus.NOT_FOUND).json({
                status: httpStatus.NOT_FOUND,
                message: "Garantía no encontrada",
                Module: Module,
            });
        } else {
            await warranty.destroy();
            res.status(httpStatus.OK).json({
                status: httpStatus.OK,
                message: "Garantía eliminada exitosamente",
                Module: Module,
            });
        }
    } catch (error) {
        console.error(error);
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            status: httpStatus.INTERNAL_SERVER_ERROR,
            message: "Error al eliminar la garantía",
            error: error.message,
            Module: Module,
        });
    }
};

module.exports = {
    getWarranties,
    createWarranty,
    updateWarranty,
    deleteWarranty,
};
