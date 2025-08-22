import { useState, useEffect } from "react";
import { UserLogType, UserRole } from "../common/enums";
import IUserLog from "../models/user-log";
import Modal from "../shared/modal";
import { formatDateTime } from "../utils/date";
import { getPageButtons } from "../utils/pagination";

type UserLogTableProps = {
  userLogs: IUserLog[];
  page: number;
  totalPages: number;
  onPageChange: (newPage: number) => void;
  sortExp: string;
  sortOrd: string;
  onSort: (column: string) => void;
  onPageSizeChange: (newPageSize: number) => void;
};

const UserLogTable = ({
  userLogs,
  page,
  totalPages,
  onPageChange,
  sortExp,
  sortOrd,
  onSort,
  onPageSizeChange,
}: UserLogTableProps) => {
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

  const pageButtons = getPageButtons(page, totalPages);

  const arrow = (col: string) => (sortExp === col ? (sortOrd === "ASC" ? " ▲" : " ▼") : "");

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
                <th className="px-4 py-2 text-left cursor-pointer" onClick={() => onSort("id")}>
                  ID{arrow("id")}
                </th>
                <th className="px-4 py-2 text-left cursor-pointer" onClick={() => onSort("action")}>
                  Action{arrow("action")}
                </th>
                <th className="px-4 py-2 text-left cursor-pointer" onClick={() => onSort("description")}>
                  Description{arrow("description")}
                </th>
                <th className="px-4 py-2 text-left cursor-pointer" onClick={() => onSort("details")}>
                  Details{arrow("details")}
                </th>
                <th className="px-4 py-2 text-left cursor-pointer" onClick={() => onSort("eventTime")}>
                  Event time{arrow("eventTime")}
                </th>
                <th className="px-4 py-2 text-left cursor-pointer" onClick={() => onSort("username")}>
                  Username{arrow("username")}
                </th>
                <th className="px-4 py-2 text-left cursor-pointer" onClick={() => onSort("roleId")}>
                  Role{arrow("roleId")}
                </th>
              </tr>
            </thead>
            <tbody>
              {userLogs.length > 0 ? (
                userLogs.map((log) => (
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
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-4 py-2 text-center">
                    No user logs found.
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
        <h2 className="text-xl font-bold mb-4">User Log details</h2>
        <div className="space-y-4">
          <div>
            <label>ID</label>
            <input
              name="id"
              type="text"
              placeholder="ID"
              disabled
              readOnly
              defaultValue={selectedUserLog?.id || ""}
              className="w-full p-2 border border-gray-300 rounded bg-gray-100"
            />
          </div>
          <div>
            <label>Action</label>
            <input
              name="action"
              type="text"
              placeholder="Action"
              disabled
              readOnly
              defaultValue={selectedUserLog?.action ? UserLogType[selectedUserLog.action] : ""}
              className="w-full p-2 border border-gray-300 rounded bg-gray-100"
            />
          </div>
          <div>
            <label>Description</label>
            <textarea
              name="description"
              placeholder="Description"
              disabled
              readOnly
              defaultValue={selectedUserLog?.description || ""}
              className="h-24 w-full p-2 border border-gray-300 rounded bg-gray-100 resize-none"
            ></textarea>
          </div>
          <div>
            <label>Details</label>
            <textarea
              name="details"
              placeholder="Details"
              disabled
              readOnly
              className="h-24 w-full p-2 border border-gray-300 rounded bg-gray-100 resize-none"
              defaultValue={selectedUserLog?.details || ""}
            ></textarea>
          </div>
          <div>
            <label>Event Time</label>
            <input
              name="eventTime"
              type="text"
              placeholder="Event Time"
              disabled
              readOnly
              defaultValue={selectedUserLog?.eventTime ? formatDateTime(selectedUserLog.eventTime) : ""}
              className="w-full p-2 border border-gray-300 rounded bg-gray-100"
            />
          </div>
          <div>
            <label htmlFor="">Username</label>
            <input
              name="username"
              type="text"
              placeholder="Username"
              disabled
              readOnly
              defaultValue={selectedUserLog?.user.username || ""}
              className="w-full p-2 border border-gray-300 rounded bg-gray-100"
            />
          </div>
          <div>
            <label>Role</label>
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
        </div>
      </Modal>
    </>
  );
};

export default UserLogTable;
