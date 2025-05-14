import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Select, Pagination, Loader, Button, Tabs } from "@mantine/core";
import { motion } from "framer-motion";
import ResourseCard from "../Cardcomp/ResourseCard";
import { useAuth } from "../../context/AuthContext";
import { FaSearch, FaBookOpen, FaUserAlt, FaBookmark, FaUpload } from "react-icons/fa";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

const ResourcePage = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState("explore");

  const userData = useAuth();
  const navigate = useNavigate();

  const page = parseInt(searchParams.get("page") || 1);
  const type = searchParams.get("type") || "";
  const [subject, setSubject] = useState("");
  const [title, setTitle] = useState("");
  const [branch, setBranch] = useState("");
  const [limit, setLimit] = useState(10);
  const isLoggedIn = !!userData.authUser;
 
  

  const handleUploadNotesClick = () => {
    navigate(isLoggedIn ? "/resources/uploadnotes" : "/login");
  };
  const fetchNotes = async () => {
    try {
      setLoading(true);

      const query = new URLSearchParams({
        type,
        ...(subject && { subject }),
        ...(title && { title }),
        ...(branch && { branch }),
        page,
        ...(limit && { limit }),
        ...(activeTab === "your" && userData?.authUser?._id
          ? { userId: userData.authUser._id }
          : {}),
        ...(activeTab === "bookmarked" && isLoggedIn
          ? { isBookmarked: "true" }
          : {}),
      }).toString();

      const response = await axios.get(`notes/getnotes?${query}`, {
        withCredentials: true,
      });
      setNotes(response.data.data.notes);
      setTotalPages(response.data.data.totalPages);
    } catch (error) {
      console.error("Error fetching notes:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    

    fetchNotes();
  }, [type, subject, title, branch, page, limit, activeTab, userData]);

  const handlePageChange = (newPage) => {
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      newParams.set("page", newPage);
      return newParams;
    });
  };

  

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Heading */}
      <motion.h1
        className="text-4xl font-bold text-blue-700 mb-10 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        📚 Explore the Notes Library
      </motion.h1>

      {/* Tabs with Icons */}
      <div className="flex justify-center mb-6">
        <Tabs value={activeTab} onChange={setActiveTab} radius="lg" color="blue">
          <Tabs.List grow>
            <Tabs.Tab value="explore" leftSection={<FaBookOpen size={18} />}>
              Explore
            </Tabs.Tab>
            <Tabs.Tab value="your" disabled={!isLoggedIn} leftSection={<FaUserAlt size={18} />}>
              Your Notes
            </Tabs.Tab>
            <Tabs.Tab value="bookmarked" disabled={!isLoggedIn} leftSection={<FaBookmark size={18} />}>
              Bookmarked
            </Tabs.Tab>
          </Tabs.List>
        </Tabs>
      </div>

      {/* Upload Button */}
      <div className="text-center mb-10">
        <Button
          onClick={handleUploadNotesClick}
          size="lg"
          color="blue"
          radius="xl"
          leftSection={<FaUpload />}
        >
          Upload Your Notes
        </Button>
      </div>

      {/* Filters */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {/* Subject */}
        <div className="relative">
          <input
            type="text"
            className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none w-full"
            placeholder="Search by Subject..."
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
          <FaSearch className="absolute right-3 top-4 text-gray-400" />
        </div>

        {/* Title */}
        <div className="relative">
          <input
            type="text"
            className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none w-full"
            placeholder="Search by Title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <FaSearch className="absolute right-3 top-4 text-gray-400" />
        </div>

        {/* Branch */}
        <Select
          placeholder="Select Branch"
          data={[
            "Computer Science",
            "Mechanical",
            "Electrical",
            "Civil",
            "Electronics",
            "Biotechnology",
            "IT",
            "Chemical",
            "Common",
            "Other",
          ]}
          size="md"
          radius="md"
          value={branch}
          onChange={setBranch}
        />
      </motion.div>

      {/* Notes Display */}
      {loading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <Loader size="lg" color="blue" />
        </div>
      ) : notes.length > 0 ? (
        <>
          <motion.div
            className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.1 },
              },
            }}
          >
            {notes.map((note, idx) => (
              <motion.div
                key={idx}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
                whileHover={{ scale: 1.03 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                
                <ResourseCard
                  title={note.title}
                  description={note.description}
                  subject={note.subject}
                  download={note.fileUrl}
                  time={dayjs(note.createdAt).fromNow()}
                  imgurl={note.thumbnail}
                  isAuthor={note.author === userData?.authUser?._id}
                  isAdmin = {userData?.authUser?.role === "admin"}
                  noteId = {note._id}
                  branch = {note.branch}
                  onUpdate={fetchNotes}
                />
              </motion.div>
            ))}
          </motion.div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-10">
              <Pagination
                total={totalPages}
                value={page}
                onChange={handlePageChange}
                color="blue"
                size="md"
                radius="lg"
              />
            </div>
          )}
        </>
      ) : (
        <motion.div
          className="text-center mt-20 text-gray-600 text-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <p>😕 No notes found. Try adjusting your filters!</p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ResourcePage;
