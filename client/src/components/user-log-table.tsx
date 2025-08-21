import { useState, useEffect } from "react";
import { UserLogType, UserRole } from "../common/enums";
import IUserLog from "../models/user-log";
import Modal from "../shared/modal";
import { formatDateTime } from "../utils/date";

const UserLogTable = ({ userLogs }: { userLogs: IUserLog[] }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUserLog, setSelectedUserLog] = useState<IUserLog | null>(null);

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

  const handleDetails = (id: number) => {
    const userLog = userLogs.find((x) => x.id === id);

    if (userLog) {
      setSelectedUserLog(userLog);
      setIsModalOpen(true);
    }
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setSelectedUserLog(null);
  };

  return (
    <>
      <div className="max-w-5xl mx-auto p-6 bg-white rounded-2xl shadow-xl mt-10">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-bold">User Logs</h1>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left">ID</th>
                <th className="px-4 py-2 text-left">Action</th>
                <th className="px-4 py-2 text-left">Description</th>
                <th className="px-4 py-2 text-left">Details</th>
                <th className="px-4 py-2 text-left">Event time</th>
                <th className="px-4 py-2 text-left">Username</th>
                <th className="px-4 py-2 text-left">Role</th>
              </tr>
            </thead>
            <tbody>
              {userLogs.map((log) => (
                <tr key={log.id} className="border-b border-t">
                  <td className="px-4 py-2">{log.id}</td>
                  <td className="px-4 py-2">{UserLogType[log.action]}</td>
                  <td className="px-4 py-2">
                    <abbr className="no-underline" title={log.description}>
                      {log.description.length > 50 ? log.description.slice(0, 50) + "..." : log.description}
                    </abbr>
                  </td>
                  <td className="px-4 py-2">
                    <abbr className="no-underline" title={log.details}>
                      {log.details.length > 50 ? log.details.slice(0, 50) + "..." : log.details}
                    </abbr>
                  </td>
                  <td className="px-4 py-2">{formatDateTime(log.eventTime)}</td>
                  <td className="px-4 py-2">{log.user.username}</td>
                  <td className="px-4 py-2">{UserRole[log.user.roleId]}</td>
                  <td className="px-4 py-2 space-x-2 flex sm:flex-none">
                    <button
                      onClick={() => handleDetails(log.id)}
                      className="px-3 py-1 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-md cursor-pointer"
                    >
                      Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Modal isOpen={isModalOpen} onClose={handleClose}>
        <h2 className="text-xl font-bold mb-4">User Log details</h2>
        <div className="space-y-4">
          <input
            name="id"
            type="text"
            placeholder="ID"
            disabled
            readOnly
            defaultValue={selectedUserLog?.id || ""}
            className="w-full p-2 border border-gray-300 rounded bg-gray-100"
          />
          <input
            name="action"
            type="text"
            placeholder="Action"
            disabled
            readOnly
            defaultValue={selectedUserLog?.action ? UserLogType[selectedUserLog.action] : ""}
            className="w-full p-2 border border-gray-300 rounded bg-gray-100"
          />
          <textarea
            name="description"
            placeholder="Description"
            disabled
            readOnly
            defaultValue={selectedUserLog?.description || ""}
            className="h-24 w-full p-2 border border-gray-300 rounded bg-gray-100 resize-none"
          ></textarea>
          <textarea
            name="details"
            placeholder="Details"
            disabled
            readOnly
            className="h-24 w-full p-2 border border-gray-300 rounded bg-gray-100 resize-none"
            defaultValue={selectedUserLog?.details || ""}
          ></textarea>
          <input
            name="eventTime"
            type="text"
            placeholder="Event Time"
            disabled
            readOnly
            defaultValue={selectedUserLog?.eventTime ? formatDateTime(selectedUserLog.eventTime) : ""}
            className="w-full p-2 border border-gray-300 rounded bg-gray-100"
          />
          <input
            name="username"
            type="text"
            placeholder="Username"
            disabled
            readOnly
            defaultValue={selectedUserLog?.user.username || ""}
            className="w-full p-2 border border-gray-300 rounded bg-gray-100"
          />
          <input
            name="roleId"
            type="text"
            placeholder="Role ID"
            disabled
            readOnly
            defaultValue={selectedUserLog?.user.roleId ? UserRole[selectedUserLog.user.roleId] : ""}
            className="w-full p-2 border border-gray-300 rounded bg-gray-100"
          />
        </div>
      </Modal>
    </>
  );
};

export default UserLogTable;
