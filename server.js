import express from "express";
import fs from "fs";
import path from "path";

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(process.cwd(), "records.csv");

app.use(express.static("public"));
app.use(express.json());

// CSVのヘッダを初期化
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, "studentId,room,action,time\n");
}

// JST時刻取得
function getJSTTime() {
  return new Date().toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" });
}

// 記録保存
app.post("/api/record", (req, res) => {
  const { studentId, room, action } = req.body;
  if (!studentId || !room || !action) return res.status(400).send("データ不足");

  const time = getJSTTime();
  const line = `${studentId},${room},${action},${time}\n`;
  fs.appendFileSync(DATA_FILE, line);
  res.send(`記録しました: ${studentId}, ${room}, ${action}, ${time}`);
});

// 記録一覧
app.get("/api/records", (req, res) => {
  const data = fs.readFileSync(DATA_FILE, "utf8");
  res.type("text/plain").send(data);
});

app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
