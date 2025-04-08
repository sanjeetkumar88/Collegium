import React, { useState } from "react";
import axios from "axios";

const CreateEventForm = () => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    duration: "",
    medium: "offline",
    meet: ["", ""],
    location: ["", "", ""],
    image: "",
    acceptingRsvp: true,
    acceptingAttendance: false,
    maxParticipants: 0,
    privacy: "public",
    isExternalOrganiser: false,
    organiser: "",
    externalOrganiserInfo: {
      name: "",
      email: "",
      phone: "",
      organisation: "",
    },
    club: "",
    invitedUsers: [],
    price: 0,
    category: "",
    language: "",
    tnc: "",
    adminNotes: "",
    createdBy: "", // Fill this with logged-in user ID
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.includes("externalOrganiserInfo.")) {
      const key = name.split(".")[1];
      setForm((prev) => ({
        ...prev,
        externalOrganiserInfo: {
          ...prev.externalOrganiserInfo,
          [key]: value,
        },
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/event/createevent", form);
      alert("Event created successfully");
      console.log(response.data);
    } catch (err) {
      console.error(err);
      alert("Error creating event");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 max-w-2xl mx-auto space-y-4">
      <input type="text" name="title" placeholder="Title" value={form.title} onChange={handleChange} required />
      <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} />
      <input type="datetime-local" name="startDate" value={form.startDate} onChange={handleChange} required />
      <input type="datetime-local" name="endDate" value={form.endDate} onChange={handleChange} />
      <input type="text" name="duration" placeholder="Duration (HH:MM)" value={form.duration} onChange={handleChange} />

      <select name="medium" value={form.medium} onChange={handleChange}>
        <option value="offline">Offline</option>
        <option value="online">Online</option>
      </select>

      {form.medium === "online" && (
        <>
          <input type="text" placeholder="Meeting Link" value={form.meet[0]} onChange={(e) => setForm({...form, meet: [e.target.value, form.meet[1]]})} />
          <input type="text" placeholder="Meeting Password" value={form.meet[1]} onChange={(e) => setForm({...form, meet: [form.meet[0], e.target.value]})} />
        </>
      )}

      {form.medium === "offline" && (
        <>
          <input type="text" placeholder="Venue" value={form.location[0]} onChange={(e) => setForm({...form, location: [e.target.value, form.location[1], form.location[2]]})} />
          <input type="text" placeholder="Latitude" value={form.location[1]} onChange={(e) => setForm({...form, location: [form.location[0], e.target.value, form.location[2]]})} />
          <input type="text" placeholder="Longitude" value={form.location[2]} onChange={(e) => setForm({...form, location: [form.location[0], form.location[1], e.target.value]})} />
        </>
      )}

      <input type="text" name="image" placeholder="Image URL" value={form.image} onChange={handleChange} />
      <input type="number" name="maxParticipants" placeholder="Max Participants" value={form.maxParticipants} onChange={handleChange} />
 
      <input type="number" name="price" placeholder="Price" value={form.price} onChange={handleChange} />
      <input type="text" name="category" placeholder="Category" value={form.category} onChange={handleChange} />
      <input type="text" name="language" placeholder="Language" value={form.language} onChange={handleChange} />
      <textarea name="tnc" placeholder="Terms and Conditions" value={form.tnc} onChange={handleChange} />
      <textarea name="adminNotes" placeholder="Admin Notes" value={form.adminNotes} onChange={handleChange} />

      <label>
        <input type="checkbox" name="isExternalOrganiser" checked={form.isExternalOrganiser} onChange={handleChange} /> External Organiser
      </label>

      {form.isExternalOrganiser ? (
        <>
          <input type="text" name="externalOrganiserInfo.name" placeholder="Organiser Name" value={form.externalOrganiserInfo.name} onChange={handleChange} />
          <input type="email" name="externalOrganiserInfo.email" placeholder="Organiser Email" value={form.externalOrganiserInfo.email} onChange={handleChange} />
          <input type="text" name="externalOrganiserInfo.phone" placeholder="Organiser Phone" value={form.externalOrganiserInfo.phone} onChange={handleChange} />
          <input type="text" name="externalOrganiserInfo.organisation" placeholder="Organisation" value={form.externalOrganiserInfo.organisation} onChange={handleChange} />
        </>
      ) : (
        <input type="text" name="organiser" placeholder="Organiser User ID" value={form.organiser} onChange={handleChange} />
      )}

      <input type="text" name="club" placeholder="Club ID (optional)" value={form.club} onChange={handleChange} />

      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
        Create Event
      </button>
    </form>
  );
};

export default CreateEventForm;
