var CHANNEL_ACCESS_TOKEN = 'xxxxxxxx';

function doPost(e) {
  var reply_token= JSON.parse(e.postData.contents).events[0].replyToken;
  if (typeof reply_token === 'undefined') {
    return;
  }

  var reply_message;
  var user_id, display_name, group_id;
  var url, response;
   
  user_id = JSON.parse(e.postData.contents).events[0].source.userId;
  group_id = JSON.parse(e.postData.contents).events[0].source.groupId;

  // プロフィールの取得
  // userId から displayName を取得
  url = 'https://api.line.me/v2/bot/profile/' + user_id;
  response = UrlFetchApp.fetch(url, {
    'headers': {
      'Content-Type': 'application/json; charset=UTF-8',
      'Authorization': 'Bearer ' + CHANNEL_ACCESS_TOKEN,
    },
  });
  display_name = JSON.parse(response).displayName;

  // ユーザー名+UserID+GroupID+おうむ返し
  reply_message = display_name + '[' + user_id + '][' + group_id + ']' + JSON.parse(e.postData.contents).events[0].message.text;

  url = 'https://api.line.me/v2/bot/message/reply';
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
        'text': reply_message,
      }],
    }),
  });
  return ContentService.createTextOutput(JSON.stringify({'content': 'post ok'})).setMimeType(ContentService.MimeType.JSON);
}