import { useEffect, useState } from "react";
import AddChatModal from "./components/AddChatModal/AddChatModal";
import AuthModal from "./components/AuthModal/AuthModal";

function App() {
  const [phones, setPhones] = useState<string[]>([]);
  const [activeChat, setActiveChat] = useState("");

  const apiUrl = sessionStorage.getItem("apiUrl");
  const idInstance = sessionStorage.getItem("idInstance");
  const apiTokenInstance = sessionStorage.getItem("apiTokenInstance");

  useEffect(() => {
    const storedPhones = sessionStorage.getItem("chatPhones");
    if (storedPhones) {
      setPhones(JSON.parse(storedPhones));
    }
  }, []);

  const addChatModalOpenClick = () => {
    const modal = document.getElementById(
      "addChatModal",
    ) as HTMLDialogElement | null;
    if (modal) {
      modal.showModal();
    }
  };

  // const handleRemovePhone = (phoneToRemove: string) => {
  //   const updatedPhones = phones.filter((p) => p !== phoneToRemove);
  //   setPhones(updatedPhones);
  //   sessionStorage.setItem("chatPhones", JSON.stringify(updatedPhones));
  // };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="drawer md:drawer-open">
        <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content bg-base-300">
          {activeChat && (
            <div className="flex flex-col justify-between h-full">
              <div className="bg-neutral p-5 text-right">{activeChat}</div>
              <div></div>
              <div className="p-5">
                <input
                  type="text"
                  placeholder="Введите сообщение"
                  className="input w-full"
                />
              </div>
            </div>
          )}
          <label
            htmlFor="my-drawer-2"
            className="btn btn-primary drawer-button md:hidden"
          >
            Open chats
          </label>
        </div>
        <div className="drawer-side">
          <label
            htmlFor="my-drawer-2"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>
          <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4">
            <li className="mb-2">
              <button
                onClick={addChatModalOpenClick}
                type="button"
                className="btn btn-neutral"
              >
                Создать новый чат
              </button>
            </li>
            {phones &&
              phones.length > 0 &&
              phones.map((phone: string) => {
                return (
                  <li
                    onClick={() => setActiveChat(phone)}
                    className="list-row bg-base-100 mt-1"
                  >
                    <div
                      className={
                        activeChat === phone ? "bg-success-content" : ""
                      }
                    >
                      <img className="size-10 rounded-box" src="/user.svg" />
                      <div>{phone}</div>
                    </div>
                  </li>
                );
              })}
          </ul>
        </div>
      </div>
      <AuthModal
        apiUrl={apiUrl || undefined}
        idInstance={idInstance || undefined}
        apiTokenInstance={apiTokenInstance || undefined}
      />
      <AddChatModal phones={phones} setPhones={setPhones} />
    </div>
  );
}

export default App;
