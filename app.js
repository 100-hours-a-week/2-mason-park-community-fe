import { fileURLToPath } from 'url';
import path from 'path';
import express from 'express';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.static(path.join(__dirname, 'public')));


// 로그인 페이지
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'login.html'));
})

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'login.html'));
})

// 회원가입 페이지
app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'register.html'));
})

// 글 목록 페이지
app.get('/posts', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'postList.html'));
})

// 글 작성 페이지
app.get('/posts/write', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'postWrite.html'));
})

// 글 수정 페이지
app.get('/posts/:post_id/modify', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'postWrite.html'));
})

// 글 상세 페이지
app.get('/posts/:post_id', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'postDetail.html'));
})

// 회원 정보 수정 페이지
app.get('/users/setting', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'userEdit.html'));
})

// 비밀번호 변경 페이지
app.get('/users/password', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'passwordEdit.html'));
})

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
})