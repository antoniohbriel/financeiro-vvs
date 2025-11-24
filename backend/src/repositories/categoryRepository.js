import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const CategoryRepository = {
  list: (user_id) =>
    prisma.category.findMany({
      where: { user_id },
      include: { user: true },
    }),

  get: (id) =>
    prisma.category.findUnique({
      where: { id },
    }),

  create: (data) =>
    prisma.category.create({
      data,
    }),

  update: (id, data) =>
    prisma.category.update({
      where: { id },
      data,
    }),

  delete: (id) =>
    prisma.category.delete({
      where: { id },
    }),
};

export default CategoryRepository;
