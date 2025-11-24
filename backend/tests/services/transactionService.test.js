import { jest } from "@jest/globals";
import TransactionService from "../../src/services/transactionService.js";

describe("TransactionService - create", () => {
  it("deve criar uma transação", async () => {
    const mockRepo = {
      create: jest.fn().mockResolvedValue({
        id: 7,
        type: "income",
        value: 500,
        category_id: 10
      })
    };

    const service = TransactionService(mockRepo);

    const result = await service.create({
      type: "income",
      value: 500,
      category_id: 10,
      user_id: 1
    });

    expect(result.type).toBe("income");
    expect(result.value).toBe(500);
    expect(mockRepo.create).toHaveBeenCalled();
  });
});
