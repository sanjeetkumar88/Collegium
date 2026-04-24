import { useState } from "react";
import { motion } from "framer-motion";
import { AiOutlinePlus } from "react-icons/ai";
import { BsCloudUpload } from "react-icons/bs";
import * as projectApi from "../api/project";

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
      const res = await projectApi.createProject(data);
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
    <div className="min-h-screen bg-white relative overflow-hidden py-20 px-6">
      {/* Background Decor */}
      <div className="absolute inset-0 bg-[url('/texture.svg')] opacity-[0.03] pointer-events-none" />
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-50/50 blur-[120px] rounded-full -mr-96 -mt-96" />
      <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-cyan-50/50 blur-[120px] rounded-full -ml-96 -mb-96" />

      <main className="relative z-10 max-w-5xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-block px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-4"
          >
            Innovation Portal
          </motion.div>
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tight leading-[1]">
             Launch <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">Your Vision</span>
          </h1>
          <p className="text-slate-500 font-medium text-lg max-w-2xl mx-auto mt-4">
             Turn your ideas into reality. Document your progress, showcase your stack, and find collaborators.
          </p>
        </div>

        {/* Cover Image Upload Area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 group"
        >
          <label className="block border-4 border-dashed border-slate-100 rounded-[3rem] h-[400px] flex flex-col justify-center items-center cursor-pointer relative overflow-hidden bg-slate-50/50 hover:bg-blue-50/50 hover:border-blue-200 transition-all shadow-xl group-hover:shadow-2xl">
            <input type="file" accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={handleImageUpload} />
            {imagePreview ? (
              <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <div className="text-center space-y-4">
                <div className="w-20 h-20 rounded-3xl bg-white flex items-center justify-center mx-auto shadow-sm text-slate-400 group-hover:text-blue-500 transition-all duration-500 transform group-hover:scale-110">
                   <BsCloudUpload size={32} />
                </div>
                <p className="font-black text-slate-400 uppercase tracking-widest text-xs">Drop your project cover here</p>
              </div>
            )}
          </label>
        </motion.div>

        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/70 backdrop-blur-xl p-10 md:p-16 rounded-[3.5rem] border border-slate-100 shadow-2xl space-y-16"
        >
          {/* Section 1: Core Specs */}
          <div className="space-y-10">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] ml-2 flex items-center gap-2">
               <div className="w-2 h-2 rounded-full bg-blue-500" /> Core Specifications
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Project Title *</label>
                  <input name="title" value={formData.title} onChange={handleChange} required placeholder="e.g. AI-Powered Study Assistant" className="w-full bg-slate-50 border-none rounded-2xl p-5 font-bold outline-none focus:ring-4 focus:ring-blue-100 transition-all" />
               </div>

               <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Project Category *</label>
                  <select name="category" value={formData.category} onChange={handleChange} required className="w-full bg-slate-50 border-none rounded-2xl p-5 font-bold outline-none focus:ring-4 focus:ring-blue-100 transition-all appearance-none cursor-pointer">
                    <option value="">Select category</option>
                    <option value="web">Web Development</option>
                    <option value="app">Mobile Application</option>
                    <option value="ml">Machine Learning / AI</option>
                  </select>
               </div>

               <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Technologies Used *</label>
                  <input name="technologiesUsed" value={formData.technologiesUsed} onChange={handleChange} required placeholder="React, Node.js, TensorFlow..." className="w-full bg-slate-50 border-none rounded-2xl p-5 font-bold outline-none focus:ring-4 focus:ring-blue-100 transition-all" />
               </div>

               <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Current Status *</label>
                  <select name="status" value={formData.status} onChange={handleChange} required className="w-full bg-slate-50 border-none rounded-2xl p-5 font-bold outline-none focus:ring-4 focus:ring-blue-100 transition-all appearance-none cursor-pointer">
                    <option value="">Select status</option>
                    <option value="ongoing">Active Development</option>
                    <option value="completed">Completed / Final</option>
                    <option value="on-hold">On Hold</option>
                  </select>
               </div>
            </div>
          </div>

          {/* Section 2: Narrative */}
          <div className="space-y-10">
             <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] ml-2 flex items-center gap-2">
               <div className="w-2 h-2 rounded-full bg-blue-500" /> Project Narrative
             </h3>

             <div className="space-y-8">
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Description *</label>
                   <textarea name="description" value={formData.description} onChange={handleChange} required rows={5} placeholder="Tell us the story of your project..." className="w-full bg-slate-50 border-none rounded-2xl p-8 font-medium outline-none focus:ring-4 focus:ring-blue-100 transition-all resize-none" />
                </div>

                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Problem Statement</label>
                   <textarea name="problemStatement" value={formData.problemStatement} onChange={handleChange} rows={3} placeholder="What problem does this solve?" className="w-full bg-slate-50 border-none rounded-2xl p-8 font-medium outline-none focus:ring-4 focus:ring-blue-100 transition-all resize-none" />
                </div>
             </div>
          </div>

          {/* Section 3: Links & Collab */}
          <div className="space-y-10">
             <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] ml-2 flex items-center gap-2">
               <div className="w-2 h-2 rounded-full bg-blue-500" /> Links & Collaboration
             </h3>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">GitHub Repository</label>
                   <input name="githubRepo" value={formData.githubRepo} onChange={handleChange} placeholder="https://github.com/..." className="w-full bg-slate-50 border-none rounded-2xl p-5 font-bold outline-none" />
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Live Demo URL</label>
                   <input name="projectUrl" value={formData.projectUrl} onChange={handleChange} placeholder="https://..." className="w-full bg-slate-50 border-none rounded-2xl p-5 font-bold outline-none" />
                </div>
             </div>

             <div className="bg-blue-50/50 p-8 rounded-[2rem] border border-blue-100 flex items-center justify-between">
                <div>
                   <h4 className="font-black text-blue-900 uppercase tracking-widest text-xs mb-1">Open for Collaboration</h4>
                   <p className="text-blue-600/60 font-medium text-[10px]">Allow other students to request to join your team.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" name="openForCollaboration" checked={formData.openForCollaboration} onChange={handleChange} className="sr-only peer" />
                  <div className="w-14 h-8 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
             </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full py-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black rounded-[2.5rem] shadow-2xl shadow-blue-500/20 hover:shadow-blue-500/40 transition-all uppercase tracking-[0.2em] disabled:opacity-50"
          >
            {loading ? "SAVING INNOVATION..." : "PUBLISH PROJECT"}
          </motion.button>
        </motion.form>
      </main>
    </div>
  );
}
