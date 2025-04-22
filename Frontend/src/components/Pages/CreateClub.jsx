import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { MultiSelect } from "@mantine/core";
import axios from "axios";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

const CreateClub = () => {
  const [selectedMentors, setSelectedMentors] = useState([]);
  const [LeaderOptions, setLeaderOptions] = useState([]);
  const [mentorOptions, setMentorOptions] = useState([]);
  const [formdata, setFormData] = useState({
    name: "",
    description: "",
    leader: "",
    mentor: selectedMentors,
  });

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const res = await axios.get(`/users/getallteachers`);
        const users = res.data.data.users;
        const formatted = users.map((user) => ({
          value: user._id,
          label: `${user.fullName} (${user.username})`,
        }));

        setMentorOptions(formatted);
      } catch (err) {
        console.error("Error fetching teachers:", err);
      }
    };

    fetchTeachers();
  }, []);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await axios.get(`/users/getallstudents`);
        const users = res.data.data.users;
        const formatted = users.map((user) => ({
          value: user._id,
          label: `${user.fullName} (${user.username})`,
        }));
        setLeaderOptions(formatted);
      } catch (error) {
        console.log("Error fetching students:", error);
      }
    };
    fetchStudents();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = { ...formdata, mentor: selectedMentors }; 
      const res = await axios.post('/club/createclub', data);
      console.log('Club created successfully:', res.data);
    } catch (error) {
      console.error('Error creating club:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <motion.div
      className="max-w-2xl mx-auto mt-12 bg-white p-8 rounded-2xl shadow-2xl"
      initial="initial"
      animate="animate"
      transition={{ duration: 0.6 }}
      variants={fadeInUp}
    >
      <motion.h2
        className="text-4xl font-bold text-indigo-700 mb-8 text-center"
        variants={fadeInUp}
        transition={{ delay: 0.1 }}
      >
        🚀 Create a New Club
      </motion.h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Club Name */}
        <motion.div variants={fadeInUp} transition={{ delay: 0.15 }}>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Club Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            placeholder="Enter club name"
            className="w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            value={formdata.name}
            onChange={handleChange}
          />
        </motion.div>

        {/* Description */}
        <motion.div variants={fadeInUp} transition={{ delay: 0.2 }}>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            rows={4}
            name="description"
            placeholder="Tell us about the club..."
            className="w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none transition"
            value={formdata.description}
            onChange={handleChange}
          />
        </motion.div>

        {/* Leader ID */}
        <motion.div variants={fadeInUp} transition={{ delay: 0.25 }}>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select Leader <span className="text-red-500">*</span>
          </label>
          <select
            name="leader"
            className="w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            value={formdata.leader}
            onChange={handleChange}
          >
            <option value="">-- Select Leader --</option>
            {LeaderOptions.map((leader, i) => (
              <option key={i} value={leader.value}>
                {leader.label}
              </option>
            ))}
          </select>
        </motion.div>

        {/* Mentor MultiSelect */}
        <motion.div variants={fadeInUp} transition={{ delay: 0.3 }}>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select Mentors (Multiple)<span className="text-red-500">*</span>
          </label>
          <MultiSelect
            data={mentorOptions}
            value={selectedMentors}
            onChange={setSelectedMentors}
            placeholder="Pick mentors"
            searchable
            nothingFound="No mentors found"
            classNames={{
              input: "rounded-xl shadow-sm border border-gray-300 focus:border-indigo-500",
              label: "hidden",
              dropdown: "z-[1000] shadow-lg border border-gray-200 rounded-xl",
              item: "hover:bg-indigo-50 data-selected:bg-indigo-100",
              values: "gap-2",
              value: "bg-indigo-100 text-indigo-700 rounded-full px-3 py-1",
            }}
            radius="lg"
            styles={{
              input: { padding: "0.625rem 0.75rem" }, // match px-4 py-2
            }}
          />
        </motion.div>

        {/* Submit Button */}
        <motion.div className="pt-4" variants={fadeInUp} transition={{ delay: 0.35 }}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={!formdata.name || !formdata.leader || selectedMentors.length === 0}
            className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-500 transition-all duration-200 shadow-md"
          >
            Create Club
          </motion.button>
        </motion.div>
      </form>
    </motion.div>
  );
};

export default CreateClub;
