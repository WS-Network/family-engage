"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Spinner } from "_components";
import { useUserService } from "_services";
import { Footer } from "_components/Footer";
import { toast } from "sonner";
import { useAlertService } from "_services";

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
  const [deleting, setDeleting] = useState<string | null>(null); // Username of the subuser being deleted
  const alertService = useAlertService();
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data: User | null = await userService.getCurrent();
        console.log("Fetched user data:", data);
        setUser(data);
      } catch (error) {
        console.error("Error fetching user:", error);
        setUser(null); // Handle error by setting user to null
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleDelete = async (username: string) => {
    window.location.reload();
    if (!user) return;

    try {
      const userId = user.id; // Parent user ID
      console.log("Deleting sub-user with payload:", { userId, username });

      setDeleting(username); // Indicate the username being deleted
      await userService.deleteSubUser(userId, username); // Pass `userId` and `username`

      // Force page refresh after successful deletion
     toast.success("Sub-user deleted successfully.");
    } finally {
      setDeleting(null); // Clear deleting state
      // alertService.success("Sub-user deleted successfully");
      
    }
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <>
      <h1 style={{ marginTop: "10%" }}>”Every Family Begins with Love - Add Yours!”</h1>
      <Link
        href="/users/add"
        className="btn btn-sm btn-primary mb-2"
        style={{
          marginTop: "60px",
          backgroundColor: "#0CA4BD",
          borderColor: "#0CA4BD",
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
      <Footer />
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
