import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Select, Chip, Button, Pagination } from "@mantine/core";
import { motion } from "framer-motion";
import { FiFilter } from "react-icons/fi";
import { IoIosAddCircle } from "react-icons/io";
import * as clubApi from "../api/club";
import ClubCard from "../components/features/cards/Clubcard";
import { useAuth } from "../context/AuthContext";
import { useClub } from "../context/ClubContext";
import useDebounce from "../hooks/useDebounce";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Club = () => {
  const [clubs, setClubs] = useState([]);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedMembership, setSelectedMembership] = useState("");
  const navigate = useNavigate();
  const auth = useAuth();
  const { handleApply } = useClub();

  const categories = [
    "Sports", "DSA", "MERN", "Cybersecurity",
    "JAVA Developer", "AI", "Data Science",
  ];

  const typeOptions = [
    { label: "All Club", value: "" },
    { label: "Public", value: "public" },
    { label: "Private", value: "private" },
  ];

  const membershipOptions = [
    { label: "ALL", value: "" },
    { label: "Joined", value: "joined" },
    { label: "Not Joined", value: "not_joined" },
  ];

  useEffect(() => {
    const pageQuery = parseInt(searchParams.get("page")) || 1;
    const nameQuery = searchParams.get("name") || "";
    const tagQuery = searchParams.get("tag") || "";
    const typeQuery = searchParams.get("type") || "";
    const membershipQuery = searchParams.get("membership") || "";

    setPage(pageQuery);
    setSearch(nameQuery);
    setSelectedCategory(tagQuery);
    setSelectedType(typeQuery);
    setSelectedMembership(membershipQuery);

    const fetchClubs = async () => {
      try {
        const response = await clubApi.getAllClubs({
          page: pageQuery,
          name: nameQuery,
          tag: tagQuery,
          type: typeQuery,
          membership: membershipQuery
        });
        const { clubs, totalPages } = response.data.data;

        setClubs(clubs);
        setTotalPages(totalPages);

        if (pageQuery > totalPages) {
          setError("No Club Exist");
          setClubs([]);
          toast.warning("No clubs found on this page.");
        } else {
          setError(null);
        }
      } catch (error) {
        console.error("Error fetching clubs:", error);
        setError("Failed to fetch clubs.");
        toast.error("Failed to fetch clubs.");
      }
    };

    fetchClubs();
  }, [searchParams]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedSearch) params.set("name", debouncedSearch);
    if (selectedCategory) params.set("tag", selectedCategory);
    if (selectedType) params.set("type", selectedType);
    if (selectedMembership) params.set("membership", selectedMembership);
    params.set("page", page);
    setSearchParams(params);
  }, [debouncedSearch, selectedCategory, selectedType, selectedMembership, page]);

  const applyToClub = async (clubId) => {
    try {
      await handleApply(clubId, auth.authUser._id);
    } catch (error) {
      console.error("Error applying to club:", error);
      toast.error("Failed to apply to club.");
    }
  };

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />
      
      {/* Background Decor */}
      <div className="absolute inset-0 bg-[url('/texture.svg')] opacity-[0.03] pointer-events-none" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-50/50 blur-[120px] rounded-full -mr-64 -mt-64" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-50/50 blur-[120px] rounded-full -ml-64 -mb-64" />

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        {/* Page Title */}
        <div className="text-center mb-16">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl md:text-6xl font-black tracking-tight mb-6"
          >
            <span className="text-gradient">Discover</span> Clubs
          </motion.h1>
          <p className="text-slate-500 text-lg md:text-xl font-medium max-w-2xl mx-auto">
            Join the most vibrant student communities. Collaborate, learn, and grow together with like-minded peers.
          </p>
        </div>

        {/* Action Bar (Filters & Create) */}
        <motion.div
          className="bg-slate-50/50 backdrop-blur-sm p-8 rounded-[2.5rem] border border-slate-200 shadow-sm mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="flex flex-col lg:flex-row justify-between items-center gap-8">
            <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
              <Select
                placeholder="Club Type"
                value={selectedType}
                data={typeOptions}
                size="lg"
                radius="xl"
                className="flex-1 sm:flex-none sm:w-48"
                onChange={setSelectedType}
              />
              
              <Button
                leftSection={<FiFilter size={18} />}
                onClick={() => setShowFilters(!showFilters)}
                size="lg"
                radius="xl"
                variant={showFilters ? "filled" : "light"}
                className={showFilters ? "bg-blue-600" : "bg-blue-50 text-blue-600"}
              >
                Filters
              </Button>

              {auth.authUser?.role === "admin" && (
                <Button
                  variant="gradient"
                  gradient={{ from: 'blue', to: 'cyan' }}
                  size="lg"
                  radius="xl"
                  leftSection={<IoIosAddCircle size={20} />}
                  onClick={() => navigate("createclub")}
                  className="shadow-lg shadow-blue-500/20"
                >
                  Create Club
                </Button>
              )}
            </div>

            {/* Category Chips */}
            <div className="w-full lg:flex-1 overflow-hidden">
               <div className="flex overflow-x-auto pb-2 scrollbar-hide gap-3 justify-start lg:justify-end">
                {categories.map((cat) => (
                  <Chip
                    key={cat}
                    checked={selectedCategory === cat}
                    onChange={() => setSelectedCategory(selectedCategory === cat ? "" : cat)}
                    variant="filled"
                    color="blue"
                    radius="xl"
                    size="md"
                    className="flex-shrink-0"
                  >
                    {cat}
                  </Chip>
                ))}
              </div>
            </div>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              className="mt-8 pt-8 border-t border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              <div className="relative group">
                <input
                  type="text"
                  value={search}
                  placeholder="Search by club name..."
                  className="w-full pl-4 pr-10 py-3 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-medium"
                  onChange={(e) => setSearch(e.target.value)}
                />
                <FiFilter className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500" />
              </div>

              <Select
                placeholder="Membership"
                value={selectedMembership}
                data={membershipOptions}
                size="md"
                radius="lg"
                onChange={setSelectedMembership}
              />
            </motion.div>
          )}
        </motion.div>

        {/* Clubs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mt-12">
          {clubs.length > 0 ? (
            clubs.map((club, index) => (
              <motion.div
                key={club._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
              >
                <ClubCard
                  coverImg={club.coverimage}
                  profileImg={club.logo}
                  name={club.name}
                  tags={club.tags}
                  status={club.status}
                  id={club._id}
                  onApply={() => applyToClub(club._id)}
                />
              </motion.div>
            ))
          ) : (
            <div className="col-span-full py-20 bg-slate-50 rounded-[3rem] text-center border border-dashed border-slate-200">
               <h3 className="text-2xl font-bold text-slate-800 mb-2">{error || "No clubs found."}</h3>
               <p className="text-slate-500">Try adjusting your search or filters.</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-20 flex justify-center">
            <Pagination
              total={totalPages}
              value={page}
              onChange={setPage}
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
};

export default Club;
