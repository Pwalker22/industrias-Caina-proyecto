const sequelize = require("../../config/Bd");
const Complaints = require("../../Model/v1/Complaints");
const httpStatus = require("http-status");
const Module = "Complaints";

//? Controlador para traer todas las quejas
async function getComplaints(req, res) {
    try {
        const complaints = await Complaints.findAll({
            attributes: { exclude: ["Id"] }, 
        });

        res.status(httpStatus.OK).json({
            status: httpStatus.OK,
            message: "Quejas obtenidas correctamente",
            data: complaints,
            Module: Module,
        });
    } catch (error) {
        console.error(error);
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            status: httpStatus.INTERNAL_SERVER_ERROR,
            message: "Error al obtener las quejas",
            Module: Module,
        });
    }
};

//? Controlador para crear una queja
const createComplaint = async (req, res) => {
    console.log(req.body); 
    try {
        const { description, client, phoneNumber, ComplaintType, fkUser } = req.body;

        // Validaciones
        if (!description || !client || !phoneNumber || !ComplaintType || !fkUser) {
            return res.status(httpStatus.BAD_REQUEST).json({
                status: httpStatus.BAD_REQUEST,
                message: 'Todos los campos son obligatorios.',
                Module: Module,
            });
        }

        const newComplaint = await Complaints.create({
            description,
            client,
            phoneNumber,
            ComplaintType,
            fkUser
        });

        res.status(httpStatus.CREATED).json({
            status: httpStatus.CREATED,
            message: 'Queja creada exitosamente',
            data: newComplaint,
            Module: Module,
        });
    } catch (error) {
        console.error("Error al intentar guardar:", error); 
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            status: httpStatus.INTERNAL_SERVER_ERROR,
            message: 'Error al crear la queja',
            error: error.message,
            Module: Module,
        });
    }
};

//? Controlador para actualizar una queja
const updateComplaint = async (req, res) => {
    try {
        const complaintId = req.params.id;
        const { description, client, phoneNumber, ComplaintType, fkUser } = req.body;

        
        const complaint = await Complaints.findOne({
            where: { Id: complaintId }
        });

        if (!complaint) {
            return res.status(httpStatus.NOT_FOUND).json({
                status: httpStatus.NOT_FOUND,
                message: 'Queja no encontrada',
                Module: Module,
            });
        }

       
        complaint.description = description || complaint.description;
        complaint.client = client || complaint.client;
        complaint.phoneNumber = phoneNumber || complaint.phoneNumber;
        complaint.ComplaintType = ComplaintType || complaint.ComplaintType;
        complaint.fkUser = fkUser || complaint.fkUser;

        await complaint.save();

        res.status(httpStatus.OK).json({
            status: httpStatus.OK,
            message: 'Queja actualizada exitosamente',
            data: complaint,
            Module: Module,
        });
    } catch (error) {
        console.error(error);
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            status: httpStatus.INTERNAL_SERVER_ERROR,
            message: 'Error al actualizar la queja',
            error: error.message,
            Module: Module,
        });
    }
};

//? Controlador para eliminar una queja
const deleteComplaint = async (req, res) => {
    try {
        const complaintId = req.params.id;
        const complaint = await Complaints.findOne({
            where: { Id: complaintId },
        });

        if (!complaint) {
            return res.status(httpStatus.NOT_FOUND).json({
                status: httpStatus.NOT_FOUND,
                message: "Queja no encontrada",
                Module: Module,
            });
        } else {
            await complaint.destroy();
            res.status(httpStatus.OK).json({
                status: httpStatus.OK,
                message: "Queja eliminada exitosamente",
                Module: Module,
            });
        }
    } catch (error) {
        console.error(error);
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            status: httpStatus.INTERNAL_SERVER_ERROR,
            message: "Error al eliminar la queja",
            error: error.message,
            Module: Module,
        });
    }
};

module.exports = {
    getComplaints,
    createComplaint,
    updateComplaint,
    deleteComplaint,
};
