import { jest } from "@jest/globals";
import request from "supertest";
import express from "express";
import ProfilePictureService from "../../src/services/profilePictureService.js";

describe("ProfilePictureService - Integração", () => {
  let app;
  let repository;
  let service;

  beforeEach(() => {
    repository = {
      upsert: jest.fn(),
      findUnique: jest.fn()
    };

    service = ProfilePictureService(repository);

    app = express();
    app.use(express.json());
    app.use(express.raw({ type: "application/octet-stream", limit: "5mb" })); // necessário para buffer

    // upload
    app.post("/profile-photo/:userId", async (req, res) => {
      try {
        const result = await service.uploadPhoto(
          req.params.userId,
          req.body
        );
        res.json(result);
      } catch (err) {
        res.status(err.status || 500).json({ message: err.message });
      }
    });

    // busca
    app.get("/profile-photo/:userId", async (req, res) => {
      try {
        const result = await service.getPhoto(req.params.userId);
        res.json(result);
      } catch (err) {
        res.status(err.status || 500).json({ message: err.message });
      }
    });
  });

  test("Deve fazer upload de foto com sucesso", async () => {
    const fakeBuffer = Buffer.from("teste");

    repository.upsert.mockResolvedValue({
      user_id: 10,
      uploaded_at: new Date()
    });

    const res = await request(app)
      .post("/profile-photo/10")
      .set("Content-Type", "application/octet-stream")
      .send(fakeBuffer);

    expect(res.status).toBe(200);
    expect(repository.upsert).toHaveBeenCalled();
    expect(res.body.user_id).toBe(10);
  });

  test("Deve retornar erro 400 quando userId for inválido no upload", async () => {
    const res = await request(app)
      .post("/profile-photo/abc")
      .set("Content-Type", "application/octet-stream")
      .send(Buffer.from("foto"));

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("ID de usuário inválido.");
  });

  test("Deve retornar erro 404 quando usuário não existir (P2003)", async () => {
    repository.upsert.mockRejectedValue({ code: "P2003" });

    const res = await request(app)
      .post("/profile-photo/10")
      .set("Content-Type", "application/octet-stream")
      .send(Buffer.from("foto"));

    expect(res.status).toBe(404);
    expect(res.body.message).toBe("Usuário associado à foto não encontrado.");
  });

  test("Deve retornar erro 500 para falha inesperada no upload", async () => {
    repository.upsert.mockRejectedValue(new Error("falha"));

    const res = await request(app)
      .post("/profile-photo/10")
      .set("Content-Type", "application/octet-stream")
      .send(Buffer.from("foto"));

    expect(res.status).toBe(500);
    expect(res.body.message).toBe("Falha ao salvar a foto de perfil.");
  });

  test("Deve obter foto com sucesso", async () => {
    const fakeBuffer = Buffer.from("img");

    repository.findUnique.mockResolvedValue({
      user_id: 10,
      photo: fakeBuffer
    });

    const res = await request(app).get("/profile-photo/10");

    expect(res.status).toBe(200);
    expect(res.body.user_id).toBe(10);
  });

  test("Deve retornar erro 400 quando userId é inválido ao buscar", async () => {
    const res = await request(app).get("/profile-photo/aaa");

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("ID de usuário inválido.");
  });

  test("Deve retornar erro 404 quando foto não existir", async () => {
    repository.findUnique.mockResolvedValue(null);

    const res = await request(app).get("/profile-photo/10");

    expect(res.status).toBe(404);
    expect(res.body.message).toBe("Foto de perfil não encontrada.");
  });

  test("Deve retornar erro 500 quando falhar ao buscar foto", async () => {
    repository.findUnique.mockRejectedValue(new Error("falha"));

    const res = await request(app).get("/profile-photo/10");

    expect(res.status).toBe(500);
    expect(res.body.message).toBe("Falha ao buscar a foto de perfil.");
  });
});
