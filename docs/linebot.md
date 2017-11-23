# LINE Botの作成

Raspberry PiでLINE Simple Beaconを動作させるためには、LINE Botを作成する必要があります。  
先ほど作成したChannelにWebhook URLを設定して、LINE Botとして使えるようにしましょう。

---

## おうむ返しBotの作成

まずは入力したテキストをそのまま返信する「おうむ返しBot」を作成します。  

Channelに設定するWebhook URLを作成します。  
クラウドサービス上に準備したりHerokuなどのサービスを使うこともできますが、  
今回は手軽かつ無料でできるGoogle Apps Scriptを使います。  

---

### Google Apps Scriptの作成

Googleドライブのマイドライブにアクセスします。  
https://drive.google.com/drive/my-drive

マイドライブ → その他 → Google Apps Script を選択します。

<img src="img/linebot_001.png" width="400px">

空のプロジェクトが作成されます。

<img src="img/linebot_002.png" width="500px">

#### ソースコードの編集

コードの部分を以下のように書き換えます。  
CHANNEL_ACCESS_TOKEN には、Channelの設定で発行したアクセストークンを設定してください。

```javascript
var CHANNEL_ACCESS_TOKEN = 'xxxxxxxx';

function doPost(e) {
  var reply_token= JSON.parse(e.postData.contents).events[0].replyToken;
  if (typeof reply_token === 'undefined') {
    return;
  }
  var user_message = JSON.parse(e.postData.contents).events[0].message.text;
  
  var url = 'https://api.line.me/v2/bot/message/reply';
  UrlFetchApp.fetch(url, {
    'headers': {
      'Content-Type': 'application/json; charset=UTF-8',
      'Authorization': 'Bearer ' + CHANNEL_ACCESS_TOKEN,
    },
    'method': 'post',
    'payload': JSON.stringify({
      'replyToken': reply_token,
      'messages': [{
        'type': 'text',
        'text': user_message,
      }],
    }),
  });
  return ContentService.createTextOutput(JSON.stringify({'content': 'post ok'})).setMimeType(ContentService.MimeType.JSON);
}
```

このファイルを echoback.gs として保存します。  

#### Webアプリケーションとして公開する

「公開」メニューから「Webアプリケーションとして導入」を選択します。

<img src="img/linebot_003.png" width="300px">

ウィンドウが表示されるので、以下のように入力する。  
* プロジェクトバージョン
  * 新規作成
  * ver.1 を入力
* アプリケーションのアクセスできるユーザー
  * 全員(匿名ユーザーを含む)に変更

<img src="img/linebot_004.png" width="400px">

承認が必要です のウィンドウが表示されるので、「許可を確認」をクリックする。

<img src="img/linebot_005.png" width="400px">

アカウントの選択ウィンドウが表示されるので、選択する。

<img src="img/linebot_006.png" width="240px">

「許可」を選択する。

<img src="img/linebot_007.png" width="450px">

WebアプリケーションのURLが作成されました。  
後ほどWebhook URLとして設定するのでコピーして控えておく。

<img src="img/linebot_008.png" width="450px">

---

### Webhook URLの設定

Channelの基本設定画面に戻り、Webhook URLの設定を行います。  
先ほどコピーしたURLを設定します。先頭の https:// は既に入力されているので必要ありません。  
入力できたら「更新」をクリックします。

<img src="img/linebot_009.png" width="500px">

---

### おうむ返しBotを試してみる

ここまでの設定で、おうむ返しのLINE Botができあがりました。  
スマートフォンのLINEアプリから、先ほど友達になったLINE Botアカウント(Channel)にメッセージを送ってみましょう。  
送ったテキストと同じテキストが返ってきたら成功です。  

<img src="img/linebot_010.png" width="400px">


---

## Beacon応答メッセージスクリプトの作成

---

LINE Botが作成できましたら、[LINE Simple Beaconの設定](linesimplebeacon.md) に進みましょう。