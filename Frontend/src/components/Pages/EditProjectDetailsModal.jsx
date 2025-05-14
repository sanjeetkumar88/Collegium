import React, { useState, useEffect } from "react";
import { Modal, TextInput, Textarea, Button } from "@mantine/core";
import axios from "../../utils/axios";

const EditProjectDetailsModal = ({ opened, onClose, projectData, onSave }) => {
  // State to manage form values
  const [formValues, setFormValues] = useState({
    title: "",
    description: "",
    category: "",
    problemStatement: "",
    technologiesUsed: "",
    status: "",
    projectUrl: "",
    githubRepo: "",
    openForCollaboration: false,
    contactInfo: "",
    startDate: "",
    endDate: "",
    demoVideo: "",
  });

  useEffect(() => {
    if (opened && projectData) {
      // Set initial form values when modal opens and projectData is available
      setFormValues({
        title: projectData.title,
        description: projectData.description,
        category: projectData.category,
        problemStatement: projectData.problemStatement,
        technologiesUsed: projectData.technologiesUsed,
        status: projectData.status,
        projectUrl: projectData.liveLink,
        githubRepo: projectData.githubLink,
        openForCollaboration: projectData.openForCollaboration,
        contactInfo: projectData.contactInfo,
        startDate: projectData.startDate,
        endDate: projectData.endDate,
        demoVideo: projectData.demoVideo,
      });
    }
  }, [opened, projectData]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.put(`/devproject/${projectData.id}/editdetails`, {
        ...formValues,
        technologiesUsed: formValues.technologiesUsed.split(",").map((tech) => tech.trim()), // Convert to array
        tags: formValues.tags.split(",").map((tag) => tag.trim()), // Convert to array
      });
      onSave(response.data); // Pass the updated data to the parent component
      alert("Project details updated successfully");
      onClose();
    } catch (error) {
      console.error("Error updating project:", error);
      alert("Failed to update project details");
    }
  };

  return (
    <Modal opened={opened} onClose={onClose} title="Edit Project Details" centered>
      <form onSubmit={handleSubmit}>
        <TextInput
          label="Project Title"
          name="title"
          value={formValues.title}
          onChange={handleInputChange}
          required
        />
        <Textarea
          label="Description"
          name="description"
          value={formValues.description}
          onChange={handleInputChange}
          required
        />
        <TextInput
          label="Category"
          name="category"
          value={formValues.category}
          onChange={handleInputChange}
          required
        />
        <Textarea
          label="Problem Statement"
          name="problemStatement"
          value={formValues.problemStatement}
          onChange={handleInputChange}
          required
        />
        <TextInput
          label="Technologies Used"
          name="technologiesUsed"
          value={formValues.technologiesUsed}
          onChange={handleInputChange}
          required
          placeholder="e.g. React, Node.js"
        />
        <TextInput
          label="Status"
          name="status"
          value={formValues.status}
          onChange={handleInputChange}
          required
        />
        <TextInput
          label="Project URL"
          name="projectUrl"
          value={formValues.projectUrl}
          onChange={handleInputChange}
        />
        <TextInput
          label="GitHub Repository"
          name="githubRepo"
          value={formValues.githubRepo}
          onChange={handleInputChange}
        />
        <TextInput
          label="Contact Info"
          name="contactInfo"
          value={formValues.contactInfo}
          onChange={handleInputChange}
        />
        <TextInput
          label="Start Date"
          name="startDate"
          value={formValues.startDate}
          onChange={handleInputChange}
        />
        <TextInput
          label="End Date"
          name="endDate"
          value={formValues.endDate}
          onChange={handleInputChange}
        />
        <TextInput
          label="Demo Video"
          name="demoVideo"
          value={formValues.demoVideo}
          onChange={handleInputChange}
        />

        <Button type="submit" mt="md" fullWidth>
          Save Changes
        </Button>
      </form>
    </Modal>
  );
};

export default EditProjectDetailsModal;
