function getMora(c, v) {
	switch (c) {
		case 'none':
		switch (v) {
			case 'a': return('あ');
			case 'i': return('い');
			case 'u': return('う');
			case 'e': return('え');
			case 'o': return('お');
			default: return('');
		}
		case 'k':
		switch (v) {
			case 'a': return('か');
			case 'i': return('き');
			case 'u': return('く');
			case 'e': return('け');
			case 'o': return('こ');
			default: return('');
		}
		case 'ky':
		switch (v) {
			case 'a': return('きゃ');
			case 'u': return('きゅ');
			case 'o': return('きょ');
			default: return('');
		}
		case 'g':
		switch (v) {
			case 'a': return('が');
			case 'i': return('ぎ');
			case 'u': return('ぐ');
			case 'e': return('げ');
			case 'o': return('ご');
			default: return('');
		}
		case 'gy':
		switch (v) {
			case 'a': return('ぎゃ');
			case 'u': return('ぎゅ');
			case 'o': return('ぎょ');
			default: return('');
		}
		case 's':
		switch (v) {
			case 'a': return('さ');
			case 'i': return('し');
			case 'u': return('す');
			case 'e': return('せ');
			case 'o': return('そ');
			default: return('');
		}
		case 'sy':
		switch (v) {
			case 'a': return('しゃ');
			case 'u': return('しゅ');
			case 'e': return('しぇ');
			case 'o': return('しょ');
			default: return('');
		}
		case 'z':
		switch (v) {
			case 'a': return('ざ');
			case 'i': return('じ');
			case 'u': return('ず');
			case 'e': return('ぜ');
			case 'o': return('ぞ');
			default: return('');
		}
		case 'zy':
		switch (v) {
			case 'a': return('じゃ');
			case 'u': return('じゅ');
			case 'e': return('じぇ');
			case 'o': return('じょ');
			default: return('');
		}
		case 't':
		switch (v) {
			case 'a': return('た');
			case 'i': return('ち');
			case 'u': return('つ');
			case 'e': return('て');
			case 'o': return('と');
			default: return('');
		}
		case 'ty':
		switch (v) {
			case 'a': return('ちゃ');
			case 'u': return('ちゅ');
			case 'e': return('ちぇ');
			case 'o': return('ちょ');
			default: return('');
		}
		case 'd':
		switch (v) {
			case 'a': return('だ');
			case 'i': return('ぢ');
			case 'u': return('づ');
			case 'e': return('で');
			case 'o': return('ど');
			default: return('');
		}
		case 'n':
		switch (v) {
			case 'a': return('な');
			case 'i': return('に');
			case 'u': return('ぬ');
			case 'e': return('ね');
			case 'o': return('の');
			default: return('');
		}
		case 'ny':
		switch (v) {
			case 'a': return('にゃ');
			case 'u': return('にゅ');
			case 'e': return('にぇ');
			case 'o': return('にょ');
			default: return('');
		}
		case 'h':
		switch (v) {
			case 'a': return('は');
			case 'i': return('ひ');
			case 'u': return('ふ');
			case 'e': return('へ');
			case 'o': return('ほ');
		}
		case 'hy':
		switch (v) {
			case 'a': return('ひゃ');
			case 'u': return('ひゅ');
			//case 'e': return('ひぇ');
			case 'o': return('ひょ');
			default: return('');
		}
		case 'b':
		switch (v) {
			case 'a': return('ば');
			case 'i': return('び');
			case 'u': return('ぶ');
			case 'e': return('べ');
			case 'o': return('ぼ');
			default: return('');
		}
		case 'by':
		switch (v) {
			case 'a': return('びゃ');
			case 'u': return('びゅ');
			//case 'e': return('びぇ');
			case 'o': return('びょ');
			default: return('');
		}
		case 'p':
		switch (v) {
			case 'a': return('ぱ');
			case 'i': return('ぴ');
			case 'u': return('ぷ');
			case 'e': return('ぺ');
			case 'o': return('ぽ');
			default: return('');
		}
		case 'py':
		switch (v) {
			case 'a': return('ぴゃ');
			case 'u': return('ぴゅ');
			//case 'e': return('ぴぇ');
			case 'o': return('ぴょ');
			default: return('');
		}
		case 'm':
		switch (v) {
			case 'a': return('ま');
			case 'i': return('み');
			case 'u': return('む');
			case 'e': return('め');
			case 'o': return('も');
			default: return('');
		}
		case 'my':
		switch (v) {
			case 'a': return('みゃ');
			case 'u': return('みゅ');
			case 'o': return('みょ');
			default: return('');
		}
		case 'y':
		switch (v) {
			case 'a': return('や');
			case 'u': return('ゆ');
			case 'o': return('よ');
			default: return('');
		}
		case 'r':
		switch (v) {
			case 'a': return('ら');
			case 'i': return('り');
			case 'u': return('る');
			case 'e': return('れ');
			case 'o': return('ろ');
			default: return('');
		}
		case 'ry':
		switch (v) {
			case 'a': return('りゃ');
			case 'u': return('りゅ');
			//case 'e': return('りぇ');
			case 'o': return('りょ');
			default: return('');
		}
		case 'w':
		switch (v) {
			case 'a': return('わ');
			default: return('');
		}
		case 'nn': return('ん');
		default: return('');
	}
}

function getVoicedConsonant(c) {
	switch (c) {
		case 'k': return('g');
		case 'ky': return('gy');
		case 's': return('z');
		case 'sy': return('zy');
		case 't': return('d');
		case 'ty': return('zy');
		case 'h': return('b');
		case 'hy': return('by');
		case 'p': return('b');
		case 'py': return('by');
		default: return('');
	}
}