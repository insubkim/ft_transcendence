// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract TTest {

    string[] winner;
    string[] player;
    string[] mode;
    uint num;
    uint full;
    uint max;

    constructor() {
        num = 0;
        full = 0;
	max = 10;
    }

    function uintToString(uint v) private pure returns (string memory) {
        if (v == 0) {
            return "0"; // 0의 경우 특별 처리
        }

        bytes memory reversed = new bytes(100);
        uint i = 0;

        while (v != 0) {
            uint remainder = v % 10;
            v = v / 10;
            reversed[i++] = bytes1(uint8(48 + remainder)); // bytes1로 변환
        }

        bytes memory s = new bytes(i);
        for (uint j = 0; j < i; j++) {
            s[j] = reversed[i - j - 1]; // 인덱스 수정
        }

        return string(s);
    }

    function line() private pure returns(string memory) {
        bytes memory ret = new bytes(0);

        for(uint i = 0; i < 8; i++) {
            ret = abi.encodePacked(ret, "***********");
        }
        ret = abi.encodePacked(ret, "*\n");
        return string(ret);
    }

    function push(string memory str, uint n) private pure returns(string memory) {
        uint space = n - bytes(str).length;
        bytes memory ret = new bytes(0);

        ret = abi.encodePacked(ret, " ", str);
        for (uint i = 0; i < space; i++) {
            ret = abi.encodePacked(ret, " ");
        }
        ret = abi.encodePacked(ret, " *");
        return string(ret);
    }

    function log(uint go, uint to, uint n) private view returns(string memory) {
        bytes memory ret = new bytes(0);
        uint i = go;

        while (i > to) {
            i -= 1;
            ret = abi.encodePacked(ret, "*", push(uintToString(n), 2), push(mode[i], 13), push(winner[i], 11), push(player[i], 50), "\n");
	    n = n + 1;
        }
        return string(ret);
    }

    function speak() public view returns(string memory) {
        bytes memory ret;

        if (num == 0 && full == 0) {
            ret = abi.encodePacked("*There is no record of the ping pong game*");
        } else {
            ret = abi.encodePacked(line(), "*", push("    LAST 10 GAMES", 85), "\n", line());
	    ret = abi.encodePacked(ret, "*", push("i", 2), push("  Game_mode", 13), push("  Winner", 11), push("  Players", 50), "\n", line());
	    ret = abi.encodePacked(ret, log(num, 0, 0));
            if (full == 1) {
                ret = abi.encodePacked(ret, log(max, num, num));
            }
            ret = abi.encodePacked(ret, line());
        }
        return string(ret);
    }

    function write(string memory m, string memory p, string memory w) public {
        require(winner.length <= max, "Maximum entries reached"); // 최대 개수 체크
	if (full == 0) {
            winner.push(w);
            player.push(p);
            mode.push(m);
	}
	else {
	    winner[num] = w;
	    player[num] = p;
	    mode[num] = m;
	}
	num ++;
        if (num == max) {
            full = 1;
            num = 0;    
        }
    }
}
