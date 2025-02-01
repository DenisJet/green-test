type GetSettingsProps = {
  apiUrl: string;
  idInstance: string;
  apiTokenInstance: string;
};

export const getSettings = async ({
  apiUrl,
  idInstance,
  apiTokenInstance,
}: GetSettingsProps): Promise<{
  success: boolean;
  error?: string;
}> => {
  try {
    const response = await fetch(
      `${apiUrl}/waInstance${idInstance}/getSettings/${apiTokenInstance}`,
    );

    if (!response.ok) {
      return {
        success: false,
        error: "Неверные учетные данные! Попробуйте ещё раз.",
      };
    }

    const data = await response.json();
    if (data) {
      sessionStorage.setItem("apiUrl", apiUrl);
      sessionStorage.setItem("idInstance", idInstance);
      sessionStorage.setItem("apiTokenInstance", apiTokenInstance);
    }
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Неизвестная ошибка",
    };
  }
};
