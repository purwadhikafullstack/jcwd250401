const { findNearestWarehouse } = require("../controller/mutation");

// Example test cases
describe("findNearestWarehouse", () => {
  const sourceLatitude = 0;
  const sourceLongitude = 0;
  const requiredStock = 16;

  // Mock data for testing
  const warehouse1 = {
    WarehouseAddress: { latitude: 110.4229104, longitude: -6.9903988 },
    Mutation: { stock: 15 },
  };

  const warehouse2 = {
    WarehouseAddress: { latitude: 106.8428715, longitude: -6.18234 },
    Mutation: { stock: 16 },
  };

  const warehouse3 = {
    WarehouseAddress: { latitude: 110.41871888511956, longitude: -7.049421049999999 },
    Mutation: { stock: 20 },
  };

  const warehouses = [warehouse1, warehouse2, warehouse3];

  it("should return the nearest warehouse with enough stock", () => {
    const result = findNearestWarehouse(sourceLatitude, sourceLongitude, warehouses, requiredStock);
    expect(result).toEqual({
      warehouse: warehouse2,
      distance: expect.any(Number),
    });
  });

  it("should return null if no warehouse has enough stock", () => {
    const result = findNearestWarehouse(sourceLatitude, sourceLongitude, warehouses, 100);
    expect(result).toBeNull();
  });
});
