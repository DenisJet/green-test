import { FormEvent, useEffect, useState } from "react";
import { getSettings } from "../../api/getSettings";

export type CredentialsForm = {
  apiUrl: {
    value: string;
  };
  idInstance: {
    value: string;
  };
  apiTokenInstance: {
    value: string;
  };
};

export default function AuthModal({
  apiUrl,
  idInstance,
  apiTokenInstance,
}: {
  apiUrl?: string;
  idInstance?: string;
  apiTokenInstance?: string;
}) {
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (apiUrl && idInstance && apiTokenInstance) {
      setIsModalOpen(false);
    }
  }, [apiTokenInstance, apiUrl, idInstance]);

  const submit = async (e: FormEvent) => {
    e.preventDefault();

    const target = e.target as typeof e.target & CredentialsForm;
    const { apiUrl, idInstance, apiTokenInstance } = target;

    const response = await getSettings({
      apiUrl: apiUrl.value,
      idInstance: idInstance.value,
      apiTokenInstance: apiTokenInstance.value,
    });

    if (response.success) {
      setIsModalOpen(false);
      setError(null);
    }

    if (response.error) {
      setError(response.error || "Ошибка при авторизации");
    }
  };

  return (
    <dialog
      id="my_modal_1"
      className={`modal ${isModalOpen ? "modal-open" : ""}`}
    >
      <div className="modal-box max-w-sm">
        <h3 className="font-bold text-lg text-center">
          Введите ваши учетные данные
        </h3>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <div className="modal-action">
          <form onSubmit={submit} className="w-full flex flex-col items-center">
            <label className="floating-label w-full">
              <span>API URL</span>
              <input
                type="text"
                name="apiUrl"
                placeholder="apiUrl"
                className="input input-md mb-3 w-full"
                required
              />
            </label>
            <label className="floating-label w-full">
              <span>ID Instance</span>
              <input
                type="text"
                name="idInstance"
                placeholder="idInstance"
                className="input input-md mb-3 w-full"
                required
              />
            </label>
            <label className="floating-label w-full">
              <span>API Token Instance</span>
              <input
                type="text"
                name="apiTokenInstance"
                placeholder="apiTokenInstance"
                className="input input-md mb-5 w-full"
                required
              />
            </label>
            <button className="btn" type="submit">
              Отправить
            </button>
            <p className="text-center mt-4 text-xs">
              Для корректной работы приложения, пожалуйста, установите инстансу
              возможность получать уведомления в своём личном кабинете Green Api
            </p>
          </form>
        </div>
      </div>
    </dialog>
  );
}
