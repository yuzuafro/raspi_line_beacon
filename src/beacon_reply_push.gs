var CHANNEL_ACCESS_TOKEN = 'xxxxxxxx';
var BEACON_GROUP_ID = 'xxxxxxxx'

function doPost(e) {
  var reply_token= JSON.parse(e.postData.contents).events[0].replyToken;
  if (typeof reply_token === 'undefined') {
    return;
  }
  var event_type, beacon_type; 
  var push_message, reply_message;
  var user_id, group_id;
  var url;
  
  group_id = BEACON_GROUP_ID;

  event_type = JSON.parse(e.postData.contents).events[0].type; 
  user_id = JSON.parse(e.postData.contents).events[0].source.userId;
  
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
  
  // ビーコンイベントの場合
  if (event_type === 'beacon') {
    beacon_type = JSON.parse(e.postData.contents).events[0].beacon.type;
    if (beacon_type === 'enter') {
      push_message = display_name + 'さんが到着しました';
      reply_message = display_name + 'の到着を通知します';
    } else if (beacon_type === 'leave') {
      push_message = display_name + 'さんが退出しました';
      reply_message = display_name + 'の退出を通知します';      
    }
    
  // その他の場合(名前+ID+おうむ返し)
  } else {
    push_message = '';
    reply_message = display_name + '[' + user_id + ']' + JSON.parse(e.postData.contents).events[0].message.text;
  }

  // 応答メッセージの送信
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
  ContentService.createTextOutput(JSON.stringify({'content': 'post ok'})).setMimeType(ContentService.MimeType.JSON);

  // プッシュメッセージの送信(ビーコンイベントの場合のみ)
  if (event_type === 'beacon') {  
    url = 'https://api.line.me/v2/bot/message/push';
    UrlFetchApp.fetch(url, {
      'headers': {
        'Content-Type': 'application/json; charset=UTF-8',
        'Authorization': 'Bearer ' + CHANNEL_ACCESS_TOKEN,
      },
      'method': 'post',
      'payload': JSON.stringify({
        'to' : group_id,
        'messages': [{
          'type': 'text',
          'text': push_message,
        }],
      }),
    });
    ContentService.createTextOutput(JSON.stringify({'content': 'post ok'})).setMimeType(ContentService.MimeType.JSON);
  }
  return;
}