import * as THREE from '../3Dmodules/three.module.js';
import { OrbitControls } from '../3Dmodules/OrbitControls.js';
import { GLTFLoader } from '../3Dmodules/GLTFLoader.js';
import { renderPage } from '../../router.js';
import { twoDTourGame } from '../../pages/2d-tour-game.js';
import { tourNicknames } from '../../pages/2d-tour-setting.js';
const appContainer = document.getElementById("app");
export let winners = [];

class GameRenderer {
	constructor(divContainer) {
		this._divContainer = divContainer;
		this._renderer = new THREE.WebGLRenderer({ antialias: true });
		this._renderer.setPixelRatio(window.devicePixelRatio);
		divContainer.appendChild(this._renderer.domElement);
		console.log(divContainer);
		this._renderer.outputEncoding = THREE.sRGBEncoding;
    this._renderer.setSize(window.innerWidth, window.innerHeight);

	}

	render(scene, camera) {
		this._renderer.render(scene, camera);
	}

	dispose() {
		this._renderer.dispose();
		this._divContainer.removeChild(this._renderer.domElement);
	}
}

class GameScene {
	constructor(ballColor) {
		this._scene = new THREE.Scene();
		this._ballColor = ballColor;
		this._objects = {};

		this._setupLight();
		this._setupModels();
	}

	dispose() {
		this._scene.traverse((object) => {
			if (object.isMesh) {
				object.geometry.dispose();
				if (Array.isArray(object.material))
					object.material.forEach((material) => material.dispose());
				else if (object.material)
					object.material.dispose();
			}
		});
		this._objects = {};
	}

	_setupLight() {
    let PLight = new THREE.PointLight(0xffffff, 30, 100);
    let ALight = new THREE.AmbientLight();
    PLight.position.set(0, 5, 0);
    this._scene.add(PLight, ALight);

    const spotLight = new THREE.SpotLight(0xffffff, 10);
    spotLight.position.set(-3, 6, -3);
    this._scene.add(spotLight);
    spotLight.target.position.set(-1, -1, -3);
    this._scene.add(spotLight.target);

    const spotLight2 = new THREE.SpotLight(0xffffff, 10);
    spotLight2.position.set(0, 0, 3);
    this._scene.add(spotLight2);
    spotLight2.target.position.set(0, 0, 0);
    this._scene.add(spotLight2.target);
	}

	_setupModels() {
		this._createBall();
		this._createPaddles();
		this._createTable();
	}

	_createBall() {
    const material = new THREE.MeshBasicMaterial({ color: this._ballColor });
    const sphere_geometry = new THREE.SphereGeometry(0.03, 32, 32); // radius, width segments, height segments
    const sphere = new THREE.Mesh(sphere_geometry, material);
    sphere.position.x += -0.05;
    sphere.position.y += 0.8;
    sphere.position.z += -0.2;
    this._scene.add(sphere);
		this._objects.ball = sphere;
	}

	_createPaddles() {
    const box_geometry = new THREE.BoxGeometry(0.1, 0.5, 0.5);
    const orange_color = new THREE.MeshBasicMaterial({ color: 0XFFB347 });
    const sky_color = new THREE.MeshBasicMaterial({ color: 0XC0E8F8 });
    const cube1 = new THREE.Mesh(box_geometry, orange_color);
    const cube2 = new THREE.Mesh(box_geometry, sky_color);
    cube1.position.x += 1.4;
    cube1.position.y += 0.8;
    cube1.position.z += 0.4;
    cube2.position.x -= 1.5;
    cube2.position.y += 0.8;
    this._scene.add(cube1);
    this._scene.add(cube2);

		this._objects.p1Paddle = cube1;
		this._objects.p2Paddle = cube2;
	}

  _createTable() {
    const loader = new GLTFLoader();
    loader.load("./../../../../../img/2d_game_pong_table/scene.gltf", (gltf) => {
      this._scene.add(gltf.scene);
  		this._objects.table = gltf.scene;
    },
    function ( xhr ) {
      console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
    },
    function ( error ) {
      console.log( 'An error happened' );
    });
	}

	getScene() {
		return this._scene;
	}

	getObjects() {
		return this._objects;
	}
}

class GameController {
	constructor(speed, objects, p1Name, p2Name) {
		this._speed = speed;
		this._ball_dyd = 0;
		this._ball_dxd = 0;
		this._objects = objects;
		this._keyState = {};
		this._isGameOver = false;
		this.playerInfo = { player1Name: p1Name, player2Name: p2Name, player1Score: 0, player2Score: 0 };
		this._maxScore = 5;

		// 컨트롤 활성화 여부 플래그
		this._controlsEnabled = true;

		this._detectKeyPress();
	}

	dispose() {
		this._keyState = {};
		this._isGameOver = false;
		this.playerInfo = null;
	}

