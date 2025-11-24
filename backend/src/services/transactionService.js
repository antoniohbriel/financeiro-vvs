export default function TransactionService(repository) {
  return {
    list: async (userId) => {
      if (!userId) throw { status: 400, message: "userId é obrigatório" };
      return repository.findAll(userId);
    },

    get: async (id) => {
      const transaction = await repository.findById(id);
      if (!transaction) throw { status: 404, message: "Transação não encontrada" };
      return transaction;
    },

    create: async (data) => {
      const description = data.description;
      const amount = data.amount;
      const type = data.type;
      const categoryId = Number(data.categoryId);
      const userId = Number(data.userId);
      const date = data.date;

      if (
        !description ||
        isNaN(amount) ||
        !type ||
        isNaN(categoryId) ||
        isNaN(userId) ||
        !date
      ) {
        throw {
          status: 400,
          message: "Preencha todos os campos corretamente (IDs e valor devem ser números).",
        };
      }

      const toPrisma = {
        description,
        amount,
        type,
        date: new Date(date),
        category: { connect: { id: categoryId } },
        user: { connect: { id: userId } },
      };

      return repository.create(toPrisma);
    },

    update: async (id, data) => {
      const updated = await repository.update(id, data);
      if (!updated) throw { status: 404, message: "Transação não encontrada" };
      return updated;
    },

    delete: async (id) => {
      const deleted = await repository.deleteById(id);
      if (!deleted) throw { status: 404, message: "Transação não encontrada" };
      return { message: "Transação removida com sucesso" };
    },
  };
}
