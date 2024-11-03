const appContainer = document.getElementById("app");
import { threeTourNicknames } from "./3d-tour-setting.js";
import { renderPage } from "../router.js";
import { gameClear } from "./3d-tour-game.js";
import { languages } from "../language.js";

export function threeCheckTourResults(currentLanguage) {
	const is3Dpong = document.getElementById("3dpong");
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
			<li class="team-item">${threeTourNicknames[0]}</li>
			<li class="team-item">${threeTourNicknames[1]}</li>
			<li class="team-item">${threeTourNicknames[2]}</li>
			<li class="team-item">${threeTourNicknames[3]}</li>
		</ul>
		<ul class="bracket bracket-2">
			<li class="team-item">${threeTourNicknames[4]}</li>
			<li class="team-item">${threeTourNicknames[5]}</li>
		</ul>
			<ul class="bracket bracket">
			<li class="team-item">${threeTourNicknames[6]}</li>
		</ul>
		</div>
		<button class="back-button" id="back-btn">${languages[currentLanguage].goMain}</button>
	</div>
	`

	const backBtn = document.getElementById('back-btn');

	if (backBtn) {
		backBtn.addEventListener('click', () => {
			fetch('https://127.0.0.1:8000/api/save-game-result/', {
				method: 'POST', // HTTP 메서드 설정
				headers: {
						'Content-Type': 'application/json', // 전송할 데이터의 형식 지정
				},
				body: JSON.stringify({ // 전송할 데이터
						'game-mode': '3d-tournament',
						'players': [`${threeTourNicknames[0]}`, `${threeTourNicknames[1]}`, `${threeTourNicknames[2]}`, `${threeTourNicknames[3]}`],
						'winner-name': `${threeTourNicknames[6]}`
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
			// 결과정보 보내기..
		})
	}
}
