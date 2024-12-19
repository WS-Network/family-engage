import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../_helpers/server/db"; // Adjust the path to your database helper

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { username } = req.query;

  if (!username || typeof username !== "string") {
    return res.status(400).json({ message: "Invalid or missing username." });
  }

  if (req.method === "GET") {
    try {
      const profile = await db.GamingProfile.findOne({ username });
      if (!profile) {
        return res.status(404).json({ message: "Gaming profile not found." });
      }
      res.status(200).json(profile);
    } catch (error) {
      console.error("Error fetching gaming profile:", error);
      res.status(500).json({ message: "Internal server error." });
    }
  } else if (req.method === "POST") {
    const { avatar, bio, totalPlayTime, achievements, playedGames } = req.body;

    try {
      const user = await db.User.findOne({ username });
      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }

      const updatedProfile = await db.GamingProfile.findOneAndUpdate(
        { username },
        { avatar, bio, totalPlayTime, achievements, playedGames },
        { new: true, upsert: true }
      );

      res.status(201).json(updatedProfile);
    } catch (error) {
      console.error("Error creating or updating gaming profile:", error);
      res.status(500).json({ message: "Internal server error." });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).json({ message: `Method ${req.method} Not Allowed.` });
  }
}
