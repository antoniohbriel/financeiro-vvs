jest.mock("../../src/utils/createUserWithDefaultCategories", () => jest.fn().mockResolvedValue(true));

const UserRepository = require("../repositories/userRepository");
const createUserWithDefaultCategories = require("../utils/createUserWithDefaultCategories");

const UserService = {
  register: ({ name, email, password }) => {
    if (!name || !email || !password) {
      throw { status: 400, message: "Preencha todos os campos" };
    }

    const existingUser = UserRepository.findByEmail(email);
    if (existingUser) {
      throw { status: 409, message: "E-mail já cadastrado" };
    }

    const newUser = UserRepository.create({ name, email, password });

    // utiliza o prisma em segundo plano pra criar categorias padrão
    createUserWithDefaultCategories(name, email).catch(console.error);

    return newUser;
  },

  login: ({ email, password }) => {
    const user = UserRepository.findByEmail(email);
    if (!user) throw { status: 404, message: "Usuário não encontrado" };
    if (user.password !== password)
      throw { status: 401, message: "Senha incorreta" };

    return { id: user.id, name: user.name, email: user.email };
  },

  listUsers: () => UserRepository.findAll(),
};

module.exports = UserService;
