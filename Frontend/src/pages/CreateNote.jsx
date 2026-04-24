import React, { useState } from "react";
import * as notesApi from "../api/notes";
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
      const response = await notesApi.uploadNotes(formData);
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
    <div className="min-h-screen bg-white relative overflow-hidden py-20 px-6">
      {/* Background Decor */}
      <div className="absolute inset-0 bg-[url('/texture.svg')] opacity-[0.03] pointer-events-none" />
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-50/50 blur-[120px] rounded-full -mr-96 -mt-96" />
      <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-cyan-50/50 blur-[120px] rounded-full -ml-96 -mb-96" />

      <main className="relative z-10 max-w-4xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-block px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-4"
          >
            Resource Hub
          </motion.div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tight">Share <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">Knowledge</span></h1>
          <p className="text-slate-500 font-medium text-lg">Upload your academic resources to help the community grow.</p>
        </div>

        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/70 backdrop-blur-xl p-10 md:p-16 rounded-[3rem] border border-slate-100 shadow-2xl space-y-12"
        >
          {/* Section 1: Metadata */}
          <div className="space-y-8">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest ml-2 flex items-center gap-2">
               <div className="w-1.5 h-1.5 rounded-full bg-blue-500" /> Resource Details
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Document Title *</label>
                  <TextInput
                    placeholder="e.g. Operating Systems Final Prep"
                    value={form.title}
                    name="title"
                    onChange={handleChange}
                    error={errors.title}
                    radius="xl"
                    size="md"
                    styles={{ input: { backgroundColor: '#f8fafc', border: 'none', padding: '1.25rem', fontWeight: 'bold' } }}
                  />
               </div>

               <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Subject / Course *</label>
                  <TextInput
                    placeholder="e.g. CS-402"
                    value={form.subject}
                    name="subject"
                    onChange={handleChange}
                    error={errors.subject}
                    radius="xl"
                    size="md"
                    styles={{ input: { backgroundColor: '#f8fafc', border: 'none', padding: '1.25rem', fontWeight: 'bold' } }}
                  />
               </div>

               <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Academic Branch *</label>
                  <Select
                    value={form.branch}
                    onChange={(value) => setForm((prev) => ({ ...prev, branch: value }))}
                    data={[
                      "Common", "Computer Science", "Mechanical", "Electrical", "Civil", "Electronics", "Biotechnology", "IT", "Chemical", "Other"
                    ]}
                    error={errors.branch}
                    radius="xl"
                    size="md"
                    styles={{ input: { backgroundColor: '#f8fafc', border: 'none', padding: '1rem', fontWeight: 'bold' } }}
                  />
               </div>

               <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Resource Type *</label>
                  <Select
                    value={form.type}
                    onChange={(value) => setForm((prev) => ({ ...prev, type: value }))}
                    data={[
                      { label: "Short Notes", value: "short-note" },
                      { label: "Previous Year Questions", value: "pyq" },
                      { label: "Lecture Materials", value: "lecture" },
                      { label: "Question Bank", value: "question-bank" },
                      { label: "Quantum Series", value: "quantum" },
                      { label: "Full Notes", value: "notes" }
                    ]}
                    error={errors.type}
                    radius="xl"
                    size="md"
                    styles={{ input: { backgroundColor: '#f8fafc', border: 'none', padding: '1rem', fontWeight: 'bold' } }}
                  />
               </div>
            </div>

            <div className="space-y-2">
               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Description *</label>
               <Textarea
                 placeholder="Briefly explain what's inside this file..."
                 value={form.description}
                 name="description"
                 onChange={handleChange}
                 error={errors.description}
                 radius="2xl"
                 minRows={3}
                 styles={{ input: { backgroundColor: '#f8fafc', border: 'none', padding: '1.25rem', fontWeight: 'medium' } }}
               />
            </div>
          </div>

          {/* Section 2: File Upload */}
          <div className="space-y-8">
             <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest ml-2 flex items-center gap-2">
               <div className="w-1.5 h-1.5 rounded-full bg-blue-500" /> Document Upload
             </h3>

             <div className="space-y-6">
                <label className="block border-4 border-dashed border-slate-100 rounded-[2.5rem] p-12 flex flex-col justify-center items-center cursor-pointer relative overflow-hidden bg-slate-50/50 hover:bg-blue-50/50 hover:border-blue-200 transition-all group">
                   <input
                     type="file"
                     onChange={handleFileChange}
                     accept="application/pdf"
                     className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                   />
                   <div className="text-center space-y-4">
                      <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center mx-auto shadow-sm text-slate-400 group-hover:text-blue-500 transition-all duration-500">
                         <Badge color="blue" size="xl" variant="light">PDF</Badge>
                      </div>
                      <div>
                         <p className="font-black text-slate-700 uppercase tracking-widest text-[10px]">
                            {form.notes ? form.notes.name : "Tap to upload PDF document"}
                         </p>
                         <p className="text-slate-400 font-medium text-[9px] mt-1 italic">Maximum file size: 10MB</p>
                      </div>
                   </div>
                </label>
                {errors.notes && <p className="text-xs text-red-500 font-black uppercase tracking-widest ml-4">{errors.notes}</p>}

                <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100 flex items-center justify-between">
                   <div className="flex items-center gap-4">
                      <input
                        type="checkbox"
                        checked={form.isPublic}
                        onChange={(e) => setForm((prev) => ({ ...prev, isPublic: e.target.checked }))}
                        className="w-5 h-5 rounded-md border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-xs font-black text-blue-900 uppercase tracking-widest">Public Visibility</span>
                   </div>
                   <p className="text-blue-600/60 font-medium text-[10px]">Visible to all students on the platform.</p>
                </div>
             </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full py-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black rounded-[2.5rem] shadow-2xl shadow-blue-500/20 hover:shadow-blue-500/40 transition-all uppercase tracking-[0.2em] disabled:opacity-50"
          >
            {loading ? <Loader size="sm" color="white" /> : "FINALIZE UPLOAD"}
          </motion.button>
        </motion.form>
      </main>
    </div>
  );
};

export default NotesUploadForm;
