type getChatHistoryProps = {
  apiUrl: string;
  idInstance: string;
  apiTokenInstance: string;
  number: string;
  count: number;
};

export const getChatHistory = async ({
  apiUrl,
  idInstance,
  apiTokenInstance,
  number,
  count = 0,
}: getChatHistoryProps): Promise<{
  success: boolean;
  error?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any;
}> => {
  try {
    const response = await fetch(
      `${apiUrl}/waInstance${idInstance}/getChatHistory/${apiTokenInstance}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chatId: `${number}@c.us`,
          count: count,
        }),
      },
    );

    if (!response.ok) {
      return {
        success: false,
        error: "Не удалось получить историю сообщений",
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
