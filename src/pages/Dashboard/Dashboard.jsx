import React, { useEffect, useState } from "react";
import "./Dashboard.scss";
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import {
	getDetailsFromDateService,
	getYearlyCaloriesDetailService,
	getYearlyWeightDetailService,
} from "../../services/services";
import RecordCard from "../../components/Common/RecordCard";
import nullData from "../../assets/images/emptydata.jpg";
import Loader from "../../components/Common/Loader";
import { formattedDate, showToast } from "../../utils/helper";
import { labels } from "../../constants/constants";

ChartJS.register(
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend
);

const options = {
	responsive: true,
	plugins: {
		legend: {
			position: "top",
		},
	},
};

function Dashboard() {
	const [yearlyCalorieDetails, setYearlyCalorieDetails] = useState([]);
	const [yearlyWeightDetails, setYearlyWeightDetails] = useState([]);
	const [allRecordsByDate, setAllRecordsByDate] = useState({});
	const [selectedDate, setSelectedDate] = useState(formattedDate());
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const [recordsResponse] = await Promise.all([
					getDetailsFromDateService({ date: selectedDate }),
					fetchYearlyDetails(selectedDate),
				]);
				setIsLoading(false);
				if (recordsResponse.status === 200) {
					setAllRecordsByDate({ ...recordsResponse.data });
					setSelectedDate(selectedDate);
				} else {
					showToast("error", "Something went wrong!");
				}
			} catch (error) {
				showToast("error", "error fetching data!!");
			}
		};
		fetchData();
	}, []);

	const yearlyWeightData = {
		labels,
		datasets: [
			{
				label: "Weight",
				data: yearlyWeightDetails,
				backgroundColor: "rgba(45, 83, 51, 0.75)",
			},
		],
	};
	const yearlyCalorieData = {
		labels,
		datasets: [
			{
				label: "Calories",
				data: yearlyCalorieDetails,
				backgroundColor: "rgba(53, 162, 235, 0.75)",
			},
		],
	};

	const fetchAllRecords = async (formatedDate) => {
		try {
			const response = await getDetailsFromDateService({
				date: formatedDate,
			});
			setIsLoading(false);
			if (response.status === 200) {
				setAllRecordsByDate({ ...response.data });
			}
		} catch (error) {
			showToast("error", "Error fetching records!!");
		}
	};

	const fetchYearlyDetails = async (date) => {
		const annualCalresponse = await getYearlyCaloriesDetailService(date);
		setIsLoading(false);

		if (annualCalresponse.status === 200) {
			setYearlyCalorieDetails([
				...(annualCalresponse.data.map(
					(data) => data.averageMonthlyCaloriesBurned
				) || []),
			]);
		}

		const annualWeightresponse = await getYearlyWeightDetailService(date);
		if (annualWeightresponse.status === 200) {
			setYearlyWeightDetails([
				...(annualWeightresponse.data.map(
					(data) => data.averageMonthlyWeight
				) || []),
			]);
		}
	};

	const handleDateChange = async ({ target }) => {
		setSelectedDate(target.value);
		if (selectedDate.substring(0, 4) !== target.value.substring(0, 4)) {
			fetchYearlyDetails(target.value);
		}
		fetchAllRecords(target.value);
	};

	return (
		<>
			{isLoading ? (
				<Loader />
			) : (
				<section id="dashboard-section">
					<h2 className="year-title">
						Annual Data Tracking (Year :{" "}
						{selectedDate?.substring(0, 4)})
					</h2>
					<div id="graph-section">
						<div className="select-date-section">
							<input
								type="date"
								name="name"
								id="date"
								value={selectedDate}
								onChange={handleDateChange}
							/>
						</div>
						<div className="graph-container">
							<Bar
								className="graph"
								options={options}
								data={yearlyWeightData}
							/>
							<Bar
								className="graph"
								options={options}
								data={yearlyCalorieData}
							/>
						</div>
					</div>
					<div id="record-section">
						{allRecordsByDate.exerciseDetails ||
						allRecordsByDate.mealDetails ? (
							<>
								<h2 className="day-title">
									Activity Records (Date : {selectedDate})
								</h2>
								<RecordCard
									allDetails={allRecordsByDate}
									isReadonly={true}
								/>
							</>
						) : (
							<>
								<div className="no-data">
									<img src={nullData} alt="No Data" />
								</div>
								<h1>No Activity For Selected Date!!</h1>
							</>
						)}
					</div>
				</section>
			)}
		</>
	);
}

export default Dashboard;
