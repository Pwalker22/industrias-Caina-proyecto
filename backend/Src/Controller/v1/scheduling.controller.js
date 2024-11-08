const  sequelize = require("../../config/Bd");
const Scheduling = require("../../Model/v1/scheduling");
const httpStatus = require("http-status");
const moment = require('moment');
const Module = "Scheduling"

//?Controlador para traer todos los agendamientos

async function getScheduling(req, res) {
    try {
        const scheduling = await Scheduling.findAll({
            attributes: { exclude: ["id", "createdAt", "updatedAt"] },
        });

        res.status(httpStatus.OK).json({
            status: httpStatus.OK,
            message: "Agendamientos obtenidos correctamente",
            data: scheduling,
            Module: Module,
        });
    } catch (error) {
        console.error(error);
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            status: httpStatus.INTERNAL_SERVER_ERROR,
            message: "Error al obtener los agendamientos",
            Module: Module,
        });
    }
};

//? controllador para guardar un agendamiento 
const scheduleMaintenance = async (req, res) => {
    console.log(req.body); 
    try {
        const { numberPhone, direction, city, typeService, ScheduledDate, document, fkUser, fullName } = req.body;

        
        if (!typeService) {
            return res.status(400).json({
                message: 'El campo typeService es obligatorio.'
            });
        }

       
        const formattedDate = moment(ScheduledDate).format('YYYY-MM-DD');

        const newScheduling = await Scheduling.create({
            fkUser,
            numberPhone,
            direction,
            ScheduledDate: formattedDate,
            city,
            typeService,
            document,
            fullName
        });

        res.status(201).json({
            message: 'Mantenimiento agendado exitosamente',
            data: newScheduling
        });
    } catch (error) {
        console.error("Error al intentar guardar:", error); // Muestra el error completo
        res.status(500).json({
            message: 'Error al agendar mantenimiento',
            error: error.message
        });
    }
};

//? Controlador para actualizar un agendamiento
const updateScheduling = async (req, res) => {
    try {
        const schedulingId = req.params.id; 
        const { numberPhone, direction, city, typeService, ScheduledDate } = req.body;

        // Validación básica
        if (!numberPhone || !direction || !city || !typeService || !ScheduledDate) {
            return res.status(400).json({
                status: 400,
                message: 'Todos los campos son obligatorios.',
                Module: 'Scheduling'
            });
        }

        const scheduling = await Scheduling.findOne({ where: { Id: schedulingId } });

        if (!scheduling) {
            return res.status(404).json({
                status: 404,
                message: 'Agendamiento no encontrado',
                Module: 'Scheduling' 
            });
        }

        scheduling.numberPhone = numberPhone;
        scheduling.direction = direction;
        scheduling.city = city;
        scheduling.typeService = typeService;
        scheduling.ScheduledDate = moment(ScheduledDate).format('YYYY-MM-DD'); // Asegúrate de que la fecha esté en el formato correcto

        await scheduling.save(); 

        res.status(200).json({
            status: 200,
            message: 'Agendamiento actualizado exitosamente',
            data: scheduling,
            Module: 'Scheduling' 
        });
    } catch (error) {
        console.error('Error en la actualización:', error);
        res.status(500).json({
            status: 500,
            message: 'Error al actualizar el agendamiento',
            error: error.message,
            Module: 'Scheduling'
        });
    }
};

//! controllador para eliminar un agendamiento
const deleteScheduling = async (req, res) => {
    try {
        const schedulingId = req.params.id; 
        const scheduling = await Scheduling.findOne({
            where: { Id: schedulingId }, 
        });

        if (!scheduling) {
            return res.status(httpStatus.NOT_FOUND).json({
                status: httpStatus.NOT_FOUND,
                message: "Agendamiento no encontrado",
                Module: 'Scheduling', 
            });
        } else {
            await scheduling.destroy();
            res.status(httpStatus.OK).json({
                status: httpStatus.OK,
                message: "Agendamiento eliminado exitosamente",
                Module: 'Scheduling', 
            });
        }
    } catch (error) {
        console.error(error);
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            status: httpStatus.INTERNAL_SERVER_ERROR,
            message: "Error al eliminar el agendamiento",
            Module: 'Scheduling',
        });
    }
};
//? controllador para trae las  resevas por el Id 
async function getReservationsByUserId(req, res) {
    const userId = req.params.id; 
    
    if (!userId) {
        return res.status(httpStatus.BAD_REQUEST).json({
            status: httpStatus.BAD_REQUEST,
            message: "El ID de usuario es obligatorio",
            Module: "Scheduling",
        });
    }

    try {
        const reservations = await sequelize.query('CALL GetReservationsByUserId(:userId)', {
            replacements: { userId },
            type: sequelize.QueryTypes.RAW,
        });
        
        if (reservations.length === 0) {
            return res.status(httpStatus.NOT_FOUND).json({
                status: httpStatus.NOT_FOUND,
                message: "No se encontraron reservas para este usuario",
                Module: "Scheduling",
            });
        }

        res.status(httpStatus.OK).json({
            status: httpStatus.OK,
            message: "Reservas obtenidas correctamente",
            data: reservations,
            Module: "Scheduling",
        });
    } catch (error) {
        console.error('Error al obtener reservas:', error);
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            status: httpStatus.INTERNAL_SERVER_ERROR,
            message: "Error al obtener reservas",
            Module: "Scheduling",
        });
    }
}

module.exports = {
    getScheduling,
    scheduleMaintenance,
    updateScheduling,
    deleteScheduling,
    getReservationsByUserId,
 };

