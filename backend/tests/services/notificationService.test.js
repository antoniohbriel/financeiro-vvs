import { jest } from "@jest/globals";
import NotificationService from "../../src/services/notificationService.js";

describe("NotificationService - create", () => {
  it("deve criar notificação", async () => {
    const mockRepo = {
      create: jest.fn().mockResolvedValue({
        id: 99,
        title: "Conta vence amanhã",
        user_id: 1
      })
    };

    const service = NotificationService(mockRepo);

    const result = await service.create({
      title: "Conta vence amanhã",
      user_id: 1
    });

    expect(result.id).toBe(99);
    expect(mockRepo.create).toHaveBeenCalled();
  });
});
