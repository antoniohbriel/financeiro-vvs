import { jest } from "@jest/globals";
import ProfilePictureService from "../../src/services/profilePictureService.js";

describe("ProfilePictureService - save", () => {
  it("deve salvar a foto de perfil do usuário", async () => {
    const mockRepo = {
      save: jest.fn().mockResolvedValue({
        user_id: 1,
        url: "https://meusite.com/foto.png"
      })
    };

    const service = ProfilePictureService(mockRepo);

    const result = await service.save({
      user_id: 1,
      url: "https://meusite.com/foto.png"
    });

    expect(result.url).toContain("foto.png");
    expect(mockRepo.save).toHaveBeenCalled();
  });
});
