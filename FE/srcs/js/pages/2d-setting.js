const appContainer = document.getElementById("app");
import { renderPage } from "../router.js";
import { languages } from "../language.js";
import { renameDuplicates } from "./2d-tour-setting.js";
export let gameSettings = [];
export let nicknames = [];
// export let TwoDsettingApp = null;
import { gameClear } from "./2d-game.js";

export function twoDSetting(currentLanguage) {
	const is2Dpong = document.getElementById("2dpong");
	if (is2Dpong)
	{
		gameClear();
		gameSettings = [];
		nicknames = [];
	}
	appContainer.innerHTML = `
	<div id="webgl-container"></div>
	<div class="setting-container">
		<form class="selection" id="ball-speed">
			<div>${languages[currentLanguage].threeDBallSpd}:</div>
			<label><input type="radio" name="speed" value="0.02" required checked> ${languages[currentLanguage].threeDEasy}</label><br>
			<label><input type="radio" name="speed" value="0.03"> ${languages[currentLanguage].threeDHard}</label><br>
		</form>

		<form class="selection" id="ball-color">
			<div>${languages[currentLanguage].threeDBallCol}:</div>
			<label style="color: #8A2BE2;"><input type="radio" name="color" value=0X8A2BE2 required checked > ⬤ </label><br>
			<label style="color: #C0C0C0;"><input type="radio" name="color" value=0XC0C0C0> ⬤</label><br>
			<label style="color: #FF00FF;"><input type="radio" name="color" value=0XFF00FF> ⬤</label><br>
		</form>
		<input class="nickname" id="p1" type="text" placeholder="${languages[currentLanguage].player1Nick}">
		<input class="nickname" id="p2" type="text" placeholder="${languages[currentLanguage].player2Nick}">
		<button class="back-button" id="game-start">${languages[currentLanguage].threeDStart}</button>
		<button class="back-button" id="2d-back-button">${languages[currentLanguage].goBack}</button>
	</div>
	`

	const startBtn = document.getElementById('game-start');
	const backBtn = document.getElementById('2d-back-button');

	if (startBtn && backBtn) {
		// // 기존 App 인스턴스가 있다면 해제
		// if (TwoDsettingApp) {
		// 	TwoDsettingApp.dispose();
		// 	TwoDsettingApp = null;
		// }

		// // 새로운 App 인스턴스 생성
		// TwoDsettingApp = new App();
		// TwoDsettingApp.startAnimation(); // 애니메이션 시작 (만약 startAnimation 메서드를 분리했다면)

		startBtn.addEventListener('click', () => {
			// TwoDsettingApp.dispose();
			// TwoDsettingApp = null;

			gameSettings = [];  // 기존 게임 설정을 초기화
			gameSettings.push(document.querySelector('input[name="color"]:checked'));
			gameSettings.push(document.querySelector('input[name="speed"]:checked'));
			let inputP1 = document.querySelector('#p1').value;
			if (!inputP1)
				inputP1 = "Player1"
			let inputP2 = document.querySelector('#p2').value;
			if (!inputP2)
				inputP2 = "Player2"

			nicknames = [];
			nicknames.push(inputP1);
			nicknames.push(inputP2);
			nicknames = renameDuplicates(nicknames);
			console.log("LETSGOOO");
			renderPage("2d-game");
		})

		backBtn.addEventListener('click', () => {
			// TwoDsettingApp.dispose();
			// TwoDsettingApp = null;
			renderPage('2d-mode-select');
		})
	}
}