	_detectKeyPress() {
		window.addEventListener('keydown', (event) => {
			this._keyState[event.code] = true;
		});

		window.addEventListener('keyup', (event) => {
			this._keyState[event.code] = false;
		});
	}

	sleep(ms) {
		return new Promise(resolve => setTimeout(resolve, ms));
	}

	async update() {
		if (this._isGameOver) return;

		this._movePaddles();
		await this._moveBall();
	}

	_movePaddles() {
		if (!this._controlsEnabled) return; // 컨트롤이 비활성화된 경우 패들 이동 중지

		const moveSpd = 0.1;

		// 1P 패들 이동
		const p1Paddle = this._objects.p1Paddle;
		if (this._keyState['ArrowLeft'])
			p1Paddle.position.z += moveSpd;
		if (this._keyState['ArrowRight'])
			p1Paddle.position.z -= moveSpd;

		// 2P 패들 이동
		const p2Paddle = this._objects.p2Paddle;
		if (this._keyState['KeyA'])
			p2Paddle.position.z -= moveSpd;
		if (this._keyState['KeyD'])
			p2Paddle.position.z += moveSpd;
	}

	async _moveBall() {
		const sphere = this._objects.ball;
		const cube1 = this._objects.p1Paddle;
		const cube2 = this._objects.p2Paddle;

    const board_coord = {
      top : -0.9,
      bottom : 0.5,
      left : -1.3,
      right : 1.3
    }

    if (sphere.position.z < board_coord.top &&
			sphere.position.x > board_coord.left &&
			sphere.position.x < board_coord.right
		) { // 위
      console.log('hit board top!');
      this._ball_dyd = 1;
    }

    if (sphere.position.z > board_coord.bottom &&
			sphere.position.x > board_coord.left &&
			sphere.position.x < board_coord.right
		) { // 아래
      console.log('hit board bottom!');
      this._ball_dyd = 0;
    }

    // 왼쪽
    if (sphere.position.x < cube1.position.x &&
      sphere.position.x > cube1.position.x - 0.1 &&
      sphere.position.z > cube1.position.z - 0.25 &&
      sphere.position.z < cube1.position.z + 0.25) {
      this._ball_dxd = 0;
    }
    // 오른쪽
    if (sphere.position.x > cube2.position.x &&
      sphere.position.x < cube2.position.x + 0.1 &&
      sphere.position.z > cube2.position.z - 0.25 &&
      sphere.position.z < cube2.position.z + 0.25) {
				this._ball_dxd = 1;
    }
    // score 셋
    if (sphere.position.x <= board_coord.left - 1 ||
      sphere.position.x >= board_coord.right + 1) {
      if (sphere.position.x <= board_coord.left - 1 ) {
        this.playerInfo.player2Score += 1;
      } else {
        this.playerInfo.player1Score += 1;
      }
			ScoreBoard.update(this.playerInfo, this._playernames);
      // 게임 종료 체크
			if (this.playerInfo.player1Score >= this._maxScore || this.playerInfo.player2Score >= this._maxScore) {
				this._isGameOver = true;
				ScoreBoard.showGameOver(this.playerInfo);
				return;
			}

      sphere.position.x = 0;
      sphere.position.z = 0;
      return;
    }

		sphere.position.z += this._ball_dyd == 0 ? -1 * this._speed : 1 * this._speed;
    sphere.position.x += this._ball_dxd == 0 ? -1 * this._speed : 1 * this._speed;
	}

	_resetGameObjects() {
		const ball = this._objects.ball;
		const p1Paddle = this._objects.p1Paddle;
		const p2Paddle = this._objects.p2Paddle;

		p1Paddle.position.set(1.4, 0.8, 0.1);
		p2Paddle.position.set(-1.5, 0.8, -0.5);
		ball.position.set(-0.05, 0.8, -0.2);
	}
}

class ScoreBoard {
	static init(gameNum) {
		this._scoreBoard = document.createElement('div');
		this._scoreBoard.classList.add('game-score');
		this._gameNum = gameNum;
		appContainer.appendChild(this._scoreBoard);
	}

	static dispose() {
		if (this._scoreBoard && this._scoreBoard.parentNode) {
			this._scoreBoard.parentNode.removeChild(this._scoreBoard);
			this._scoreBoard = null;
		}
		if (this._gameOverElement && this._gameOverElement.parentNode) {
			this._gameOverElement.parentNode.removeChild(this._gameOverElement);
			this._gameOverElement = null;
		}
		// 이벤트 리스너 제거
		if (this._returnBtn) {
			this._returnBtn.removeEventListener('click', () => renderPage('game-select'));
			this._returnBtn = null;
		}
	}

