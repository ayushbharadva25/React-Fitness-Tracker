import React from "react";
import ReactLoading from "react-loading";
import "./Loader.scss";

function Loader() {
	return (
		<div className="loader-container">
			<ReactLoading
				type="spin"
				color="#37455f"
				height="64px"
				width="64px"
				className="loader"
			/>
		</div>
	);
}

export default Loader;
