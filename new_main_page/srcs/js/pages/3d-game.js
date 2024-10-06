const appContainer = document.getElementById("app");
const langSetting = document.getElementById("globe-icon");
import { ThreeGame } from '../game/3D/3d-game-app.js'
import { renderPage } from '../router/router.js';
import { gameSettings } from './3d-setting.js';
import { nicknames } from './3d-setting.js';
let game = null;
export let isFirstLoad = true; // 첫 로드 여부를 체크하기 위한 플래그

export function threeDGame() {
	appContainer.innerHTML = `
	<div id="3dpong"></div>
	`

	langSetting.style.display = "none";
	const pongGame = document.getElementById('3dpong');

	if (pongGame) {
		if (game) {
			game.dispose();
			game = null;
		}
		if (!gameSettings || gameSettings.length < 2 || !gameSettings[0] || !gameSettings[1]) {
			renderPage('game-select');
			return 1;
		}
		game = new ThreeGame(gameSettings[0].value, gameSettings[1].value, nicknames[0], nicknames[1]);
		console.log("GAMESTARTT");
		game.start();
	}
	// 첫 로드가 아닌 경우에만 popstate 이벤트에서 dispose 호출
	if (!isFirstLoad) {
		window.addEventListener('popstate', () => {
			if (game) {
				game.dispose();
				game = null; // game 인스턴스를 해제
				renderPage('game-select');
				return 1;
			}
		});
	}
	isFirstLoad = false;
}
