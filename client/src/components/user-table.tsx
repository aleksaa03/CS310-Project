import { useEffect, useState } from "react";
import { UserRole } from "../common/enums";
import Modal from "../shared/modal";
import { addUser, deleteUser, editUser } from "../api/services/user-service";
import { toast } from "react-toastify";
import IUser from "../models/user";
import { LockClosedIcon } from "@heroicons/react/24/outline";
import { generateRandomPassword } from "../utils/general";
import { getPageButtons } from "../utils/pagination";

type UserTableProps = {
  users: IUser[];
  refetchUsers: () => Promise<void>;
  page: number;
  totalPages: number;
  onPageChange: (newPage: number) => void;
  sortExp: string;
  sortOrd: string;
  onSort: (column: string) => void;
  onPageSizeChange: (newPageSize: number) => void;
};

const UserTable = ({
  users,
  refetchUsers,
  page,
  totalPages,
  onPageChange,
  sortExp,
  sortOrd,
  onSort,
  onPageSizeChange,
}: UserTableProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
  const [generatedPassword, setGeneratedPassword] = useState("");

  useEffect(() => {
    if (isModalOpen) {
      window.addEventListener("keyup", handleKeyUp);
      return () => window.removeEventListener("keyup", handleKeyUp);
    }
  }, [isModalOpen]);

  const handleKeyUp = (e: KeyboardEvent) => {
    if (isModalOpen && e.key === "Escape") {
      handleClose();
    }
  };

  const handleAdd = () => {
    setIsModalOpen(true);
  };

  const handleEdit = (id: number) => {
    const user = users.find((x) => x.id === id);

    if (user) {
      setSelectedUser(user);
      setIsModalOpen(true);
    }
  };

  const handleDelete = async (id: number) => {
    const result = await deleteUser(id);

    if (result.success) {
      toast.success(result.message);
      await refetchUsers();
    } else {
      toast.error(result.message);
    }
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
    setGeneratedPassword("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const form = e.target as HTMLFormElement;
    const username = (form.elements.namedItem("username") as HTMLInputElement).value;
    const password = (form.elements.namedItem("password") as HTMLInputElement)?.value;
    const roleId = +(form.elements.namedItem("roleId") as HTMLSelectElement).value;

    let result;

    if (selectedUser) {
      result = await editUser(selectedUser.id, username, roleId);
    } else {
      result = await addUser(username, password, roleId);
    }

    if (result.success) {
      toast.success(result.message);
      await refetchUsers();
      handleClose();
    } else {
      toast.error(result.message);
    }
  };

  const generatePassword = () => {
    setGeneratedPassword(generateRandomPassword());
  };

  const pageButtons = getPageButtons(page, totalPages);

  const arrow = (col: string) => (sortExp === col ? (sortOrd === "ASC" ? " ▲" : " ▼") : "");

  return (
    <>
      <div className="max-w-5xl mx-auto p-6 bg-white rounded-2xl shadow-xl mt-10">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-bold">Users</h1>
          <button
            onClick={handleAdd}
            className="p-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-md cursor-pointer"
          >
            Add user
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left" onClick={() => onSort("id")}>
                  ID{arrow("id")}
                </th>
                <th className="px-4 py-2 text-left" onClick={() => onSort("username")}>
                  Username{arrow("username")}
                </th>
                <th className="px-4 py-2 text-left" onClick={() => onSort("roleId")}>
                  Role ID{arrow("roleId")}
                </th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map((user) => (
                  <tr key={user.id} className="border-b border-t">
                    <td className="px-4 py-2">{user.id}</td>
                    <td className="px-4 py-2">{user.username}</td>
                    <td className="px-4 py-2">{UserRole[user.roleId]}</td>
                    <td className="px-4 py-2 space-x-2 flex sm:flex-none">
                      <button
                        onClick={() => handleEdit(user.id)}
                        className="px-3 py-1 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-md cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="px-3 py-1 text-sm text-white bg-red-600 hover:bg-red-700 rounded-md cursor-pointer"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-4 py-2 text-center">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <div className="flex justify-between items-center mt-4">
            <div className="flex flex-col">
              <label>Range</label>
              <select
                className="cursor-pointer"
                name=""
                id=""
                defaultValue={10}
                onChange={(e) => onPageSizeChange(+e.target.value)}
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
            </div>
            <div className="space-x-2">
              {pageButtons.map((p, idx) =>
                typeof p === "number" ? (
                  <button
                    key={p}
                    onClick={() => onPageChange(p)}
                    className={`px-3 py-1 rounded cursor-pointer ${
                      p === page ? "bg-blue-500 text-white" : "bg-gray-200"
                    }`}
                  >
                    {p}
                  </button>
                ) : (
                  <span key={idx} className="px-2">
                    ...
                  </span>
                )
              )}
            </div>
          </div>
        </div>
      </div>
      <Modal isOpen={isModalOpen} onClose={handleClose}>
        <h2 className="text-xl font-bold mb-4">{!selectedUser ? "Add" : "Edit"} User</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            name="username"
            type="text"
            placeholder="Username"
            defaultValue={selectedUser?.username || ""}
            className="w-full p-2 border border-gray-300 rounded"
          />
          {!selectedUser && (
            <>
              <input
                name="password"
                type="password"
                placeholder="Password"
                className="w-full p-2 border border-gray-300 rounded"
              />
              <div className="flex jutify-between items-center space-x-2">
                <input
                  type="text"
                  placeholder="Generate password..."
                  value={generatedPassword}
                  className="flex-grow p-2 border border-gray-300 rounded bg-gray-100 text-gray-800 cursor-pointer select-all focus:outline-none"
                  style={{ caretColor: "transparent" }}
                  onClick={() => {
                    if (generatedPassword) {
                      navigator.clipboard.writeText(generatedPassword);
                      toast.success("Password copied to clipboard!");
                    }
                  }}
                  readOnly
                />
                <button
                  type="button"
                  onClick={generatePassword}
                  className="w-auto p-2 border border-gray-300 rounded cursor-pointer"
                >
                  <LockClosedIcon className="h-5 w-5" />
                </button>
              </div>
            </>
          )}
          <select
            name="roleId"
            defaultValue={selectedUser?.roleId ?? 0}
            className="w-full p-2 border border-gray-300 rounded"
          >
            <option value={UserRole.Client}>Client</option>
            <option value={UserRole.Admin}>Admin</option>
          </select>
          <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded cursor-pointer">
            Save
          </button>
        </form>
      </Modal>
    </>
  );
};

export default UserTable;
