type ReceiveNotificationProps = {
  apiUrl: string;
  idInstance: string;
  apiTokenInstance: string;
};

export const receiveNotification = async ({
  apiUrl,
  idInstance,
  apiTokenInstance,
}: ReceiveNotificationProps): Promise<{
  success: boolean;
  error?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any;
}> => {
  try {
    const response = await fetch(
      `${apiUrl}/waInstance${idInstance}/receiveNotification/${apiTokenInstance}`,
    );

    if (!response.ok) {
      return {
        success: false,
        error: "Не удалось получить уведомление",
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
