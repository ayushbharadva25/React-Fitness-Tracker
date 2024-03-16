import { toast } from "react-toastify";
export function getCookie(name) {
	const allCookies = document.cookie.split(";");
	for (const cookie of allCookies) {
		const [cookieName, cookieValue] = cookie.split("=");
		if (cookieName.trim() === name) {
			return cookieValue;
		}
	}
	return null; // cookie not found
}

export function setCookie(cookieName, cookieValue) {
	document.cookie = `${cookieName}=${cookieValue}`;
}

export function isUserLoggedIn() {
	const userId = getCookie("userId");
	return !!userId;
}

export const formattedDate = () => {
	const todayDate = new Date();
	return todayDate.toJSON().split("T")[0];
};

export const showToast = (type, message) => {
	toast[type](message, { position: toast.POSITION.TOP_RIGHT });
};

export const validatePassword = (value) => {
	const specialCharacterPattern = /[!@#$%^&*()_+{}\[\]:;<>,.?~\\|/]/;
	const digitPattern = /\d/;
	const alphabetPattern = /[a-zA-Z]/;

	if (value.length <= 5) {
		return "Password length should be greater than 5";
	} else if (!specialCharacterPattern.test(value)) {
		return "Password must contain special characters";
	} else if (!digitPattern.test(value)) {
		return "Password must contain at least one digit";
	} else if (!alphabetPattern.test(value)) {
		return "Password must contain at least one alphabet";
	} else {
		return "";
	}
};
