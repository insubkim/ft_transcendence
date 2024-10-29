const appContainer = document.getElementById("app");
import { languages } from "../language.js";
import { renderPage } from "../router.js";

export function twoDModeSel(currentLanguage) {
	appContainer.innerHTML = `
	<h1 id="2d-mode-select-title" class="title-text">${languages[currentLanguage].gameModeSel}</h1>
	<div class="button-container">
		<button id="two-1V1-btn" class="button">
			<img src="./FE/img/mode_select/fist-bump.png">
			<span id="2D-1V1" class="text">${languages[currentLanguage].oneVone}</span>
		</button>

		<button id="two-tournament-btn" class="button2">
			<img src="./FE/img/mode_select/Trophy-icon.png">
			<span id="2D-tournament" class="text">${languages[currentLanguage].tournament}</span>
		</button>
	</div>
	`
	const oneVoneBtn = document.getElementById('two-1V1-btn');
	if (oneVoneBtn)
		oneVoneBtn.addEventListener('click', () => renderPage('2d-setting'));
	const tournamentBtn = document.getElementById('two-tournament-btn');
	if (tournamentBtn)
		tournamentBtn.addEventListener('click', () => renderPage('2d-tour-setting'));
}

