import { useState } from "react";

type AddChatModalProps = {
  phones: string[];
  setPhones: (phones: string[]) => void;
};

export default function AddChatModal({ phones, setPhones }: AddChatModalProps) {
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");

  const modal = document.getElementById(
    "addChatModal",
  ) as HTMLDialogElement | null;

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(e.target.value);
  };

  const handleClose = () => {
    if (modal) {
      modal.close();
      setPhone("");
      setError("");
    }
  };

  const handleOkClick = () => {
    setError("");
    const isValid = /^7\d{10}$/.test(phone);

    if (isValid) {
      const updatedPhones = [...phones, phone];
      setPhones(updatedPhones);
      sessionStorage.setItem("chatPhones", JSON.stringify(updatedPhones));

      if (modal) {
        modal.close();
        setPhone("");
      }
    } else {
      setError("Телефон должен состоять из 11 цифр и начинаться с цифры 7");
    }
  };

  return (
    <dialog id="addChatModal" className="modal">
      <div className="modal-box flex flex-col">
        <form method="dialog">
          <button
            onClick={handleClose}
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          >
            ✕
          </button>
        </form>
        <h3 className="font-bold text-lg mb-4 text-center">
          Введите номер телефона
        </h3>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        <label className="floating-label w-full">
          <span>Номер телефона без знаков, в формате 7xxxxxxxxxx</span>
          <input
            type="text"
            placeholder="Номер телефона без знаков"
            className="input input-md w-full"
            value={phone}
            onChange={handlePhoneChange}
          />
        </label>
        <button className="btn mt-5 mx-auto" onClick={handleOkClick}>
          Ok
        </button>
      </div>
    </dialog>
  );
}
