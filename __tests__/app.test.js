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
            title: "Living in the shadow of a great man",
            article_id: 1,
            body: expect.any(String),
            topic: "mitch",
            created_at: expect.any(String),
            votes: expect.any(Number),
          })
        );
      });
  });
  test("4. status: 400, responds with invalid ID type ", () => {
    return request(app)
      .get("/api/articles/PEOOHSOEPEO")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid URL - passed invalid ID");
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
            title: "Living in the shadow of a great man",
            article_id: 1,
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
      .patch("/api/articles/WEODLWOEDJ")
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
  test("5. status 400, responds with error when passed incorrect data type ", () => {
    const article_id = 1;
    return request(app)
      .patch(`/api/articles/${article_id}`)
      .send({
        inc_votes: "hello",
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid input, wrong data type");
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
  test("7. status: 400, responds with invalid ID type passed in", () => {
    return request(app)
      .get("/api/articles/WOWOIEIR")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid URL - passed invalid ID");
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

describe("9.GET /api/articles/:article_id/comments", () => {
  test("an array of comments for the given `article_id` ", () => {
    const article_id = 1;
    return request(app)
      .get(`/api/articles/${article_id}/comments`)
      .expect(200)
      .then(({ body }) => {
        expect(body.comments.length).toEqual(11);
      });
  });
  test("9. responds with message when article ID has 0 comments ", () => {
    const article_id = 7;
    return request(app)
      .get(`/api/articles/${article_id}/comments`)
      .expect(200)
      .then(({ body }) => {
        expect(body.comments.length).toEqual(0);
      });
  });

  test("9. responds with error message when passed invalid ID type", () => {
    return request(app)
      .get("/api/articles/thisIsWrongData/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid URL - passed invalid ID");
      });
  });
  test("9. responds with an err 404 when passed ID that does not exist", () => {
    return request(app)
      .get("/api/articles/23456273/comments")
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("ID does not exist");
      });
  });
});

describe("10.POST /api/articles/:article_id/comments", () => {
  test("add new comment body to specified id", () => {
    const article_id = 2;
    return request(app)
      .post(`/api/articles/${article_id}/comments`)
      .send({
        username: "butter_bridge",
        body: "Hi there dudes we all feeling good?",
      })
      .expect(201)
      .then(({ body: { comment } }) => {
        expect(comment).toEqual(
          expect.objectContaining({
            comment_id: expect.any(Number),
            author: expect.any(String),
            article_id: expect.any(Number),
            body: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
          })
        );
      });
  });

  test("10. responds with an err 404 when passed ID that does not exist", () => {
    const article_id = 200;
    return request(app)
      .post(`/api/articles/${article_id}/comments`)
      .send({
        username: "butter_bridge",
        body: "Hi there dudes we all feeling good?",
      })
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("ID does not exist");
      });
  });
  test("10. responds with err 400 when passed Invalid ID type", () => {
    return request(app)
      .post(`/api/articles/HowdyChap/comments`)
      .send({
        username: "butter_bridge",
        body: "Hi there dudes we all feeling good?",
      })
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Invalid URL - passed invalid ID");
      });
  });

  test("10. status: 400, invalid send body ", () => {
    const article_id = 1;
    return request(app)
      .post(`/api/articles/${article_id}/comments`)
      .send({
        usernameewq: "butter_bridge",
        bodyewq: "Hi there dudes we all feeling good?",
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid input, not correct props");
      });
  });
});

describe("11. GET /api/articles (queries) ", () => {
  test("status:200, responds with default sort_by query", () => {
    return request(app)
      .get(`/api/articles?sort_by=created_at`)
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSorted({
          descending: true,
          key: "created_at",
        });
      });
  });

  test("11.status:200, responds with sort_by query set at title", () => {
    return request(app)
      .get(`/api/articles?sort_by=title`)
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSorted({
          descending: true,
          key: "title",
        });
      });
  });

  test("11. status:200, responds with sort_by query set at topic", () => {
    return request(app)
      .get(`/api/articles?sort_by=topic`)
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSorted({
          descending: true,
          key: "topic",
        });
      });
  });

  test("11. status:200, responds with sort_by query set at author", () => {
    return request(app)
      .get(`/api/articles?sort_by=author`)
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSorted({
          descending: true,
          key: "author",
        });
      });
  });

  test("11. status:200, responds with sort_by query set at votes", () => {
    return request(app)
      .get(`/api/articles?sort_by=votes`)
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSorted({
          descending: true,
          key: "votes",
        });
      });
  });

  test("11. status:200, responds with order query in asc order set at votes", () => {
    return request(app)
      .get(`/api/articles?order=ASC`)
      .expect(200)
      .then(({ body }) => {
        console.log(body);
        expect(body.articles).toBeSorted("votes", {
          ascending: true,
        });
      });
  });

  test("11. status:200, responds with order query in asc order set at title", () => {
    return request(app)
      .get(`/api/articles?order=ASC`)
      .expect(200)
      .then(({ body }) => {
        console.log(body);
        expect(body.articles).toBeSorted("title", {
          ascending: true,
        });
      });
  });

  test("11. status:200, responds with topic query with all matching topics returned", () => {
    return request(app)
      .get(`/api/articles?topic=mitch`)
      .expect(200)
      .then(({ body }) => {
        expect(body.articles.length).toEqual(11);
      });
  });

  test("11. status:404, responds with topic query with all matching topics returned", () => {
    return request(app)
      .get(`/api/articles?topic=paper`)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toEqual('No data found');
      });
  });

  test("11. status:400, responds with 400 err when incorrect data passed", () => {
    return request(app)
      .get(`/api/articles?seir_by=kwqlewi`)
      .expect(400)
      .then(( res ) => {
        expect(res.body.msg).toBe("Invalid query parameter");
      });
  });

    test("11. status:400, responds with 400 err when wrong order query data passed", () => {
      return request(app)
        .get(`/api/articles?order=kwqlewi`)
        .expect(400)
        .then((res) => {
          expect(res.body.msg).toBe("It appears this query parameter does not exist");
        });
    });
    test.only("11. status:400, responds with 400 err when wrong sort_by query data passed", () => {
      return request(app)
        .get(`/api/articles?sort_by=banana`)
        .expect(400)
        .then((res) => {
          expect(res.body.msg).toBe("It appears this query parameter does not exist");
        });
    });   

  






});