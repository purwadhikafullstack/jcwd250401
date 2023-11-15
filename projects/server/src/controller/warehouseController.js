const { Warehouse, WarehouseAddress } = require('../models'); // Adjust the path as necessary4

exports.getAllWarehouses = async (req, res) => {

    try {
        const warehouses = await Warehouse.findAll({
            include: [
                {
                    model: WarehouseAddress,
                    attributes: ['street', 'city', 'province', 'longitude', 'latitude']
                }
            ]
        });
        res.json(warehouses);
    } catch (error) {
        res.status(500).send({
            message: "Error retrieving warehouses: " + error.message
        });
    }
};