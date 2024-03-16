import { Suspense, lazy } from "react";
import {
	Route,
	RouterProvider,
	createBrowserRouter,
	createRoutesFromElements,
} from "react-router-dom";
import "./App.scss";
import Layout from "./Layout";
import AuthForm from "./components/AuthForm/AuthForm";
import Loader from "./components/Common/Loader";

const dynamicImport = (path) =>
	lazy(() =>
		import("./pages/index").then((module) => ({ default: module[path] }))
	);

const Home = dynamicImport("Home");
const UserProfile = dynamicImport("UserProfile");
const DailyGoals = dynamicImport("DailyGoals");
const Dashboard = dynamicImport("Dashboard");

const router = createBrowserRouter(
	createRoutesFromElements(
		<>
			<Route path="/" element={<Layout />}>
				<Route path="" element={<Home />} />
				<Route path="user-profile" element={<UserProfile />} />
				<Route path="daily-goals" element={<DailyGoals />} />
				<Route path="dashboard" element={<Dashboard />} />
			</Route>
			<Route path="auth" element={<AuthForm />} />
		</>
	)
);

function App() {
	return (
		<Suspense fallback={<Loader />}>
			<RouterProvider router={router} />
		</Suspense>
	);
}

export default App;
