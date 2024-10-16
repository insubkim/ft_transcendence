const appContainer = document.getElementById("app");
const langSetting = document.getElementById("globe-icon");
import { ThreeGame } from '../game/3D/3d-game-app.js'
import { gameSettings } from './3d-tour-setting.js';
import { nicknames } from './3d-tour-setting.js';
import { winners } from '../game/3D/3d-game-app.js';

let gameApp = null;
let gameNum = 0;

export function threeDTourGame() {
	appContainer.innerHTML = `
	<div id="3dpong"></div>
	`

	gameNum += 1;
	langSetting.style.display = "none";
	const pongGame = document.getElementById('3dpong');

	if (pongGame) {
		if (gameApp)
			gameApp.dispose();
		if (gameNum === 4) {
			winners.pop();
			gameNum = 1;
		}
		if (winners[0]) {
			nicknames.push(winners[0]);
			winners.pop();
		}
		let playerIdx = gameNum * 2 - 2;
		console.log("Game " + gameNum + " start!");
		gameApp = new ThreeGame(gameNum, gameSettings[0].value, gameSettings[1].value, nicknames[playerIdx], nicknames[playerIdx + 1]);
		gameApp.start();
	}
}

export function gameClear() {
	gameApp.dispose();
	gameNum = 0;
}
