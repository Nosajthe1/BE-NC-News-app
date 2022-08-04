const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data/index");
const { string } = require("pg-format");
const articles = require("../db/data/test-data/articles");

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

describe("3. ALL/api/*", () => {
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
        expect(body.articles).toEqual(
          expect.objectContaining({
            author: expect.any(String),
            title: expect.any(String),
            article_id: expect.any(Number),
            body: expect.any(String),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
          })
        );
      });
  });
  test("4. status: 400, responds with invalid ", () => {
    return request(app)
      .get("/api/articles/PEOOHSOEPEO")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid URL");
      });
  });
  test("4. status: 404, responds with id error that doesnt exist ", () => {
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
        expect(body.articles).toEqual(
          expect.objectContaining({
            author: expect.any(String),
            title: expect.any(String),
            article_id: expect.any(Number),
            body: expect.any(String),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: 101,
          })
        );
      });
  });
  test("5. status: 400, responds with invalid URL ", () => {
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
  test("5. status: 404, responds with id error that doesnt exist ", () => {
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
  test("5. status: 400, invalid send body ", () => {
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
  test("6. status:200, responds with an array of users", () => {
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
  test("6. responds with error 404 when passed route that does not exist", () => {
    return request(app)
      .get("/api/hellohello")
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("Route not found");
      });
  });
});

describe("task 7. get /api/arcticles/:arcticle_id", () => {
  test("status:200, responds with updated articles table with extra property", () => {
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
          comment_count: 11,
        });
      });
  });
  test("7. status: 400, responds with invalid ", () => {
    return request(app)
      .get("/api/articles/WOWOIEIR")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid URL");
      });
  });

  test("7. status: 404, responds with id error that doesnt exist ", () => {
    return request(app)
      .get("/api/articles/8989898")
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("ID does not exist");
      });
  });
});

describe("task 8. get /api/arcticles", () => {
  test("status:200, responds with updated articles table with user table info", () => {
    return request(app)
      .get(`/api/articles`)
      .expect(200)
      .then(({ body }) => {
        expect(body.articles.length).toEqual(12);
      });
  });
  test("8.Make sure it responds in descending order", () => {
    return request(app)
      .get(`/api/articles`)
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSorted({
          descending: true,
        });
      });
  });
  test("8.responds with error 404 when passed route that does not exist", () => {
    return request(app)
      .get("/api/OWOWOWOW")
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("Route not found");
      });
  });
});
