import { jest } from "@jest/globals";
import BudgetService from "../../src/services/budgetService.js";

describe("BudgetService - save", () => {
  it("deve criar um orçamento", async () => {
    const mockRepo = {
      findAllByUser: jest.fn(),
      findByUserAndCategory: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    mockRepo.findByUserAndCategory.mockResolvedValue(null);

    mockRepo.create.mockResolvedValue({
      id: 5,
      user_id: 1,
      category_id: 10,
      amount: 500,
    });

    const service = BudgetService(mockRepo);

    const result = await service.save(1, 10, 500);

    expect(result).toEqual({
      id: 5,
      user_id: 1,
      category_id: 10,
      amount: 500,
    });

    expect(mockRepo.findByUserAndCategory).toHaveBeenCalled();
    expect(mockRepo.create).toHaveBeenCalled();
  });
});
