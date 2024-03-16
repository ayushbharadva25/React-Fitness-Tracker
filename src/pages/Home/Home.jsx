import React from "react";
import "./Home.scss";
import "../../global.scss";
import video from "../../assets/videos/gym-video.mp4";
import { isUserLoggedIn } from "../../utils/helper";
import { useNavigate } from "react-router-dom";

function Home() {
	const navigate = useNavigate();
	const userLoggedIn = isUserLoggedIn();

	const handleStartButton = () => {
		if (!userLoggedIn) {
			navigate("/auth");
		} else {
			navigate("/daily-goals");
		}
	};

	return (
		<>
			<div id="home-container">
				<section id="banner-section">
					<video
						src={video}
						autoPlay
						muted
						loop
						id="bg-video"
					></video>
					<div className="video-overlay">
						<div className="caption">
							<h5>WORK HARDER, GET STRONGER</h5>
							<h2>
								EASY WITH OUR <span> Fitness Tracker </span>
							</h2>
							<div className="main-button">
								<button onClick={handleStartButton}>
									Start Tracking
								</button>
							</div>
						</div>
					</div>
				</section>
			</div>
		</>
	);
}

export default Home;
