import * as THREE from '../3Dmodules/three.module.js';
import { GLTFLoader } from '../3Dmodules/GLTFLoader.js';

export class App {
	constructor() {
		const divContainer = document.querySelector("#webgl-container");
		this._divContainer = divContainer;

		// const renderer = new THREE.WebGLRenderer({ antialias: true });
		// renderer.setPixelRatio(window.devicePixelRatio);
		const renderer = new THREE.WebGLRenderer({
      canvas: document.querySelector("#webgl-container"),
      antialias: true,
    });
		// divContainer.appendChild(renderer.domElement);
		this._renderer = renderer;

		const scene = new THREE.Scene();
    scene.background = new THREE.Color("black");
		this._scene = scene;

		this._setupCamera();
		this._setupLight();
		this._setupModel();

		window.onresize = this.resize.bind(this);
		this.resize();

		const speedOptions = document.querySelectorAll('input[name="speed"]');
		speedOptions.forEach(button => {
			button.addEventListener('change', () => {
				ballSpeed = this._getSpeed();
			});
		});

		const colorOptions = document.querySelectorAll('input[name="color"]');
		colorOptions.forEach(button => {
			button.addEventListener('change', () => {
				this._ballColor = this._getColor();
			});
		});

		// 애니메이션 관련 변수
		this._animationId = null;
	}

	dispose() {
		// 애니메이션 루프 종료
		if (this._animationId)
			this.stopAnimation();

		// 씬에서 모든 객체 제거
		this._scene.traverse((object) => {
			if (object.geometry) {
				object.geometry.dispose(); // 기하학 해제
			}
			if (object.material) {
				if (Array.isArray(object.material)) {
					// 여러 개의 재질이 있는 경우 각 재질 해제
					object.material.forEach((material) => material.dispose());
				} else {
					object.material.dispose(); // 단일 재질 해제
				}
			}
			if (object.texture) {
				object.texture.dispose(); // 텍스처 해제
			}
		});

		// 렌더러 해제
		this._renderer.dispose();

		// 기타 null 처리를 통해 참조 해제
		this._scene = null;
		this._camera = null;
		this._renderer = null;

		console.log("App resources have been disposed.");
	}

	// 애니메이션 루프 시작
	startAnimation() {
		this._animationId = requestAnimationFrame(this._render.bind(this));
	}

	// 애니메이션 루프 중지
	stopAnimation() {
		if (this._animationId) {
			cancelAnimationFrame(this._animationId);
			this._animationId = null;
		}
	}

	// 렌더링 및 애니메이션을 위한 별도 함수
	_render(time) {
		this._renderer.render(this._scene, this._camera);
		this._update(time);
		this._animationId = requestAnimationFrame(this._render.bind(this));
	}

	// 씬 업데이트 (회전 및 위치 변경 등)
	_update(time) {
		time *= 0.001;
	}

	_getColor() {
		const selectedColor = document.querySelector('input[name="color"]:checked');
		return Number(selectedColor.value);
	}

	_getSpeed() {
		const selectedSpeed = document.querySelector('input[name="speed"]:checked');
		return Number(selectedSpeed.value);
	}

	_setupCamera() {
		const width = this._divContainer.clientWidth;
		const height = this._divContainer.clientHeight;
		const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 5, 5);
		this._camera = camera;
	}

	_setupLight() {
    const PLight = new THREE.PointLight(0xffffff, 30, 100);
    const ALight = new THREE.AmbientLight();
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

	_setupModel() {
    let loader = new GLTFLoader();
    loader.load("./../../../../../FE/img/2d_game_pong_table/scene.gltf", (gltf) => {
      this._scene.add(gltf.scene);
      this._renderer.render(this._scene, this._camera);
    },
    function ( xhr ) {
      console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
    },
    function ( error ) {
      console.log( 'An error happened' );
      console.log( error );
    });
	}

	resize() {
		const width = this._divContainer.clientWidth;
		const height = this._divContainer.clientHeight;
		this._camera.aspect = width / height;
		this._camera.updateProjectionMatrix();
		this._renderer.setSize(width, height);
	}
}
