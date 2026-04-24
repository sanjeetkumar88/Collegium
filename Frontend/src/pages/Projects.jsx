import React, { useState, useEffect } from "react";
import * as projectApi from "../api/project";
import { Pagination, Tabs } from '@mantine/core';
import { motion } from 'framer-motion';
import { useAuth } from "../context/AuthContext";
import { FaSearch, FaFilter } from 'react-icons/fa'; 
import ProjectCard from '../components/features/cards/ProjectCard';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useNavigate } from 'react-router-dom';

dayjs.extend(relativeTime);

function Projects() {
  const [projects, setProjects] = useState([]);
  const [titleFilter, setTitleFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [activeTab, setActiveTab] = useState('all');
  const user = useAuth();
  const navigate = useNavigate(); // Initialize navigate

  // Fetch projects based on filters and active tab
  useEffect(() => {
    fetchProjects();
  }, [page, titleFilter, categoryFilter, activeTab]);

  const fetchProjects = async () => {
    try {
      const response = await projectApi.getProjects({
        page,
        title: titleFilter,
        category: categoryFilter,
        ...(activeTab === 'all' ? {} : { userId: user.authUser._id }), 
      });

      const { projects, totalPages } = response.data.data;

      setProjects(projects);
      setTotalPages(totalPages);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  // Handle title filter input change
  const handleTitleChange = (e) => {
    setTitleFilter(e.target.value);
    setPage(1); // Reset to first page on new filter
  };

  // Handle category filter input change
  const handleCategoryChange = (e) => {
    setCategoryFilter(e.target.value);
    setPage(1); // Reset to first page on new filter
  };

  // Handle tab change (All Projects / Your Projects)
  const handleTabChange = (value) => {
    setActiveTab(value);
    setPage(1); // Reset to first page when switching tabs
    setTitleFilter('');
    setCategoryFilter('');
  };

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 bg-[url('/texture.svg')] opacity-[0.03] pointer-events-none" />
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-blue-50/50 blur-[120px] rounded-full -ml-64 -mt-64" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-cyan-50/50 blur-[120px] rounded-full -mr-64 -mb-64" />

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        {/* Page Title */}
        <div className="text-center mb-16">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl md:text-6xl font-black tracking-tight mb-6"
          >
            <span className="text-gradient">Innovate</span> with Projects
          </motion.h1>
          <p className="text-slate-500 text-lg md:text-xl font-medium max-w-2xl mx-auto">
            Explore groundbreaking student projects, collaborate on open-source initiatives, and showcase your own innovations.
          </p>
        </div>

        {/* Filters & Tabs Section */}
        <motion.div
          className="bg-slate-50/50 backdrop-blur-sm p-8 rounded-[2.5rem] border border-slate-200 shadow-sm mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="flex flex-col lg:flex-row justify-between items-center gap-8">
            {/* Custom Pills Switcher */}
            <div className="flex p-1.5 bg-slate-200/50 rounded-2xl w-full lg:w-auto">
              <button
                onClick={() => handleTabChange('all')}
                className={`flex-1 lg:flex-none px-8 py-2.5 rounded-xl font-black transition-all duration-300 ${
                  activeTab === 'all' 
                    ? "bg-white text-blue-600 shadow-lg" 
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                All Projects
              </button>
              <button
                onClick={() => handleTabChange('yours')}
                className={`flex-1 lg:flex-none px-8 py-2.5 rounded-xl font-black transition-all duration-300 ${
                  activeTab === 'yours' 
                    ? "bg-white text-blue-600 shadow-lg" 
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                Your Projects
              </button>
            </div>

            {/* Controls */}
            <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
              <div className="relative flex-1 sm:w-72">
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={titleFilter}
                  onChange={handleTitleChange}
                  className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-bold text-slate-700"
                />
                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>

              <select
                value={categoryFilter}
                onChange={handleCategoryChange}
                className="w-full sm:w-48 px-4 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-bold text-slate-700 appearance-none cursor-pointer"
              >
                <option value="">All Categories</option>
                <option value="web">Web Development</option>
                <option value="app">Mobile Apps</option>
                <option value="ml">Machine Learning</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Projects List */}
        {projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {projects.map((project, i) => (
              <motion.div
                key={project._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <ProjectCard
                  imageUrl={project.coverImage}
                  title={project.title}
                  badgeText={project.category}
                  description={project.description}
                  buttonText="Explore Details"
                  timestamp={dayjs(project.createdAt).fromNow()}
                  onClick={() => navigate(`/project/explore-projects/${project._id}`)}
                />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-slate-50/50 rounded-[3rem] border border-dashed border-slate-200">
             <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white shadow-xl text-slate-300 mb-6">
                <FaFilter size={24} />
             </div>
             <h3 className="text-2xl font-black text-slate-800 mb-2">No Projects Found</h3>
             <p className="text-slate-500 max-w-sm mx-auto">We couldn't find any projects matching your search. Try adjusting your filters.</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-12">
            <Pagination
              value={page}
              onChange={setPage}
              total={totalPages}
              size="lg"
              radius="xl"
              color="blue"
              withEdges
            />
          </div>
        )}
      </main>
    </div>
  );
}

export default Projects;
