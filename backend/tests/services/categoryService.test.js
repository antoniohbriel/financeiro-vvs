import { jest } from "@jest/globals";
import CategoryService from "../../src/services/categoryService.js";

describe("CategoryService - create", () => {
  it("deve criar nova categoria", async () => {
    const mockRepo = {
      create: jest.fn().mockResolvedValue({
        id: 10,
        name: "Alimentação",
        user_id: 1
      })
    };

    const service = CategoryService(mockRepo);

    const result = await service.create({
      name: "Alimentação",
      user_id: 1
    });

    expect(result.name).toBe("Alimentação");
    expect(mockRepo.create).toHaveBeenCalled();
  });
});
