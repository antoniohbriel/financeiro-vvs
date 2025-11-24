export default function ProfilePictureService(repository) {
  return {

    async uploadPhoto(userId, photoBuffer) {
      const idAsInt = parseInt(userId);

      if (isNaN(idAsInt)) {
        throw { status: 400, message: "ID de usuário inválido." };
      }

      try {
        return await repository.upsert({
          where: { user_id: idAsInt },
          update: { photo: photoBuffer, uploaded_at: new Date() },
          create: { user_id: idAsInt, photo: photoBuffer },
          select: { user_id: true, uploaded_at: true },
        });

      } catch (error) {
        if (error.code === "P2003") {
          throw { status: 404, message: "Usuário associado à foto não encontrado." };
        }
        throw { status: 500, message: "Falha ao salvar a foto de perfil." };
      }
    },

    async getPhoto(userId) {
      const idAsInt = parseInt(userId);

      if (isNaN(idAsInt)) {
        throw { status: 400, message: "ID de usuário inválido." };
      }

      try {
        const photoRecord = await repository.findUnique({
          where: { user_id: idAsInt },
          select: { photo: true, user_id: true },
        });

        if (!photoRecord) {
          throw { status: 404, message: "Foto de perfil não encontrada." };
        }

        return photoRecord;

      } catch (error) {
        if (error.status === 404) throw error;
        throw { status: 500, message: "Falha ao buscar a foto de perfil." };
      }
    },
  };
}
