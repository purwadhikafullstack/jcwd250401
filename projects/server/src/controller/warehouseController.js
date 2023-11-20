const axios = require('axios');
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

        if (warehouses.length === 0) {
            return res.status(404).send({
                message: "Warehouses not found"
            });
        }

        res.json({
            ok: true,
            data: warehouses
        });
    } catch (error) {
        res.status(500).send({
            message: "Error retrieving warehouses: " + error.message
        });
    }
};

// Function to convert address to coordinates
const convertAddressToCoordinates = async (address) => {
    try {
        const response = await axios.get(`https://geocode.maps.co/search?q=${encodeURIComponent(address)}`);
        // Check if the response data array has at least one result
        if (response.data && response.data.length > 0) {
            const firstResult = response.data[0];
            return { lat: firstResult.lat, lon: firstResult.lon };
        } else {
            return null;
        }
    } catch (error) {
        console.error('Error converting address to coordinates:', error);
        return null;
    }
};

exports.addWarehouse = async (req, res) => {
    const { name, street, city, province } = req.body;
    const address = `${street}, ${city}, ${province}`;

    try {
        // Convert address to coordinates
        const coordinates = await convertAddressToCoordinates(address);

        if (!coordinates) {
            return res.status(400).send('Invalid address or unable to find coordinates.');
        }

        // Create Warehouse with location and coordinates
        const warehouse = await Warehouse.create({
            name,
            location: address,
        });

        // Create WarehouseAddress
        const warehouseAddress = await WarehouseAddress.create({
            warehouseId: warehouse.id,
            street,
            city,
            province,
            latitude: coordinates.lat,
            longitude: coordinates.lon
        });

        // Update Warehouse with warehouseAddressId
        await Warehouse.update({
            warehouseAddressId: warehouseAddress.id
        }, {
            where: {
                id: warehouse.id
            }
        });

        // If coordinates not found, return error
        if (warehouseAddress.latitude === null || warehouseAddress.longitude === null) {
            return res.status(400).send('Invalid address or unable to find coordinates.');
        };

        res.json({
            ok: true,
            data: {
                name: warehouse.name,
                location: warehouse.location,
                coordinates: {
                    latitude: warehouseAddress.latitude,
                    longitude: warehouseAddress.longitude
                }
            }
        });
    } catch (error) {
        res.status(500).send({
            message: "Error adding warehouse: " + error.message
        });
    }
};

exports.updateWarehouse = async (req, res) => {
    const { id } = req.params;
    const { name, street, city, province } = req.body;
    const address = `${street}, ${city}, ${province}`;

    try {
        // Convert address to coordinates
        const coordinates = await convertAddressToCoordinates(address);

        if (!coordinates) {
            return res.status(400).send('Invalid address or unable to find coordinates.');
        }

        // Update Warehouse with location and coordinates
        const warehouse = await Warehouse.update({
            name,
            location: address,
        }, {
            where: {
                id
            }
        });

        // Update WarehouseAddress
        const warehouseAddress = await WarehouseAddress.update({
            street,
            city,
            province,
            latitude: coordinates.lat,
            longitude: coordinates.lon
        }, {
            where: {
                id
            }
        });

        // If coordinates not found, return error
        if (warehouseAddress.latitude === null || warehouseAddress.longitude === null) {
            return res.status(400).json({
                ok: false,
                message: 'Invalid address or unable to find coordinates.'
            
            })
        };

        res.json({
            ok: true,
            data: {
                name,
                location: address,
                coordinates: {
                    latitude: coordinates.lat,
                    longitude: coordinates.lon
                }
            }
        });
    } catch (error) {
        res.status(500).send({
            message: "Error updating warehouse: " + error.message
        });
    }
}

exports.deleteWarehouse = async (req, res) => {
    const { id } = req.params;

    try {

        const warehouse = await Warehouse.destroy({
            where: {
                id
            }
        });

        const warehouseAddress = await WarehouseAddress.destroy({
            where: {
                id
            }
        });

        if (warehouse === 0 || warehouseAddress === 0) {
            return res.status(404).send({
                message: "Warehouse not found"
            });
        }

        res.json({
            ok: true,
            message: 'Warehouse deleted'
        });
        
    } catch (error) {
        res.status(500).send({
            message: "Error deleting warehouse: " + error.message
        });
    }
}