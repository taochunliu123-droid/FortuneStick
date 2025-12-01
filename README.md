# 🔮 PM里長伯解籤大師 | Cyber Oracle

賽博朋克風格的 AI 求籤應用，結合攝像頭實景、手勢追蹤與全息 HUD 界面。

A cyberpunk-styled AI fortune stick oracle with camera background, gesture tracking, and holographic HUD interface.

## ✨ 功能特色 | Features

### 🎨 賽博朋克 HUD 界面
- 青色 (#00FFFF) 為主色調的科幻 UI
- 掃描線動畫、發光效果、數據流裝飾
- 全息風格的籤筒與結果卡片

### 📷 攝像頭實景背景
- 實時攝像頭畫面作為背景
- 降低亮度、提高對比度的處理
- 可開關控制

### ✋ 手勢追蹤 (MediaPipe)
- 即時手部骨骼追蹤
- 青色發光的手部連線繪製
- 張開手掌並揮動可觸發求籤

### 🖨️ 列印輸出
- 點擊「列印籤詩」按鈕
- 自動切換為列印友好的排版
- 可儲存為 PDF

### 🌐 雙語支援
- 中文 / English 一鍵切換

## 🚀 部署到 Vercel

### 1. 安裝依賴
```bash
npm install
```

### 2. 本地測試
```bash
npm run dev
```

### 3. 部署
```bash
npx vercel
```

### 4. 環境變數（可選）

| 變數名 | 說明 |
|--------|------|
| `ANTHROPIC_API_KEY` | Anthropic API Key（不設定也能運作）|

## 📁 專案結構

```
fortune-cyber/
├── api/
│   └── interpret.js      # AI 解籤 API
├── public/
│   └── favicon.svg       # 賽博風格圖標
├── src/
│   ├── App.jsx           # 主要元件（HUD、手勢、籤筒）
│   ├── data/
│   │   └── fortunes.js   # 60首籤詩
│   ├── index.css         # 賽博朋克樣式
│   └── main.jsx
├── index.html
├── package.json
├── tailwind.config.js
├── vite.config.js
└── vercel.json
```

## 🎮 操作說明

1. **開啟相機**：點擊左側面板的「開啟相機」
2. **手勢求籤**：張開手掌對著攝像頭，在畫面中央揮動
3. **點擊求籤**：也可以直接點擊籤筒
4. **列印籤詩**：結果頁面點擊「列印籤詩」按鈕

## 🛠️ 技術棧

- **Frontend**: React 18 + Vite + Tailwind CSS
- **手勢追蹤**: @mediapipe/tasks-vision
- **API**: Vercel Edge Functions
- **AI**: Anthropic Claude (optional)

## 📄 授權 | License

MIT

## 👨‍💻 作者 | Author

**PM 里長伯**

---

🔮 心誠則靈 • SINCERITY BRINGS BLESSINGS
