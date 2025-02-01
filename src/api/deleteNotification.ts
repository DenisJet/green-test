type DeleteNotificationProps = {
  apiUrl: string;
  idInstance: string;
  apiTokenInstance: string;
  receptId: string;
};

export const deleteNotification = async ({
  apiUrl,
  idInstance,
  apiTokenInstance,
  receptId,
}: DeleteNotificationProps): Promise<{
  success: boolean;
  error?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any;
}> => {
  try {
    const response = await fetch(
      `${apiUrl}/waInstance${idInstance}/deleteNotification/${apiTokenInstance}/${receptId}`,
      {
        method: "DELETE",
        body: JSON.stringify({
          receptId: receptId,
        }),
      },
    );

    if (!response.ok) {
      return {
        success: false,
        error: "Не удалось удалить уведомление",
      };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Неизвестная ошибка",
    };
  }
};
