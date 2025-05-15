import { createContext, useContext, useState } from "react";
import axios from "../utils/axios";
import { toast } from "react-toastify";

const ClubContext = createContext();

export const useClub = () => useContext(ClubContext);

export const ClubProvider = ({ children }) => {
  const [clubData, setClubData] = useState(null);
  const [refreshApplicants, setRefreshApplicants] = useState(false);
  const [refreshMembers, setRefreshMembers] = useState(false);
  const [refreshLeaders, setRefreshLeaders] = useState(false);
  const [applying, setApplying] = useState(false);

  const toggleRefresh = (setter) => setter((prev) => !prev);

  const approveApplicant = async (id, applicantId) => {
    try {
      const res = await axios.post(`/club/${id}/approveapplicants`, { applicantId });
      toggleRefresh(setRefreshApplicants);
      toast.success("Applicant approved successfully!");
      return res.data;
    } catch (err) {
      console.error("Error approving applicant:", err);
      toast.error("Failed to approve applicant.");
    }
  };

  const rejectApplicant = async (id, applicantId) => {
    try {
      const res = await axios.post(`/club/${id}/rejectapplicants`, { applicantId });
      toggleRefresh(setRefreshApplicants);
      toast.success("Applicant rejected successfully.");
      return res.data;
    } catch (err) {
      console.error("Error rejecting applicant:", err);
      toast.error("Failed to reject applicant.");
    }
  };

  const removeMember = async (id, applicantId) => {
    try {
      const res = await axios.post(`/club/${id}/removemember`, { applicantId });
      toggleRefresh(setRefreshMembers);
      toast.success("Member removed successfully.");
      return res.data;
    } catch (err) {
      console.error("Error removing member:", err);
      toast.error("Failed to remove member.");
    }
  };

  const makeCoLeader = async (id, applicantId) => {
    try {
      const res = await axios.post(`/club/${id}/makecoleader`, { applicantId });
      toggleRefresh(setRefreshMembers);
      toast.success("Co-leader assigned successfully.");
      return res.data;
    } catch (err) {
      console.error("Error making co-leader:", err);
      toast.error("Failed to assign co-leader.");
    }
  };

  const makeLeader = async (id, applicantId) => {
    try {
      const res = await axios.post(`/club/${id}/makeleader`, { applicantId });
      toast.success("Leader assigned successfully.");
      return res.data;
    } catch (err) {
      console.error("Error making leader:", err);
      toast.error("Failed to assign leader.");
    }
  };

  const removeCoLeader = async (id, applicantId) => {
    try {
      const res = await axios.post(`/club/${id}/removecoleader`, { applicantId });
      toggleRefresh(setRefreshLeaders);
      toast.success("Co-leader removed successfully.");
      return res.data;
    } catch (err) {
      console.error("Error removing co-leader:", err);
      toast.error("Failed to remove co-leader.");
    }
  };

  const handleApply = async (id, userId) => {
    setApplying(true);
    try {
      const response = await axios.post(`/club/${id}/joinclub`, { userId });
      toast.success("Applied to club successfully.");
      return response.data;
    } catch (err) {
      console.error("Error applying to club:", err);
      toast.error(err.response?.data?.message || "Failed to apply to club.");
    } finally {
      setApplying(false);
    }
  };

  return (
    <ClubContext.Provider
      value={{
        clubData,
        setClubData,
        approveApplicant,
        rejectApplicant,
        removeMember,
        makeCoLeader,
        makeLeader,
        removeCoLeader,
        refreshApplicants,
        setRefreshApplicants,
        refreshMembers,
        setRefreshMembers,
        refreshLeaders,
        setRefreshLeaders,
        handleApply,
        applying,
        setApplying,
      }}
    >
      {children}
    </ClubContext.Provider>
  );
};
