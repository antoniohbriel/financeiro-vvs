import { jest } from "@jest/globals";
import UserService from "../../src/services/userService.js";

describe("UserService - register", () => {
  it("deve criar um novo usuário", async () => {
    const mockRepo = {
      create: jest.fn().mockResolvedValue({
        id: 1,
        name: "Antônio",
        email: "antonio@email.com"
      })
    };

    const service = UserService(mockRepo);

    const result = await service.register({
      name: "Antônio",
      email: "antonio@email.com",
      password: "123456"
    });

    expect(result.id).toBe(1);
    expect(mockRepo.create).toHaveBeenCalledTimes(1);
  });
});
