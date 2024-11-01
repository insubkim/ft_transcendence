# FT_Transcendence

Makefile 생성
- 실행방법
	1.make
	2.https://127.0.0.1/ 으로 접속

# ganache 도커 컨테이너 실행 없이 docker-compose up 명령어 수행 안됨
# make 이용 추천

### 백엔드 요청관련 파일들
- `/BE/pong/urls.py`
- `/BE/pong/views.py`
  - `save_game_result`: 게임결과 & 플레이어 정보 저장
  - `game_rankings`: 각 게임 모드의 1등부터 5등까지 정보제공
