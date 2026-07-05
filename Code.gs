function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    // 同時送信時の書き込み競合を防ぐ（最大20秒待機）
    lock.waitLock(20000);

    var ss = SpreadsheetApp.getActiveSpreadsheet();
    // シート名が誤って変更・削除されても記録が止まらないよう、無ければ作り直す
    var sheet = ss.getSheetByName('RSVP') || ss.insertSheet('RSVP');

    var data = JSON.parse(e.postData.contents);
    sheet.appendRow([
      new Date(),
      safe_(data.name),
      safe_(data.kana),
      safe_(data.address),
      safe_(data.attendance),
      safe_(data.companions),
      safe_(data.companionNames),
      safe_(data.allergy),
      safe_(data.message)
    ]);
    SpreadsheetApp.flush();

    // 回答をメールでも通知（シートと二重に記録が残る）。
    // メール送信の失敗は、シートへの記録成功に影響させない。
    try {
      MailApp.sendEmail(
        Session.getEffectiveUser().getEmail(),
        '【結婚式RSVP】' + String(data.name || '(名前なし)') + ' 様（' + String(data.attendance || '?') + '）',
        '出欠回答を受信しました。\n\n' +
        'お名前: ' + String(data.name || '') + '\n' +
        'ふりがな: ' + String(data.kana || '') + '\n' +
        'ご住所: ' + String(data.address || '') + '\n' +
        '出欠: ' + String(data.attendance || '') + '\n' +
        '同伴者人数: ' + String(data.companions || '0') + '\n' +
        '同伴者のお名前: ' + String(data.companionNames || '') + '\n' +
        'アレルギー・ご要望: ' + String(data.allergy || '') + '\n' +
        'メッセージ: ' + String(data.message || '') + '\n\n' +
        '※スプレッドシートにも記録済みです。'
      );
    } catch (mailErr) {
      // 通知メールの失敗は無視（記録自体は成功している）
    }

    return ContentService.createTextOutput(JSON.stringify({ result: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    // 記録に失敗した場合はエラーを返し、フォーム側で「送信失敗」を表示させる
    return ContentService.createTextOutput(JSON.stringify({ result: 'error', message: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    try { lock.releaseLock(); } catch (ignored) {}
  }
}

// セルへの数式注入を防ぎ、極端に長い入力を制限する
function safe_(v) {
  v = String(v === undefined || v === null ? '' : v).slice(0, 1000);
  return /^[=+\-@\t\r]/.test(v) ? "'" + v : v;
}

// 通知メールの動作確認用。エディタから一度実行して権限を承認し、
// 自分宛てにテストメールが届くことを確認してください。
function testMail() {
  MailApp.sendEmail(
    Session.getEffectiveUser().getEmail(),
    '【結婚式RSVP】通知メールテスト',
    '通知メールの設定が完了しました。このメールが届いていれば正常です。'
  );
}
