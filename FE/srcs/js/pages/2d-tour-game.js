const appContainer = document.getElementById("app");
const langSetting = document.getElementById("globe-icon");
import { TwoGame } from '../game/2D/2d-game-app.js';
import { gameSettings } from './2d-tour-setting.js';
import { tourNicknames } from './2d-tour-setting.js';
import { winners } from '../game/2D/2d-game-app.js';
import { hideLeaderboard } from '../leaderboard.js';
let gameApp = null;
let gameNum = 0;

export function twoDTourGame() {
    appContainer.innerHTML = `
    <div id="2dpong"></div>
    `;

    gameNum += 1;
    langSetting.style.display = "none";
    hideLeaderboard();
    const pongGame = document.getElementById('2dpong');

    if (pongGame) {
        if (gameApp)
            gameApp.dispose();
        if (gameNum === 4) {
            winners.pop();
            gameNum = 1;
        }
        if (winners[0]) {
            tourNicknames.push(winners[0]);
            winners.pop();
        }
        let playerIdx = gameNum * 2 - 2;
        console.log("Game " + gameNum + " start!");
        gameApp = new TwoGame(
            gameNum,
            gameSettings[0].value,
            gameSettings[1].value,
            tourNicknames[playerIdx],
            tourNicknames[playerIdx + 1]
        );
        gameApp.start();
    }
}

export function gameClear() {
    if (gameApp) {
        gameApp.dispose();
        gameApp = null;
    }
    gameNum = 0;
}
