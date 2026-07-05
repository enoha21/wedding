# 結婚式Web招待状

「里山の実り」をコンセプトにした単一HTMLの結婚式Web招待状です。`index.html` のみでビルドツール不要、GitHub Pagesにそのまま公開できます。

---

## 1. 出席確認（RSVP）の準備：Google Apps Script

ご回答フォームの送信先は、Google スプレッドシート + Google Apps Script (GAS) で作成します。

1. 新規 Google スプレッドシートを作成し、シート名を **`RSVP`** にする
2. 「拡張機能 > Apps Script」を開き、このリポジトリの [`Code.gs`](Code.gs) の内容をすべて貼り付けて保存する
3. 「デプロイ > 新しいデプロイ」を選択し、種類で「ウェブアプリ」を選ぶ
4. 「実行ユーザー：自分」「アクセスできるユーザー：全員」を選択してデプロイする
5. 発行された **ウェブアプリのURL** をコピーする
6. [`index.html`](index.html) 内の以下の行を、コピーしたURLに書き換える

   ```javascript
   const GAS_WEB_APP_URL = "ここにデプロイ後のURLを入れる"; // 要編集
   ```

スプレッドシートには「送信日時 / 氏名 / ふりがな / ご住所 / 出席・欠席 / 同伴者人数 / 同伴者のお名前 / アレルギー・お食事のご要望 / メッセージ」の順で1行ずつ追記されます。

---

## 2. GitHub Pages での公開手順

1. GitHubで新規リポジトリを作成する（例：`our-wedding-invitation`）
2. このフォルダの内容（`index.html` / `Code.gs` / `images/` / `README.md`）をリポジトリのルートに配置して push する
3. リポジトリの「Settings > Pages」を開き、公開元（Source）を `main` ブランチ・ルート（`/`）に設定する
4. 数分後に `https://(ユーザー名).github.io/(リポジトリ名)/` で公開される
5. 独自ドメインを使う場合は、リポジトリのルートに `CNAME` ファイルを作成し、1行目に独自ドメイン名（例：`invitation.example.com`）を記載して push し、ドメインのDNS設定で GitHub Pages 側に向ける（詳細は GitHub Pages のドキュメントを参照）

---

## 3. 公開前の差し替え必須項目チェックリスト

- [ ] 新郎新婦の名前
- [ ] 挙式・披露宴の正確な時刻
- [ ] 会場名・住所・Google Map座標（`index.html` 内の `iframe` の `src` を、実際の会場のGoogle Map埋め込みURLに差し替える）
- [ ] アクセス方法の文言（最寄り駅・駐車場有無）
- [ ] RSVP回答期限の日付
- [ ] 主催者名・お問い合わせ先
- [ ] `images/` フォルダに入れる実際の写真ファイル（`images/couple.jpg`）
- [ ] GAS Webアプリ発行後のURL（上記「1.」の手順6）

---

## ファイル構成

```
.
├── index.html       … 招待状本体（CSS・JSをすべてインライン記述）
├── Code.gs          … Google Apps Script（RSVP送信先）
├── images/          … 写真プレースホルダー用フォルダ
│   └── .gitkeep
└── README.md        … このファイル
```
