const appContainer = document.getElementById("app");
const langSetting = document.getElementById("globe-icon");
import { ThreeGame } from '../game/3D/3d-game-app.js'
import { threeGameSettings } from './3d-tour-setting.js';
import { threeTourNicknames } from './3d-tour-setting.js';
import { winners } from '../game/3D/3d-game-app.js';
import { hideLeaderboard } from '../leaderboard.js';


let gameApp = null;
let gameNum = 0;

export function threeDTourGame() {
	appContainer.innerHTML = `
	<div id="3dpongTour"></div>
	`

	gameNum += 1;
	langSetting.style.display = "none";
	hideLeaderboard();
	const pongGame = document.getElementById('3dpongTour');

	if (pongGame) {
		if (gameApp)
			gameApp.dispose();
		if (gameNum === 4) {
			winners.pop();
			gameNum = 1;
		}
		if (winners[0]) {
			threeTourNicknames.push(winners[0]);
			winners.pop();
		}
		let playerIdx = gameNum * 2 - 2;
		console.log("Game " + gameNum + " start!");
		gameApp = new ThreeGame(gameNum, threeGameSettings[0].value, threeGameSettings[1].value, threeTourNicknames[playerIdx], threeTourNicknames[playerIdx + 1]);
		gameApp.start();
	}
}

export function gameClear() {
	gameApp.dispose();
	gameApp = null;
	gameNum = 0;
}
