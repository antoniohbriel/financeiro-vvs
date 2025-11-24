import { jest } from "@jest/globals";
import TransactionService from "../../src/services/transactionService.js";

describe("TransactionService - create", () => {
  it("deve criar uma transação", async () => {
    const mockRepo = {
      create: jest.fn().mockResolvedValue({
        id: 7,
        description: "Salário",
        amount: 500,
        type: "income",
        date: new Date("2024-01-10"),
        categoryId: 10,
        userId: 1
      })
    };

    const service = TransactionService(mockRepo);

    const input = {
      description: "Salário",
      amount: 500,
      type: "income",
      categoryId: 10,
      userId: 1,
      date: "2024-01-10"
    };

    const result = await service.create(input);

    expect(result.amount).toBe(500);
    expect(result.type).toBe("income");
    expect(mockRepo.create).toHaveBeenCalledTimes(1);
  });
});
