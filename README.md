# 데이터 입출력 프로그램

간단한 서버-클라이언트 구조의 웹 기반 데이터 입출력 프로그램입니다.
- 서버: Node.js + Express (REST API 제공, JSON 파일에 데이터 저장)
- 클라이언트: 브라우저(HTML/CSS/JS)에서 서버 API를 호출하여 데이터를 입력/조회/삭제

## 실행 방법

```bash
npm install
npm start
```

서버가 실행되면 크롬 브라우저에서 아래 주소로 접속하세요.

```
http://localhost:3000
```

## 기능

- 제목/내용을 입력해 데이터 저장 (POST /api/items)
- 저장된 데이터 목록 조회 (GET /api/items)
- 데이터 삭제 (DELETE /api/items/:id)

데이터는 `data/items.json` 파일에 저장되어 서버를 재시작해도 유지됩니다.
