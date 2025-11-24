// src/services/NotificationService.js
const NotificationService = (repository) => ({

  listUserNotifications: async ({ userId, page = 1, pageSize = 10 }) => {
    if (!userId || isNaN(parseInt(userId))) {
      throw { status: 400, message: "ID de usuário inválido." };
    }

    const idAsInt = parseInt(userId);
    const skip = (parseInt(page) - 1) * parseInt(pageSize);
    const take = parseInt(pageSize);

    try {
      const notifications = await repository.findByUserId(idAsInt, skip, take);
      const unreadCount = await repository.countUnread(idAsInt);

      return {
        notifications,
        metadata: {
          currentPage: parseInt(page),
          pageSize: take,
          unreadCount
        },
      };
    } catch (error) {
      console.error("Erro no NotificationService.listUserNotifications:", error);
      throw { status: 500, message: "Falha ao buscar notificações." };
    }
  },

  markAsRead: async ({ userId, notificationIds }) => {
    if (!userId || !notificationIds) {
      throw { status: 400, message: "IDs de usuário e notificação são obrigatórios." };
    }

    const idsArray = Array.isArray(notificationIds)
      ? notificationIds.map(id => parseInt(id))
      : [parseInt(notificationIds)];

    if (idsArray.some(isNaN)) {
      throw { status: 400, message: "Um ou mais IDs de notificação são inválidos." };
    }

    try {
      const updatedCount = await repository.markAsRead(idsArray);

      if (updatedCount === 0) {
        throw { status: 404, message: "Nenhuma notificação encontrada ou atualizada." };
      }

      return updatedCount;
    } catch (error) {
      console.error("Erro no NotificationService.markAsRead:", error);
      if (error.status) throw error;
      throw { status: 500, message: "Falha ao atualizar notificações." };
    }
  },

  create: async ({ title, user_id }) => {
    if (!title || !user_id) {
      throw { status: 400, message: "Título e usuário são obrigatórios." };
    }

    return await repository.create({ title, user_id });
  },

  createNotification: async ({ userId, type, title, body, link_url, metadata }) => {
    if (!userId || !type || !title) {
      throw { status: 400, message: "Campos obrigatórios ausentes." };
    }

    try {
      const idAsInt = parseInt(userId);
      return await repository.create(idAsInt, { type, title, body, link_url, metadata });
    } catch (error) {
      console.error("Erro no NotificationService.createNotification:", error);
      throw { status: 500, message: "Falha ao criar notificação." };
    }
  }
});

export default NotificationService;
