import * as THREE from '../3Dmodules/three.module.js';
import { GLTFLoader } from '../3Dmodules/GLTFLoader.js';
import { OrbitControls } from '../3Dmodules/OrbitControls.js';

import { ScoreBoard } from '../3D/app.js';
class GameRenderer {
	constructor(divContainer) {
		this._divContainer = divContainer;
		this._renderer = new THREE.WebGLRenderer({ antialias: true });
		this._renderer.setPixelRatio(window.devicePixelRatio);
		divContainer.appendChild(this._renderer.domElement);
	}

	resize() {
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
	constructor(ballColor, ballWireColor) {
		this._scene = new THREE.Scene();
		this._ballColor = ballColor;
		this._objects = {};

		this._setupLight();
		this._setupModels();
	}

	_setupLight() {
    const pointLight = new THREE.PointLight(0xffffff, 30, 100);
    const ambientLight = new THREE.AmbientLight();
    pointLight.position.set(0, 5, 0);
    this._scene.add(pointLight, ambientLight);
    
    // spotLight1,2 는 테스트 중
    const spotLight1 = new THREE.SpotLight(0xffffff, 10);
    spotLight1.position.set(-3, 6, -3);
    scene.add(spotLight1);

    spotLight1.target.position.set(-1, -1, -3);
    scene.add(spotLight1.target);

    // spotLight1,2 는 테스트 중
    const spotLight2 = new THREE.SpotLight(0xffffff, 10);
    spotLight2.position.set(0, 0, 3);
    scene.add(spotLight2);

    spotLight2.target.position.set(0, 0, 0);
    scene.add(spotLight2.target);
	}

	_setupModels() {
		this._createRoom();
    this._createBall();
		this._createPaddles();
	}

	_createRoom() {
    // gltf 업로드
    let loader = new GLTFLoader();
    loader.load("./../../../../img/2d_game_pong_table/scene.gltf", function (gltf) {
      this.scene.add(gltf.scene);
    },
    function ( xhr ) {
      console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
    },
    function ( error ) {
      console.log( 'An error happened' );
    });
	}

	_createBall() {
		const ballGeometry = new THREE.SphereGeometry(2, 10, 10);
		const ballEdges = new THREE.EdgesGeometry(ballGeometry);
		const ballMaterial = new THREE.MeshPhongMaterial({ color: this._ballColor });
		const ballWireMaterial = new THREE.LineBasicMaterial({ color: this._ballWireColor });
		const ball = new THREE.Mesh(ballGeometry, ballMaterial);
		const ballWire = new THREE.LineSegments(ballEdges, ballWireMaterial);
		ballWire.rotation.x = Math.PI / 2;

		const ballGroup = new THREE.Group();
		ballGroup.add(ball);
		ballGroup.add(ballWire);

		this._scene.add(ballGroup);
		this._objects.ballGroup = ballGroup;
		this._objects.ball = ball;
		this._objects.ballWire = ballWire;
	}

	_createPaddles() {
		const paddleGeometry = new THREE.BoxGeometry(0.4, 5, 5);
		const paddleEdges = new THREE.EdgesGeometry(paddleGeometry);
		const paddleWireMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });

		// 1P 패들 생성
		const p1Material = new THREE.MeshBasicMaterial({
			color: 0xD9A6A6,
			transparent: true,
			opacity: 0.5
		});
		const p1Paddle = new THREE.Mesh(paddleGeometry, p1Material);
		const p1PaddleWire = new THREE.LineSegments(paddleEdges, paddleWireMaterial);
		const p1PaddleGroup = new THREE.Group();

		// 2P 패들 생성
		const p2Material = new THREE.MeshBasicMaterial({
			color: 0xA6E1F9,
			transparent: true,
			opacity: 0.5
		});
		const p2Paddle = new THREE.Mesh(paddleGeometry, p2Material);
		const p2PaddleWire = new THREE.LineSegments(paddleEdges, paddleWireMaterial);
		const p2PaddleGroup = new THREE.Group();

