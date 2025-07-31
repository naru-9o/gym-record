import AddMemberForm from "./components/AddMemberForm";
import MemberTable from "./components/MemberTable";
import { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


function App() {
  const [refresh, setRefresh] = useState(false);

  const reloadData = () => setRefresh(!refresh);

  // 📤 Send reminders with toast
  const sendReminders = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/send-reminders`);
      toast.success("✅ Reminders sent successfully!");
    } catch (err) {
      toast.error("❌ Failed to send reminders");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-black dark:text-white p-6">
      {/* ✅ Toast container for notifications */}
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />

      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">🏋️ Gym Member Fee Tracker</h1>
        <div className="flex gap-4">
          <button
            onClick={sendReminders}
            className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
          >
            Send Reminders
          </button>
        </div>
      </div>

      {/* Components */}
      <AddMemberForm onMemberAdded={reloadData} />
      <MemberTable key={refresh} />
    </div>
  );
}

export default App;
