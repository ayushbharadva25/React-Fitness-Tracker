import React, { useEffect, useState } from "react";
import {
	addWaterService,
	addWeightService,
	editWaterService,
	editWeightService,
} from "../../services/services";
import { showToast } from "../../utils/helper";
import "./DailyGoals.scss";

function WeightAndWaterTracker({ heading, title, value, setAllDetails, type }) {
	const [inputValue, setInputValue] = useState(value);
	const [inputDisabled, setInputDisabled] = useState(!!value);

	useEffect(() => {
		setInputValue(value);
		setInputDisabled(!!value);
	}, [value]);

	const handleApiCall = async (apiCall) => {
		try {
			const response = await apiCall(Number(inputValue));
			if (response.status === 200) {
				setInputDisabled(true);

				const detailsKey =
					type === "weight" ? "weightDetails" : "waterDetails";

				setAllDetails((prevDetails) => ({
					...prevDetails,
					[detailsKey]: {
						[type === "weight" ? "dailyWeight" : "waterIntake"]:
							inputValue,
					},
				}));

				showToast("success", "Data Saved Successfully..");
			}
		} catch (error) {
			showToast("error", "An Error Occured while Updating Data!!");
		}
	};

	const handleSubmit = () => {
		if (!inputValue) {
			showToast("error", "Please Enter Valid Value!!");
			return;
		}
		const addApiCall =
			type === "weight" ? addWeightService : addWaterService;
		const editApiCall =
			type === "weight" ? editWeightService : editWaterService;
		const apiCall = !value ? addApiCall : editApiCall;
		handleApiCall(apiCall);
	};

	let dailyValue =
		type === "weight" ? inputValue + " Kgs" : inputValue + " Ltrs";

	return (
		<div id="tracking-section">
			<h3>{heading}</h3>
			<div className="tracker-container">
				<h2 className="title">{title}</h2>
				<div className="actions">
					{!inputDisabled ? (
						<input
							type="text"
							value={inputValue}
							onChange={(e) => setInputValue(e.target.value)}
							disabled={inputDisabled}
							placeholder={`Today's ${title}`}
						/>
					) : (
						<p>{dailyValue}</p>
					)}
					<button
						className="action-btn"
						onClick={
							inputDisabled
								? () => setInputDisabled(false)
								: handleSubmit
						}>
						{inputDisabled ? "Edit" : "Save"}
					</button>
				</div>
			</div>
		</div>
	);
}

export default WeightAndWaterTracker;
