const appContainer = document.getElementById("app");
const langSetting = document.getElementById("globe-icon");
import { ThreeGame } from '../game/3D/3d-game-app.js'
import { gameSettings } from './3d-setting.js';
import { nicknames } from './3d-setting.js';
import { setGameApp } from './3d-game.js';
import { clearGameApp } from './3d-game.js';

let gameApp = null;

export function threeDTourGame() {
	appContainer.innerHTML = `
	<div id="3dpong"></div>
	`

	langSetting.style.display = "none";
	const pongGame = document.getElementById('3dpong');

	if (pongGame)
		newGameStart(1, nicknames[0], nicknames[1]);
}

export function newGameStart(gameNum, P1Nick, P2Nick) {
	clearGameApp();
	let newGame = new ThreeGame(gameNum, gameSettings[0], gameSettings[1], P1Nick, P2Nick);
	setGameApp(newGame);
	console.log("Game " + gameNum + " started");
	newGame.start(() => {
		clearGameApp();
		gameNum += 1;
		newGameStart(gameNum, nicknames[gameNum + 1], nicknames[gameNum + 2]);
	});
}
