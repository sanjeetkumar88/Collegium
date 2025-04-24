import React, { useState } from 'react';
import { Badge, Modal, TextInput, Textarea, Select, Checkbox, Button } from "@mantine/core";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useDisclosure } from '@mantine/hooks';
import axios from 'axios';
import { modals } from '@mantine/modals';

const branches = [
  "Computer Science", "Mechanical", "Electrical", "Civil", "Electronics", 
  "Biotechnology", "IT", "Chemical", "Common", "Other"
];

const ResourseCard = ({
  title,
  description,
  imgurl,
  download,
  subject,
  time,
  isAuthor,
  isAdmin,
  noteId,
  onUpdate,
  branch,
}) => {
  const [editOpened, { open: openEdit, close: closeEdit }] = useDisclosure(false);
  const [formData, setFormData] = useState({ title, description, subject, branch, isPublic: true });

  

  const handleDelete = () => {
    modals.openConfirmModal({
      title: 'Confirm Delete',
      centered: true,
      children: <p>Are you sure you want to delete this note?</p>,
      labels: { confirm: 'Delete', cancel: 'Cancel' },
      confirmProps: { color: 'red' },
      onConfirm: async () => {
        try {
          await axios.delete(`/notes/${noteId}`, { withCredentials: true });
          onUpdate?.(); // callback to remove it from UI
        } catch (err) {
          console.error("Delete error:", err);
        }
      },
    });
  };

  const handleEditSubmit = async () => {
    try {
      await axios.put(
        `/notes/${noteId}`,
        { ...formData },
        { withCredentials: true }
      );
      onUpdate?.();
      closeEdit();
    } catch (err) {
      console.error("Edit error:", err);
    }
  };

  return (
    <div className="w-64 h-96 bg-white text-gray-800 rounded-3xl p-4 shadow-md hover:shadow-xl transition-all flex flex-col justify-between border border-gray-200 hover:border-blue-400 relative">
      
      {/* Edit/Delete Icons */}
      {(isAuthor || isAdmin) && (
        <>
          <FaTrash
            className="absolute top-3 left-3 text-red-500 hover:text-red-700 cursor-pointer z-10"
            onClick={handleDelete}
          />
          <FaEdit
            className="absolute top-3 right-3 text-blue-500 hover:text-blue-700 cursor-pointer z-10"
            onClick={openEdit}
          />
        </>
      )}

      {/* Thumbnail */}
      <div className="w-full h-40 bg-gray-200 rounded-xl overflow-hidden flex items-center justify-center">
        {imgurl ? (
          <img
            src={imgurl}
            alt={title}
            className="w-full h-full object-cover rounded-xl"
          />
        ) : (
          <span className="text-gray-400 text-sm italic">No Image</span>
        )}
      </div>

      {/* Title & Badge */}
      <div className="flex justify-between items-center mt-2">
        <h3 className="font-bold text-lg truncate">{title}</h3>
        <Badge color="blue" variant="light" size="sm">{subject}</Badge>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-600 mt-1 line-clamp-2">{description}</p>

      {/* Action & Time */}
      <div className="mt-4 w-full">
        {download ? (
          <a
            href={download}
            download={`Note-${title.replace(/\s+/g, "_")}.pdf`}
            className="w-full block text-center bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold py-2 rounded-xl hover:from-blue-600 hover:to-indigo-600 transition-colors"
          >
            View Notes
          </a>
        ) : (
          <button
            disabled
            className="w-full bg-gray-300 text-gray-600 font-semibold py-2 rounded-xl cursor-not-allowed"
          >
            No File Available
          </button>
        )}

        {/* Time */}
        {time && (
          <div className="text-right mt-2 text-xs text-gray-500 italic">
            {time}
          </div>
        )}
      </div>

      {/* Edit Modal */}
      <Modal
        opened={editOpened}
        onClose={closeEdit}
        title="Edit Note"
        centered
        size="lg"
      >
        <div className="space-y-4">
          <TextInput
            label="Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
          <Textarea
            label="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
          <TextInput
            label="Subject"
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
          />
          <Select
            label="Branch"
            data={branches}
            value={formData.branch}
            onChange={(val) => setFormData({ ...formData, branch: val })}
          />
          <Checkbox
            label="Public Note"
            checked={formData.isPublic}
            onChange={(e) => setFormData({ ...formData, isPublic: e.currentTarget.checked })}
          />
          <Button onClick={handleEditSubmit} color="blue" fullWidth mt="md">
            Save Changes
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default ResourseCard;
