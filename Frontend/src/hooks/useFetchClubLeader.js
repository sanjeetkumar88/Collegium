import { useState, useEffect } from "react";
import * as clubApi from "../api/club";

export const useFetchClubLeader = () => {
  const [userClubs, setUserClubs] = useState([]);
  const [isLeader, setIsLeader] = useState(false);
  const [loadingClubs, setLoadingClubs] = useState(true);

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const { data } = await clubApi.getMyClubs();
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
