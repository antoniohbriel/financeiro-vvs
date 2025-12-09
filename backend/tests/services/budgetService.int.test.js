import { jest } from '@jest/globals';
import request from "supertest";
import express from "express";
import BudgetService from "../../src/services/budgetService.js";

describe("BudgetService - Integração", () => {
  let app;
  let repository;
  let service;

  beforeEach(() => {
    // Mock simples do repositório
    repository = {
      findAllByUser: jest.fn(),
      findByUserAndCategory: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn()
    };

    service = BudgetService(repository);

    // servidor express fictício só pra rodar o teste
    app = express();
    app.use(express.json());

    app.get("/budgets/:userId", async (req, res) => {
      const budgets = await service.list(req.params.userId);
      res.json(budgets);
    });

    app.post("/budgets", async (req, res) => {
      const { user_id, category_id, amount } = req.body;
      const result = await service.save(user_id, category_id, amount);
      res.json(result);
    });

    app.delete("/budgets/:id", async (req, res) => {
      const result = await service.delete(req.params.id);
      res.json({ deleted: result });
    });
  });

  test("Deve listar budgets de um usuário", async () => {
    const mockBudgets = [
      { id: 1, user_id: 10, category_id: 2, amount: 200 }
    ];

    repository.findAllByUser.mockResolvedValue(mockBudgets);

    const res = await request(app).get("/budgets/10");

    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockBudgets);
    expect(repository.findAllByUser).toHaveBeenCalledWith("10");
  });


  test("Deve criar um novo budget quando não existe", async () => {
    repository.findByUserAndCategory.mockResolvedValue(null);

    repository.create.mockResolvedValue({
      id: 1,
      user_id: 10,
      category_id: 5,
      amount: 300
    });

    const res = await request(app)
      .post("/budgets")
      .send({ user_id: 10, category_id: 5, amount: 300 });

    expect(repository.create).toHaveBeenCalled();
    expect(repository.update).not.toHaveBeenCalled();
    expect(res.status).toBe(200);
    expect(res.body.amount).toBe(300);
  });


  test("Deve atualizar budget existente", async () => {
    repository.findByUserAndCategory.mockResolvedValue(
      { id: 99, user_id: 10, category_id: 5, amount: 100 }
    );

    repository.update.mockResolvedValue({
      id: 99,
      user_id: 10,
      category_id: 5,
      amount: 500
    });

    const res = await request(app)
      .post("/budgets")
      .send({ user_id: 10, category_id: 5, amount: 500 });

    expect(repository.update).toHaveBeenCalledWith(99, 500);
    expect(repository.create).not.toHaveBeenCalled();
    expect(res.body.amount).toBe(500);
  });


  test("Deve deletar um budget", async () => {
    repository.delete.mockResolvedValue(true);

    const res = await request(app).delete("/budgets/99");

    expect(repository.delete).toHaveBeenCalledWith("99");
    expect(res.body).toEqual({ deleted: true });
  });
});
