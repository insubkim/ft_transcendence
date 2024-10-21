const appContainer = document.getElementById("app");
import { App } from "../game/3D/3d-game-option-select.js";
import { renderPage } from "../router.js";
import { languages } from "../language.js";
export let gameSettings = [];
export let nicknames = [];
export let ThreeDsettingApp = null;
import { gameClear } from "./3d-tour-game.js";

export function threeDTourSetting(currentLanguage) {
	const is3Dpong = document.getElementById("3dpong");
	if (is3Dpong)
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
		<input class="nickname" id="p3" type="text" placeholder="${languages[currentLanguage].player3Nick}">
		<input class="nickname" id="p4" type="text" placeholder="${languages[currentLanguage].player4Nick}">
		<button class="back-button" id="game-start">${languages[currentLanguage].threeDStart}</button>
		<button class="back-button" id="3d-back-button">${languages[currentLanguage].goBack}</button>
	</div>
	`

	const startBtn = document.getElementById('game-start');
	const backBtn = document.getElementById('3d-back-button');

	if (startBtn && backBtn) {
		// 기존 App 인스턴스가 있다면 해제
		if (ThreeDsettingApp) {
			ThreeDsettingApp.dispose();
			ThreeDsettingApp = null;
		}

		// 새로운 App 인스턴스 생성
		ThreeDsettingApp = new App();
		ThreeDsettingApp.startAnimation(); // 애니메이션 시작 (만약 startAnimation 메서드를 분리했다면)

		startBtn.addEventListener('click', () => {
			ThreeDsettingApp.dispose();
			ThreeDsettingApp = null;

			gameSettings = [];  // 기존 게임 설정을 초기화
			gameSettings.push(document.querySelector('input[name="color"]:checked'));
			gameSettings.push(document.querySelector('input[name="speed"]:checked'));

			let inputP1 = document.querySelector('#p1').value;
			let inputP2 = document.querySelector('#p2').value;
			let inputP3 = document.querySelector('#p3').value;
			let inputP4 = document.querySelector('#p4').value;

			if (!inputP1)
			inputP1 = "Player1"
			if (!inputP2)
			inputP2 = "Player2"
			if (!inputP3)
				inputP3 = "Player3"
			if (!inputP4)
				inputP4 = "Player4"

			nicknames = [];
			nicknames.push(inputP1);
			nicknames.push(inputP2);
			nicknames.push(inputP3);
			nicknames.push(inputP4);
			nicknames = renameDuplicates(nicknames);
			console.log("LETSGOOO");
			renderPage("3d-tour-game");
		})

		backBtn.addEventListener('click', () => {
			ThreeDsettingApp.dispose();
			ThreeDsettingApp = null;
			renderPage('3d-mode-select');
		})
	}
}

function truncateStrings(arr) {
	for (let i = 0; i < arr.length; i++) {
		if (arr[i].length > 8) {
			arr[i] = arr[i].slice(0, 8);
		}
	}
}


export function renameDuplicates(arr) {
	const counts = {}; // Keeps track of counts used for each base name
	const usedNames = new Set(); // Keeps track of all names used
	
	console.log("here");
	truncateStrings(arr);
	return arr.map(function(str) {
		// Extract base name and count from the string
		const { baseName, count } = getBaseName(str);

		// Initialize counts for base name if not already done
		if (!counts[baseName]) {
			counts[baseName] = new Set();
		}

		// If the name hasn't been used yet, add it directly
		if (!usedNames.has(str)) {
			usedNames.add(str);
			if (count !== null) {
				counts[baseName].add(count);
			}
			return str;
		} else {
			// Generate a new name with an appropriate count
			let newCount = 1;
			while (
				counts[baseName].has(newCount) ||
				usedNames.has(`${baseName}(${newCount})`)
			) {
				newCount++;
			}
			counts[baseName].add(newCount);
			const newName = `${baseName}(${newCount})`;
			usedNames.add(newName);
			return newName;
		}
	});
}

// Helper function to extract base name and count
function getBaseName(str) {
	const match = str.match(/^(.*?)(?:\((\d+)\))?$/);
	if (match) {
		const baseName = match[1];
		const count = match[2] ? parseInt(match[2], 10) : null;
		return { baseName, count };
	}
	return { baseName: str, count: null };
}
