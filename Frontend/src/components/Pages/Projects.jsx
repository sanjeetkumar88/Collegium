import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Pagination, Tabs } from '@mantine/core';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/Authcontext';
import { FaSearch, FaFilter } from 'react-icons/fa'; 
import ProjectCard from '../Cardcomp/ProjectCard';
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
      const query = new URLSearchParams({
        page,
        title: titleFilter,
        category: categoryFilter,
        ...(activeTab === 'all' ? {} : { userId: user.authUser._id }), 
      }).toString();

      const response = await axios.get(`/devproject/getallprojects?${query}`, {
        withCredentials: true,
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
    <motion.div
      className="p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <h1 className="text-2xl font-bold mb-4 text-center text-indigo-600">Projects</h1>

      {/* Tabs: All Projects and Your Projects */}
      <Tabs value={activeTab} onChange={handleTabChange} variant="outline" radius="md" className="mb-6">
        <Tabs.List>
          <Tabs.Tab value="all">All Projects</Tabs.Tab>
          <Tabs.Tab value="yours">Your Projects</Tabs.Tab>
        </Tabs.List>
      </Tabs>

      {/* Filter Inputs */}
      <motion.div
        className="flex flex-col md:flex-row gap-4 mb-6 justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center border px-3 py-1 rounded w-full md:w-auto">
          <FaSearch className="text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Filter by title"
            value={titleFilter}
            onChange={handleTitleChange}
            className="outline-none w-full"
          />
        </div>

        <div className="flex items-center border px-3 py-1 rounded w-full md:w-auto">
          <FaFilter className="text-gray-400 mr-2" />
          <select
            value={categoryFilter}
            onChange={handleCategoryChange}
            className="outline-none w-full"
          >
            <option value="">Select category</option>
            <option value="web">Web</option>
            <option value="app">App</option>
            <option value="ml">Machine Learning</option>
          </select>
        </div>
      </motion.div>

      {/* Projects List */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {projects.length > 0 ? (
          projects.map((project) => (
            <ProjectCard
              key={project._id}
              imageUrl={project.coverImage}
              title={project.title}
              badgeText={project.category}
              description={project.description}
              buttonText="More Detail"
              timestamp={dayjs(project.createdAt).fromNow()}
              onClick={() => navigate(`/project/explore-projects/${project._id}`)} // Navigate on click
            />
          ))
        ) : (
          <p className="text-center text-gray-600">No projects found.</p>
        )}
      </motion.div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <Pagination
            value={page}
            onChange={setPage}
            total={totalPages}
            size="md"
            radius="md"
            withEdges
          />
        </div>
      )}
    </motion.div>
  );
}

export default Projects;
