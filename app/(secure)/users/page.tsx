'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Spinner } from '_components';
import { useUserService } from '_services';

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

    useEffect(() => {
        // Fetch the current user and their subUsers
        const fetchUser = async () => {
            try {
                const data: User | null = await userService.getCurrent();
                setUser(data); // This will be a User object or null
            } catch (error) {
                console.error("Error fetching user:", error);
                setUser(null); // Handle the error case
            } finally {
                setLoading(false); // Stop loading once the request is complete
            }
        };

        fetchUser(); // Call the async function inside useEffect
    }, [userService]);

    if (loading) {
        return <Spinner />;
    }

    return (
        <>
            <h1>Family Members</h1>
            <Link href="/users/add" className="btn btn-sm btn-success mb-2">Add Family Member</Link>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th style={{ width: '30%' }}>First Name</th>
                        <th style={{ width: '30%' }}>Last Name</th>
                        <th style={{ width: '30%' }}>Username</th>
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
                </tr>
            ));
        }

        return (
            <tr>
                <td colSpan={3} className="text-center">
                    <div className="p-2">No Sub Users To Display</div>
                </td>
            </tr>
        );
    }
}
