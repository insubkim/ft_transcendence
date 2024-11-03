const appContainer = document.getElementById("app");
import { languages } from "../language.js";
import { renderPage } from "../router.js";
import { gameClear } from "./3d-game.js";
import { clearThreeTourSetting } from "./3d-tour-setting.js";
import { fetchTop3Data } from "../leaderboard.js";

export function gameSelect(currentLanguage) {
	const is3DpongTour = document.getElementById("3dpongTour");
	const is3Dpong = document.getElementById("3dpong");
	console.log(is3Dpong);
	if (is3DpongTour)
		clearThreeTourSetting();
	if (is3Dpong)
		gameClear();
	fetchTop3Data();
	appContainer.innerHTML = `
	<h1 id="welcome-title" class="title-text">${languages[currentLanguage].welcome}</h1>
	<div class="button-container" style="margin-bottom: 2vw;">
		<button id="2d-pong-btn" class="button">
			<img src="./img/game_select/2d-pong.png" alt="2d image">
			<span id="2d-pong" class="text">${languages[currentLanguage].twoDPong}</span>
		</button>

		<button id="3d-pong-btn" class="button2">
			<img src="./img/game_select/3d-pong.png" alt="3d image">
			<span id="3d-pong" class="text">${languages[currentLanguage].threeDPong}</span>
		</button>
	</div>
	`
	const twoDPongSelBtn = document.getElementById('2d-pong-btn');
	const threeDPongSelBtn = document.getElementById('3d-pong-btn');

	if (twoDPongSelBtn && threeDPongSelBtn) {
		twoDPongSelBtn.addEventListener('click', () => renderPage('2d-mode-select'));
		threeDPongSelBtn.addEventListener('click', () => renderPage('3d-mode-select'));
	}
}

