const appContainer = document.getElementById("app");
const langSetting = document.getElementById("globe-icon");
import { ThreeGame } from '../game/3D/3d-game-app.js'
import { gameSettings } from './3d-setting.js';
import { nicknames } from './3d-setting.js';
import { hideLeaderboard } from '../leaderboard.js';
let gameApp = null;

export function threeDGame() {
	appContainer.innerHTML = `
	<div id="3dpong"></div>
	`

	langSetting.style.display = "none";
	hideLeaderboard();
	const pongGame = document.getElementById('3dpong');

	if (pongGame) {
		if (gameApp)
			gameApp.dispose();
		gameApp = new ThreeGame(0, gameSettings[0].value, gameSettings[1].value, nicknames[0], nicknames[1]);
		console.log("GAMESTARTT");
		gameApp.start();
	}
}

export function gameClear() {
	console.log(gameApp);
	gameApp.dispose();
	gameApp = null;
}
