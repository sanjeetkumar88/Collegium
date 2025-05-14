import React, { useState } from "react";
import axios from "../../utils/axios";
import { motion } from "framer-motion";
import {
  Badge,
  Button,
  Select,
  Textarea,
  TextInput,
  Loader,
} from "@mantine/core";

const NotesUploadForm = () => {
  const [form, setForm] = useState({
    title: "",
    subject: "",
    description: "",
    type: "",
    branch: "Other",
    notes: null,
    isPublic: false,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file && file.type !== "application/pdf") {
      alert("Please upload only PDF files.");
      e.target.value = "";
      return;
    }
    setForm((prev) => ({
      ...prev,
      notes: file,
    }));
  };

  const validateForm = () => {
    const validationErrors = {};
    if (!form.title.trim()) validationErrors.title = "Title is required";
    if (!form.subject.trim()) validationErrors.subject = "Subject is required";
    if (!form.description.trim())
      validationErrors.description = "Description is required";
    if (!form.type) validationErrors.type = "Type is required";
    if (!form.branch) validationErrors.branch = "Branch is required";
    if (!form.notes) validationErrors.notes = "File is required";
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("description", form.description);
    formData.append("type", form.type);
    formData.append("branch", form.branch);
    formData.append("notes", form.notes);
    formData.append("subject", form.subject);
    formData.append("isPublic", form.isPublic);

    try {
      const response = await axios.post("/notes/uploadnotes", formData, {
        withCredentials: true,
      });
      alert(response.data.message || "Notes uploaded successfully");
      resetForm();
    } catch (error) {
      console.error(
        "Error uploading notes:",
        error.response?.data || error.message
      );
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm({
      title: "",
      description: "",
      type: "",
      branch: "Other",
      notes: null,
      subject: "",
      isPublic: false,
    });
    setErrors({});
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-xl mx-auto mt-8 p-6 bg-white rounded-2xl shadow-lg space-y-6"
    >
      <h2 className="text-3xl font-bold text-gray-800 mb-2 text-center">
        Upload Notes
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <TextInput
          label="Title"
          placeholder="Enter title"
          value={form.title}
          name="title"
          onChange={handleChange}
          error={errors.title}
          withAsterisk
        />

        <TextInput
          label="Subject"
          placeholder="Enter subject"
          value={form.subject}
          name="subject"
          onChange={handleChange}
          error={errors.subject}
          withAsterisk
        />

        <Textarea
          label="Description"
          placeholder="Write a short description..."
          value={form.description}
          name="description"
          onChange={handleChange}
          error={errors.description}
          autosize
          minRows={3}
          withAsterisk
        />

        <Select
          label="Branch"
          value={form.branch}
          onChange={(value) => setForm((prev) => ({ ...prev, branch: value }))}
          data={[
            "Common",
            "Computer Science",
            "Mechanical",
            "Electrical",
            "Civil",
            "Electronics",
            "Biotechnology",
            "IT",
            "Chemical",
            "Other",
          ]}
          error={errors.branch}
          withAsterisk
        />

        <Select
          label="Type"
          value={form.type}
          onChange={(value) => setForm((prev) => ({ ...prev, type: value }))}
          data={[
            "short-note",
            "pyq",
            "lecture",
            "question-bank",
            "quantum",
            "notes",
          ]}
          error={errors.type}
          withAsterisk
        />

        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            checked={form.isPublic}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, isPublic: e.target.checked }))
            }
            className="w-4 h-4"
          />
          <span className="text-sm text-gray-600">
            Make this note public (visible to others)
          </span>
        </div>

        <div className="space-y-1">
          <input
            type="file"
            onChange={handleFileChange}
            accept="application/pdf"
            className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          {errors.notes && (
            <p className="text-sm text-red-500">{errors.notes}</p>
          )}
        </div>

        <Button
          type="submit"
          fullWidth
          radius="md"
          size="md"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          {loading ? <Loader size="xs" color="white" /> : "Upload Notes"}
        </Button>
      </form>
    </motion.div>
  );
};

export default NotesUploadForm;
