import { FormEvent, useState } from "react";
import { sendMessage } from "../../api/sendMessage";

export default function AddChatModal({
  apiUrl,
  idInstance,
  apiTokenInstance,
}: {
  apiUrl: string;
  idInstance: string;
  apiTokenInstance: string;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false); // Состояние для индикатора загрузки
  const [isSuccess, setIsSuccess] = useState(false); // Состояние для успешной отправки

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setIsSuccess(false);

    const target = e.target as HTMLFormElement & {
      number: { value: string };
      message: { value: string };
    };

    const { number, message } = target;

    const result = await sendMessage({
      apiUrl,
      idInstance,
      apiTokenInstance,
      number: number.value,
      message: message.value,
    });

    setIsLoading(false);

    if (result.success) {
      setIsSuccess(true);
      target.reset();
    } else {
      setError(result.error || "Неизвестная ошибка");
    }
  };

  return (
    <dialog
      id="addChatModal"
      className={`modal ${isModalOpen ? "modal-open" : ""}`}
    >
      <div className="modal-box">
        <form method="dialog">
          <button
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            onClick={() => setIsModalOpen(false)}
          >
            ✕
          </button>
        </form>
        <h3 className="font-bold text-lg mb-4 text-center">
          Введите номер телефона и сообщение
        </h3>
        {error && (
          <div className="alert alert-error mb-4">
            <span>{error}</span>
          </div>
        )}
        {isSuccess && (
          <div className="alert alert-success mb-4">
            <span>Сообщение успешно отправлено!</span>
          </div>
        )}
        <form onSubmit={submit} className="flex flex-col items-center w-full">
          <label className="form-control w-full">
            <span className="label-text">Номер телефона</span>
            <input
              type="text"
              name="number"
              placeholder="Введите номер"
              className="input input-bordered w-full"
              required
            />
          </label>

          <label className="form-control w-full mt-4">
            <span className="label-text">Сообщение</span>
            <textarea
              name="message"
              className="textarea textarea-bordered h-24 w-full"
              placeholder="Напишите сообщение..."
              required
            ></textarea>
          </label>
          <button
            className={`btn mt-5 ${isLoading ? "loading" : ""}`}
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Отправка..." : "Отправить"}
          </button>
        </form>
      </div>
    </dialog>
  );
}
