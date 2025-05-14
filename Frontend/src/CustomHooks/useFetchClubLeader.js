import { useState, useEffect } from "react";
import axios from "../utils/axios"

export const useFetchClubLeader = () => {
  const [userClubs, setUserClubs] = useState([]);
  const [isLeader, setIsLeader] = useState(false);
  const [loadingClubs, setLoadingClubs] = useState(true);

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const { data } = await axios.get("/club/mine");
        setUserClubs(data.clubs);
        setIsLeader(data.clubs.length > 0);
      } catch (err) {
        console.error("Error fetching user clubs", err);
      } finally {
        setLoadingClubs(false);
      }
    };

    fetchClubs();
  }, []);

  return { userClubs, isLeader, loadingClubs };
};
