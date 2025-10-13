const TransactionService = require("../../src/services/transactionService");
const TransactionRepository = require("../../src/repositories/transactionRepository");

// Mock do repositório (para não usar banco real)
jest.mock("../../src/repositories/transactionRepository");

describe("TransactionService", () => {
  afterEach(() => jest.clearAllMocks());

  it("deve listar todas as transações", () => {
    const mockTransactions = [
      { id: 1, description: "Compra", amount: 50, type: "expense" },
      { id: 2, description: "Salário", amount: 5000, type: "income" },
    ];

    TransactionRepository.findAll.mockReturnValue(mockTransactions);

    const result = TransactionService.list();

    expect(TransactionRepository.findAll).toHaveBeenCalled();
    expect(result).toEqual(mockTransactions);
  });

  it("deve criar uma transação com sucesso", () => {
    const mockTransaction = {
      description: "Internet",
      amount: 120,
      type: "expense",
      category: "Serviços",
    };

    TransactionRepository.create.mockReturnValue({
      id: 1,
      ...mockTransaction,
    });

    const result = TransactionService.create(mockTransaction);

    expect(TransactionRepository.create).toHaveBeenCalledWith(mockTransaction);
    expect(result).toHaveProperty("id", 1);
  });

  it("deve lançar erro ao tentar criar transação sem campos obrigatórios", () => {
    expect(() => TransactionService.create({ description: "Incompleta" }))
      .toThrow("Preencha todos os campos");
  });

  it("deve lançar erro ao tentar obter uma transação inexistente", () => {
    TransactionRepository.findById.mockReturnValue(undefined);

    expect(() => TransactionService.get(99))
      .toThrow("Transação não encontrada");
  });
});
