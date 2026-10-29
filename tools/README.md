# tools — 실험실 점검 스크립트

Playwright 가 있는 곳에서 `lab/` 을 띄운 뒤 쓴다: `cd lab && python3 -m http.server 8765`

| 스크립트 | 하는 일 |
| --- | --- |
| `check-lab.js` | 실험실 첫 화면이 오류 없이 뜨는지. **fixes.js 를 고친 뒤 꼭 돌린다** — 항목 하나의 형식이 틀려도(`screens` 빠짐 등) 실험실 전체가 멈춘다 |
| `shots.js <폴더> [1440,390] [포트]` | 모든 화면을 수정안으로 그려 저장 + 가로 넘침 찾기. 전/후 비교는 `git archive HEAD lab \| tar -x -C /tmp/old` 로 옛 lab 을 8766 에 띄워 한 번 더 돌린다 |
| `radius-scan.js [포트]` | 버튼 · 입력 칸 모서리가 4px(`--cl-radius-control`)이 아닌 것 모으기 |
| `apply.js` | 화면 하나에 수정안 CSS · DOM 을 입히는 공용 함수 |
