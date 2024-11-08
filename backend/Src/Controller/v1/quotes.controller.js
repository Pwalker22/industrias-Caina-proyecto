const sequelize = require("../../config/Bd");
const Quotes = require("../../Model/v1/Quotes");
const httpStatus = require("http-status");
const Module = "Quotes";

//*Controlador para traer todas las cotizaciones

async function getQuotes(req, res) {
    try {
        
        const quotes = await Quotes.findAll({
            attributes: { exclude: ["id", "createdAt", "updatedAt"] },
        });

        
        res.status(httpStatus.OK).json({
            status: httpStatus.OK,
            data: quotes,
            Module: Module, 
        });

    } catch (error) {
        console.error(error);
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            status: httpStatus.INTERNAL_SERVER_ERROR,
            message: "Error al obtener las cotizaciones",
            Module: Module, 
        });
    }
}

//*Controlador para traer una cotización por ID

async function saveQuotes(req, res) {
    try {
        const quotesData = req.body;
        const quotes = await Quotes.create(quotesData, {
            attributes: { exclude: ["id", "createdAt", "updatedAt"] }, 
        });

    console.log(quotes.dataValues.Id);
    if(quotes){
        res.status(httpStatus.CREATED).json({
            status: httpStatus.CREATED,
            message: "Cotización guardada exitosamente",
            Module: Module,
            id: quotes.dataValues.Id
        });
    }
} catch(error){
    console.error(error);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        status: httpStatus.INTERNAL_SERVER_ERROR,
        message: "Error al guardar la cotización",
        Module: Module
    });
  }
}

//*Controlador para actualizar una cotización

async function updateQuotes(req, res) {
    try {
        const quotesId = req.params.id;
        const quotesData = req.body;

        console.log('ID de cotización:', quotesId);
        console.log('Datos de la cotización recibidos:', quotesData);

        const quotes = await Quotes.findByPk(quotesId);

        if (!quotes) {
            return res.status(httpStatus.NOT_FOUND).json({
                status: httpStatus.NOT_FOUND,
                message: "Cotización no encontrada",
                Module: Module,
            });
        }

        // Mapear los campos recibidos desde el frontend a los nombres que espera la base de datos
        const updatedData = {
            nameNewUser: quotesData.name,
            emailNewUser: quotesData.email,
            numberPhone: quotesData.phone,
            information: quotesData.information,
        };

        // Actualizar los datos en la base de datos
        await quotes.set(updatedData);
        const result = await quotes.save();

        console.log('Resultado de la actualización:', result); // Registrar el resultado

        res.status(httpStatus.OK).json({
            status: httpStatus.OK,
            message: "Cotización actualizada exitosamente",
            Module: Module,
        });

    } catch (error) {
        console.error(error);
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            status: httpStatus.INTERNAL_SERVER_ERROR,
            message: "Error al actualizar la cotización",
            Module: Module,
        });
    }
}

//!Controlador para eliminar una cotización

async function deleteQuotes(req, res) {
    try {
        const quotesId = req.params.id;
        const quotes = await Quotes.findOne({
            where: { Id: quotesId },
        });
        if (!quotes) {
            return res.status(httpStatus.NOT_FOUND).json({
                status: httpStatus.NOT_FOUND,
                message: "Cotización no encontrada",
                Module: Module,
            });
        }else{
            await quotes.destroy();
            res.status(httpStatus.OK).json({
                status: httpStatus.OK,
                message: "Cotización eliminada exitosamente",
                Module: Module,
            });
        }
     } catch (error) {
        console.error(error);
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            status: httpStatus.INTERNAL_SERVER_ERROR,
            message: "Error al eliminar la cotización",
            Module: Module,
        });
     }
} 

module.exports = {
        getQuotes,
        saveQuotes,
        updateQuotes,
        deleteQuotes
    };