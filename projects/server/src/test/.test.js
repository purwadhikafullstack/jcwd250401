const { findNearestWarehouse } = require("../controller/mutation");

// Example test cases
describe("findNearestWarehouse", () => {
  const sourceLatitude = 110.4229104;
  const sourceLongitude = -6.9903988;
  const requiredStock = 10;

  // Mock data for testing
  const warehouse1 = {
    WarehouseAddress: { latitude: 110.4229104, longitude: -6.9903988 },
    Mutations: [{ stock: 5 }],
  };

  const warehouse2 = {
    WarehouseAddress: { latitude: 106.8428715, longitude: -6.18234 },
    Mutations: [{ stock: 25 }],
  };

  const warehouse3 = {
    WarehouseAddress: { latitude: 110.41871888511956, longitude: -7.049421049999999 },
    Mutations: [{ stock: 20 }],
  };

  const warehouses = [warehouse1, warehouse2, warehouse3];

  it("should return the nearest warehouse with enough stock", () => {
    const result = findNearestWarehouse(sourceLatitude, sourceLongitude, warehouses, requiredStock);
    expect(result).toEqual(warehouse3);
  });

  it("should return null if no warehouse has enough stock", () => {
    const result = findNearestWarehouse(sourceLatitude, sourceLongitude, warehouses, 100);
    expect(result).toBeNull();
  });
});
