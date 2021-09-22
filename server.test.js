const request = require("supertest");
const app = require("./app");

describe("serving static files", () => {
  test("should respond with 200 status code", async () => {
    const response = await request(app).get("/");
    expect(response.statusCode).toBe(200);
  });

  test("should with an html document", async () => {
    const response = await request(app).get("/");
    expect(response.headers["content-type"]).toEqual(
      expect.stringContaining("html")
    );
  });
});

describe("REST API Behaviour", () => {
  let sampleData;
  let badID = "ihopethisisntanID";
  beforeAll(async () => {
    let res = await request(app).get("/api");
    sampleData = res.body[0];
    delete sampleData["_id"];
  });

  describe("GET /api", () => {
    test("should respond with 200 status code", async () => {
      const response = await request(app).get("/api");
      expect(response.statusCode).toBe(200);
    });
    test("should respond with a JSON object", async () => {
      const response = await request(app).get("/");
      expect(response.headers["content-type"]).toEqual(
        expect.stringContaining("html")
      );
    });
  });

  describe("GET /api/search?{KEY}={VALUE}", () => {
    describe("when search result exists in database", () => {
      //should respond with 200 status code
      //should respond with JSON object of results
      //results should contain the key and value from the query
    });
    describe("when search result does not exist in database", () => {
      //should respond with 400 status code
      //should respond with JSON object containing an error message
    });
  });

  describe("POST /api", () => {
    describe("when request body is valid data for POST", () => {
      //should respond with 201 status code
      //should respond with JSON object containing new record in database
      //response from GET "/api" should then contain the new record
    });
    describe("when request body is invalid data for POST", () => {
      //should respond with 400 status code
      //should respond with JSON object containing error message
      //response from GET "/api" should not contain the new record
    });
  });

  describe("PUT /api/:id", () => {
    describe("when the id exists in the database", () => {
      describe("when request body is valid data for PUT", () => {
        //should respond with 200 status code
        //should respond with JSON object containing updated record in database
        //response from GET "/api" should then contain the updated record
      });
      describe("when request body is invalid data for PUT", () => {
        //should respond with 400 status code
        //should respond with JSON object containing error message
        //response from GET "/api" should not contain the update
      });
    });
    describe("when the id does not exist in the database", () => {
      describe("when request body is valid data for PUT", () => {
        //should respond with 201 status code
        //should respond with JSON object containing new record in database
        //response from GET "/api" should then contain the new record
      });
      describe("when request body is invalid data for PUT", () => {
        //should respond with 400 status code
        //should respond with JSON object containing error message
        //response from GET "/api" should not contain the new record
      });
    });
  });

  describe("DELETE /api/:id", () => {
    describe("when the id exists in the database", () => {
      //should respond with 204 status code
      //response from GET "/api" should not contain record with the id
    });
    describe("when the id does not exist in the database", () => {
      //should respond with 404 status code
    });
  });
});
