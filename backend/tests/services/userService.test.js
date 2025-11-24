// tests/services/userService.test.js
import { jest } from "@jest/globals";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// =================== Mocks ===================

// 1️⃣ Mock NotificationService antes de importar UserService
jest.mock("../../src/services/notificationService.js", () => ({
  default: { createNotification: jest.fn().mockResolvedValue(true) },
}));

// 2️⃣ Mock PrismaClient antes de importar UserService
const mockFindUnique = jest.fn();
const mockCreate = jest.fn();
const mockFindMany = jest.fn();
const mockUpdate = jest.fn();

jest.mock("@prisma/client", () => {
  return {
    PrismaClient: jest.fn().mockImplementation(() => ({
      user: {
        findUnique: mockFindUnique,
        create: mockCreate,
        findMany: mockFindMany,
        update: mockUpdate,
      },
    })),
  };
});

// 3️⃣ Agora podemos importar UserService e NotificationService
import UserService from "../../src/services/userService.js";
import NotificationService from "../../src/services/notificationService.js";

// =================== Testes ===================

describe("UserService", () => {
  beforeEach(() => {
    jest.restoreAllMocks();

    // bcrypt
    jest.spyOn(bcrypt, "hash").mockImplementation(async (pwd) => `hashed-${pwd}`);
    jest.spyOn(bcrypt, "compare").mockImplementation(async (pwd, hash) => pwd === hash.replace("hashed-", ""));

    // jwt
    jest.spyOn(jwt, "sign").mockImplementation(() => "fake-jwt-token");

    // reset Prisma mocks
    mockFindUnique.mockReset();
    mockCreate.mockReset();
    mockFindMany.mockReset();
    mockUpdate.mockReset();

    // reset NotificationService
    NotificationService.createNotification.mockClear();
  });

  // ---------------- Register ----------------
  describe("register", () => {
    it("deve criar um novo usuário com sucesso", async () => {
      mockFindUnique.mockResolvedValue(null);
      mockCreate.mockResolvedValue({ id: 1, name: "Antônio", email: "antonio@email.com" });

      const result = await UserService.register({
        name: "Antônio",
        email: "antonio@email.com",
        password: "123456",
      });

      expect(result.user.id).toBe(1);
      expect(result.user.name).toBe("Antônio");
      expect(result.user.email).toBe("antonio@email.com");
      expect(result.token).toBe("fake-jwt-token");
      expect(mockFindUnique).toHaveBeenCalledTimes(1);
      expect(mockCreate).toHaveBeenCalledTimes(1);
      expect(NotificationService.createNotification).toHaveBeenCalledTimes(1);
    });

    it("falha se campos estiverem ausentes", async () => {
      await expect(UserService.register({ name: "", email: "", password: "" }))
        .rejects.toEqual({ status: 400, message: "Preencha todos os campos" });
    });

    it("falha se e-mail já cadastrado", async () => {
      mockFindUnique.mockResolvedValue({ id: 1, email: "existente@email.com" });

      await expect(UserService.register({ name: "Teste", email: "existente@email.com", password: "123" }))
        .rejects.toEqual({ status: 409, message: "E-mail já cadastrado" });
    });

    it("não falha se criação de notificação der erro", async () => {
      mockFindUnique.mockResolvedValue(null);
      mockCreate.mockResolvedValue({ id: 2, name: "João", email: "joao@email.com" });
      NotificationService.createNotification.mockRejectedValue(new Error("Erro"));

      const result = await UserService.register({
        name: "João",
        email: "joao@email.com",
        password: "123456",
      });

      expect(result.user.name).toBe("João");
      expect(result.token).toBe("fake-jwt-token");
    });
  });

  // ---------------- Login ----------------
  describe("login", () => {
    it("deve logar usuário com sucesso", async () => {
      mockFindUnique.mockResolvedValue({ id: 1, name: "Antônio", email: "antonio@email.com", password_hash: "hashed-123456" });

      const result = await UserService.login({ email: "antonio@email.com", password: "123456" });

      expect(result.user.id).toBe(1);
      expect(result.token).toBe("fake-jwt-token");
    });

    it("falha se usuário não encontrado", async () => {
      mockFindUnique.mockResolvedValue(null);

      await expect(UserService.login({ email: "x@email.com", password: "123" }))
        .rejects.toEqual({ status: 404, message: "Usuário não encontrado" });
    });

    it("falha se senha incorreta", async () => {
      mockFindUnique.mockResolvedValue({ id: 1, name: "Antônio", email: "antonio@email.com", password_hash: "hashed-123456" });

      await expect(UserService.login({ email: "antonio@email.com", password: "wrong" }))
        .rejects.toEqual({ status: 401, message: "Senha incorreta" });
    });
  });

  // ---------------- listUsers ----------------
  describe("listUsers", () => {
    it("retorna lista de usuários", async () => {
      mockFindMany.mockResolvedValue([
        { id: 1, name: "Antônio", email: "antonio@email.com" },
        { id: 2, name: "João", email: "joao@email.com" },
      ]);

      const result = await UserService.listUsers();

      expect(result).toHaveLength(2);
      expect(result[0].name).toBe("Antônio");
    });
  });

  // ---------------- updateUser ----------------
  describe("updateUser", () => {
    it("atualiza usuário com sucesso", async () => {
      mockUpdate.mockResolvedValue({ id: 1, name: "NovoNome", email: "antonio@email.com" });

      const result = await UserService.updateUser(1, { name: "NovoNome" });
      expect(result.name).toBe("NovoNome");
    });

    it("falha se nome não fornecido", async () => {
      await expect(UserService.updateUser(1, {}))
        .rejects.toEqual({ status: 400, message: "O nome é obrigatório para atualização" });
    });

    it("falha se id inválido", async () => {
      await expect(UserService.updateUser("abc", { name: "x" }))
        .rejects.toEqual({ status: 400, message: "ID de usuário inválido." });
    });

    it("falha se usuário não encontrado", async () => {
      const err = { code: "P2025" };
      mockUpdate.mockRejectedValue(err);

      await expect(UserService.updateUser(999, { name: "x" }))
        .rejects.toEqual({ status: 404, message: "Usuário não encontrado." });
    });
  });
});
