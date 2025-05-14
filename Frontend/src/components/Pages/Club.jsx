import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import ClubCard from "../Cardcomp/Clubcard";
import axios from "axios";
import { motion } from "framer-motion";
import { Select, Button, Chip, Pagination } from "@mantine/core";
import { FiFilter } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import { IoIosAddCircle } from "react-icons/io";
import { useDebounce } from "use-debounce";
import { useClub } from "../../context/ClubContext";

const Club = () => {
  const [clubs, setClubs] = useState([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 500);
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

  const categories = [
    "Sports",
    "DSA",
    "MERN",
    "Cybersecurity",
    "JAVA Developer",
    "AI",
    "Data Science",
  ];

  const typeOptions = [
    { label: "All Club", value: "" },
    { label: "Public", value: "public" },
    { label: "Private", value: "private" },
  ];

  const membershipOptions = [
    { label: "ALL", value: "" },
    { label: "Joined", value: "joined" },
    {label:"Not Joined",value:"not_joined"},
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
        const response = await axios.get(
          `/club/getallclub?page=${pageQuery}&name=${nameQuery}&tag=${tagQuery}&type=${typeQuery}&membership=${membershipQuery}`
        );
        setClubs(response.data.data.clubs);
        setTotalPages(response.data.data.totalPages);

        if (pageQuery > response.data.data.totalPages) {
          setError("No Club Exist");
          setClubs([]);
        } else {
          setError(null);
        }
      } catch (error) {
        console.error("Error fetching clubs:", error);
        setError("Failed to fetch clubs.");
      }
    };
    fetchClubs();
  }, [searchParams]);

  // Update searchParams when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedSearch) params.set("name", debouncedSearch);
    if (selectedCategory) params.set("tag", selectedCategory);
    if (selectedType) params.set("type", selectedType);
    if (selectedMembership) params.set("membership", selectedMembership);
    params.set("page", page);
    setSearchParams(params);
  }, [debouncedSearch, selectedCategory, selectedType, selectedMembership, page]);

   const {handleApply} = useClub();

  

  return (
    <div className="p-6">
      <motion.h1
        className="text-5xl font-bold text-center text-gray-800 drop-shadow-sm tracking-wide"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        Discover Clubs
      </motion.h1>

      {auth.authUser?.role === "admin" && (
        <Button
          variant="light"
          leftSection={<IoIosAddCircle size={14} />}
          className="p-6 space-y-6 ml-5"
          onClick={() => navigate("createclub")}
        >
          Create Club
        </Button>
      )}

      <div className="p-6 space-y-6">
        {/* Top Filter Row */}
        <div className="flex flex-wrap justify-center items-center gap-4 text-center">
          {/* Club Type Filter */}
          <Select
            placeholder="Select club type"
            value={selectedType}
            data={typeOptions}
            w={160}
            styles={{ input: { borderRadius: "8px" } }}
            onChange={(value) => setSelectedType(value)}
          />

          {/* Category Chips */}
          <div className="flex justify-center flex-1 min-w-[200px] overflow-x-auto whitespace-nowrap scrollbar-hide items-center">
            <div className="flex gap-3 w-max justify-center">
              {categories.map((cat) => (
                <Chip
                  key={cat}
                  checked={selectedCategory === cat}
                  onChange={() =>
                    setSelectedCategory(selectedCategory === cat ? "" : cat)
                  }
                  variant="light"
                  radius="md"
                >
                  {cat}
                </Chip>
              ))}
            </div>
          </div>

          {/* Show Filters Toggle */}
          <Button
            leftSection={<FiFilter size={16} />}
            onClick={() => setShowFilters(!showFilters)}
            variant="light"
            color="blue"
          >
            Filters
          </Button>
        </div>

        {/* Filter Input Fields */}
        {showFilters && (
          <div className="mt-4 flex flex-wrap justify-center gap-4">
            {/* Name Search */}
            <input
              type="text"
              value={search}
              placeholder="Search by Name"
              className="w-full md:w-80 px-4 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              onChange={(e) => setSearch(e.target.value)}
            />

            {/* Membership Filter */}
            <Select
              placeholder="Membership"
              value={selectedMembership}
              data={membershipOptions}
              w={160}
              styles={{ input: { borderRadius: "8px" } }}
              onChange={(value) => setSelectedMembership(value)}
              className=""
            />
          </div>
        )}
      </div>

      {/* Club Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mt-8">
        {clubs.length > 0 ? (
          clubs.map((club, index) => (
            <ClubCard
              key={index}
              coverImg={club.coverimage}
              profileImg={club.logo}
              name={club.name}
              tags={club.tags}
              status={club.status}
              id={club._id}
              onApply={() => handleApply(club._id, auth.authUser._id)}
            />
          ))
        ) : (
          <div className="col-span-full text-center text-gray-500 mt-6">
            {error || "No clubs found."}
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          total={totalPages}
          value={page}
          onChange={(newPage) => setPage(newPage)}
          size="md"
          radius="lg"
          withEdges
          className="mt-8 flex justify-center"
        />
      )}
    </div>
  );
};

export default Club;
