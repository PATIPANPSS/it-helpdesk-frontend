import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

function Dashboard() {
  const [tickets, setTickets] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [ticketStatus, setTicketStatus] = useState("");
  const [commentText, setCommentText] = useState("");
  const [ticketLogs, setTicketLogs] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");
  const [page, setPage] = useState(1);
  const limit = 10;

  const fetchTickets = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `https://it-helpdesk-backend-845i.onrender.com/api/tickets?page=${page}&limit=${limit}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (response.ok) {
        const data = await response.json();
        setTickets(data.tickets);
      }
    } catch (error) {
      console.error("ติดต่อเซิร์ฟเวอร์หลังบ้านไม่ได้:", error);
    }
  };

  const fetchTicketDetails = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`https://it-helpdesk-backend-845i.onrender.com/api/tickets/${id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (response.ok) {
        setTicketLogs(data.logs);
      }
    } catch (error) {
      console.error("ดึงประวัติคอมเมนต์ไม่สำเร็จ:", error);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [page]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const token = localStorage.getItem("token");
      const ticketId = selectedTicket.id;

      const statusResponse = await fetch(
        `https://it-helpdesk-backend-845i.onrender.com/api/tickets/${ticketId}/status`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: ticketStatus,
          }),
        },
      );

      if (commentText.trim() !== "") {
        const commentResponse = await fetch(
          `https://it-helpdesk-backend-845i.onrender.com/api/tickets/${ticketId}/comments`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              message: commentText,
            }),
          },
        );
      }

      if (statusResponse.ok) {
        toast.success("บันทึกข้อมูลและเพิ่มคอมเมนต์สำเร็จ!!!");
        setIsModalOpen(false);
        fetchTickets();
      } else {
        const data = await statusResponse.json();
        toast.error(
          `เกิดข้อผิดพลาด: ${data.message || "ไม่สามารถอัปเดตสถานะได้"}`,
        );
      }
    } catch (error) {
      console.error("ติดต่อเซิร์ฟเวอร์หลังบ้านไม่ได้:", error);
      toast.error("ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้");
    } finally {
      setIsSaving(false);
    }
  };

  const filteredTickets = tickets.filter((ticket) => {
    if (filterStatus === "all") {
      return true;
    }
    return ticket.status === filterStatus;
  });

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <Toaster position="top-right" reverseOrder={false} />
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            รายการแจ้งซ่อม (IT Helpdesk)
          </h1>
        </div>

        <div className="mb-4">
          <label className="mr-2 font-semibold text-gray-700">กรองสถานะ:</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">ดูทั้งหมด</option>
            <option value="pending">รอดำเนินการ (Pending)</option>
            <option value="in_progress">กำลังแก้ไข (In progress)</option>
            <option value="resolved">เสร็จสิ้น (Resolved)</option>
          </select>
        </div>

        <div className="overflow-hidden bg-white border border-gray-200 rounded-xl shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100 border-b border-gray-200">
                <th className="p-4 font-semibold text-gray-600">รหัส</th>
                <th className="p-4 font-semibold text-gray-600">หัวข้อปัญหา</th>
                <th className="p-4 font-semibold text-gray-600">สถานะ</th>
                <th className="p-4 font-semibold text-gray-600">ผู้แจ้ง</th>
                <th className="p-4 font-semibold text-gray-600 text-center">
                  จัดการ
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredTickets.length > 0 ? (
                filteredTickets.map((ticket) => (
                  <tr
                    key={ticket.id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="p-4 font-medium text-gray-800 max-w-30 truncate">
                      {ticket.ticket_no}
                    </td>
                    <td className="p-4 text-gray-600">{ticket.title}</td>
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 text-sm font-semibold rounded-full 
                        ${
                          ticket.status === "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : ticket.status === "in_progress"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-green-100 text-green-700"
                        }`}
                      >
                        {ticket.status}
                      </span>
                    </td>
                    <td className="p-4 text-gray-600">
                      พนักงาน {ticket.employee_id}
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => {
                          setSelectedTicket(ticket);
                          setIsModalOpen(true);
                          setTicketStatus(ticket.status);
                          setCommentText("");
                          fetchTicketDetails(ticket.id);
                        }}
                        className="px-3 py-1 text-sm font-medium text-white bg-blue-500 rounded hover:bg-blue-600 transition-colors"
                      >
                        ดูรายละเอียด
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-gray-500">
                    ยังไม่มีรายการแจ้งซ่อมในระบบ
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="flex items-center justify-between px-4 py-3 mt-4 bg-white border border-gray-200 rounded-lg sm:px-6">
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  แสดงข้อมูลหน้า{" "}
                  <span className="font-medium text-blue-600">{page}</span>
                </p>
              </div>
              <div>
                <nav
                  className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                  aria-label="Pagination"
                >
                  <button
                    onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                    disabled={page === 1}
                    className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-l-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    ก่อนหน้า
                  </button>

                  <button
                    onClick={() => setPage((prev) => prev + 1)}
                    disabled={tickets.length < limit}
                    className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-r-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    ถัดไป
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
        {isModalOpen && selectedTicket && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/50">
            <div className="w-full max-w-lg p-6 bg-white rounded-xl shadow-2xl">
              <h2 className="mb-4 text-2xl font-bold text-gray-800">
                รายละเอียดใบแจ้งซ่อม {selectedTicket.ticket_no}
              </h2>

              <div className="p-4 mb-6 space-y-3 bg-gray-50 rounded-lg text-gray-700 border border-gray-200">
                <p>
                  <span className="font-semibold text-gray-900">
                    หัวข้อปัญหา:
                  </span>
                  {selectedTicket.title}
                </p>
                <p>
                  <span className="font-semibold text-gray-900">
                    รายละเอียด:
                  </span>
                  {selectedTicket.description}
                </p>
                <p>
                  <span className="font-semibold text-gray-900">สถานะ:</span>
                  {selectedTicket.status}
                </p>
                <p>
                  <span className="font-semibold text-gray-900">ผู้แจ้ง:</span>
                  พนักงาน {selectedTicket.employee_id}
                </p>
              </div>

              <div className="mb-6 space-y-4">
                <div>
                  <label className="block mb-1 text-sm font-semibold text-gray-700">
                    อัปเดตสถานะการซ่อม:
                  </label>
                  <select
                    value={ticketStatus}
                    onChange={(e) => setTicketStatus(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="pending">รอดำเนินการ (Pending)</option>
                    <option value="in_progress">
                      กำลังแก้ไข (In progress)
                    </option>
                    <option value="resolved">เสร็จสิ้น (Resolved)</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-1 text-sm font-semibold text-gray-700">
                    คอมเมนต์ / บันทึกการทำงาน:
                  </label>
                  <textarea
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    rows="3"
                    placeholder="เช่น แจ้งรีสตาร์ทเซิร์ฟเวอร์เรียบร้อยแล้ว..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  ></textarea>
                </div>

                <div className="mb-6">
                  <h3 className="mb-2 text-md font-bold text-gray-800">
                    ประวัติการทำงาน / คอมเมนต์
                  </h3>

                  <div className="max-h-48 p-3 space-y-3 overflow-y-auto bg-gray-100 border border-gray-200 rounded-lg">
                    {ticketLogs.length > 0 ? (
                      ticketLogs.map((log) => (
                        <div
                          key={log.id}
                          className="p-3 bg-white rounded shadow-sm border border-gray-200"
                        >
                          <div className="flex justify-between mb-1 text-xs text-gray-500">
                            <span className="font-semibold text-blue-600">
                              ช่าง/พนักงาน: {log.employee_id}
                            </span>
                            <span>
                              {new Date(log.created_at).toLocaleString("th-TH")}
                            </span>
                          </div>
                          <p className="text-sm text-gray-800">{log.message}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-center text-gray-500">
                        ยังไม่มีประวัติการพูดคุย
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className={`px-4 py-2 font-medium text-white  rounded-lg  transition-colors ${isSaving ? "bg-gray-400 cursor-not-allowed" : "bg-green-500 hover:bg-green-600"}`}
                >
                  {isSaving ? "กำลังบันทึก..." : "บันทึกข้อมูล"}
                </button>

                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  ปิดหน้าต่าง
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
