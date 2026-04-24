import React, { useState } from 'react';
import { Badge, Modal, TextInput, Textarea, Select, Checkbox, Button } from "@mantine/core";
import { FaEdit, FaTrash, FaBookOpen } from "react-icons/fa";
import { useDisclosure } from '@mantine/hooks';
import * as notesApi from "../../../api/notes";
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
          await notesApi.deleteNote(noteId);
          onUpdate?.(); // callback to remove it from UI
        } catch (err) {
          console.error("Delete error:", err);
        }
      },
    });
  };

  const handleEditSubmit = async () => {
    try {
      await notesApi.updateNote(noteId, { ...formData });
      onUpdate?.();
      closeEdit();
    } catch (err) {
      console.error("Edit error:", err);
    }
  };

  return (
    <div className="group relative h-[420px] bg-white rounded-[2rem] p-5 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 border border-slate-100 flex flex-col justify-between overflow-hidden">
      {/* Decorative Gradient Glow on Hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Edit/Delete Icons (Glassmorphic) */}
      {(isAuthor || isAdmin) && (
        <div className="absolute top-4 right-4 flex gap-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button 
            onClick={openEdit}
            className="p-2 rounded-xl bg-white/80 backdrop-blur-md shadow-lg text-blue-600 hover:bg-blue-600 hover:text-white transition-all"
          >
            <FaEdit size={14} />
          </button>
          <button 
            onClick={handleDelete}
            className="p-2 rounded-xl bg-white/80 backdrop-blur-md shadow-lg text-red-500 hover:bg-red-500 hover:text-white transition-all"
          >
            <FaTrash size={14} />
          </button>
        </div>
      )}

      {/* Thumbnail Container */}
      <div className="w-full h-44 bg-slate-50 rounded-[1.5rem] overflow-hidden relative mb-4">
        {imgurl ? (
          <img
            src={imgurl}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-slate-300">
             <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-2">
                <FaBookOpen size={20} />
             </div>
             <span className="text-xs font-medium uppercase tracking-widest">No Preview</span>
          </div>
        )}
        <div className="absolute top-3 left-3">
          <Badge 
            variant="filled" 
            className="bg-blue-600/90 backdrop-blur-sm text-white font-bold px-3 py-3 rounded-lg shadow-lg border-none"
          >
            {subject}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col">
        <h3 className="font-bold text-xl text-slate-900 line-clamp-1 mb-2 group-hover:text-blue-600 transition-colors">
          {title}
        </h3>
        <p className="text-slate-500 text-sm leading-relaxed line-clamp-2 mb-4">
          {description}
        </p>
      </div>

      {/* Footer Info */}
      <div className="mt-auto">
        <div className="flex items-center gap-2 mb-4">
           <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 text-[10px] font-bold">
              {branch?.substring(0, 2).toUpperCase() || 'CO'}
           </div>
           <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider truncate">
              {branch || 'General'}
           </span>
        </div>

        {download ? (
          <a
            href={download}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full block text-center py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-[1.02] transition-all active:scale-95"
          >
            View Notes
          </a>
        ) : (
          <button
            disabled
            className="w-full py-3 rounded-2xl bg-slate-100 text-slate-400 font-bold cursor-not-allowed"
          >
            Not Available
          </button>
        )}

        {time && (
          <div className="text-center mt-3 text-[10px] font-bold text-slate-300 uppercase tracking-widest">
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
