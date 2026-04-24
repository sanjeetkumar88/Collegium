import React, { useState, useEffect } from "react";
import * as notesApi from "../api/notes";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Select, Pagination, Loader, Button, Tabs } from "@mantine/core";
import { motion } from "framer-motion";
import ResourseCard from "../components/features/cards/ResourseCard";
import { useAuth } from "../context/AuthContext";
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

      const response = await notesApi.getNotes({
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
      className="min-h-screen bg-white relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Background Texture & Blobs */}
      <div className="absolute inset-0 bg-[url('/texture.svg')] opacity-[0.03] pointer-events-none" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100/50 blur-3xl rounded-full -mr-48 -mt-48" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-100/50 blur-3xl rounded-full -ml-48 -mb-48" />

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-24">
        {/* Heading Section */}
        <div className="text-center mb-16">
          <motion.h1
            className="text-5xl font-black tracking-tight mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-gradient">Explore</span> the Notes Library
          </motion.h1>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto">
            Access a vast collection of notes, previous year papers, and study resources shared by the community.
          </p>
        </div>

        {/* Action Bar (Tabs & Upload) */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-12">
          {/* Tabs */}
          <div className="w-full md:w-auto">
            <Tabs value={activeTab} onChange={setActiveTab} radius="xl" color="blue" variant="pills">
              <Tabs.List className="bg-slate-100/50 p-1 rounded-full backdrop-blur-sm border border-slate-200">
                <Tabs.Tab value="explore" leftSection={<FaBookOpen size={16} />} className="font-semibold px-6">
                  Explore
                </Tabs.Tab>
                <Tabs.Tab value="your" disabled={!isLoggedIn} leftSection={<FaUserAlt size={16} />} className="font-semibold px-6">
                  Your Notes
                </Tabs.Tab>
                <Tabs.Tab value="bookmarked" disabled={!isLoggedIn} leftSection={<FaBookmark size={16} />} className="font-semibold px-6">
                  Bookmarked
                </Tabs.Tab>
              </Tabs.List>
            </Tabs>
          </div>

          {/* Upload Button */}
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={handleUploadNotesClick}
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 rounded-2xl shadow-lg shadow-blue-600/20 transition-all font-bold"
              leftSection={<FaUpload />}
            >
              Upload Your Notes
            </Button>
          </motion.div>
        </div>

        {/* Filters Grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16 p-8 rounded-[2rem] bg-slate-50/50 border border-slate-200 backdrop-blur-sm shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          {/* Subject Filter */}
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
              <FaSearch size={16} />
            </div>
            <input
              type="text"
              className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400 text-slate-700 font-medium"
              placeholder="Search by Subject..."
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>

          {/* Title Filter */}
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
              <FaSearch size={16} />
            </div>
            <input
              type="text"
              className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400 text-slate-700 font-medium"
              placeholder="Search by Title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Branch Filter */}
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
            size="lg"
            radius="xl"
            value={branch}
            onChange={setBranch}
            className="w-full"
            styles={{
              input: {
                paddingTop: '0.875rem',
                paddingBottom: '0.875rem',
                border: '1px solid #e2e8f0',
                borderRadius: '1rem',
                fontWeight: 500,
              }
            }}
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
      </main>
    </motion.div>
  );
};

export default ResourcePage;
