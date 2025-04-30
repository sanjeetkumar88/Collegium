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
} from "react-icons/fa";
import ProjectCover from "../Cardcomp/projectDetail/ProjectCover";
import UserCardSm from "../Cardcomp/projectDetail/UserCardSm";
import { useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import JoinRequestModal from "../joinRequestModal";
import EditCoverModal from "./EditCoverModal";
import EditProjectDetailsModal from "./EditProjectDetailsModal";

const ProjectDetail = () => {
  const { id } = useParams();
  const [projectData, setProjectData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [roleInput, setRoleInput] = useState("");
  const [roleInputModel, setRoleInputModel] = useState(false);
  const [editCoverOpen, setEditCoverOpen] = useState(false);
  const [editDetailsOpen,setEditDetailsOpen]  = useState(false);

  const auth = useAuth();

  const [joinModalOpen, setJoinModalOpen] = useState(false);


  const fetchProject = async () => {
    try {
      const response = await axios.get(`/devproject/${id}`);
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

  useEffect(() => {
    

    fetchProject();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!projectData) return null;

  const isMember = projectData.members?.some(
    (member) => member.username === auth.authUser.username
  );

  const isAuthor = auth.authUser.username === projectData.author.username;

  // console.log(isAuthor, !isMember);

  return (
    <div className="bg-gradient-to-b from-gray-100 to-white text-gray-900 min-h-screen p-8">
      <div className="max-w-5xl mx-auto space-y-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative rounded-lg overflow-hidden shadow-2xl hover:scale-[1.02] transition-all duration-300"
        >
          <ProjectCover coverImage={projectData.coverImage} />

          {/* Edit Cover Image Button */}
          {auth.authUser && (isAuthor || auth.authUser.role === "admin") && (
            <button
              onClick={() => setEditCoverOpen(true)}
              className="absolute top-4 right-4 bg-white p-2 rounded-full shadow hover:scale-105 transition-transform cursor-pointer"
              title="Edit Cover Image"
            >
              <FaEdit />
            </button>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="flex flex-col md:flex-row justify-between items-center gap-6 mt-10"
        >
          <h1 className="text-4xl font-bold text-gray-800 leading-tight tracking-wide">
            {projectData.title}
          </h1>
          <Menu shadow="md" width={200}>
            <Menu.Target>
              <Button
                variant="gradient"
                gradient={{ from: "yellow", to: "orange", deg: 45 }}
                size="md"
                radius="lg"
                leftSection={<FaEllipsisH />}
                className="shadow-md hover:scale-105 transition-transform duration-300"
              >
                Actions
              </Button>
            </Menu.Target>
            <Menu.Dropdown>
              {!isMember && !isAuthor && projectData.openForCollaboration && (
                <Menu.Item
                  icon={<FaUserPlus />}
                  onClick={() => setRoleInputModel(true)}
                >
                  Request to Join
                </Menu.Item>
              )}

              {isMember && (
                <Menu.Item
                  icon={<FaSignOutAlt />}
                  color="red"
                  onClick={async () => {
                    try {
                      const response = await axios.post(
                        `/devproject/${id}/leave`
                      );
                      alert(response.data.message || "Left the project");
                    } catch (error) {
                      alert("Failed to leave project");
                      console.error(error);
                    }
                  }}
                >
                  Leave Project
                </Menu.Item>
              )}

              {isAuthor && (
                <Menu.Item
                  icon={<FaUserPlus />}
                  onClick={() => setJoinModalOpen(true)}
                >
                  View Join Requests
                </Menu.Item>
              )}

              {(isAuthor || auth.authUser.role === "admin") && (
                <Menu.Item
                  icon={<FaEdit />}
                  onClick={() => setEditDetailsOpen(true)}
                >
                  Edit Project Details
                </Menu.Item>
              )}
            </Menu.Dropdown>
          </Menu>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mt-8"
        >
          <h3 className="text-2xl font-semibold mb-3 text-gray-700">Author</h3>
          <UserCardSm
            logo={projectData.author.logo}
            name={projectData.author.name}
            username={projectData.author.username}
            role="Admin"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-8"
        >
          <h3 className="text-2xl font-semibold mb-3 text-gray-700">
            Technologies Used
          </h3>
          <div className="flex flex-wrap gap-4">
            {projectData.technologiesUsed.map((tech, idx) => (
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
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mt-6"
        >
          <h3 className="text-2xl font-semibold mb-3 text-gray-700">
            Category
          </h3>
          <Badge
            color="grape"
            variant="filled"
            size="lg"
            radius="md"
            className="text-lg"
          >
            {projectData.category}
          </Badge>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="mt-8"
        >
          <h3 className="text-2xl font-semibold mb-3 text-gray-700">
            Problem Statement
          </h3>
          <Text size="lg" className="text-gray-600 leading-relaxed">
            {projectData.problemStatement}
          </Text>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="mt-6"
        >
          <h3 className="text-2xl font-semibold mb-3 text-gray-700">
            Project Status
          </h3>
          <Badge
            color={projectData.status === "Completed" ? "green" : "yellow"}
            variant="outline"
            size="lg"
            radius="md"
            className="shadow-sm hover:bg-green-50 transition-colors"
          >
            {projectData.status}
          </Badge>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-6"
        >
          <h3 className="text-2xl font-semibold mb-3 text-gray-700">
            Description
          </h3>
          <Text size="lg" className="text-gray-600 leading-relaxed">
            {projectData.description}
          </Text>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="mt-8"
        >
          <h3 className="text-2xl font-semibold mb-3 text-gray-700">
            Project Links
          </h3>
          <div className="flex gap-6">
            <Anchor
              href={projectData.liveLink}
              target="_blank"
              className="flex items-center gap-2 text-blue-600 hover:underline hover:scale-105 transition-transform text-lg"
            >
              <FaExternalLinkAlt /> Live Demo
            </Anchor>
            <Anchor
              href={projectData.githubLink}
              target="_blank"
              className="flex items-center gap-2 text-gray-800 hover:underline hover:scale-105 transition-transform text-lg"
            >
              <FaGithub /> GitHub Repo
            </Anchor>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0, duration: 0.6 }}
          className="mt-10"
        >
          <h3 className="text-2xl font-semibold mb-3 text-gray-700">
            Team Members
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {projectData.members.map((member) => (
              <motion.div whileHover={{ scale: 1.05 }} key={member.id}>
                <UserCardSm
                  logo={member.logo}
                  name={member.name}
                  username={member.username}
                  role="Member"
                />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Join Request Modal */}
      <Modal
        opened={roleInputModel}
        onClose={() => setRoleInputModel(false)}
        title="Request to Join Project"
        centered
      >
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            try {
              const response = await axios.post(
                `/devproject/${id}/joinprojectrequest`,
                { role: roleInput }
              );
              alert(response.data.message || "Join request sent");
              setRoleInputModel(false);
            } catch (error) {
              alert("Failed to request join");
              console.error(error);
            }
          }}
        >
          <TextInput
            label="Your Role"
            placeholder="e.g. Frontend Developer"
            value={roleInput}
            onChange={(e) => setRoleInput(e.currentTarget.value)}
            required
          />
          <Button type="submit" mt="md" fullWidth>
            Submit Request
          </Button>
        </form>
      </Modal>

      <JoinRequestModal
        opened={joinModalOpen}
        onClose={() => setJoinModalOpen(false)}
        projectId={id}
      />
      <EditCoverModal
        opened={editCoverOpen}
        onClose={() => setEditCoverOpen(false)}
        projectId={id}
      />

      <EditProjectDetailsModal 
      projectData={projectData}
      opened={editDetailsOpen}
      onClose={() => setEditDetailsOpen(false)}
      onSave={() => fetchProject()}
      />
    </div>
  );
};

export default ProjectDetail;
