const appContainer = document.getElementById("app");
const langSetting = document.getElementById("globe-icon");
import { TwoGame } from '../game/2D/2d-game-app.js'
import { gameSettings } from './2d-setting.js';
import { nicknames } from './2d-setting.js';
let gameApp = null;

export function twoDGame() {
	appContainer.innerHTML = `
  <div id="2dpong"></div>
	`

	langSetting.style.display = "none";
	const pongGame = document.getElementById('2dpong');

	if (pongGame) {
		if (gameApp)
			gameApp.dispose();
		gameApp = new TwoGame(0, gameSettings[0].value, gameSettings[1].value, nicknames[0], nicknames[1]);
		console.log("GAMESTARTT");
		gameApp.start();
	}
}

export function gameClear() {
	gameApp.dispose();
}
