const appContainer = document.getElementById("app");
const langSetting = document.getElementById("globe-icon");
import { ThreeGame } from '../game/3D/3d-game-app.js'
import { gameSettings } from './3d-setting.js';
import { nicknames } from './3d-setting.js';
let gameApp = null;

export function threeDGame() {
	appContainer.innerHTML = `
	<div id="3dpong"></div>
	`

	langSetting.style.display = "none";
	const pongGame = document.getElementById('3dpong');

	if (pongGame) {
		clearGameApp();
		let newGame = new ThreeGame(0, gameSettings[0].value, gameSettings[1].value, nicknames[0], nicknames[1]);
		setGameApp(newGame);
		console.log("GAMESTARTT");
		gameApp.start();
	}
}

export function setGameApp(app) {
	gameApp = app;
}

export function getGameApp() {
	return gameApp;
}

export function clearGameApp() {
	if (gameApp) {
		gameApp.dispose();
		gameApp = null;
	}
}
