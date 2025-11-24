export default function BudgetService(repository) {
  return {
    async list(userId) {
      return repository.findAllByUser(userId);
    },

    async save(user_id, category_id, amount) {
      const existing = await repository.findByUserAndCategory(
        user_id,
        category_id
      );

      if (existing) {
        return repository.update(existing.id, amount);
      }

      return repository.create(user_id, category_id, amount);
    },

    async delete(id) {
      return repository.delete(id);
    }
  };
}
