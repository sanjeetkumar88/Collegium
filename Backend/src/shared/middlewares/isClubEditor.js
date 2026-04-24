import { Club } from "../../modules/club/club.model.js";
import { ApiError } from "../utils/ApiError.js";

export const isClubEditor = async (req, res, next) => {
  const userId = req.user._id;
  const userRole = req.user.role;
  const clubId = req.params.id; // Ensure your route uses :id

  try {
    const club = await Club.findById(clubId);

    if (!club) {
      throw new ApiError(404, "Club not found");
    }

    const isLeader = club.leader.toString() === userId.toString();
    const isMentor = club.mentor?.some(mId => mId.toString() === userId.toString());
    const isAdmin = userRole === "admin";

    if (isLeader || isMentor || isAdmin) {
      return next();
    }

    throw new ApiError(403, "You are not authorized to edit this club");
  } catch (err) {
    next(err);
  }
};
