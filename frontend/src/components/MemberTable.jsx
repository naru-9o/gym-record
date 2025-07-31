import { useEffect, useState } from "react";
import axios from "axios";
import { unparse } from "papaparse"; // ✅ CSV exporter
import { toast } from "react-toastify";

const MemberTable = () => {
  const [members, setMembers] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({
    memberId: "",
    name: "",
    phone: "",
    email: ""
  });

  const fetchMembers = async () => {
    const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/members`);
    setMembers(res.data);
  };

  const startEdit = (member) => {
    setEditId(member._id);
    setEditForm({
      memberId: member.memberId,
      name: member.name,
      phone: member.phone,
      email: member.email
    });
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditForm({ memberId: "", name: "", phone: "", email: "" });
  };

  const saveEdit = async () => {
    try {
      await axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/members/${editId}`, editForm);
      toast.success("Member details updated!");
      cancelEdit();
      fetchMembers();
    } catch (err) {
      toast.error("Failed to update member");
    }
  };

    const handleDelete = (id) => {
    toast.info(
        <div>
        <p className="font-semibold">Delete this member?</p>
        <div className="flex gap-3 mt-2">
            <button
            className="bg-red-600 text-white px-2 py-1 rounded text-xs"
            onClick={async () => {
                await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/members/${id}`);
                toast.dismiss();
                toast.success("✅ Member deleted successfully!");
                fetchMembers();
            }}
            >
            Yes, Delete
            </button>
            <button
            className="bg-gray-500 text-white px-2 py-1 rounded text-xs"
            onClick={() => toast.dismiss()}
            >
            Cancel
            </button>
        </div>
        </div>,
        { autoClose: false, position: "top-center" }
    );
    };


  const markPaid = async (memberId, month) => {
    try {
      await axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/members/${memberId}/payment`, {
        month,
        toggle: true
      });
      toast.info(`💰 Payment updated for ${month}`);
      fetchMembers();
    } catch (err) {
      toast.error("❌ Failed to update payment");
    }
  };

  const exportCSV = () => {
    const csvData = members.map((m) => {
      const row = {
        ID: m.memberId,
        Name: m.name,
        Phone: m.phone,
        Email: m.email
      };
      m.payments.forEach((p) => {
        row[p.month] = p.paid ? "Paid" : "Unpaid";
      });
      return row;
    });

    const csv = unparse(csvData);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "gym-members-report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("📤 CSV exported successfully!");
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  return (
    <div className="overflow-auto max-h-[600px] bg-white dark:bg-gray-800 p-4 rounded shadow">
      {/* Export button */}
      <div className="flex justify-end mb-4">
        <button
          onClick={exportCSV}
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
        >
          Export as CSV
        </button>
      </div>

      <table className="min-w-full border text-sm text-left">
        <thead className="bg-gray-200 dark:bg-gray-700 sticky top-0 z-10">
          <tr>
            <th className="p-2 border">ID</th>
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Phone</th>
            <th className="p-2 border">Email</th>
            {[
              "Jan", "Feb", "Mar", "Apr", "May", "Jun",
              "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
            ].map((m) => (
              <th key={m} className="p-2 border">{m}</th>
            ))}
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {members.map((member) => (
            <tr key={member._id} className="border">
              {editId === member._id ? (
                <>
                  <td className="p-2 border">
                    <input
                      type="text"
                      value={editForm.memberId}
                      onChange={(e) =>
                        setEditForm({ ...editForm, memberId: e.target.value })
                      }
                      className="border p-1 rounded w-full"
                    />
                  </td>
                  <td className="p-2 border">
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) =>
                        setEditForm({ ...editForm, name: e.target.value })
                      }
                      className="border p-1 rounded w-full"
                    />
                  </td>
                  <td className="p-2 border">
                    <input
                      type="text"
                      value={editForm.phone}
                      onChange={(e) =>
                        setEditForm({ ...editForm, phone: e.target.value })
                      }
                      className="border p-1 rounded w-full"
                    />
                  </td>
                  <td className="p-2 border">
                    <input
                      type="email"
                      value={editForm.email}
                      onChange={(e) =>
                        setEditForm({ ...editForm, email: e.target.value })
                      }
                      className="border p-1 rounded w-full"
                    />
                  </td>
                </>
              ) : (
                <>
                  <td className="p-2 border">{member.memberId}</td>
                  <td className="p-2 border">{member.name}</td>
                  <td className="p-2 border">{member.phone}</td>
                  <td className="p-2 border">{member.email}</td>
                </>
              )}

              {member.payments.map((payment) => (
                <td key={payment.month} className="p-1 border text-center">
                  <button
                    onClick={() => markPaid(member._id, payment.month)}
                    className={`px-2 py-1 rounded text-xs ${
                      payment.paid
                        ? "bg-green-600 hover:bg-green-700 text-white"
                        : "bg-red-500 hover:bg-red-600 text-white"
                    }`}
                  >
                    {payment.paid ? "✓ Paid" : "Pay"}
                  </button>
                </td>
              ))}

              <td className="p-1 border text-center whitespace-nowrap">
                {editId === member._id ? (
                  <>
                    <button
                      onClick={saveEdit}
                      className="bg-green-600 text-white px-2 py-1 rounded text-xs mr-1 hover:bg-green-700"
                    >
                      Save
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="bg-gray-500 text-white px-2 py-1 rounded text-xs hover:bg-gray-600"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => startEdit(member)}
                      className="bg-yellow-500 text-white px-2 py-1 rounded text-xs mr-1 hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(member._id)}
                      className="bg-red-600 text-white px-2 py-1 rounded text-xs hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MemberTable;
