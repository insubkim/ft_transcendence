const top3 = [
   { "2d_1vs1": ['a', 'b', 'c'], win: [3, 2, 1], total: [6, 4, 2] },
   { "2d_tournament": ['c', 'd', ''], win: [5, 3, ''], total: [8, 5, ''] },
   { "3d_1vs1": ['e', 'f', ''], win: [4, 2, ''], total: [7, 4, ''] },
   { "3d_tournament": ['g', 'h', ''], win: [6, 4, ''], total: [10, 7, ''] }
];

//위와 같은 자료구조로 온다 가정하고 로직짬
//fetch로 받을경우 아래와 같은 함수 사용예정

// let top3 = []; // 데이터를 저장할 변수를 let으로 선언

// async function fetchTop3Data() {
//     try {
//         const response = await fetch('https://localhost/data.json'); // 로컬 JSON 파일 경로 또는 서버 URL 사용
//         if (!response.ok) throw new Error('네트워크 응답 오류');
//         top3 = await response.json();
//         console.log(top3); // 데이터 확인용 로그
//         updateLeaderboard(top3);
//     } catch (error) {
//         console.error('데이터 가져오기 오류:', error);
//     }
// }

const container = document.createElement("div");
container.classList.add("leaderboard-container");

const modes = [
    { title: "2D 1vs1", id: "leaderboard-list1", modeKey: "2d_1vs1", modeIndex: 0 },
    { title: "2D 1vs1vs1vs1", id: "leaderboard-list2", modeKey: "2d_tournament", modeIndex: 1 },
    { title: "3D 1vs1", id: "leaderboard-list3", modeKey: "3d_1vs1", modeIndex: 2 },
    { title: "3D 1vs1vs1vs1", id: "leaderboard-list4", modeKey: "3d_tournament", modeIndex: 3 }
];

modes.forEach(mode => {
    const leaderboard = document.createElement("div");
    leaderboard.classList.add("leaderboard");

    leaderboard.innerHTML = `
        <h2 class="title-text">${mode.title}</h2>
        <div class="header-row">
            <span class="name-field">id</span>
            <span class="score-field">win</span>
            <span class="total-play-field">plays</span>
        </div>
        <div class="leaderboard-list" id="${mode.id}"></div>
    `;

    container.appendChild(leaderboard);
});

document.body.appendChild(container);

function updateLeaderboard(modeKey, modeIndex, listId) {
    const leaderboardList = document.getElementById(listId);
    leaderboardList.innerHTML = ''; // 기존 목록 초기화

    const modeData = top3[modeIndex];

    for (let i = 0; i < 3; i++) {
        if (modeData[modeKey][i]) {  // 이름이 있는 경우에만 표시
            const playerDiv = document.createElement('div');
            playerDiv.classList.add('player');

            playerDiv.innerHTML = `
                <span class="name-field">${i + 1}. ${modeData[modeKey][i]}</span>
                <span class="score-field">${modeData.win[i]}</span>
                <span class="total-play-field">${modeData.total[i]}</span>`;
            leaderboardList.appendChild(playerDiv);
        }
    }
}


export function showLeaderboard() {
    container.style.display = '';
}

// 리더보드를 숨기는 함수
export function hideLeaderboard() {
    container.style.display = 'none';
}

// 각 모드에 맞는 순위표 업데이트 호출
modes.forEach(mode => updateLeaderboard(mode.modeKey, mode.modeIndex, mode.id));
