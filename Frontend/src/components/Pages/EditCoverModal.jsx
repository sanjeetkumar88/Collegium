import { Modal, FileInput, Button } from "@mantine/core";
import { useState } from "react";
import axios from "axios";

const EditCoverModal = ({ opened, onClose, projectId }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!file) return alert("Please select an image");
    const formData = new FormData();
    formData.append("coverImage", file);

    try {
      setLoading(true);
      await axios.post(`/devproject/${projectId}/editcoverimg`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Cover image updated");
      onClose();
      window.location.reload(); // refresh to fetch new image
    } catch (err) {
      alert("Failed to update cover image");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal opened={opened} onClose={onClose} title="Edit Cover Image" centered>
      <FileInput
        label="Upload New Cover Image"
        placeholder="Select image"
        onChange={setFile}
        accept="image/*"
      />
      <Button
        fullWidth
        mt="md"
        onClick={handleSubmit}
        loading={loading}
        disabled={!file}
      >
        Update
      </Button>
    </Modal>
  );
};

export default EditCoverModal;
