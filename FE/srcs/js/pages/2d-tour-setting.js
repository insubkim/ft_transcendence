const appContainer = document.getElementById("app");
import { renderPage } from "../router.js";
import { languages } from "../language.js";
export let gameSettings = [];
export let tourNicknames = [];
// export let TwoDsettingApp = null;
import { gameClear } from "./2d-tour-game.js"; // 2D 전용 게임 클리어 함수로 수정

export function twoDTourSetting(currentLanguage) {
  const is2Dpong = document.getElementById("2dpong");
  if (is2Dpong) {
    gameClear();
    gameSettings = [];
    tourNicknames = [];
  }
	appContainer.innerHTML = `
	<div id="webgl-container"></div>
	<div class="setting-container">
		<form class="selection" id="ball-speed">
			<div>${languages[currentLanguage].threeDBallSpd}:</div>
			<label><input type="radio" name="speed" value="0.02" required checked> ${languages[currentLanguage].threeDEasy}</label><br>
			<label><input type="radio" name="speed" value="0.03"> ${languages[currentLanguage].threeDHard}</label><br>
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
		<button class="back-button" id="2d-back-button">${languages[currentLanguage].goBack}</button>
	</div>
	`

  const startBtn = document.getElementById('game-start');
  const backBtn = document.getElementById('2d-back-button');

  if (startBtn && backBtn) {
    // 기존 App 인스턴스가 있다면 해제
    // if (TwoDsettingApp) {
    //   TwoDsettingApp.dispose();
    //   TwoDsettingApp = null;
    // }

    // 새로운 App 인스턴스 생성
    // TwoDsettingApp = new App();
    // TwoDsettingApp.startAnimation(); // 애니메이션 시작

    startBtn.addEventListener('click', () => {
      // TwoDsettingApp.dispose();
      // TwoDsettingApp = null;

      gameSettings = [];  // 기존 게임 설정을 초기화
      gameSettings.push(document.querySelector('input[name="color"]:checked'));
      gameSettings.push(document.querySelector('input[name="speed"]:checked'));

      let inputP1 = document.querySelector('#p1').value;
      let inputP2 = document.querySelector('#p2').value;
      let inputP3 = document.querySelector('#p3').value;
      let inputP4 = document.querySelector('#p4').value;

      if (!inputP1) inputP1 = "Player1";
      if (!inputP2) inputP2 = "Player2";
      if (!inputP3) inputP3 = "Player3";
      if (!inputP4) inputP4 = "Player4";

      tourNicknames = [];
      tourNicknames.push(inputP1);
      tourNicknames.push(inputP2);
      tourNicknames.push(inputP3);
      tourNicknames.push(inputP4);
      tourNicknames = renameDuplicates(tourNicknames);
      console.log("Starting 2D Tournament!");
      renderPage("2d-tour-game"); // 2D 토너먼트 게임 페이지로 이동
    });

    backBtn.addEventListener('click', () => {
      TwoDsettingApp.dispose();
      TwoDsettingApp = null;
      renderPage('2d-mode-select'); // 2D 모드 선택 페이지로 돌아가기
    });
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
  const counts = {};
  const usedNames = new Set();

  truncateStrings(arr);
  return arr.map(function(str) {
    const { baseName, count } = getBaseName(str);

    if (!counts[baseName]) {
      counts[baseName] = new Set();
    }

    if (!usedNames.has(str)) {
      usedNames.add(str);
      if (count !== null) {
        counts[baseName].add(count);
      }
      return str;
    } else {
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

function getBaseName(str) {
  const match = str.match(/^(.*?)(?:\((\d+)\))?$/);
  if (match) {
    const baseName = match[1];
    const count = match[2] ? parseInt(match[2], 10) : null;
    return { baseName, count };
  }
  return { baseName: str, count: null };
}
