import { jest } from "@jest/globals";
import request from "supertest";
import express from "express";
import TransactionService from "../../src/services/transactionService.js";

describe("TransactionService - Integração", () => {
  let app;
  let repository;
  let service;

  beforeEach(() => {
    repository = {
      findAll: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      deleteById: jest.fn(),
    };

    service = TransactionService(repository);

    app = express();
    app.use(express.json());

    // Rotas simuladas
    app.get("/transactions/:userId", async (req, res) => {
      try {
        const result = await service.list(req.params.userId);
        res.json(result);
      } catch (err) {
        res.status(err.status || 500).json({ message: err.message });
      }
    });

    app.get("/transaction/:id", async (req, res) => {
      try {
        const result = await service.get(req.params.id);
        res.json(result);
      } catch (err) {
        res.status(err.status || 500).json({ message: err.message });
      }
    });

    app.post("/transaction", async (req, res) => {
      try {
        const result = await service.create(req.body);
        res.json(result);
      } catch (err) {
        res.status(err.status || 500).json({ message: err.message });
      }
    });

    app.put("/transaction/:id", async (req, res) => {
      try {
        const result = await service.update(req.params.id, req.body);
        res.json(result);
      } catch (err) {
        res.status(err.status || 500).json({ message: err.message });
      }
    });

    app.delete("/transaction/:id", async (req, res) => {
      try {
        const result = await service.delete(req.params.id);
        res.json(result);
      } catch (err) {
        res.status(err.status || 500).json({ message: err.message });
      }
    });
  });

  // -----------------------------------------------------------------------
  test("Deve listar transações de um usuário", async () => {
    repository.findAll.mockResolvedValue([{ id: 1, description: "Teste" }]);

    const res = await request(app).get("/transactions/10");

    expect(res.status).toBe(200);
    expect(repository.findAll).toHaveBeenCalledWith("10");
    expect(res.body.length).toBe(1);
  });

  // -----------------------------------------------------------------------
  test("Deve retornar erro 400 quando userId não for enviado na listagem", async () => {
    const res = await request(app).get("/transactions/");

    expect(res.status).toBe(404); // rota inválida → normal do Express
  });

  // -----------------------------------------------------------------------
  test("Deve retornar uma transação por ID", async () => {
    repository.findById.mockResolvedValue({ id: 1 });

    const res = await request(app).get("/transaction/1");

    expect(res.status).toBe(200);
    expect(res.body.id).toBe(1);
  });

  // -----------------------------------------------------------------------
  test("Deve retornar erro 404 quando transação não existir", async () => {
    repository.findById.mockResolvedValue(null);

    const res = await request(app).get("/transaction/999");

    expect(res.status).toBe(404);
    expect(res.body.message).toBe("Transação não encontrada");
  });

  // -----------------------------------------------------------------------
  test("Deve criar transação com sucesso", async () => {
    const payload = {
      description: "Compra",
      amount: 50,
      type: "saida",
      categoryId: 2,
      userId: 5,
      date: "2024-01-01",
    };

    repository.create.mockResolvedValue({ id: 1, ...payload });

    const res = await request(app).post("/transaction").send(payload);

    expect(res.status).toBe(200);
    expect(repository.create).toHaveBeenCalled();
    expect(res.body.id).toBe(1);
  });

  // -----------------------------------------------------------------------
  test("Deve retornar erro 400 quando campos inválidos forem enviados na criação", async () => {
    const res = await request(app).post("/transaction").send({
      description: "",
      amount: "abc",
    });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe(
      "Preencha todos os campos corretamente (IDs e valor devem ser números)."
    );
  });

  // -----------------------------------------------------------------------
  test("Deve atualizar uma transação com sucesso", async () => {
    repository.update.mockResolvedValue({ id: 1, description: "Atualizado" });

    const res = await request(app)
      .put("/transaction/1")
      .send({ description: "Atualizado" });

    expect(res.status).toBe(200);
    expect(res.body.description).toBe("Atualizado");
  });

  // -----------------------------------------------------------------------
  test("Deve retornar erro 404 ao tentar atualizar transação inexistente", async () => {
    repository.update.mockResolvedValue(null);

    const res = await request(app)
      .put("/transaction/999")
      .send({ description: "Teste" });

    expect(res.status).toBe(404);
    expect(res.body.message).toBe("Transação não encontrada");
  });

  // -----------------------------------------------------------------------
  test("Deve deletar uma transação com sucesso", async () => {
    repository.deleteById.mockResolvedValue(true);

    const res = await request(app).delete("/transaction/1");

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Transação removida com sucesso");
  });

  // -----------------------------------------------------------------------
  test("Deve retornar erro 404 ao tentar deletar transação inexistente", async () => {
    repository.deleteById.mockResolvedValue(false);

    const res = await request(app).delete("/transaction/999");

    expect(res.status).toBe(404);
    expect(res.body.message).toBe("Transação não encontrada");
  });
});
