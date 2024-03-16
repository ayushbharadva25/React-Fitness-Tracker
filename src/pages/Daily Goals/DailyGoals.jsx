import React, { useEffect, useState } from "react";
import { getDetailsFromDateService } from "../../services/services";
import RecordCard from "../../components/Common/RecordCard";
import "react-toastify/dist/ReactToastify.css";
import AddActivityForm from "../../components/Common/AddActivityForm";
import Loader from "../../components/Common/Loader";
import WeightAndWaterTracker from "./WeightAndWaterTracker";
import { formattedDate, showToast } from "../../utils/helper";
import "./DailyGoals.scss";

function DailyGoals() {
	const [allDetails, setAllDetails] = useState({});
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchAllRecords = async () => {
			try {
				const formatedDate = formattedDate();
				const response = await getDetailsFromDateService({
					date: formatedDate,
				});
				setIsLoading(false);
				if (response.status === 200) {
					const allData = { ...response.data };
					setAllDetails(allData);
				} else if (response.status === 500) {
					showToast("error", response.message);
				}
			} catch (error) {
				setIsLoading(false);
				showToast("error", "error fetching records!!");
			}
		};
		fetchAllRecords();
	}, []);

	return (
		<main className="daily-goals-section">
			<section id="activity-form-section">
				<div className="form-container">
					<AddActivityForm
						isExercise={true}
						allDetails={allDetails}
						setAllDetails={setAllDetails}
					/>
				</div>
				<div className="form-container">
					<AddActivityForm
						isExercise={false}
						allDetails={allDetails}
						setAllDetails={setAllDetails}
					/>
				</div>
			</section>
			<section id="track-activity-section">
				<WeightAndWaterTracker
					heading={"Today's Weight"}
					title={"Weight (Kgs)"}
					type={"weight"}
					value={allDetails?.weightDetails?.dailyWeight}
					setAllDetails={setAllDetails}
				/>
				<WeightAndWaterTracker
					heading={"Water Drunk Today"}
					title={"Water Intake (Ltrs)"}
					type={"water"}
					value={allDetails?.waterDetails?.waterIntake}
					setAllDetails={setAllDetails}
				/>
			</section>
			{isLoading ? (
				<Loader />
			) : (
				<RecordCard
					allDetails={allDetails}
					setAllDetails={setAllDetails}
				/>
			)}
		</main>
	);
}

export default DailyGoals;
