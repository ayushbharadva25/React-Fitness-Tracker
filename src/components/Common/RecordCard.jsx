import React from "react";
import {
	deleteExerciseService,
	deleteMealService,
} from "../../services/services";
import { ToastContainer } from "react-toastify";
import Swal from "sweetalert2";
import "../../global.scss";
import { showToast } from "../../utils/helper";
import Record from "./Record";
import "./RecordCard.scss";

function RecordCard({ allDetails, setAllDetails, isReadonly }) {
	const { exerciseDetails, mealDetails } = allDetails;

	const handleDeleteActivity = async (type, isExercise) => {
		Swal.fire({
			title: "Are you sure?",
			text: "You won't be able to revert this!",
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#3085d6",
			cancelButtonColor: "#d33",
			confirmButtonText: "Yes, delete it!",
		}).then(async (result) => {
			if (result.isConfirmed) {
				try {
					const service = isExercise
						? deleteExerciseService
						: deleteMealService;
					const response = await service(type);

					if (response.status === 200) {
						const key = isExercise
							? "exerciseDetails"
							: "mealDetails";
						const updatedDetails = {
							[key]: allDetails[key].filter(
								(item) =>
									item[
										isExercise ? "exerciseType" : "mealType"
									] !== type
							),
						};
						showToast("success", "Activity deleted!!");
						setAllDetails({ ...allDetails, ...updatedDetails });
					}
				} catch (error) {
					showToast(
						"error",
						"Error deleting activity. Please try again."
					);
				}
			}
		});
	};

	return (
		<>
			{!exerciseDetails?.length && !mealDetails?.length && (
				<h1 className="no-activity-heading text-center">
					Add some Activities to display Here!!
				</h1>
			)}
			<div className="record-card">
				<div className="exercise-record-container">
					{exerciseDetails?.length > 0 && (
						<>
							<h1 className="dg-activity-heading text-center">
								Exercise Performed
							</h1>
							{exerciseDetails?.map((exercise, index) => (
								<Record
									data={exercise}
									index={index}
									isReadonly={isReadonly}
									onDelete={handleDeleteActivity}
									isExercise={true}
								/>
							))}
						</>
					)}
				</div>
				<div className="meal-record-container">
					{mealDetails?.length > 0 && (
						<>
							<h1 className="dg-activity-heading text-center">
								Meals Taken
							</h1>
							{mealDetails.map((meal, index) => (
								<Record
									data={meal}
									index={index}
									isReadonly={isReadonly}
									onDelete={handleDeleteActivity}
									isExercise={false}
								/>
							))}
						</>
					)}
				</div>
			</div>
			<ToastContainer />
		</>
	);
}

export default RecordCard;