		// CrossHair
		const whiteWireMat = new THREE.LineBasicMaterial({ color: 0xffffff });
		const circleGeo = new THREE.CircleGeometry(2, 64);
		const circleGeo2 = new THREE.CircleGeometry(0.5, 64);
		const circleEdge = new THREE.EdgesGeometry(circleGeo);
		const circleEdge2 = new THREE.EdgesGeometry(circleGeo2);
		const circleWire = new THREE.LineSegments(circleEdge, whiteWireMat);
		const circleWire2 = new THREE.LineSegments(circleEdge2, whiteWireMat);
		circleWire.rotation.y = Math.PI / 2;
		circleWire2.rotation.y = Math.PI / 2;

		const half = 5 / 2;
		const pointX = [new THREE.Vector3(-half, 0, 0), new THREE.Vector3(half, 0, 0)];
		const pointY = [new THREE.Vector3(0, -half, 0), new THREE.Vector3(0, half, 0)];
		const lineGeometryX = new THREE.BufferGeometry().setFromPoints(pointX);
		const lineX = new THREE.Line(lineGeometryX, whiteWireMat);
		const lineGeometryY = new THREE.BufferGeometry().setFromPoints(pointY);
		const lineY = new THREE.Line(lineGeometryY, whiteWireMat);
		lineX.rotation.y = Math.PI / 2;
		lineY.rotation.y = Math.PI / 2;

		p1PaddleGroup.add(p1Paddle);
		p1PaddleGroup.add(p1PaddleWire);
		p1PaddleGroup.add(circleWire);
		p1PaddleGroup.add(circleWire2);
		p1PaddleGroup.add(lineX);
		p1PaddleGroup.add(lineY);

		p2PaddleGroup.add(p2Paddle);
		p2PaddleGroup.add(p2PaddleWire);
		p2PaddleGroup.add(circleWire.clone());
		p2PaddleGroup.add(circleWire2.clone());
		p2PaddleGroup.add(lineX.clone());
		p2PaddleGroup.add(lineY.clone());

		p1PaddleGroup.position.set(15, 0, 0);
		p2PaddleGroup.position.set(-15, 0, 0);
		this._scene.add(p1PaddleGroup);
		this._scene.add(p2PaddleGroup);

		this._objects.p1PaddleGroup = p1PaddleGroup;
		this._objects.p2PaddleGroup = p2PaddleGroup;
	}

	getScene() {
		return this._scene;
	}

	getObjects() {
		return this._objects;
	}
}


class ThreeGame {
	constructor(speed, color, p1Name, p2Name) {
		this._divContainer = document.getElementById('webgl-container');
		this._renderer = new GameRenderer(this._divContainer);
		this._scene = new GameScene(color, color === 0xC0C0C0 ? 0x000000 : 0xFFFFFF);
		this._objects = this._scene.getObjects();
		this._controller = new GameController(speed, this._objects, p1Name, p2Name);

		window.onresize = this.resize.bind(this);
		this.resize();

		ScoreBoard.init();
		ScoreBoard.update(this._controller.playerInfo);

		this._animationId = null;
		// 컨트롤 비활성화
		this._controller._controlsEnabled = false;
  }


	_setupCameras() {
		const width = this._divContainer.clientWidth;
		const height = this._divContainer.clientHeight;

		// 1P 카메라 초기 위치 (대각선 위쪽)
		this._camera1p = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
	}

  _setupControls() {
		new OrbitControls(this._camera1p, this._divContainer);
	}

	resize() {
		this._renderer.resize();

		this._camera1p.aspect = window.innerWidth / 2 / window.innerHeight;
		this._camera1p.updateProjectionMatrix();
	}

	start() {
		this._animationId = requestAnimationFrame(this._animate.bind(this));
	}

	async _animate() {
		await this._controller.update();

		this._renderer.render(this._scene.getScene(), this._camera1p);

		if (!this._controller._isGameOver) {
			this._animationId = requestAnimationFrame(this._animate.bind(this));
		}
	}

  dispose() {
		if (this._animationId) {
			cancelAnimationFrame(this._animationId);
			this._animationId = null;
		}
		this._renderer.dispose();
		// 기타 리소스 해제 코드
	}
}



window.onload = function () {
	const game = new ThreeGame(1, 0x8A2BE2, "Yusekim", "Inskim");
	game.start();
}
