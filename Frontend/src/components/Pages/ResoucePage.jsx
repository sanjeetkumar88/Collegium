import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";

const ResourcePage = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  // Extract query parameters from URL
  const tags = searchParams.get("tags") || "";
  const page = searchParams.get("page") || 1;
  const userId = searchParams.get("userId") || ""; // Only for private notes

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        setLoading(true);
        const query = new URLSearchParams({
          tags,
          page,
          ...(userId && { userId, isPublic: "false" }) // Only include userId & isPublic if userId exists
        }).toString();

        const response = await axios.get(
          `notes/getnotes?${query}`
        );

        setNotes(response.data.data.notes);
      } catch (error) {
        console.error("Error fetching notes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, [tags, page, userId]);

  const handleFilterChange = (filterType, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(filterType, value);
    } else {
      newParams.delete(filterType);
    }
    setSearchParams(newParams);
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-semibold text-gray-800 mb-4">Notes</h1>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <input
          type="text"
          className="p-2 border rounded"
          placeholder="Tags (comma-separated)"
          value={tags}
          onChange={(e) => handleFilterChange("tags", e.target.value)}
        />
      </div>

      {/* Notes List */}
      {loading ? (
        <p>Loading notes...</p>
      ) : notes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {notes.map((note) => (
            <div
              key={note._id}
              className="p-4 border rounded shadow-md hover:shadow-lg transition"
            >
              <h2 className="text-xl font-semibold text-gray-800">{note.title}</h2>
              <p className="text-gray-600">{note.description}</p>
              <p className="text-sm text-gray-500">
                Tags: {note.tags?.join(", ") || "None"}
              </p>
              {note.fileUrl && (
                <a
                  href={note.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 mt-2 block"
                >
                  View File
                </a>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p>No notes found.</p>
      )}
    </div>
  );
};

export default ResourcePage;