	static update(playerInfo) {
		let gameNumTxt = '';
		if (this._gameNum)
			gameNumTxt = `Game ` + this._gameNum + `<br>`;
		this._scoreBoard.innerHTML = gameNumTxt + `${playerInfo.player1Name}: ${playerInfo.player1Score} - ${playerInfo.player2Name}: ${playerInfo.player2Score}`;
	}

	updateWinner(){
		fetch('https://127.0.0.1:8000/save-game-result', {
			method: 'POST', // HTTP 메서드 설정
			headers: {
					'Content-Type': 'application/json' // 전송할 데이터의 형식 지정
			},
			body: JSON.stringify({ // 전송할 데이터
					'game-mode': '2d-1vs1',
					'players': ['insub2', 'qwer'],
					'winner-name': 'insub2'
			})
		})
		.then(response => response.json()) // 응답을 JSON으로 파싱
		.then(data => {
				console.log('Success:', data);
		})
		.catch((error) => {
				console.error('Error:', error);
		});
	}

	static showGameOver(playerInfo) {
		const gameOverText = document.createElement('div');
		gameOverText.classList.add('game-over');
		const winner = playerInfo.player1Score >= 5 ? `${playerInfo.player1Name}` : `${playerInfo.player2Name}`;
		gameOverText.innerHTML = `Game Over<br>${winner}` + ' Wins!';
		appContainer.appendChild(gameOverText);

		const returnBtn = document.createElement('button');
		returnBtn.classList.add('game-over-button');
		if (this._gameNum && this._gameNum < 3) {
			returnBtn.textContent = 'Go to the next match';
			returnBtn.addEventListener('click', () => {
				winners.push(winner);
				twoDTourGame();
			});
		}
		else if (this._gameNum === 0) {
			returnBtn.textContent = 'Back to the main page';
			returnBtn.addEventListener('click', () => renderPage('game-select'));
			console.log('HERE');
			//code for 1v1 result

			fetch('https://127.0.0.1:8000/api/save-game-result/', {
				method: 'POST', // HTTP 메서드 설정
				headers: {
						'Content-Type': 'application/json', // 전송할 데이터의 형식 지정
				},
				body: JSON.stringify({ // 전송할 데이터
						'game-mode': '2d-1vs1',
						'players': [`${playerInfo.player1Name}`, `${playerInfo.player2Name}`],
						'winner-name': `${winner}`
				})
			})
			.then(response => response.json()) // 응답을 JSON으로 파싱
			.then(data => {
					console.log('Success:', data);
			})
			.catch((error) => {
					console.error('Error:', error);
			});
		}
		else {
			winners.push(winner);
			tourNicknames.push(winner);
			returnBtn.textContent = 'Check results';
			returnBtn.addEventListener('click', () => renderPage('2d-check-results'));
		}
		gameOverText.appendChild(returnBtn);

		this._gameOverElement = gameOverText;
		this._returnBtn = returnBtn;
	}
}

export class TwoGame {
	constructor(gameNum, color, speed, p1Name, p2Name) {
		this._divContainer = document.getElementById('2dpong');
		this._renderer = new GameRenderer(this._divContainer);
		this._scene = new GameScene(Number(color));
		this._objects = this._scene.getObjects();
		this._controller = new GameController(speed, this._objects, p1Name, p2Name);
		this._setupCameras();

		this._controls = new OrbitControls(this._camera, this._renderer._renderer.domElement);

		ScoreBoard.init(gameNum);
		ScoreBoard.update(this._controller.playerInfo);

		this._animationId = null;
		// 컨트롤 비활성화
		// this._controller._controlsEnabled = false;
	}

_setupCameras() {
    const width = this._divContainer.clientWidth;
    const height = this._divContainer.clientHeight;

    this._camera = new THREE.PerspectiveCamera(
        45,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    this._camera.position.set(0, 5, 5);
    this._camera.lookAt(0, 0, 0); // Add this line
}
	start(onGameOverCallback) {
		this._animationId = requestAnimationFrame(this._animate.bind(this));
	}

	async _animate() {
		await this._controller.update();

		this._renderer.render(this._scene.getScene(), this._camera);

		if (this._renderer && !this._controller._isGameOver)
			this._animationId = requestAnimationFrame(this._animate.bind(this));
	}

	dispose() {
		if (this._animationId) {
			cancelAnimationFrame(this._animationId);
			this._animationId = null;
		}
		if (this._renderer) {
			this._renderer.dispose();
			this._renderer = null;
		}
		if (this._controller) {
			this._controller.dispose();
			this._controller = null;
		}
		if (this._scene) {
			this._scene.dispose();
			this._scene = null;
		}
		if (ScoreBoard) {
			ScoreBoard.dispose();
		}

		// 기타 리소스 해제
		this._divContainer = null;
		this._objects = null;
		this._camera = null;
		console.log('2D game resources dispose complete');
	}
}
