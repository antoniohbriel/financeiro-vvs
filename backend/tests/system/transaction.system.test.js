import request from "supertest";
import app from "../../src/app.js";

describe("Testes de Sistema - Transactions", () => {
  
  // 1️⃣ Criar uma transação
  it("Deve criar uma transação (POST /api/transactions)", async () => {
    const newTransaction = {
      userId: 1,
      amount: 120.50,
      type: "income",
      description: "Freelance",
      categoryId: 2,
      date: "2024-11-10"
    };

    const res = await request(app)
      .post("/api/transactions")
      .send(newTransaction);

    console.log("DEBUG CREATE:", res.body); // 👈 AQUI

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body.amount).toBe(newTransaction.amount);
  });

  // 2️⃣ Listar transações de um usuário
  it("Deve listar transações (GET /api/transactions?userId=1)", async () => {
    const res = await request(app)
      .get("/api/transactions")
      .query({ userId: 1 });

    console.log("DEBUG LIST:", res.body); // 👈 AQUI

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  // 3️⃣ Obter uma transação por ID
  it("Deve retornar uma transação específica (GET /api/transactions/:id)", async () => {
    const createRes = await request(app)
      .post("/api/transactions")
      .send({
        userId: 1,
        amount: 50,
        type: "expense",
        description: "Café",
        categoryId: 3,
        date: "2024-10-02"
      });

    console.log("DEBUG CREATE 2:", createRes.body); // 👈 AQUI

    const id = createRes.body.id;

    const getRes = await request(app).get(`/api/transactions/${id}`);

    console.log("DEBUG GET:", getRes.body); // 👈 AQUI

    expect(getRes.status).toBe(200);
    expect(getRes.body).toHaveProperty("id", id);
  });
});
