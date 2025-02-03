import { useEffect, useState } from "react";
import AddChatModal from "./components/AddChatModal/AddChatModal";
import AuthModal from "./components/AuthModal/AuthModal";
import { sendMessage } from "./api/sendMessage";
import { receiveNotification } from "./api/receiveNotification";
import { deleteNotification } from "./api/deleteNotification";

function App() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(true);
  const [phones, setPhones] = useState<string[]>([]);
  const [activeChat, setActiveChat] = useState("");
  const [newMessage, setNewMessage] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [activeChatHistory, setActiveChatHistory] = useState<any[]>([]);
  const [isLoadingIncomingMessage, setIsLoadingIncomingMessage] =
    useState(false);

  const apiUrl = sessionStorage.getItem("apiUrl");
  const idInstance = sessionStorage.getItem("idInstance");
  const apiTokenInstance = sessionStorage.getItem("apiTokenInstance");

  const storedPhones = sessionStorage.getItem("chatPhones");

  useEffect(() => {
    if (storedPhones) {
      setPhones(JSON.parse(storedPhones));
    }
  }, [storedPhones]);

  useEffect(() => {
    const storedActiveChatHistory = sessionStorage.getItem(
      `${activeChat}_chat_history`,
    );
    if (storedActiveChatHistory) {
      setActiveChatHistory(JSON.parse(storedActiveChatHistory));
    } else {
      setActiveChatHistory([]);
    }
  }, [activeChat]);

  const addChatModalOpenClick = () => {
    const parsedPhones = storedPhones ? JSON.parse(storedPhones) : [];
    if (parsedPhones.length > 0) {
      alert(
        "В данной версии приложения можно создать только один активный чат.",
      );
      return;
    }

    const modal = document.getElementById(
      "addChatModal",
    ) as HTMLDialogElement | null;
    if (modal) {
      modal.showModal();
    }
  };

  const handleActiveChatChange = (phone: string) => {
    setActiveChat(phone);
    setNewMessage("");
  };

  const handleNewMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value.trim());
  };

  const handleMessageSend = async () => {
    if (!apiUrl || !idInstance || !apiTokenInstance) {
      setIsAuthModalOpen(true);
      return;
    }

    const result = await sendMessage({
      apiUrl,
      idInstance,
      apiTokenInstance,
      number: activeChat,
      message: newMessage,
    });

    if (result.success) {
      const updatedHistory = [
        ...activeChatHistory,
        { type: "outgoing", message: newMessage },
      ];
      setActiveChatHistory(updatedHistory);
      sessionStorage.setItem(
        `${activeChat}_chat_history`,
        JSON.stringify(updatedHistory),
      );
      setNewMessage("");
    } else {
      alert(result.error || "Не удалось отправить сообщение.");
    }
  };

  const handleMessageReceive = async () => {
    setIsLoadingIncomingMessage(true);

    if (!apiUrl || !idInstance || !apiTokenInstance) {
      setIsAuthModalOpen(true);
      return;
    }

    const result = await receiveNotification({
      apiUrl,
      idInstance,
      apiTokenInstance,
    });

    if (result.success) {
      const data = result.data;

      if (data === null) {
        alert("Нет входящих сообщений, попробуйте позже.");
        setIsLoadingIncomingMessage(false);
        return;
      }

      const receptId = result.data.receiptId;
      const messageType = result.data.body?.messageData?.typeMessage || null;

      if (messageType === "textMessage") {
        const updatedHistory = [
          ...activeChatHistory,
          {
            type: "incoming",
            message: result.data.body.messageData.textMessageData.textMessage,
          },
        ];
        setActiveChatHistory(updatedHistory);
        sessionStorage.setItem(
          `${activeChat}_chat_history`,
          JSON.stringify(updatedHistory),
        );

        await deleteNotification({
          apiUrl,
          idInstance,
          apiTokenInstance,
          receptId,
        });
      } else {
        await deleteNotification({
          apiUrl,
          idInstance,
          apiTokenInstance,
          receptId,
        });

        handleMessageReceive();
      }
    }
    setIsLoadingIncomingMessage(false);
  };

  const removeChatModal = document.getElementById(
    "remove_chat_modal",
  ) as HTMLDialogElement | null;

  const handleRemoveChat = (chatToRemove: string) => {
    const updatedPhones = phones.filter((p) => p !== chatToRemove);
    setPhones(updatedPhones);
    sessionStorage.setItem("chatPhones", JSON.stringify(updatedPhones));
    sessionStorage.removeItem(`${chatToRemove}_chat_history`);
    removeChatModal?.close();
    setActiveChat("");
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="drawer md:drawer-open">
        <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content bg-neutral">
          {activeChat && (
            <div className="flex flex-col justify-between h-full">
              <div className="bg-base-200 p-5">{activeChat}</div>
              <div className="mt-auto mb-0">
                {activeChatHistory &&
                  activeChatHistory.map((message) => {
                    return (
                      <div
                        key={message.message}
                        className={`chat ${
                          message.type === "outgoing"
                            ? "chat-end"
                            : "chat-start"
                        }`}
                      >
                        <div className="chat-bubble">{message.message}</div>
                      </div>
                    );
                  })}
              </div>
              <div className="p-5">
                <label className="input w-full">
                  <input
                    type="text"
                    placeholder="Введите сообщение"
                    className="grow w-full input-lg"
                    value={newMessage}
                    onChange={handleNewMessageChange}
                  />
                  {newMessage.trim() && (
                    <span
                      onClick={handleMessageSend}
                      className="badge badge-neutral badge-md cursor-pointer"
                    >
                      Отправить
                    </span>
                  )}
                </label>
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
            <li className="mb-3">
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
                    onClick={() => handleActiveChatChange(phone)}
                    className="list-row bg-base-100 mb-1"
                    key={phone}
                  >
                    <div
                      className={
                        activeChat === phone ? "bg-success-content" : ""
                      }
                    >
                      <img className="size-10 rounded-box" src="/user.svg" />
                      <div>{phone}</div>
                      <button
                        className="btn btn-xs"
                        onClick={() => removeChatModal?.showModal()}
                      >
                        Удалить
                      </button>
                    </div>
                  </li>
                );
              })}
            {activeChat && (
              <li className="mt-auto mb-0">
                <button
                  onClick={handleMessageReceive}
                  type="button"
                  className="btn btn-neutral"
                >
                  {isLoadingIncomingMessage ? (
                    <span className="loading loading-spinner"></span>
                  ) : (
                    "Проверить входящие сообщения"
                  )}
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>
      <AuthModal
        apiUrl={apiUrl || undefined}
        idInstance={idInstance || undefined}
        apiTokenInstance={apiTokenInstance || undefined}
        isModalOpen={isAuthModalOpen}
        setIsModalOpen={setIsAuthModalOpen}
      />
      <AddChatModal phones={phones} setPhones={setPhones} />
      <dialog id="remove_chat_modal" className="modal">
        <div className="modal-box">
          <p className="py-4">
            Вы действительно хотите удалить чат и историю сообщений?
          </p>
          <div className="modal-action">
            <button
              onClick={() => handleRemoveChat(activeChat)}
              className="btn"
            >
              Удалить
            </button>
            <form method="dialog">
              <button className="btn">Отмена</button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
}

export default App;
