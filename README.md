# 🎋 PM里長伯解籤大師 | Fortune Stick Oracle

一個結合傳統廟宇求籤體驗與 AI 解籤的互動式 Web 應用程式。

An interactive web application combining traditional temple fortune stick experience with AI interpretation.

## ✨ 功能特色 | Features

### 🏮 視覺設計 | Visual Design
- 傳統廟宇風格：金紅配色、古典籤筒、羊皮紙卷軸
- 動態效果：搖籤動畫、煙霧繚繞、燈籠發光

### 🎯 核心功能 | Core Features
1. **輸入問題**（可選）- Enter your question (optional)
2. **搖籤筒** - Shake the fortune stick container
3. **抽籤** - Draw from 60 classic fortune poems
4. **AI 解籤** - AI Oracle interprets your fortune

### 🌐 雙語支援 | Bilingual Support
- 中文 / English 一鍵切換

## 🚀 部署到 Vercel | Deploy to Vercel

### 方法一：一鍵部署 | One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/fortune-sticks-oracle)

### 方法二：手動部署 | Manual Deploy

1. **安裝依賴**
   ```bash
   npm install
   ```

2. **本地測試**
   ```bash
   npm run dev
   ```

3. **部署到 Vercel**
   ```bash
   npm i -g vercel
   vercel
   ```

### 設定環境變數 | Environment Variables

在 Vercel Dashboard 中設定：

| 變數名稱 | 說明 |
|---------|------|
| `ANTHROPIC_API_KEY` | 你的 Anthropic API Key（可選，不設定則使用預設解籤）|

> 💡 **提示**：即使沒有設定 API Key，應用程式也會正常運作，只是會使用預設的解籤內容而非 AI 生成。

## 📁 專案結構 | Project Structure

```
fortune-sticks-vercel/
├── api/
│   └── interpret.js      # Vercel Serverless API
├── public/
│   └── favicon.svg       # 網站圖標
├── src/
│   ├── App.jsx           # 主要 React 元件
│   ├── fortuneData.js    # 60首籤詩資料
│   ├── index.css         # 樣式
│   └── main.jsx          # React 入口
├── index.html            # HTML 入口
├── package.json          # 專案設定
├── tailwind.config.js    # Tailwind 設定
├── vite.config.js        # Vite 設定
└── vercel.json           # Vercel 設定
```

## 🛠️ 技術棧 | Tech Stack

- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS
- **API**: Vercel Edge Functions
- **AI**: Anthropic Claude API (optional)

## 📜 籤詩來源 | Fortune Poems

本應用使用經典「觀音靈籤」60 首，每首包含：
- 籤號 (Fortune number)
- 吉凶等級 (Fortune level)
- 四句籤詩 (Four-line poem)
- 基本解釋 (Basic interpretation)

## 📄 授權 | License

MIT License

## 👨‍💻 作者 | Author

**PM 里長伯**

---

🙏 心誠則靈 • 善緣廣結

*Sincerity Brings Blessings • Good Karma Connects All*
