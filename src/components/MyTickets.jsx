import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

function MyTickets() {
  const [tickets, setTickets] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [ticketLogs, setTicketLogs] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  const fetchMyTickets = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:3000/api/tickets", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      if (response.ok) {
        setTickets(data.tickets || []);
      }
    } catch (error) {
      console.error("ติดต่อเซิร์ฟเวอร์ไม่ได้:", error);
    }
  };

  const fetchTicketDetails = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:3000/api/tickets/${id}`, {
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
    fetchMyTickets();
  }, []);

  const handleReply = async () => {
    if (commentText.trim() === "") return;
    setIsSaving(true);

    try {
      const token = localStorage.getItem("token");
      const ticketId = selectedTicket.id;

      const response = await fetch(
        `http://localhost:3000/api/tickets/${ticketId}/comments`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ message: commentText }),
        },
      );

      if (response.ok) {
        toast.success("ส่งข้อความสำเร็จ");
        setCommentText("");
        fetchTicketDetails(ticketId);
      } else {
        toast.error("ไม่สามารถส่งข้อความได้");
      }
    } catch (error) {
      console.error("เกิดข้อผิดพลาด:", error);
      toast.error("ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <Toaster position="top-right" />
      <div className="max-w-5xl mx-auto">
        <h1 className="mb-8 text-3xl font-bold text-gray-800">
          ประวัติการแจ้งซ่อมของฉัน
        </h1>

        <div className="overflow-hidden bg-white border border-gray-200 rounded-xl shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100 border-b border-gray-200">
                <th className="p-4 font-semibold text-gray-600">รหัส</th>
                <th className="p-4 font-semibold text-gray-600">หัวข้อปัญหา</th>
                <th className="p-4 font-semibold text-gray-600">สถานะ</th>
                <th className="p-4 font-semibold text-gray-600 text-center">
                  จัดการ
                </th>
              </tr>
            </thead>
            <tbody>
              {tickets.length > 0 ? (
                tickets.map((ticket) => (
                  <tr
                    key={ticket.id}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="p-4 font-medium text-gray-800">
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
                    <td className="p-4 text-center">
                      <button
                        onClick={() => {
                          setSelectedTicket(ticket);
                          setIsModalOpen(true);
                          fetchTicketDetails(ticket.id);
                        }}
                        className="px-3 py-1 text-sm font-medium text-blue-600 bg-blue-100 rounded hover:bg-blue-200"
                      >
                        ดู/ตอบกลับ
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="p-8 text-center text-gray-500">
                    คุณยังไม่มีการแจ้งซ่อม
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {isModalOpen && selectedTicket && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
            <div className="w-full max-w-lg p-6 bg-white rounded-xl shadow-2xl">
              <h2 className="mb-4 text-2xl font-bold text-gray-800">
                ใบแจ้งซ่อม {selectedTicket.ticket_no}
              </h2>

              <div className="p-4 mb-4 space-y-2 bg-gray-50 rounded-lg text-gray-700 border border-gray-200">
                <p>
                  <span className="font-semibold text-gray-900">หัวข้อ:</span>{" "}
                  {selectedTicket.title}
                </p>
                <p>
                  <span className="font-semibold text-gray-900">
                    รายละเอียด:
                  </span>{" "}
                  {selectedTicket.description}
                </p>
                <p>
                  <span className="font-semibold text-gray-900">สถานะ:</span>{" "}
                  {selectedTicket.status}
                </p>
              </div>

              <div className="mb-4">
                <h3 className="mb-2 text-md font-bold text-gray-800">
                  ประวัติการพูดคุย
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
                            {log.employee_id}
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
                      ยังไม่มีการตอบกลับ
                    </p>
                  )}
                </div>
              </div>

              <div className="mb-4">
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  rows="2"
                  placeholder="พิมพ์ข้อความตอบกลับช่างไอทีที่นี่..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                ></textarea>
                <button
                  onClick={handleReply}
                  disabled={isSaving || commentText.trim() === ""}
                  className={`mt-2 w-full px-4 py-2 font-medium text-white rounded-lg transition-colors 
                    ${isSaving || commentText.trim() === "" ? "bg-gray-400 cursor-not-allowed" : "bg-green-500 hover:bg-green-600"}`}
                >
                  {isSaving ? "กำลังส่ง..." : "ส่งข้อความ"}
                </button>
              </div>

              <div className="flex justify-end">
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

export default MyTickets;
