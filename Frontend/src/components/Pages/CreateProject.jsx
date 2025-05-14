import { useState } from "react";
import { motion } from "framer-motion";
import { AiOutlinePlus } from "react-icons/ai";
import { BsCloudUpload } from "react-icons/bs";
import axios from "../../utils/axios";

export default function CreateProject() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    tags: "",
    technologiesUsed: "",
    status: "",
    projectUrl: "",
    githubRepo: "",
    contactInfo: "",
    startDate: "",
    endDate: "",
    demoVideo: "",
    problemStatement: "",
    openForCollaboration: false,
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false); // For tracking form submission state

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading state to true

    const data = new FormData();
    for (const key in formData) {
      data.append(key, formData[key]);
    }

    if (imageFile) {
      data.append("coverImage", imageFile); // must match backend key
    }

    try {
      const res = await axios.post("/devproject/createproject", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      alert("Project created successfully!");
      console.log(res.data);
      resetForm(); // Reset form after successful submission
    } catch (err) {
      console.error(err);
      alert("Error creating project");
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      category: "",
      tags: "",
      technologiesUsed: "",
      status: "",
      projectUrl: "",
      githubRepo: "",
      contactInfo: "",
      startDate: "",
      endDate: "",
      demoVideo: "",
      problemStatement: "",
      openForCollaboration: false,
    });
    setImageFile(null);
    setImagePreview(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-gray-100 to-white text-gray-800 flex justify-center p-8"
    >
      <div className="w-full max-w-5xl">
        {/* Cover Image Upload */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="border-2 border-dashed border-blue-400 rounded-lg h-80 flex flex-col items-center justify-center mb-10 relative overflow-hidden bg-white"
        >
          {imagePreview ? (
            <img
              src={imagePreview}
              alt="Uploaded Preview"
              className="absolute w-full h-full object-cover rounded-lg"
            />
          ) : (
            <>
              <BsCloudUpload className="w-12 h-12 text-gray-500 mb-2" />
              <p className="text-gray-500">Click to upload cover image</p>
            </>
          )}
          <input
            type="file"
            accept="image/*"
            className="absolute w-full h-full opacity-0 cursor-pointer"
            onChange={handleImageUpload}
          />
        </motion.div>

        {/* Project Form */}
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 rounded-xl shadow-xl"
        >
          {[ 
            ["Project Title", "title"],
            ["Project URL", "projectUrl"],
            ["GitHub/Repository Link", "githubRepo"],
            ["Contact Information", "contactInfo"],
            ["Tags/Keywords", "tags"],
            ["Technologies Used", "technologiesUsed"],
          ].map(([label, name]) => (
            <div key={name}>
              <label className="block mb-1 font-medium">{label} *</label>
              <input
                name={name}
                value={formData[name]}
                onChange={handleChange}
                className="w-full p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>
          ))}

          {/* Description */}
          <div className="md:col-span-2">
            <label className="block mb-1 font-medium">
              Project Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-3 rounded border border-gray-300"
              rows="4"
              required
            />
          </div>

          {/* Category */}
          <div>
            <label className="block mb-1 font-medium">Project Category *</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full p-3 rounded border border-gray-300"
              required
            >
              <option value="">Select category</option>
              <option value="web">Web</option>
              <option value="app">App</option>
              <option value="ml">Machine Learning</option>
            </select>
          </div>

          {/* Open for Collaboration */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="openForCollaboration"
              checked={formData.openForCollaboration}
              onChange={handleChange}
              className="w-5 h-5 text-blue-600"
            />
            <label className="font-medium">Open for Collaboration</label>
          </div>

          {/* Problem Statement */}
          <div className="md:col-span-2">
            <label className="block mb-1 font-medium">Problem Statement</label>
            <textarea
              name="problemStatement"
              value={formData.problemStatement}
              onChange={handleChange}
              className="w-full p-3 rounded border border-gray-300"
              rows="4"
            />
          </div>

          {/* Status */}
          <div>
            <label className="block mb-1 font-medium">Status *</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full p-3 rounded border border-gray-300"
              required
            >
              <option value="">Select status</option>
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
              <option value="on-hold">On Hold</option>
            </select>
          </div>

          {/* Dates */}
          <div>
            <label className="block mb-1 font-medium">Start Date *</label>
            <input
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              type="date"
              className="w-full p-3 rounded border border-gray-300"
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">End Date</label>
            <input
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              type="date"
              className="w-full p-3 rounded border border-gray-300"
            />
          </div>

          {/* Demo Video */}
          <div className="md:col-span-2">
            <label className="block mb-1 font-medium">Demo Video</label>
            <input
              name="demoVideo"
              value={formData.demoVideo}
              onChange={handleChange}
              className="w-full p-3 rounded border border-gray-300"
              type="text"
            />
          </div>

          {/* Submit Button */}
          <div className="md:col-span-2 flex justify-center mt-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="flex items-center gap-2 bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg shadow hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? (
                <span>Creating Project...</span>
              ) : (
                <>
                  <AiOutlinePlus />
                  Save Project
                </>
              )}
            </motion.button>
          </div>
        </motion.form>
      </div>
    </motion.div>
  );
}
