// categoryService.js
export default function CategoryService(repo) {
  return {
    list: async (user_id) => {
      if (!user_id) throw { status: 400, message: "user_id obrigatório" };
      return await repo.list(user_id);
    },

    get: async (id) => {
      const category = await repo.get(id);
      if (!category) throw { status: 404, message: "Categoria não encontrada" };
      return category;
    },

    create: async ({ name, user_id }) => {
      if (!name || !user_id)
        throw { status: 400, message: "Nome e usuário são obrigatórios" };

      return await repo.create({ name, user_id });
    },

    update: async (id, data) => {
      try {
        return await repo.update(id, data);
      } catch {
        throw { status: 404, message: "Categoria não encontrada" };
      }
    },

    delete: async (id) => {
      try {
        await repo.delete(id);
        return { message: "Categoria removida com sucesso" };
      } catch {
        throw { status: 404, message: "Categoria não encontrada" };
      }
    },
  };
}
