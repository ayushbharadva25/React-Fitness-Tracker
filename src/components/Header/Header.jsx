import React, { useEffect, useState, useRef } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import ProfileMenu from "../Common/ProfileMenu";
import { isUserLoggedIn, setCookie } from "../../utils/helper";
import { GiHamburgerMenu } from "react-icons/gi";
import { RxCross1 } from "react-icons/rx";
import "./Header.scss";

function Header() {
	const location = useLocation();
	const pathName = location.pathname;
	const navigate = useNavigate();

	const [burgerMenu, setBurgerMenu] = useState(false);
	const userLoggedIn = isUserLoggedIn();
	const navItemsRef = useRef(null);

	const isActive = (path) => (pathName === path ? "Active" : "");

	useEffect(() => {
		navItemsRef.current?.classList.toggle("display-none", !burgerMenu);
	}, [burgerMenu]);

	const handleLogout = () => {
		setCookie("userId", "");
		setBurgerMenu(false);
		navigate("/");
	};

	const burgerBtn = burgerMenu ? (
		<RxCross1
			className="close-burger-btn"
			onClick={() => setBurgerMenu((prev) => !prev)}
		/>
	) : (
		<GiHamburgerMenu
			className="burger-btn"
			onClick={() => setBurgerMenu((prev) => !prev)}
		/>
	);

	return (
		<header className="navbar">
			<h1 className="logo">
				<NavLink className="logo-text" to="/">
					<span>Fit</span>
					<span style={{ color: "#06ccb2" }}>Tracker</span>
				</NavLink>
			</h1>
			{userLoggedIn ? (
				<>
					<ul className="nav-items" ref={navItemsRef}>
						<li
							className="nav-item"
							onClick={() => setBurgerMenu((p) => !p)}>
							<NavLink className={`link ${isActive("/")}`} to="/">
								Home
							</NavLink>
						</li>
						<li
							className="nav-item"
							onClick={() => setBurgerMenu((p) => !p)}>
							<NavLink
								className={`link ${isActive("/user-profile")}`}
								to="user-profile">
								User Profile
							</NavLink>
						</li>
						<li
							className="nav-item"
							onClick={() => setBurgerMenu((p) => !p)}>
							<NavLink
								className={`link ${isActive("/daily-goals")}`}
								to="/daily-goals">
								Daily Goals
							</NavLink>
						</li>
						<li
							className="nav-item"
							onClick={() => setBurgerMenu((p) => !p)}>
							<NavLink
								className={`link ${isActive("/dashboard")}`}
								to="/dashboard">
								Dashboard
							</NavLink>
						</li>
						{userLoggedIn && (
							<button
								className="mobile-logout-btn"
								onClick={handleLogout}>
								Logout
							</button>
						)}
					</ul>
					{burgerBtn}
					<ProfileMenu className="profile-menu" />
				</>
			) : (
				<NavLink to="auth" className="login">
					LogIn
				</NavLink>
			)}
		</header>
	);
}

export default Header;
