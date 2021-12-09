process.env.NODE_ENV = "test";
const request = require("supertest");

const app = require("./app");
let items = require("./fakeDb");

let newItem = { name: "Pickles", price: 2.99 };

beforeEach(function () {
  items.push(newItem);
});

afterEach(function () {
  items.length = 0;
});

describe("GET /items", () => {
    test("Get list of items", async () => {
        const res = await request(app).get('/items');
        expect(res.statusCode).toBe(200);
        expect(res.body.ITEMS[0]).toEqual( newItem );
        expect(res.body.ITEMS).toHaveLength(1);
    });
});

describe("POST /items", () => {
    test("Create a new item", async () => {
        const res = await request(app).post('/items').send({
            name: "Popsicle",
            price: 1.45
        });
        expect(res.statusCode).toBe(201);
        expect(res.body).toEqual({ "added": {"name": "Popsicle", "price": 1.45}});
        expect(res.body.added).toHaveProperty("name");
        expect(res.body.added).toHaveProperty("price");
        expect(res.body.added.name).toEqual("Popsicle");
        expect(res.body.added.price).toEqual(1.45);
    });
    test("Respond with 400 due to missing price", async () => {
        const res = await request(app).post('/items').send({
            name: "Waffles"
        });
        expect(res.statusCode).toBe(400);
    });
    test("Respond with 400 due to missing name", async () => {
        const res = await request(app).post('/items').send({
            price: 2
        });
        expect(res.statusCode).toBe(400);
    });
    test("Respond with 400 due to duplicate item", async () => {
        const res = await request(app).post('/items').send({
            name: "Pickles",
            price: 1.49
        });
        expect(res.statusCode).toBe(400);
    });
}); 

describe("GET /items/:name", () => {
    test("Get item by name", async () => {
        const res = await request(app).get(`/items/${newItem.name}`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual( newItem );
    });
    test("Respond with 404 if cannot find item", async () => {
        const res = await request(app).get(`/items/fakeItem`);
        expect(res.statusCode).toBe(404);
    });
});

describe("PATCH /items/:name", () => {
    test("Update item name", async () => {
        const res = await request(app).patch(`/items/${newItem.name}`).send({
            name: "Poggles"
        });
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({ "updated": {"name": "Poggles", "price": 2.99} });
    });
    test("Update item price", async () => {
        const res = await request(app).patch(`/items/${newItem.name}`).send({
            price: 2.49
        });
        expect(res.statusCode).toBe(200);
        // item name is now Poggles because it was changed in the previous test
        expect(res.body).toEqual({ "updated": {"name": "Poggles", "price": 2.49} });
    });
    test("Respond with 404 if cannot find item", async () => {
        const res = await request(app).patch(`/items/fakeItem`);
        expect(res.statusCode).toBe(404);
    });
});

describe("DELETE /items/:name", () => {
    test("Deletes a single item", async () => {
      const res = await request(app).delete(`/items/${newItem.name}`);
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({ message: "Deleted" });
    });
    test("Respond with 404 if cannot find item", async () => {
        const res = await request(app).delete(`/items/fakeItem`);
        expect(res.statusCode).toBe(404);
    });
  });