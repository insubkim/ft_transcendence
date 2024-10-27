const appContainer = document.getElementById("app");
import { tourNicknames } from "./3d-tour-setting.js";
import { renderPage } from "../router.js";
import { gameClear } from "./3d-tour-game.js";
import { languages } from "../language.js";

export function threeCheckTourResults(currentLanguage) {
	const is3Dpong = document.getElementById("3dpong");
	if (is3Dpong)
		gameClear();
	appContainer.innerHTML = `
	<div class="tournament-container">
		<div class="tournament-headers">
			<h3>${languages[currentLanguage].players}</h3>
			<h3>${languages[currentLanguage].final}</h3>
			<h3>${languages[currentLanguage].winner}</h3>
		</div>

		<div class="tournament-brackets">
		<ul class="bracket bracket">
			<li class="team-item">${tourNicknames[0]}</li>
			<li class="team-item">${tourNicknames[1]}</li>
			<li class="team-item">${tourNicknames[2]}</li>
			<li class="team-item">${tourNicknames[3]}</li>
		</ul>
		<ul class="bracket bracket-2">
			<li class="team-item">${tourNicknames[4]}</li>
			<li class="team-item">${tourNicknames[5]}</li>
		</ul>
			<ul class="bracket bracket">
			<li class="team-item">${tourNicknames[6]}</li>
		</ul>
		</div>
		<button class="back-button" id="back-btn">${languages[currentLanguage].goMain}</button>
	</div>
	`

	const backBtn = document.getElementById('back-btn');

	if (backBtn) {
		backBtn.addEventListener('click', () => {
			renderPage('game-select');
			// 결과정보 보내기..
		})
	}
}
