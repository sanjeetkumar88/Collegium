import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button, Badge, Anchor, Text } from "@mantine/core";
import { FaGithub, FaExternalLinkAlt, FaUserPlus } from "react-icons/fa"; // React Icons
import ProjectCover from "../Cardcomp/projectDetail/ProjectCover";
import UserCardSm from "../Cardcomp/projectDetail/UserCardSm";
import { useParams } from "react-router-dom";
import axios from "axios";

// Static data for project details
const data = {
  project: {
    title: "Tech Innovators Club",
    description:
      "The project is designed to streamline communication and task management among project team members, enabling smoother collaboration.",
    problemStatement:
      "This project aims to solve the problem of inefficient project collaboration and management in small teams.",
    category: "Web Development",
    status: "Completed",
    liveLink: "https://example.com",
    githubLink: "https://github.com/username/repository",
    technologiesUsed: ["React", "TailwindCSS", "Framer Motion", "Mantine"],
    author: {
      name: "Sanjeet Kumar",
      username: "sanjeetkumar88",
      logo: "https://i.imgur.com/1J5JofQ.png", // Replace with the actual author's logo
    },
    members: [
      {
        id: 1,
        logo: "https://i.imgur.com/1J5JofQ.png",
        name: "John Doe",
        username: "johndoe",
      },
      {
        id: 2,
        logo: "https://i.imgur.com/2J3JofQ.png",
        name: "Jane Smith",
        username: "janesmith",
      },
      {
        id: 3,
        logo: "https://i.imgur.com/3J1JofQ.png",
        name: "Alice Johnson",
        username: "alicejohnson",
      },
      {
        id: 4,
        logo: "https://i.imgur.com/3J1JofQ.png",
        name: "Alice Johnson",
        username: "alicejohnson",
      },
      {
        id: 5,
        logo: "https://i.imgur.com/3J1JofQ.png",
        name: "Alice Johnson",
        username: "alicejohnson",
      },
    ],
  },
};

const ProjectDetail = () => {
  const { id } = useParams();
  const [projectData, setProjectData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await axios.get(`/devproject/${id}`);
        setProjectData(response.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load project.");
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, []);

  const {
    title,
    description,
    problemStatement,
    category,
    status,
    liveLink,
    githubLink,
    technologiesUsed,
    author,
    members,
  } = data.project;

  const SectionHeader = ({ title }) => (
    <h3 className="text-2xl font-semibold mb-3 text-gray-700">{title}</h3>
  );

  const TechBadges = ({ technologies }) => (
    <div className="flex flex-wrap gap-4">
      {technologies.map((tech, idx) => (
        <Badge
          key={idx}
          color="blue"
          variant="light"
          size="lg"
          radius="md"
          className="capitalize hover:scale-110 transition-transform duration-300 cursor-pointer"
        >
          {tech}
        </Badge>
      ))}
    </div>
  );

  const Links = ({ liveLink, githubLink }) => (
    <div className="flex gap-6">
      <Anchor
        href={liveLink}
        target="_blank"
        className="flex items-center gap-2 text-blue-600 hover:underline hover:scale-105 transition-transform text-lg"
      >
        <FaExternalLinkAlt /> Live Demo
      </Anchor>
      <Anchor
        href={githubLink}
        target="_blank"
        className="flex items-center gap-2 text-gray-800 hover:underline hover:scale-105 transition-transform text-lg"
      >
        <FaGithub /> GitHub Repo
      </Anchor>
    </div>
  );

  const TeamMembers = ({ members }) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {members.map((member) => (
        <motion.div whileHover={{ scale: 1.05 }} key={member.id}>
          <UserCardSm
            logo={member.logo}
            name={member.name}
            username={member.username}
            role="Admin"
          />
        </motion.div>
      ))}
    </div>
  );

  return (
    <div className="bg-gradient-to-b from-gray-100 to-white text-gray-900 min-h-screen p-8">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Cover Image */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="rounded-lg overflow-hidden shadow-2xl hover:scale-[1.02] transition-all duration-300"
        >
          <ProjectCover coverImage="https://i.imgur.com/Vz81GEl.jpg" />
        </motion.div>

        {/* Title and Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="flex flex-col md:flex-row justify-between items-center gap-6 mt-10"
        >
          <h1 className="text-4xl font-bold text-gray-800 leading-tight tracking-wide">
            {title}
          </h1>
          <Button
            variant="gradient"
            gradient={{ from: "yellow", to: "orange", deg: 45 }}
            size="md"
            radius="lg"
            leftSection={<FaUserPlus />}
            className="shadow-md hover:scale-105 transition-transform duration-300"
          >
            Join Now
          </Button>
        </motion.div>

        {/* Author Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mt-8"
        >
          <SectionHeader title="Author" />
          <UserCardSm
            logo={author.logo}
            name={author.name}
            username={author.username}
            role="Admin"
          />
        </motion.div>

        {/* Technologies Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mt-8"
        >
          <SectionHeader title="Technologies Used" />
          <TechBadges technologies={technologiesUsed} />
        </motion.div>

        {/* Category Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mt-6"
        >
          <SectionHeader title="Category" />
          <Badge
            color="grape"
            variant="filled"
            size="lg"
            radius="md"
            className="text-lg"
          >
            {category}
          </Badge>
        </motion.div>

        {/* Problem Statement Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-8"
        >
          <SectionHeader title="Problem Statement" />
          <Text size="lg" className="text-gray-600 leading-relaxed">
            {problemStatement}
          </Text>
        </motion.div>

        {/* Project Status Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="mt-6"
        >
          <SectionHeader title="Project Status" />
          <Badge
            color={status === "Completed" ? "green" : "yellow"}
            variant="outline"
            size="lg"
            radius="md"
            className="shadow-sm hover:bg-green-50 transition-colors"
          >
            {status}
          </Badge>
        </motion.div>

        {/* Description Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="mt-6"
        >
          <SectionHeader title="Description" />
          <Text size="lg" className="text-gray-600 leading-relaxed">
            {description}
          </Text>
        </motion.div>

        {/* Links Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-8"
        >
          <SectionHeader title="Project Links" />
          <Links liveLink={liveLink} githubLink={githubLink} />
        </motion.div>

        {/* Team Members Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="mt-10"
        >
          <SectionHeader title="Team Members" />
          <TeamMembers members={members} />
        </motion.div>
      </div>
    </div>
  );
};

export default ProjectDetail;
