# Chunk2Speak · Netlify 배포 묶음

## 파일
- index.html : 웹앱 (학생 화면 + 교사 대시보드)
- netlify/functions/gemini.js : 교사 AI 호출 (키는 서버에만)
- netlify.toml : 배포 설정

## 환경 변수 (Netlify → Site configuration → Environment variables)
- GEMINI_API_KEY : Google AI Studio에서 받은 키 (필수)
- TEACHER_PIN : 교사 화면 PIN, 기본 예시 1234를 바꿔서 쓰기 권장 (필수)
- GEMINI_MODEL : 모델 이름 (선택, 기본 gemini-2.5-flash)

## 교사 PIN 바꾸기
index.html에서 `const TEACHER_PIN = '1234';`를 바꾼 뒤 환경 변수 TEACHER_PIN도 같은 값으로 맞춥니다.

## 배포
1. GitHub에 이 폴더를 올리고 Netlify에서 "Import from Git"으로 연결 (권장, 함수가 확실히 배포됨)
2. 또는 Netlify CLI: `npx netlify-cli deploy --prod`
3. 환경 변수를 넣은 뒤 Deploys에서 다시 배포
