let categories = []; // banco temporário em memória
let currentId = 1;

const findAll = () => {
  return categories;
};

const findById = (id) => {
  return categories.find((c) => c.id === parseInt(id));
};

const create = ({ name, userId }) => {
  if (!userId) throw new Error("userId é obrigatório para criar uma categoria");
  const newCategory = { id: currentId++, name, userId };
  categories.push(newCategory);
  return newCategory;
};

const findByUserId = (userId) => {
  return categories.filter((c) => c.userId === userId);
};

const clearAll = () => {
  // útil para testes
  categories = [];
  currentId = 1;
};

module.exports = { findAll, findById, create, findByUserId, clearAll };
