const request = require("supertest");
const app = require("../server");

describe("Server initialization", () => {
  it("should return a 404 for an unknown route", async () => {
    const response = await request(app).get("/unknown-route");
    expect(response.status).toBe(404);
  });
});
