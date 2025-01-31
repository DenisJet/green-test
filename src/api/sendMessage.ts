type SendMessageProps = {
  apiUrl: string;
  idInstance: string;
  apiTokenInstance: string;
  number: string;
  message: string;
};

export const sendMessage = async ({
  apiUrl,
  idInstance,
  apiTokenInstance,
  number,
  message,
}: SendMessageProps): Promise<{ success: boolean; error?: string }> => {
  try {
    const response = await fetch(
      `${apiUrl}/waInstance${idInstance}/sendMessage/${apiTokenInstance}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chatId: `${number}@c.us`,
          message: message,
        }),
      },
    );

    if (!response.ok) {
      return {
        success: false,
        error: "Ошибка при отправке запроса! Попробуйте ещё раз.",
      };
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Неизвестная ошибка",
    };
  }
};
