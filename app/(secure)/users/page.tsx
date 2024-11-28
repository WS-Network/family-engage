"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Spinner } from "_components";
import { useUserService } from "_services";

type SubUser = {
  username: string;
  firstName: string;
  lastName: string;
};

type User = {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  subUsers: SubUser[];
};

export default function Users() {
  const userService = useUserService();
  const [user, setUser] = useState<User | null>(null); // User can be null initially
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null); // ID of the subUser being deleted

  useEffect(() => {
    // Fetch the current user and their subUsers
    const fetchUser = async () => {
      try {
        const data: User | null = await userService.getCurrent();
        console.log("Fetched user data:", data); // Debugging log
        setUser(data); // This will be a User object or null
      } catch (error) {
        console.error("Error fetching user:", error);
        setUser(null); // Handle the error case
      } finally {
        setLoading(false); // Stop loading once the request is complete
      }
    };

    fetchUser(); // Call the async function inside useEffect
  }, []);

  const handleDelete = async (username: string) => {
    if (!user) return;

    try {
        const userId = user.id; // Get the main user's ID
        console.log("Deleting sub-user with payload:", { userId, username });

        setDeleting(username); // Indicate which user is being deleted
        await userService.deleteSubUser(username, userId); // Pass both username and userId
        setUser((prevUser) => {
            if (!prevUser) return null;
            return {
                ...prevUser,
                subUsers: prevUser.subUsers.filter((subUser) => subUser.username !== username),
            };
        }); // Update state to remove the deleted user
    } catch (error) {
        console.error("Error deleting sub-user:", error);
    } finally {
        setDeleting(null); // Clear the deleting state
    }
};


  if (loading) {
    return <Spinner />;
  }

  return (
    <>
      <Link
  href="/users/add"
  className="btn btn-sm btn-primary mb-2"
  style={{
    marginTop: "60px",
    backgroundColor: "#0CA4BD", // Set background color
    borderColor: "#0CA4BD", // Optional: Update border color if necessary
  }}
>
        Add Family Member
      </Link>
      <table className="table table-striped">
        <thead>
          <tr>
            <th style={{ width: "30%" }}>First Name</th>
            <th style={{ width: "30%" }}>Last Name</th>
            <th style={{ width: "30%" }}>Username</th>
            <th style={{ width: "10%" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          <TableBody />
        </tbody>
      </table>
    </>
  );

  function TableBody() {
    if (user?.subUsers?.length) {
      return user.subUsers.map((subUser: SubUser, index: number) => (
        <tr key={index}>
          <td>{subUser.firstName}</td>
          <td>{subUser.lastName}</td>
          <td>{subUser.username}</td>
          <td>
            <button
              className="btn btn-danger btn-sm"
              onClick={() => handleDelete(subUser.username)}
              disabled={deleting === subUser.username}
            >
              {deleting === subUser.username ? "Deleting..." : "Delete"}
            </button>
          </td>
        </tr>
      ));
    }

    return (
      <tr>
        <td colSpan={4} className="text-center">
          <div className="p-2">No Sub Users To Display</div>
        </td>
      </tr>
    );
  }
}
