import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Pagination, Button, Group } from "@mantine/core";
import { Carousel } from "@mantine/carousel";
import ClubCard from "../Cardcomp/Clubcard";
import axios from "axios";

const Club = () => {
  const [clubs, setClubs] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const predefinedTags = [
    "Sports",
    "DSA",
    "MERN",
    "Cybersecurity",
    "JAVA Developer",
    "AI",
    "Data Science",
  ];

  useEffect(() => {
    const pageQuery = parseInt(searchParams.get("page")) || 1;
    setPage(pageQuery);

    const fetchClubs = async () => {
      try {
        const response = await axios.get(
          `/club/getallclub?page=${pageQuery}&name=${search}`
        );
        setClubs(response.data.data.clubs);
        setTotalPages(response.data.data.totalPages);

        if (pageQuery > response.data.data.totalPages) {
          setError("Page does not exist");
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
  }, [searchParams, search]); // Corrected dependency array

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-center text-black mb-6">
        Discover Clubs
      </h1>

      <input
        type="text"
        placeholder="Search clubs..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="p-2 border rounded-md mb-4"
      />

      <Group justify="center" gap="xs" className="mb-3">
        {predefinedTags.map((tag, index) => (
          <div key={index}>
            <Button variant="outline" className="px-6 py-2 text-lg ">
              {tag}
            </Button>
          </div>
        ))}
      </Group>

      {error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {clubs.map((club) => (
            <div key={club._id} onClick={() => navigate(`/community/${club._id}`)}>
              <ClubCard
                coverImg={club.coverimage}
                profileImg={club.logo}
                name={club.name}
                tags={club.tags || []}
                status={club.status}
              />
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-center mt-6">
        <Pagination
          total={totalPages}
          page={page}
          onChange={(newPage) =>
            setSearchParams((prev) => ({
              ...Object.fromEntries(prev),
              page: newPage,
            }))
          }
          color="blue"
          size="md"
        />
      </div>
    </div>
  );
};

export default Club;
