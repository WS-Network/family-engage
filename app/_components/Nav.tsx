'use client';

import { useState } from 'react';

import { NavLink } from '_components';
import { useUserService } from '_services';
import Image from 'next/image';
import logo from '../(public)/assets/Logo.png'

export { Nav };

function Nav() {
    const [loggingOut, setLoggingOut] = useState<boolean>(false);
    const userService = useUserService();

    async function logout() {
        setLoggingOut(true);
        await userService.logout();
    }

    return (
        <nav className="navbar navbar-expand navbar-dark bg-dark px-3">
            <a href="/" className="navbar-brand">
                <Image src={logo} alt="Logo" width={50} height={40} />
            </a>
            <div className="navbar-nav">
                <NavLink href="/" exact className="nav-item nav-link">Game Library</NavLink>
                <NavLink href="/users" className="nav-item nav-link">Family Members</NavLink>
                <button onClick={logout} className="btn btn-link nav-item nav-link" style={{ width: '67px' }} disabled={loggingOut}>
                    {loggingOut
                        ? <span className="spinner-border spinner-border-sm"></span>
                        : <span>Logout</span>
                    }
                </button>
            </div>
        </nav>
    );
}