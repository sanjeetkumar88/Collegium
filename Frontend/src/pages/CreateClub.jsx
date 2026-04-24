import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { MultiSelect } from "@mantine/core";
import * as clubApi from "../api/club";
import * as userApi from "../api/user";
import { toast } from "react-toastify";  

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
    mentor: [],
  });

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const res = await userApi.getAllTeachers();
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
        const res = await userApi.getAllStudents();
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
      const res = await clubApi.createClub(data);
      toast.success('Club created successfully!');

      // Reset form & mentors selection
      setFormData({
        name: "",
        description: "",
        leader: "",
        mentor: [],
      });
      setSelectedMentors([]);
    } catch (error) {
      toast.error('Failed to create club. Please try again.');
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
            Administration
          </motion.div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tight">Establish <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">New Club</span></h1>
          <p className="text-slate-500 font-medium text-lg">Define the mission and leadership for a new community hub.</p>
        </div>

        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/70 backdrop-blur-xl p-10 md:p-16 rounded-[3rem] border border-slate-100 shadow-2xl space-y-12"
        >
          {/* Section 1: Core Identity */}
          <div className="space-y-8">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest ml-2 flex items-center gap-2">
               <div className="w-1.5 h-1.5 rounded-full bg-blue-500" /> Core Identity
            </h3>
            
            <div className="space-y-6">
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Club Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formdata.name}
                    onChange={handleChange}
                    placeholder="e.g. The Robotics Collective"
                    className="w-full bg-slate-50 border-none rounded-2xl p-5 font-bold outline-none focus:ring-4 focus:ring-blue-100 transition-all"
                  />
               </div>

               <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Mission Statement</label>
                  <textarea
                    rows={4}
                    name="description"
                    value={formdata.description}
                    onChange={handleChange}
                    placeholder="What is the primary goal of this club?"
                    className="w-full bg-slate-50 border-none rounded-2xl p-6 font-medium outline-none focus:ring-4 focus:ring-blue-100 transition-all resize-none"
                  />
               </div>
            </div>
          </div>

          {/* Section 2: Leadership */}
          <div className="space-y-8">
             <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest ml-2 flex items-center gap-2">
               <div className="w-1.5 h-1.5 rounded-full bg-blue-500" /> Appointed Leadership
             </h3>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Select Leader (Student) *</label>
                   <select
                     name="leader"
                     value={formdata.leader}
                     onChange={handleChange}
                     className="w-full bg-slate-50 border-none rounded-2xl p-4 font-bold outline-none focus:ring-4 focus:ring-blue-100 transition-all appearance-none cursor-pointer"
                   >
                     <option value="">Choose Student Leader</option>
                     {LeaderOptions.map((leader, i) => (
                       <option key={i} value={leader.value}>{leader.label}</option>
                     ))}
                   </select>
                </div>

                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Select Mentors (Teachers) *</label>
                   <MultiSelect
                     data={mentorOptions}
                     value={selectedMentors}
                     onChange={setSelectedMentors}
                     placeholder="Pick one or more mentors"
                     searchable
                     nothingFound="No mentors found"
                     radius="xl"
                     styles={{
                       input: { 
                         backgroundColor: '#f8fafc', // slate-50
                         border: 'none',
                         borderRadius: '1rem',
                         padding: '1rem',
                         fontWeight: 'bold',
                         minHeight: '3.5rem'
                       },
                       dropdown: {
                         borderRadius: '1rem',
                         boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                         border: '1px solid #f1f5f9'
                       },
                       value: {
                         backgroundColor: '#eff6ff', // blue-50
                         color: '#2563eb', // blue-600
                         fontWeight: '900',
                         fontSize: '10px',
                         textTransform: 'uppercase',
                         letterSpacing: '0.05em'
                       }
                     }}
                   />
                </div>
             </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={!formdata.name || !formdata.leader || selectedMentors.length === 0}
            className="w-full py-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black rounded-[2rem] shadow-2xl shadow-blue-500/20 hover:shadow-blue-500/40 transition-all uppercase tracking-[0.2em] disabled:opacity-50"
          >
            FINALIZE CLUB CREATION
          </motion.button>
        </motion.form>
      </main>
    </div>
  );
};

export default CreateClub;
