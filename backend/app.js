const express = require('express');
const cors = require('cors');
const app = express();

// تمكين CORS لجميع المصادر
app.use(cors());

// أو تمكين CORS لمصدر معين (مثل http://localhost:4200)
// app.use(cors({
//   origin: 'http://localhost:4200'
// }));

app.get('/', (req, res) => {
  res.send('Hello World');
});

// تشغيل الخادم على المنفذ 64403
app.listen(64403, () => {
  console.log('Server running on port 64403');
});
