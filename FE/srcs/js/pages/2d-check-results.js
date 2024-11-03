const appContainer = document.getElementById("app");
import { tourNicknames } from "./2d-tour-setting.js";
import { renderPage } from "../router.js";
import { gameClear } from "./2d-tour-game.js";
import { languages } from "../language.js";

export function twoCheckTourResults(currentLanguage) {
	const is3Dpong = document.getElementById("2dpong");
	if (is3Dpong)
		gameClear();
	appContainer.innerHTML = `
	<div class="tournament-container">
		<div class="tournament-headers">
			<h3>${languages[currentLanguage].players}</h3>
			<h3>${languages[currentLanguage].final}</h3>
			<h3>${languages[currentLanguage].winner}</h3>
		</div>

		<div class="tournament-brackets">
		<ul class="bracket bracket">
			<li class="team-item">${tourNicknames[0]}</li>
			<li class="team-item">${tourNicknames[1]}</li>
			<li class="team-item">${tourNicknames[2]}</li>
			<li class="team-item">${tourNicknames[3]}</li>
		</ul>
		<ul class="bracket bracket-2">
			<li class="team-item">${tourNicknames[4]}</li>
			<li class="team-item">${tourNicknames[5]}</li>
		</ul>
			<ul class="bracket bracket">
			<li class="team-item">${tourNicknames[6]}</li>
		</ul>
		</div>
		<button class="back-button" id="back-btn">${languages[currentLanguage].goMain}</button>
	</div>
	`

	const backBtn = document.getElementById('back-btn');

	if (backBtn) {
		backBtn.addEventListener('click', () => {
			fetch('http://127.0.0.1:8000/api/save-game-result/', {
				method: 'POST', // HTTP 메서드 설정
				headers: {
						'Content-Type': 'application/json', // 전송할 데이터의 형식 지정
				},
				body: JSON.stringify({ // 전송할 데이터
						'game-mode': '3d-tournament',
						'players': [`${tourNicknames[0]}`, `${tourNicknames[1]}`, `${tourNicknames[2]}`, `${tourNicknames[3]}`],
						'winner-name': `${tourNicknames[6]}`
				})
			})
			.then(response => response.json()) // 응답을 JSON으로 파싱
			.then(data => {
					console.log('Success:', data);
			})
			.catch((error) => {
					console.error('Error:', error);
			});
			renderPage('game-select');
		})
	}
}
