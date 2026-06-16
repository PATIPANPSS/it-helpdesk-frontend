import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("https://it-helpdesk-backend-845i.onrender.com/api/users", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      if (response.ok) {
        setUsers(data.users);
      } else {
        toast.error(data.message || "ดึงข้อมูลผู้ใช้งานไม่สำเร็จ");
      }
    } catch (error) {
      console.error("ติดต่อเซิร์ฟเวอร์ไม่ได้:", error);
      toast.error("ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `https://it-helpdesk-backend-845i.onrender.com/api/users/${userId}/role`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ role: newRole }),
        },
      );

      if (response.ok) {
        toast.success("อัปเดตสิทธิ์การใช้งานสำเร็จ");
        fetchUsers();
      } else {
        const data = await response.json();
        toast.error(data.message || "ไม่สามารถเปลี่ยนได้");
      }
    } catch (error) {
      console.error("เกิดข้อผิดพลาด:", error);
      toast.error("เซิร์ฟเวอร์มีปัญหา");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <Toaster position="top-right" />
      <div className="max-w-5xl mx-auto">
        <h1 className="mb-8 text-3xl font-bold text-gray-800">
          จัดการผู้ใช้งานระบบ (Admin Mode)
        </h1>

        <div className="overflow-hidden bg-white border border-gray-200 rounded-xl shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100 border-b border-gray-200">
                <th className="p-4 font-semibold text-gray-600">รหัสพนักงาน</th>
                <th className="p-4 font-semibold text-gray-600">วันที่สมัคร</th>
                <th className="p-4 font-semibold text-gray-600">สถานะ</th>
                <th className="p-4 font-semibold text-gray-600 text-center">
                  เปลี่ยนสิทธิ์การใช้งาน
                </th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="p-4 font-medium text-gray-800">
                      {user.employee_id}
                    </td>
                    <td className="p-4 text-gray-600">
                      {new Date(user.created_at).toLocaleDateString("th-TH")}
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 text-sm font-semibold rounded-full 
                        ${
                          user.role === "admin"
                            ? "bg-purple-100 text-purple-700"
                            : user.role === "it_support"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <select
                        disabled={isLoading}
                        value={user.role}
                        onChange={(e) =>
                          handleRoleChange(user.id, e.target.value)
                        }
                        className="p-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                      >
                        <option value="user">พนักงานทั่วไป (user)</option>
                        <option value="it_support">
                          ช่างไอที (it_support)
                        </option>
                        <option value="admin">ผู้ดูแลระบบ (admin)</option>
                      </select>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="p-8 text-center text-gray-500">
                    กำลังโหลดข้อมูลผู้ใช้งาน...
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminUsers;
