const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data/index");
const { string } = require("pg-format");

beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  return db.end();
});

describe("task 3. GET /api/topics", () => {
  test("status:200, responds with an array of topics", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        const { topics } = body;
        expect(topics).toBeInstanceOf(Array);
        expect(topics).toHaveLength(3);
        topics.forEach((topic) => {
          expect(topic).toEqual(
            expect.objectContaining({
              description: expect.any(String),
              slug: expect.any(String),
            })
          );
        });
      });
  });
});

describe("ALL/api/*", () => {
  test("responds with error 404 when passed route that does not exist", () => {
    return request(app)
      .get("/api/hellohello")
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("Route not found");
      });
  });
});

describe("task 4. GET /api/arcticles/:arcticle_id", () => {
  test("status:200, responds with a single matching article", () => {
    const article_id = 1;
    return request(app)
      .get(`/api/articles/${article_id}`)
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toEqual({
          author: expect.any(String),
          title: expect.any(String),
          article_id: expect.any(Number),
          body: expect.any(String),
          topic: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
        });
      });
  });
  test("status: 400, responds with invalid ", () => {
    return request(app)
      .get("/api/articles/PEOOHSOEPEO")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid URL");
      });
  });
  test("status: 404, responds with id error that doesnt exist ", () => {
    return request(app)
      .get("/api/articles/77777777")
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("ID does not exist");
      });
  });
});

describe("task 5. PATCH /api/arcticles/:arcticle_id", () => {
  test("status:200, responds with updated vote value in articles table", () => {
    const article_id = 1;
    return request(app)
      .patch(`/api/articles/${article_id}`)
      .send({
        inc_votes: 1,
      })
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toEqual({
          author: expect.any(String),
          title: expect.any(String),
          article_id: expect.any(Number),
          body: expect.any(String),
          topic: expect.any(String),
          created_at: expect.any(String),
          votes: 101,
        });
      });
  });
  test("status: 400, responds with invalid URL ", () => {
    return request(app)
      .patch("/api/articles/PEOOHSOEPEO")
      .expect(400)
      .send({
        inc_votes: 1,
      })
      .then(({ body }) => {
        expect(body.msg).toBe("ID is not a number");
      });
  });
  test("status: 404, responds with id error that doesnt exist ", () => {
    return request(app)
      .patch("/api/articles/777777")
      .send({
        inc_votes: 1,
      })
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("ID does not exist");
      });
  });
  test("status: 400, invalid send body ", () => {
    const article_id = 1;
    return request(app)
      .patch(`/api/articles/${article_id}`)
      .send({
        inc_votewqe: 1,
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid input missing inc_votes prop");
      });
  });
});

describe("task 6. GET /api/users", () => {
  test("status:200, responds with an array of users", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        const { users } = body;
        expect(users).toBeInstanceOf(Array);
        expect(users).toHaveLength(4);
        users.forEach((user) => {
          expect(user).toEqual(
            expect.objectContaining({
              username: expect.any(String),
              name: expect.any(String),
              avatar_url: expect.any(String),
            })
          );
        });
      });
  });
  test("responds with error 404 when passed route that does not exist", () => {
    return request(app)
      .get("/api/hellohello")
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("Route not found");
      });
  });
});
