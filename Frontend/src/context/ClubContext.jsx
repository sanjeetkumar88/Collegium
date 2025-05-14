import { createContext, useContext, useState } from "react";
import axios from "../../utils/axios";

const ClubContext = createContext();

export const useClub = () => useContext(ClubContext);

export const ClubProvider = ({ children }) => {
  const [clubData, setClubData] = useState(null);

  // Separate refresh states for different tabs
  const [refreshApplicants, setRefreshApplicants] = useState(false);
  const [refreshMembers, setRefreshMembers] = useState(false);
  const [refreshLeaders, setRefreshLeaders] = useState(false);
  const [applying,setApplying] = useState(false);

  const toggleRefresh = (setter) => setter((prev) => !prev);

  const approveApplicant = async (id, applicantId) => {
    try {
      const res = await axios.post(`/club/${id}/approveapplicants`, { applicantId });
      toggleRefresh(setRefreshApplicants);
      return res.data;
    } catch (err) {
      console.error("Error approving applicant:", err);
    }
  };

  const rejectApplicant = async (id, applicantId) => {
    try {
      const res = await axios.post(`/club/${id}/rejectapplicants`, { applicantId });
      toggleRefresh(setRefreshApplicants);
      return res.data;
    } catch (err) {
      console.error("Error rejecting applicant:", err);
    }
  };

  const removeMember = async (id, applicantId) => {
    try {
      const res = await axios.post(`/club/${id}/removemember`, { applicantId });
      toggleRefresh(setRefreshMembers);
      return res.data;
    } catch (err) {
      console.error("Error removing member:", err);
    }
  };

  const makeCoLeader = async (id, applicantId) => {
    try {
      const res = await axios.post(`/club/${id}/makecoleader`, { applicantId });
      toggleRefresh(setRefreshMembers);
      return res.data;
    } catch (err) {
      console.error("Error making co-leader:", err);
    }
  };

  const makeLeader = async (id, applicantId) => {
    try {
      const res = await axios.post(`/club/${id}/makeleader`, { applicantId });
      return res.data;
    } catch (err) {
      console.error("Error making leader:", err);
    }
  };

  const removeCoLeader = async (id, applicantId) => {
    try {
      const res = await axios.post(`/club/${id}/removecoleader`, { applicantId });
      toggleRefresh(setRefreshLeaders);
      return res.data;
    } catch (err) {
      console.error("Error removing co-leader:", err);
    }
  };

  const handleApply = async (id,userId) =>{
    setApplying(true);
    try {
      const response = await axios.post(`/club/${id}/joinclub`, {
        userId
      });
      return response.data;
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong");
    } finally {
      setApplying(false);
    }
  }

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
