import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Button,
  Badge,
  Anchor,
  Text,
  Menu,
  TextInput,
  Modal,
} from "@mantine/core";
import {
  FaGithub,
  FaExternalLinkAlt,
  FaEllipsisH,
  FaUserPlus,
  FaSignOutAlt,
  FaEdit,
  FaTrash,
} from "react-icons/fa";
import * as projectApi from "../api/project";
import ProjectCover from "../components/features/project/ProjectCover";
import UserCardSm from "../components/features/project/UserCardSm";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import JoinRequestModal from "../components/features/project/JoinRequestModal";
import EditCoverModal from "../components/features/project/EditCoverModal";
import EditProjectDetailsModal from "../components/features/project/EditProjectDetailsModal";

const ProjectDetail = () => {
  const { id } = useParams();
  const [projectData, setProjectData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [roleInput, setRoleInput] = useState("");
  const [roleInputModel, setRoleInputModel] = useState(false);
  const [editCoverOpen, setEditCoverOpen] = useState(false);
  const [editDetailsOpen, setEditDetailsOpen] = useState(false);

  const auth = useAuth();

  const [joinModalOpen, setJoinModalOpen] = useState(false);

  const fetchProject = async () => {
    try {
      const response = await projectApi.getProjectDetail(id);
      setProjectData(response.data.data); // Keep only the data part
    } catch (err) {
      console.error(
        "Error fetching project:",
        err.response?.data || err.message
      );
      setError("Failed to load project.");
    } finally {
      setLoading(false);
    }
  };
  const navigate = useNavigate();

  const handleProjectDelete = async () => {
    try {
      const res = await projectApi.deleteProject(id);
      navigate("/project/explore-projects/");
    } catch (error) {
      console.error("Error deleting project:", error.response?.data || error.message);
      
    }
  };

  useEffect(() => {
    fetchProject();
  }, [id]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="font-black text-slate-400 uppercase tracking-widest">Loading Project...</p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
         <div className="text-center">
            <h2 className="text-2xl font-black text-red-600 mb-2">Error Occurred</h2>
            <p className="font-medium text-slate-500">{error}</p>
         </div>
      </div>
    );

  if (!projectData) return null;

  const isMember = projectData.members?.some(
    (member) => member.username === auth.authUser.username
  );
  const isAuthor = auth.authUser.username === projectData.author.username;
  const isAdmin = auth.authUser.role === "admin";

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 bg-[url('/texture.svg')] opacity-[0.03] pointer-events-none" />
      <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-blue-50/50 blur-[120px] rounded-full -ml-96 -mt-96" />
      <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-cyan-50/50 blur-[120px] rounded-full -mr-96 -mb-96" />

      <main className="relative z-10 max-w-6xl mx-auto px-6 py-12 md:py-20">
        {/* Project Header Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[3rem] shadow-2xl border border-slate-100 overflow-hidden mb-16"
        >
          {/* Cover Section */}
          <div className="relative h-[400px] group">
            <img 
              src={projectData.coverImage} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
              alt="Project Cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent" />
            
            {auth.authUser && (isAuthor || auth.authUser.role === "admin") && (
              <button
                onClick={() => setEditCoverOpen(true)}
                className="absolute top-8 right-8 bg-white/80 backdrop-blur-md p-3 rounded-2xl shadow-xl text-blue-600 hover:bg-white transition-all active:scale-95"
              >
                <FaEdit size={20} />
              </button>
            )}

            {/* Float Info */}
            <div className="absolute bottom-12 left-12 right-12 flex flex-col md:flex-row md:items-end justify-between gap-8">
              <div className="space-y-4">
                <div className="flex gap-2">
                   <span className="px-4 py-1.5 bg-blue-600 text-white text-[10px] font-black rounded-lg uppercase tracking-widest shadow-lg shadow-blue-500/20">
                      {projectData.category}
                   </span>
                   <span className={`px-4 py-1.5 ${projectData.status === 'Completed' ? 'bg-green-500' : 'bg-yellow-500'} text-white text-[10px] font-black rounded-lg uppercase tracking-widest shadow-lg shadow-green-500/20`}>
                      {projectData.status}
                   </span>
                </div>
                <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-tight">
                  {projectData.title}
                </h1>
              </div>

              <div className="flex items-center gap-4">
                <Menu shadow="xl" width={240} radius="xl">
                  <Menu.Target>
                    <Button
                      size="xl"
                      radius="xl"
                      className="bg-white/10 backdrop-blur-md border border-white/20 text-white font-black hover:bg-white/20 active:scale-95 transition-all"
                      leftSection={<FaEllipsisH />}
                    >
                      Management
                    </Button>
                  </Menu.Target>
                  <Menu.Dropdown className="bg-white/90 backdrop-blur-xl border-none shadow-2xl p-2">
                    {!isMember && !isAuthor && projectData.openForCollaboration && !isAdmin && (
                      <Menu.Item leftSection={<FaUserPlus />} onClick={() => setRoleInputModel(true)}>
                        Join Collaboration
                      </Menu.Item>
                    )}
                    {isMember && (
                      <Menu.Item leftSection={<FaSignOutAlt />} color="red" onClick={async () => {
                        try {
                          await projectApi.leaveProject(id);
                          alert("Left project");
                          fetchProject();
                        } catch (e) { alert("Failed to leave"); }
                      }}>
                        Leave Project
                      </Menu.Item>
                    )}
                    {(isAuthor || isAdmin) && (
                      <Menu.Item leftSection={<FaUserPlus />} onClick={() => setJoinModalOpen(true)}>
                        Collaboration Requests
                      </Menu.Item>
                    )}
                    {(isAuthor || isAdmin) && (
                      <Menu.Item leftSection={<FaEdit />} onClick={() => setEditDetailsOpen(true)}>
                        Project Settings
                      </Menu.Item>
                    )}
                    {(isAuthor || isAdmin) && (
                      <Menu.Item leftSection={<FaTrash />} color="red" onClick={() => handleProjectDelete()}>
                        Delete Forever
                      </Menu.Item>
                    )}
                  </Menu.Dropdown>
                </Menu>

                {projectData.githubLink && (
                  <a href={projectData.githubLink} target="_blank" className="p-4 bg-white rounded-full text-slate-900 shadow-xl hover:scale-110 active:scale-95 transition-all">
                    <FaGithub size={24} />
                  </a>
                )}
                {projectData.liveLink && (
                  <a href={projectData.liveLink} target="_blank" className="p-4 bg-blue-600 text-white rounded-full shadow-xl hover:scale-110 active:scale-95 transition-all">
                    <FaExternalLinkAlt size={24} />
                  </a>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column: Core Info */}
          <div className="lg:col-span-2 space-y-12">
            <section className="space-y-6">
               <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest ml-2">Objective & Mission</h3>
               <div className="bg-slate-50/50 backdrop-blur-sm p-10 rounded-[2.5rem] border border-slate-100">
                  <p className="text-2xl font-bold text-slate-800 leading-relaxed italic">
                     "{projectData.problemStatement}"
                  </p>
               </div>
            </section>

            <section className="space-y-6">
               <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest ml-2">Project Evolution</h3>
               <p className="text-lg text-slate-500 font-medium leading-relaxed whitespace-pre-wrap">
                  {projectData.description}
               </p>
            </section>

            <section className="space-y-8">
               <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest ml-2">Built with Modern Tech</h3>
               <div className="flex flex-wrap gap-4">
                  {projectData.technologiesUsed.map((tech, i) => (
                    <motion.div
                      key={i}
                      whileHover={{ y: -5 }}
                      className="px-6 py-3 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center gap-3"
                    >
                       <div className="w-2 h-2 rounded-full bg-blue-500" />
                       <span className="text-sm font-black text-slate-700 uppercase tracking-wider">{tech}</span>
                    </motion.div>
                  ))}
               </div>
            </section>
          </div>

          {/* Right Column: Team & Metadata */}
          <div className="space-y-12">
             <section className="space-y-6">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest ml-2">Project Visionary</h3>
                <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-200">
                   <UserCardSm
                     logo={projectData.author.logo}
                     name={projectData.author.name}
                     username={projectData.author.username}
                     role="Founder"
                   />
                </div>
             </section>

             <section className="space-y-6">
                <div className="flex items-center justify-between ml-2">
                   <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Collaborators</h3>
                   <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase">
                      {projectData.members.length} Active
                   </span>
                </div>
                <div className="space-y-4">
                  {projectData.members.map((member) => (
                    <motion.div whileHover={{ x: 5 }} key={member.username}>
                      <UserCardSm
                        logo={member.logo}
                        name={member.name}
                        username={member.username}
                        role="Contributor"
                      />
                    </motion.div>
                  ))}
                  {projectData.members.length === 0 && (
                    <div className="py-8 text-center text-slate-400 font-bold uppercase tracking-widest text-xs border-2 border-dashed border-slate-200 rounded-[2rem]">
                       No active collaborators
                    </div>
                  )}
                </div>
             </section>
          </div>
        </div>
      </main>

      {/* Modals */}
      <Modal opened={roleInputModel} onClose={() => setRoleInputModel(false)} title="Join the Mission" centered radius="2rem" padding="xl" className="backdrop-blur-sm">
        <form onSubmit={async (e) => {
            e.preventDefault();
            try {
              await projectApi.joinProject(id, { role: roleInput });
              alert("Join request sent");
              setRoleInputModel(false);
            } catch (err) { alert("Failed to join"); }
          }}
          className="space-y-6"
        >
          <TextInput
            label="What will be your contribution?"
            placeholder="e.g. Design Architecture, Backend..."
            value={roleInput}
            onChange={(e) => setRoleInput(e.currentTarget.value)}
            required
            size="lg"
            radius="xl"
          />
          <Button type="submit" fullWidth size="lg" radius="xl" className="bg-blue-600 font-black shadow-xl">
            SEND REQUEST
          </Button>
        </form>
      </Modal>

      <JoinRequestModal opened={joinModalOpen} onClose={() => setJoinModalOpen(false)} projectId={id} />
      <EditCoverModal opened={editCoverOpen} onClose={() => setEditCoverOpen(false)} projectId={id} />
      <EditProjectDetailsModal projectData={projectData} opened={editDetailsOpen} onClose={() => setEditDetailsOpen(false)} onSave={() => fetchProject()} />
    </div>
  );
};

export default ProjectDetail;
