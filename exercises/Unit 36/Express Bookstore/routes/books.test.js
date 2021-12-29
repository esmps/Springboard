const request = require("supertest");
process.env.NODE_ENV = 'test';
const app = require("../app");
const db = require("../db");
const Book = require("../models/book");

describe("Book Routes Test", function () {

  beforeEach(async function () {
    await db.query("DELETE FROM books");

    const book = await Book.create({
        isbn: "0691161518",
        amazon_url: "http://a.co/eobPtX2",
        author: "Matthew Lane",
        language: "english",
        pages: 264,
        publisher: "Princeton University Press",
        title: "Power-Up: Unlocking the Hidden Mathematics in Video Games",
        year: 2017
      });
  });

  describe("GET /books/", function () {
    test("get all books", async function () {
        const res = await request(app).get("/books/");
        expect(res.statusCode).toEqual(200);
        expect(res.body.books.length).toEqual(1);
        expect(res.body.books[0]).toHaveProperty("isbn");
    });
  });

  describe("POST /books/", function () {
    test("create a valid book", async function () {
        const res = await request(app).post("/books/").send({
            isbn: "0691161512",
            amazon_url: "http://a.co/123456",
            author: "Jessica Liu",
            language: "english",
            pages: 333,
            publisher: "A Valid Book Publisher",
            title: "A Valid Book: A Story",
            year: 2021
        });
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty("book");
        expect(res.body.book.author).toBe("Jessica Liu");
    });
    test("create an invalid book", async function () {
        const res = await request(app).post("/books/").send({
            isbn: 12345,
            amazon_url: "http://a.co/eobPtX2",
            author: "Matthew Lane",
            language: "english",
            pages: "264",
            publisher: "Princeton University Press",
            title: "Power-Up: Unlocking the Hidden Mathematics in Video Games",
            year: 2017
        });
        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty("error");
    });
  });

  describe("GET /books/[isbn]", function () {
    test("get valid book by isbn number", async function () {
        const res = await request(app).get("/books/0691161518");
        expect(res.statusCode).toEqual(200);
        expect(res.body.book.isbn).toBe("0691161518");
    });
    test("get error by invalid isbn number", async function () {
        const isbn = 1234567;
        const res = await request(app).get(`/books/${isbn}`);
        expect(res.statusCode).toEqual(404);
        expect(res.body).toHaveProperty("error");
        expect(res.body.message).toEqual(`There is no book with an isbn ${isbn}`)
    });
    test("get error by null isbn number", async function () {
        const isbn = null;
        const res = await request(app).get(`/books/${isbn}`);
        expect(res.statusCode).toEqual(404);
        expect(res.body).toHaveProperty("error");
    });
  });

  describe("PUT /books/", function () {
    test("Update a valid book", async function () {
        const isbn = "0691161518";
        const res = await request(app).put(`/books/${isbn}`).send({
            amazon_url: "http://a.co/eobPtX2",
            author: "Jessica Loo",
            language: "japanese",
            pages: 264,
            publisher: "Princeton University Press",
            title: "Power-Up: Unlocking the Hidden Mathematics in Video Games",
            year: 2017
        });
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty("book");
        expect(res.body.book.author).toBe("Jessica Loo");
        expect(res.body.book.language).toBe("japanese");
        expect(res.body.book.pages).toBe(264);
    });
    test("Update an invalid book", async function () {
        const isbn = "0691161511";
        const res = await request(app).put(`/books/${isbn}`).send({
        amazon_url: "http://a.co/eobPtX2",
        author: "Jessica Loo",
        language: "japanese",
        pages: 264,
        publisher: "Princeton University Press",
        title: "Power-Up: Unlocking the Hidden Mathematics in Video Games",
        year: 2017
    });
        //You will expect 404 for this because the json is valid which skips the 400 error and gives 404 for book not found.
        expect(res.statusCode).toEqual(404);
        expect(res.body).toHaveProperty("error");
    });
    test("Update a valid book with missing information", async function () {
        const isbn = "0691161518";
        const res = await request(app).put(`/books/${isbn}`).send({
            author: "Jessica Loo",
            language: "japanese",
            pages: 264,
            title: "Power-Up: Unlocking the Hidden Mathematics in Video Games",
            year: 2017
        });
        expect(res.body).toHaveProperty("error");
        expect(res.statusCode).toEqual(400);
    });
    test("Update a valid book with invalid information", async function () {
        const isbn = "0691161518";
        const res = await request(app).put(`/books/${isbn}`).send({
            amazon_url: "http://a.co/eobPtX2",
            author: "Jessica Loo",
            language: "japanese",
            pages: "264",
            publisher: "Princeton University Press",
            title: "Power-Up: Unlocking the Hidden Mathematics in Video Games",
            year: "2017"
        });
        expect(res.body).toHaveProperty("error");
        expect(res.statusCode).toEqual(400);
    });
  });
  describe("DELETE /books/:isbn", function () {
    test("Delete a book", async function () {
        const isbn = "0691161518";
        const res = await request(app).delete(`/books/${isbn}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body.message).toEqual("Book deleted");
    });
    test("Delete a book", async function () {
        const isbn = "0691161";
        const res = await request(app).delete(`/books/${isbn}`);
        expect(res.statusCode).toEqual(404);
        expect(res.body.message).toEqual(`There is no book with an isbn '${isbn}`);
    });
  });

    afterAll(async function () {
    await db.end();
    });
});