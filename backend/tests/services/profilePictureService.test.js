import { jest } from "@jest/globals";
import ProfilePictureService from "../../src/services/profilePictureService.js";

describe("ProfilePictureService - save", () => {
  it("deve salvar a foto de perfil do usuário", async () => {
    const mockRepo = {
      upsert: jest.fn().mockResolvedValue({
        user_id: 1,
        uploaded_at: new Date()
      })
    };

    const service = ProfilePictureService(mockRepo);

    const buffer = Buffer.from("abc123");

    const result = await service.uploadPhoto(1, buffer);

    expect(result.user_id).toBe(1);
    expect(mockRepo.upsert).toHaveBeenCalledTimes(1);
  });
});
