import { jest } from "@jest/globals";
import BudgetService from "../../src/services/budgetService.js";

describe("BudgetService - create", () => {
  it("deve criar um orçamento", async () => {
    const mockRepo = {
      create: jest.fn().mockResolvedValue({
        id: 5,
        month: "2025-02",
        limit: 1200
      })
    };

    const service = BudgetService(mockRepo);

    const result = await service.create({
      month: "2025-02",
      limit: 1200,
      user_id: 1
    });

    expect(result.limit).toBe(1200);
    expect(mockRepo.create).toHaveBeenCalled();
  });
});
