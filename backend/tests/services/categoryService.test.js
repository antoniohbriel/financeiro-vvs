const CategoryService = require("../../src/services/categoryService");
const CategoryRepository = require("../../src/repositories/categoryRepository");

jest.mock("../../src/repositories/categoryRepository");

describe("CategoryService", () => {
  afterEach(() => jest.clearAllMocks());

  it("deve listar categorias de um usuário", () => {
    const mockCategories = [
      { id: 1, name: "Alimentação", userId: 1 },
      { id: 2, name: "Transporte", userId: 1 },
    ];

    CategoryRepository.findByUserId.mockReturnValue(mockCategories);

    const result = CategoryService.list(1);

    expect(CategoryRepository.findByUserId).toHaveBeenCalledWith(1);
    expect(result).toEqual(mockCategories);
  });

  it("deve criar uma categoria com sucesso", () => {
    const mockData = { name: "Lazer", userId: 1 };
    const mockCreated = { id: 1, ...mockData };

    CategoryRepository.create.mockReturnValue(mockCreated);

    const result = CategoryService.create(mockData);

    expect(CategoryRepository.create).toHaveBeenCalledWith(mockData);
    expect(result).toEqual(mockCreated);
  });

  it("deve lançar erro ao criar categoria sem nome ou userId", () => {
    expect(() => CategoryService.create({ name: "" }))
      .toThrow("Nome e usuário são obrigatórios");
  });

  it("deve lançar erro ao buscar categoria inexistente", () => {
    CategoryRepository.findById.mockReturnValue(undefined);

    expect(() => CategoryService.get(99))
      .toThrow("Categoria não encontrada");
  });

  it("deve atualizar uma categoria existente", () => {
    const mockUpdated = { id: 1, name: "Saúde", userId: 1 };
    CategoryRepository.update.mockReturnValue(mockUpdated);

    const result = CategoryService.update(1, { name: "Saúde" });

    expect(CategoryRepository.update).toHaveBeenCalledWith(1, { name: "Saúde" });
    expect(result).toEqual(mockUpdated);
  });

  it("deve lançar erro ao tentar atualizar categoria inexistente", () => {
    CategoryRepository.update.mockReturnValue(undefined);

    expect(() => CategoryService.update(99, { name: "Nova" }))
      .toThrow("Categoria não encontrada");
  });

  it("deve deletar uma categoria com sucesso", () => {
    CategoryRepository.delete.mockReturnValue(true);

    const result = CategoryService.delete(1);

    expect(CategoryRepository.delete).toHaveBeenCalledWith(1);
    expect(result).toEqual({ message: "Categoria removida com sucesso" });
  });

  it("deve lançar erro ao deletar categoria inexistente", () => {
    CategoryRepository.delete.mockReturnValue(undefined);

    expect(() => CategoryService.delete(99))
      .toThrow("Categoria não encontrada");
  });
});
