const appContainer = document.getElementById("app");
import { App } from "../game/3D/3d-game-option-select.js";
import { renderPage } from "../router/router.js";
import { languages } from "../language.js";
export let gameSettings = [];
export let nicknames = [];
let appInstance = null;
let isInitialLoad = true;

export function threeDSetting(currentLanguage) {
	appContainer.innerHTML = `
	<div id="webgl-container"></div>
	<div class="setting-container">
		<form class="selection" id="ball-speed">
			<div>${languages[currentLanguage].threeDBallSpd}:</div>
			<label><input type="radio" name="speed" value="1" required checked> ${languages[currentLanguage].threeDEasy}</label><br>
			<label><input type="radio" name="speed" value="1.5"> ${languages[currentLanguage].threeDHard}</label><br>
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
		<button class="back-button" id="3d-back-button">${languages[currentLanguage].goBack}</button>
	</div>
	`

	const startBtn = document.getElementById('game-start');
	const backBtn = document.getElementById('3d-back-button');

	if (startBtn && backBtn) {
		// 기존 App 인스턴스가 있다면 해제
		if (appInstance) {
			appInstance.dispose();
			appInstance = null;
		}

		// 새로운 App 인스턴스 생성
		appInstance = new App();
		appInstance.startAnimation(); // 애니메이션 시작 (만약 startAnimation 메서드를 분리했다면)

		startBtn.addEventListener('click', () => {
			appInstance.dispose();
			appInstance = null;

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
			console.log("LETSGOOO");
			renderPage("3d-game");
		})

		backBtn.addEventListener('click', () => {
			appInstance.dispose();
			appInstance = null;
			renderPage('3d-mode-select');
		})

		// 페이지 새로고침 또는 뒤로 가기 시에만 dispose 실행 (첫 로드 시 실행 X)
		if (window.performance.navigation.type === 1 || window.performance.navigation.type === 2) {
			isInitialLoad = false;  // 첫 로드 이후에는 dispose가 작동하도록 설정
		}

		window.addEventListener('popstate', () => {
			if (!isInitialLoad && appInstance)
				resetForm();
		});

	}
}

function resetForm() {
	appInstance.dispose();
	document.getElementById('ball-speed').reset(); // 속도 설정 폼 초기화
	document.getElementById('ball-color').reset(); // 색상 설정 폼 초기화
	document.getElementById('p1').value = "";	  // 플레이어 1 닉네임 초기화
	document.getElementById('p2').value = "";	  // 플레이어 2 닉네임 초기화
}
