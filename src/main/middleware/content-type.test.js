const request = require("supertest");
let app 
describe("Content Type", () => {
  beforeEach(() => {
    jest.resetModules()
    app = require("../config/app");
  })

  it("should return json content type as default", async () => {
    app.get("/test_content_type", (req, res) => {
      res.send({});
    });

    await request(app).get("/test_content_type").expect("content-type", /json/);
  });

  it("should return text content type if forced", async () => {
    app.get("/test_content_type", (req, res) => {
      res.type('xml')
      res.send('');
    });

    await request(app).get("/test_content_type").expect("content-type", /xml/);
  });
});
