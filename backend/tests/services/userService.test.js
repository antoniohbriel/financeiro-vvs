const UserRepository = require("../../src/repositories/userRepository");

// mock /utils
jest.mock("../../src/utils/createUserWithDefaultCategories", () => ({
  createUserWithDefaultCategories: jest.fn().mockResolvedValue(true),
}));

const UserService = require("../../src/services/userService");

// mock repositório
jest.mock("../../src/repositories/userRepository");

beforeEach(() => {
  jest.clearAllMocks();
  UserRepository.findByEmail = jest.fn();
  UserRepository.create = jest.fn();
  UserRepository.findAll = jest.fn();
});

describe("UserService", () => {
  afterEach(() => jest.clearAllMocks());

  it("deve registrar um novo usuário com sucesso", () => {
    const mockUser = {
      name: "Antônio",
      email: "antonio@email.com",
      password: "123456",
    };

    UserRepository.findByEmail.mockReturnValue(undefined);
    UserRepository.create.mockReturnValue({ id: 1, ...mockUser });

    const result = UserService.register(mockUser);

    expect(UserRepository.findByEmail).toHaveBeenCalledWith(mockUser.email);
    expect(UserRepository.create).toHaveBeenCalledWith(mockUser);
    expect(result).toHaveProperty("id", 1);
  });

  it("deve lançar erro se algum campo estiver faltando", () => {
    expect(() => UserService.register({ email: "teste@email.com" }))
      .toThrow("Preencha todos os campos");
  });

  it("deve lançar erro se o e-mail já estiver cadastrado", () => {
    UserRepository.findByEmail.mockReturnValue({ id: 1, email: "ja@existe.com" });

    expect(() =>
      UserService.register({ name: "João", email: "ja@existe.com", password: "123" })
    ).toThrow("E-mail já cadastrado");
  });

  it("deve fazer login com sucesso", () => {
    const mockUser = { id: 1, name: "Antônio", email: "a@a.com", password: "123" };
    UserRepository.findByEmail.mockReturnValue(mockUser);

    const result = UserService.login({ email: "a@a.com", password: "123" });

    expect(result).toEqual({
      id: mockUser.id,
      name: mockUser.name,
      email: mockUser.email,
    });
  });

  it("deve lançar erro se o usuário não for encontrado", () => {
    UserRepository.findByEmail.mockReturnValue(undefined);

    expect(() =>
      UserService.login({ email: "nao@existe.com", password: "123" })
    ).toThrow("Usuário não encontrado");
  });

  it("deve lançar erro se a senha estiver incorreta", () => {
    const mockUser = { id: 1, name: "Antônio", email: "a@a.com", password: "correta" };
    UserRepository.findByEmail.mockReturnValue(mockUser);

    expect(() =>
      UserService.login({ email: "a@a.com", password: "errada" })
    ).toThrow("Senha incorreta");
  });

  it("deve listar todos os usuários", () => {
    const mockUsers = [
      { id: 1, name: "Antônio" },
      { id: 2, name: "Maria" },
    ];

    UserRepository.findAll.mockReturnValue(mockUsers);

    const result = UserService.listUsers();

    expect(UserRepository.findAll).toHaveBeenCalled();
    expect(result).toEqual(mockUsers);
  });
});
