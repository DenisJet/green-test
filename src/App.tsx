import AddChatModal from "./components/AddChatModal/AddChatModal";
import AuthModal from "./components/AuthModal/AuthModal";

function App() {
  const apiUrl = sessionStorage.getItem("apiUrl");
  const idInstance = sessionStorage.getItem("idInstance");
  const apiTokenInstance = sessionStorage.getItem("apiTokenInstance");

  const addChatModalOpenClick = () => {
    const modal = document.getElementById(
      "addChatModal",
    ) as HTMLDialogElement | null;
    if (modal) {
      modal.showModal();
    }
  };

  return (
    <div className="">
      <div className="drawer md:drawer-open">
        <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content flex flex-col items-center justify-center">
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
            <li>
              <button
                onClick={addChatModalOpenClick}
                type="button"
                className="btn btn-neutral"
              >
                Создать новый чат
              </button>
            </li>
            <li>
              <a>Chat 1</a>
            </li>
            <li>
              <a>Chat 2</a>
            </li>
          </ul>
        </div>
      </div>
      <AuthModal
        apiUrl={apiUrl || undefined}
        idInstance={idInstance || undefined}
        apiTokenInstance={apiTokenInstance || undefined}
      />
      <AddChatModal />
    </div>
  );
}

export default App;
