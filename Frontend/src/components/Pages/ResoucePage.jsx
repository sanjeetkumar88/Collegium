import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import { Card, Image, Text, Badge, Button, Group, Select, Pagination } from "@mantine/core";

const ResourcePage = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [searchParams, setSearchParams] = useSearchParams();

  // Derive page directly from searchParams
  const page = parseInt(searchParams.get("page") || 1);

  // Filters
  const type = searchParams.get("type") || "";
  const [subject, setSubject] = useState("");
  const [title, setTitle] = useState("");
  const [branch, setBranch] = useState("");
  const [userId, setUserId] = useState("");
  const [limit, setLimit] = useState(10);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        setLoading(true);

        const query = new URLSearchParams({
          type,
          ...(subject && { subject }),
          ...(title && { title }),
          ...(branch && { branch }),
          page, // Directly controlled by searchParams
          ...(userId && { userId, isPublic: "false" }),
          ...(limit && {limit}),
        }).toString();

        console.log("Fetching notes with query:", query);

        const response = await axios.get(`notes/getnotes?${query}`);
        setNotes(response.data.data.notes);
        setTotalPages(response.data.data.totalPages);
      } catch (error) {
        console.error("Error fetching notes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, [type, subject, title, branch, page, userId,limit]);

  // Handle page change and update searchParams directly (no extra state)
  const handlePageChange = (newPage) => {
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      newParams.set("page", newPage); // Sync page in the URL
      return newParams;
    });
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">Notes</h1>

      {/* Filter Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <input
          type="text"
          className="p-2 border rounded-lg"
          placeholder="Search by Subject..."
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />

        <input
          type="text"
          className="p-2 border rounded-lg"
          placeholder="Search by Title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

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
            "Other",
          ]}
          value={branch}
          onChange={setBranch}
        />
      </div>

      {loading ? (
        <p>Loading notes...</p>
      ) : notes.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {notes.map((note) => (
              <Card key={note._id} shadow="sm" padding="lg" radius="md" withBorder>
                <Card.Section>
                  <Image src={note.fileUrl} height={160} alt={note.title} />
                </Card.Section>

                <Group justify="space-between" mt="md" mb="xs">
                  <Text fw={500}>{note.title}</Text>
                  <Badge color="pink">{note.subject}</Badge>
                </Group>

                <Text size="sm" c="dimmed">
                  {note.description}
                </Text>

                <Button
                  color="blue"
                  fullWidth
                  mt="md"
                  radius="md"
                  component="a"
                  href={note.fileUrl ? note.fileUrl : "#"}
                  download={note.fileUrl ? `Note-${note.title}.pdf` : undefined}
                  target="_blank"
                  rel="noopener noreferrer"
                  disabled={!note.fileUrl}
                >
                  {note.fileUrl ? "Download Note" : "No File Available"}
                </Button>
              </Card>
            ))}
          </div>

          {/* Pagination Component */}
          <div className="flex justify-center mt-6">
            <Pagination total={totalPages} value={page} onChange={handlePageChange} />
          </div>
        </>
      ) : (
        <p>No notes found.</p>
      )}
    </div>
  );
};

export default ResourcePage;
