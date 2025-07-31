import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const AddMemberForm = ({ onMemberAdded }) => {
  const [formData, setFormData] = useState({
    memberId: "",
    name: "",
    phone: "",
    email: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/members`, formData);
      toast.success("✅ Member added successfully!");
      setFormData({ memberId: "", name: "", phone: "", email: "" });
      onMemberAdded(); // refresh list
    } catch (err) {
      toast.error("❌ Error adding member");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white dark:bg-gray-800 dark:text-white p-4 rounded shadow mb-6"
    >
      <h2 className="text-xl font-semibold mb-4">➕ Add New Member</h2>
      <div className="flex gap-4 mb-2 flex-col md:flex-row">
        <input
          type="text"
          name="memberId"
          placeholder="Member ID"
          value={formData.memberId}
          onChange={handleChange}
          className="border p-2 w-full rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          required
        />
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          className="border p-2 w-full rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          required
        />
        <input
          type="text"
          name="phone"
          placeholder="Phone"
          value={formData.phone}
          onChange={handleChange}
          className="border p-2 w-full rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="border p-2 w-full rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          required
        />
      </div>
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Add Member
      </button>
    </form>
  );
};

export default AddMemberForm;
