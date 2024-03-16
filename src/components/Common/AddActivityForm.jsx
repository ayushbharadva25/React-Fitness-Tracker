import React, { useMemo, useState } from "react";
import { showToast } from "../../utils/helper";
import {
	addExerciseService,
	addMealService,
	updateExerciseServise,
	updateMealService,
} from "../../services/services";
import { ToastContainer } from "react-toastify";
import "./AddActivityForm.scss";
import "react-toastify/dist/ReactToastify.css";

const initialValue = {
	type: "",
	duration: "",
	ingredients: "",
	calories: "",
};

const initialError = {
	typeError: "",
	durationError: "",
	ingredientsError: "",
	caloriesError: "",
};

function AddActivityForm({ isExercise, allDetails, setAllDetails }) {
	const { exerciseDetails, mealDetails } = allDetails || {};
	const [activityDetails, setActivityDetails] = useState(initialValue);
	const [activityDetailsError, setActivityDetailsError] =
		useState(initialError);
	const [buttonText, setButtonText] = useState("Add");

	const formInfo = useMemo(() => {
		if (isExercise) {
			return {
				formType: "Exercise",
				heading: "Log Exercise",
				activityText: "Exercise Type",
				optionText: "Select Exercise Type",
				calorieText: "Calories Burned",
				caloriePlaceholder: "Enter calories burned (approx)",
			};
		} else {
			return {
				formType: "Meal",
				heading: "Log Meal",
				activityText: "Meal Type",
				optionText: "Select Meal Type",
				calorieText: "Calories Consumed",
				caloriePlaceholder: "Enter calories consumed (approx)",
			};
		}
	}, [isExercise]);

	const {
		formType,
		heading,
		activityText,
		optionText,
		calorieText,
		caloriePlaceholder,
	} = formInfo;
	const { durationError, ingredientsError, caloriesError } =
		activityDetailsError;

	const options = useMemo(
		() =>
			isExercise
				? ["Walking", "Running", "Weight Lifting", "Gym", "Yoga"]
				: ["Breakfast", "Lunch", "Dinner", "Snacks"],
		[isExercise]
	);

	const handleType = (type) =>
		type === "Weight Lifting" ? "Weight_lifting" : type;

	const getActivityDetails = (type) => {
		let activityType = handleType(type);
		return isExercise
			? exerciseDetails?.find(
					(exercise) => exercise.exerciseType === activityType
			  )
			: mealDetails?.find((meal) => meal.mealType === type);
	};

	const { type, duration, ingredients, calories } = activityDetails;

	const updateActivityDetails = (type, duration, calories) => {
		return isExercise
			? updateExerciseServise({
					exerciseType: handleType(type),
					duration,
					caloriesBurned: calories,
			  })
			: updateMealService({
					mealType: type,
					ingredients: activityDetails.ingredients,
					caloriesConsumed: calories,
			  });
	};

	const validateInputs = (name, value) => {
		const inputErrorObj = {};

		switch (name) {
			case "duration":
				inputErrorObj.durationError =
					value >= 1440 ? "Duration must be less than 1440 min" : "";
				break;
			case "calories":
				inputErrorObj.caloriesError =
					value >= 20000 ? "Calories must be less than 20000" : "";
				break;
			case "ingredients":
				inputErrorObj.ingredientsError = !value
					? "Ingredients is required"
					: "";
				break;
			default:
				break;
		}

		setActivityDetailsError((prevErrors) => ({
			...prevErrors,
			...inputErrorObj,
		}));
	};

	const handleInputChange = (e) => {
		const { name, value } = e.target;

		validateInputs(name, value);

		if (name === "type") {
			const activityDetails = getActivityDetails(value);
			setButtonText(!activityDetails ? "Add" : "Edit");

			const {
				exerciseType = "",
				duration = "",
				caloriesBurned = "",
				mealType = "",
				ingredients = "",
				caloriesConsumed = "",
			} = activityDetails || {};

			setActivityDetails({
				type:
					exerciseType === "Weight_lifting"
						? "Weight Lifting"
						: exerciseType || mealType || value,
				duration,
				ingredients,
				calories: caloriesBurned || caloriesConsumed,
			});
		} else {
			setActivityDetails((prevInfo) => ({
				...prevInfo,
				[name]: name === "ingredients" ? value : Number(value),
			}));
		}
	};

	const updateActivity = async () => {
		const response = await updateActivityDetails(type, duration, calories);

		if (response.status === 200) {
			const previousActivity = getActivityDetails(type);

			let updatedDetails;
			if (isExercise) {
				updatedDetails = {
					exerciseDetails: exerciseDetails.map((exercise) =>
						exercise.exerciseType === previousActivity.exerciseType
							? {
									...exercise,
									duration,
									caloriesBurned: calories,
							  }
							: exercise
					),
				};
			} else {
				updatedDetails = {
					mealDetails: mealDetails.map((meal) =>
						meal.mealType === previousActivity.mealType
							? {
									...meal,
									ingredients,
									caloriesConsumed: calories,
							  }
							: meal
					),
				};
			}
			setAllDetails({
				...allDetails,
				...updatedDetails,
			});

			showToast("success", "activity updated successfully");
			setActivityDetails(initialValue);
			setButtonText("Add");
		} else {
			showToast("error", "some error occured while Updating Activity!");
		}
	};

	const addActivity = async () => {
		let response = isExercise
			? await addExerciseService({
					exerciseType: handleType(type),
					duration: duration,
					caloriesBurned: calories,
			  })
			: await addMealService({
					mealType: type,
					ingredients: ingredients,
					caloriesConsumed: calories,
			  });

		if (response.status === 200) {
			const newActivity = isExercise
				? {
						exerciseType: handleType(type),
						duration,
						caloriesBurned: calories,
				  }
				: { mealType: type, ingredients, caloriesConsumed: calories };

			const activityDetailsType = isExercise
				? "exerciseDetails"
				: "mealDetails";

			setAllDetails({
				...allDetails,
				[activityDetailsType]: [
					...(allDetails[activityDetailsType] || []),
					newActivity,
				],
			});
			showToast(
				"success",
				`${formType.toLowerCase()} added successfully`
			);
			setActivityDetails(initialValue);
			setButtonText("Add");
		} else {
			showToast("error", "some error occured while Adding Activity!");
		}
	};

	const handleSubmit = (e) => {
		e.preventDefault();

		if (durationError || ingredientsError || caloriesError) {
			showToast("error", "Please enter valid details");
			return;
		}
		if (buttonText === "Add") {
			addActivity();
		} else {
			updateActivity();
		}
	};

	return (
		<>
			<h2 className="form-heading">{heading}</h2>
			<form action="" onSubmit={handleSubmit}>
				<div className="field">
					<label htmlFor="activity">{activityText}</label>
					<select
						name="type"
						id="activity"
						value={activityDetails["type"]}
						onChange={handleInputChange}
						required>
						<option value="">{optionText}</option>
						{options.map((data, index) => (
							<option key={index} value={data}>
								{data}
							</option>
						))}
					</select>
				</div>
				<div className="field">
					{isExercise ? (
						<>
							<label htmlFor="duration">Duration</label>
							<input
								type="number"
								id="duration"
								name="duration"
								value={activityDetails["duration"]}
								onChange={handleInputChange}
								placeholder="Exercise duration (in min)"
								required
							/>
							<p className="activity-error-text">
								{durationError}
							</p>
						</>
					) : (
						<>
							<label htmlFor="ingredients">Ingredients</label>
							<input
								type="text"
								id="ingredients"
								name="ingredients"
								value={activityDetails["ingredients"]}
								onChange={handleInputChange}
								placeholder="Meal ingredients"
								required
							/>
							<p className="activity-error-text">
								{ingredientsError}
							</p>
						</>
					)}
				</div>
				<div className="field">
					<label htmlFor="calories">{calorieText}</label>
					<input
						type="number"
						id="calories"
						name="calories"
						value={activityDetails["calories"]}
						onChange={handleInputChange}
						placeholder={caloriePlaceholder}
						required
					/>
					<p className="activity-error-text">{caloriesError}</p>
				</div>

				<button
					className="activity-submit-btn"
					type="submit"
					onClick={handleSubmit}>
					{isExercise
						? `${buttonText} Exercise`
						: `${buttonText} Meal`}
				</button>
			</form>
			<ToastContainer />
		</>
	);
}

export default AddActivityForm;
