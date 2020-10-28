module.exports = {
  ja: {
    translation: {

      // -- Component -- START --

      // Component / Button
      Apply: '適用',

      // Component / Loading Spinner
      Loading: 'ロードしています',

      // Component / Date Picker
      Sun: '日',
      Mon: '月',
      Tue: '火',
      Wed: '水',
      Thu: '木',
      Fri: '金',
      Sat: '土',

      // Component / API Processing Modal
      'Please wait': 'しばらくお待ちください',

      // Component / Session Expired Modal
      'Session Expired': '自動ログアウト',
      'Your session has expired. You will be redirected to the login page in {{0}} second(s).': 'セッションの有効期間が切れています、{{0}} 秒後でログイン画面にリダイレクトします',
      'Renew Session': 'セッション更新',

      // Component / Switch component
      ON: 'ON',
      OFF: 'OFF',

      // Component / Navigation
      Home: 'ホームページ',
      Image: '画像設定',
      Video: '映像',
      Audio: 'オーディオ',
      Notification: '通知',
      'User Management': 'ユーザー管理',
      Analytics: '映像分析',
      Network: 'ネットワーク',
      System: 'システム',
      SDCard: 'SDカード',

      // Component / App Bar
      About: '情報',
      'Model Name': 'デバイス名',
      Software: 'ソフトウェアバージョン',
      'Serial Number': 'デバイスシリアル番号',
      Support: 'サポート',
      'Online Support Request': '線上支援',
      'Firmware Downloads': '韌體下載',
      'Software Downloads': '軟體下載',
      Downloads: '下載中心',
      'Product Selector': '產品選擇',
      'Technical Updates': '技術更新',
      Resources: '資源',

      // Component / App Bar / Support
      'Device Help': 'ヘルプ',
      'Technical Support': 'テクニカルサポート',
      'Product Information': 'その他の製品情報',
      'Sign Out': 'ログアウト',

      // Compoenet / Input / Validations
      'These passwords didn\'t match.': 'パスワードが一致しません',
      'validation-required': 'この項目は入力必須です',
      'validation-string': '文字列である必要があります',
      'validation-stringEmpty': '入力は必須です',
      'validation-stringMin': '{expected}文字以上を入力する必要があります',
      'validation-stringMax': '{expected}文字以下を入力する必要があります',
      'validation-stringLength': '{expected}文字を入力する必要があります',
      'validation-stringPattern': '無効な文字が含まれています',
      'validation-stringContains': '{expected}の文字を含む必要があります',
      'validation-stringContainsLowerCaseLatter': '小文字のアルファベットの入力は必須です',
      'validation-stringContainsUpperCaseLatter': '大文字のアルファベットの入力は必須です',
      'validation-stringContainsNumber': '数字の入力は必須です',
      'validation-stringAbortSpecialCharacters': 'この項目は次の符号を使用できません: #, %, &, `, ", \\, /, <, >, とスペース',
      'validation-stringAcceptSpecialCharacters': '符号の入力は必須です',
      'validation-stringEnum': '不符内容のルールに不一致です合內容要求',
      'validation-number': '数字を入力してください',
      'validation-numberMin': '{expected}文字以上の数字を入力する必要があります',
      'validation-numberMax': '{expected}文字以下の数字を入力する必要があります',
      'validation-numberEqual': '{expected}文字の数字を入力する必要があります',
      'validation-numberNotEqual': '{expected}と同じ数字を入力することができません',
      'validation-numberInteger': '整数を入力してください',
      'validation-numberPositive': '正数を入力してください',
      'validation-numberNegative': '負数を入力してください',
      'validation-array': 'アレイを入力してください',
      'validation-arrayEmpty': 'アレイは空白にすることができません',
      'validation-arrayMin': 'この項目は最小 {expected} を入力してください',
      'validation-arrayMax': 'この項目は最大 {expected} を入力してください',
      'validation-arrayLength': '項目数は {expected}が必要です',
      'validation-arrayContains': '項目は {expected} 個が必須です',
      'validation-arrayEnum': '使用できない{expected}項目が使用されています',
      'validation-boolean': 'ブール値を入力してください',
      'validation-function': '関数を入力してください',
      'validation-date': '日付を入力してください',
      'validation-dateMin': '{expected}以降の日付を入力してください',
      'validation-dateMax': '{expected}以前の日付を入力してください',
      'validation-forbidden': '項目を非表示する',
      'validation-email': '正しいメールアドレスを入力してください',
      'validation-url': '正しいURLを入力してください,',
      'validation-birthday': '正しい生年月日を入力してください',
      'validation-countryCode': '国コードが間違っています',
      'This name already exists in the system. Please use a different name.': '名前が重複しました、他の名前に設定してください',
      'The port number must not be empty.': 'この項目の入力は必須です',

      // Component / CustomTooltip
      'Hide Password': 'パスワードを非表示する',
      'Show Password': 'パスワードを表示する',
      'Please Select a File First': 'ファイルを選択してください',
      // CustomTooltip / /notification/cards
      'Please enter start and end time.': '開始および終了日および時間を選択してください',
      'The maximum number of allowed schedules is 5.': '最大スケジュール数は5です',
      'Please enter an email address.': 'メールアドレスを入力してください',
      // CustomTooltip / /users/members
      'Group number limit exceeded.': 'グループの数量は上限に達しました',
      'Photo Limit Reached': '已達照片上限',
      // CustomTooltip / /users/accounts
      'This Account is Protected': '此帳戶不可刪除',
      'This account cannot be deleted because it is currently logged in to the device.': '使用中のアカウントを削除することができません',
      // CustomTooltip / /system/maintain
      'Check this option to overwrite these settings: Members and Groups, System Accounts, Focus and Zoom of Image settings, RTSP settings, Internet & Network settings, app settings and data on the SD Card.': '本項目をチェックすると、メンバー、グループ、システムアカウント、フォーカスおよびズーム設定、RTSP設定、ネットワーク、app設定、SDカードのデータなどすべてのデータと設定を削除し、出荷時の設定に戻ります',
      // CustomTooltip / /sd-card
      'Please disable the SD card first.': '先にSDカードの機能を無効にしてください',
      'Please enable outgoing email first.': 'メールアドレスを設定するのは必須です',

      // -- Component -- END --

      // -- Page -- START --

      // /setup
      'INITIAL PASSWORD SETUP': '初始密碼設定',
      'Prior to accessing this device for the first time a unique admin password must be created': '首次使用時，請先創建一個管理員密碼',
      '8-16 characters: at least one uppercase and lowercase letter, number, and symbol excluding #, %, &, `, ", \\, <, > and space': '文字数8～16：大文字、小文字のアルファベット、数字、符号を混在するのは必須です。但し符号は# % & ` “  \\ / < >',
      '1-32 characters: letters, numbers and symbols excluding #, %, &, `, ", \\, <, > and space': '1-32個字：可包含字母、數字以及符號，但符號不能為 # % & ` “ \\ < >跟空白',
      Welcome: 'ようこそ',
      'For a better experience,': 'よりいい使用体験のために、',
      'Please click Continue to complete the initial setup!': '[続行]をクリックして、初期設定を完了してください',
      Continue: '続行',
      Submit: '確認',

      // /setup/language
      Language: '言語を選択する',
      HTTPS: 'HTTPS',
      Next: '次へ',

      // /setup/account
      'Setup Account': 'アカウント初期設定',
      Account: '帳號',
      'Please enter your account.': 'アカウント名を入力してください',
      Permission: '権限',
      Password: 'パスワード',
      Birthday: '生日',
      'This is used for resetting password.': '生日將會用於重置密碼',
      'Enter your account': 'アカウントを入力してください',
      // /setup/account / Constants / Permission
      'permission-0': '管理者',
      'permission-1': 'ゲスト',
      'permission-2': '訪客',
      'permission-99': '管理者', // Super-Admin, for easier backend permission control, no difference for UI

      // /setup/https
      'Certificate Type': '憑證方式',
      'SSL certificate.': 'SSL 憑證方式',
      Certificate: '署名証明書',
      'Private Key': '私鑰',
      'Country Name': '國家名稱',
      'Please enter the country code.': '請輸入您的國家代碼',
      'Two letters.': '2 位字母代碼',
      'State or province name': '州或省名稱',
      'Please enter the state or province name.': '請輸入您的州或省名稱',
      'City Name': '城市名稱',
      'Please enter the city name.': '請輸入您的城市名稱',
      'Organization Name': '組織名稱',
      'The company.': '公司',
      'Organization Unit Name': '組織部門名稱',
      'Email Address': '電子信箱',
      'Please enter the email address.': '請輸入電子信箱',
      Domain: '域名',
      'Please enter the domain.': '請輸入域名',
      'Range: 1024-65535 Default: 8443': '入力範囲：1024-65535 デフォルト：8443',

      // /login
      Login: 'ログイン',
      'ACCOUNT LOGIN': 'アカウントログイン',
      'Enter Your Username and Password': '請輸入您的帳號與密碼',
      'Enter your username': 'アカウントを入力してください',
      'Password Reset': '重置密碼',

      // /login-error
      'Incorrect Password': 'パスワードが間違っています',
      'You have {{0}} attempt(s) remaining...': 'リトライ可能回数は残り {{0}} 回...',
      'Expires in 10 minutes': '10 分後期限切れ',
      'Expires in 30 minutes': '30 分後期限切れ',
      'Expires in 1 hour': '1 時間後期限切れ',
      'Expires in 12 hours': '12 時間後期限切れ',

      // /login-lock
      'Too Many Login Attempts!': 'アカウントやパスワードの入力間違い回数は５回以上に達しました',
      'Please try again in 5 minutes.': '5分後再度ログインを試みてください',
      'Tech Support Phone Number: +1 (818) 937-0700': '支援專線：+1 (818) 937-0700',
      'Login locked': 'ログインがロックされました',
      'Forgot password?': '忘記密碼？',
      '{{0}} Remaining': 'ログインするため {{0}} が必要です',
      'Login Again': '再度ログインする',

      // Deprecated
      // /forgot-password
      'Forgot Password': '忘記密碼',
      OK: '確定',

      // Deprecated
      // /reset-password
      'Reset Password': '重設密碼',

      // /reset-password-success
      'Reset password success.': '重設密碼成功',
      Done: '完成',

      // /home
      'Device Name': 'デバイス名',
      'Device Status': 'ステータス',
      'SD Card': 'SDカード',
      'Authentication Required': '無効',
      'Facial Recognition: ': '顔認証 : ',
      'Age & Gender: ': '性別年齢推定 : ',
      'Human Detection: ': '人体検知 : ',
      'Free: {{0}}, Total: {{1}}': '{{0}} 使用可能 (合計 {{1}})',
      'Enable HDR': 'HDRを有効にする',
      Adjustments: '属性',
      Brightness: '明るさ',
      Contrast: 'コントラスト',
      Sharpness: 'シャープネス',
      Saturation: '飽和',
      'Lens Control': 'レンズ',
      'Select Focus Type': '選擇對焦方式',
      'Full-Range Focus': '全範囲フォーカス',
      'Short-Range Focus': '短距離フォーカス',
      Focus: 'フォーカス',
      Zoom: '焦距',
      'Auto Focus after Zoom': 'ズーム調整するとき、自動フォーカスする',
      Iris: 'Iris',
      'Shutter Speed': 'シャッタースピード',
      Advanced: '高度な設定',
      'White Balance': 'ホワイトバランス',
      'Color Temperature': '色温度',
      'IR Control': 'IR制御',
      Level: '強度',
      'Day/Night': 'デイナイト機能',
      Sensitivity: '感度',
      'Day Mode': 'デイモード',
      Rotation: '映像方向',
      Defog: '霧補正',
      'Lighting Compensation Frequency (Hz)': '更新周波数(Hz)',
      'Auto Focus': '自動フォーカス',
      'Focal Length': '焦距',
      'Reset to Default Settings': 'デフォルト設定へ戻る',
      // /home / Constans
      Auto: '自動',
      On: '有効',
      Off: '無効',
      Max: '最大',
      // /home / Constans / Iris
      'aperture-0': '自動',
      'aperture-1': '最大',
      // /home / Constans / Shutter speed
      'shutter-speed-0': '自動',
      'shutter-speed-1': '1/30',
      'shutter-speed-2': '1/50',
      'shutter-speed-3': '1/60',
      'shutter-speed-4': '1/100',
      'shutter-speed-5': '1/125',
      'shutter-speed-6': '1/500',
      'shutter-speed-7': '1/1,000',
      'shutter-speed-8': '1/2,000',
      'shutter-speed-9': '1/4,000',
      'shutter-speed-10': '1/8,000',
      // /home / Constans / White balance
      'white-balance-0': '自動',
      'white-balance-1': '室外',
      'white-balance-2': '蛍光灯',
      'white-balance-3': '白熱灯',
      'white-balance-4': '手動調整',
      // /home / Constans / Day/Night
      'daynight-mode-0': '自動',
      'daynight-mode-1': 'カラー',
      'daynight-mode-2': 'モノクロ',
      'daynight-mode-3': '時間帯を指定する',
      // /home / Constans / Rotation
      'orientation-0': '正常',
      'orientation-1': '垂直回転',
      'orientation-2': '水平回転',
      'orientation-3': '180 度回転',
      // /home / Constans / Lighting Compensation Frequency (Hz)
      'refresh-rate-0': '自動',
      'refresh-rate-1': '50Hz',
      'refresh-rate-2': '60Hz',

      // /media
      'Video Settings': 'ビデオ設定',
      Streams: 'ストリーム',
      OSD: 'OSD',
      'Privacy Mask': 'プライバシーマスク',

      // /media/stream
      Settings: '設定',
      'Stream 01': 'ストリーム 01',
      'Stream 02': 'ストリーム 02',
      Codec: 'コーデック',
      Resolution: '解像度',
      'Frame Rate (FPS)': 'フレームレート (FPS)',
      'Bandwidth Management': 'ビットレート制御',
      Quality: '品質',
      'Are you sure you want to update stream settings?': 'ストリーム設定を変更しますか？',
      'Updating Stream Settings': '更新串流設定',
      'Changing the aspect ratio of Stream 1 will also update Stream 2 settings. Are you sure you want to continue?': '改變串流1解析度的畫面比例會造成串流2的設定被改變，請確認是否繼續？',
      // /media/stream / Constans / Resolution
      'stream-resolution-0': '3840*2160 (16:9)',
      'stream-resolution-1': '2560*1440 (16:9)',
      'stream-resolution-2': '1920*1080 (16:9)',
      'stream-resolution-3': '1280*720 (16:9)',
      'stream-resolution-4': '640*360 (16:9)',
      'stream-resolution-5': '2560*1920 (4:3)',
      'stream-resolution-6': '2048*1536 (4:3)',
      'stream-resolution-7': '1600*1200 (4:3)',
      'stream-resolution-8': '1280*960 (4:3)',
      'stream-resolution-9': '1024*768 (4:3)',
      'stream-resolution-10': '640*480 (4:3)',
      'stream-resolution-11': '320*240 (4:3)',
      // /media/stream / Constans / Bandwidth Management
      'stream-bandwidth-management-0': '最大ビットレート',
      'stream-bandwidth-management-1': '可変ビットレート',
      'stream-bandwidth-management-2': '固定ビットレート',
      // /media/stream / Constans / Quality
      'quality-30': '低',
      'quality-50': '中',
      'quality-80': '高',
      // /media/stream / Constans / Bitrate
      '{{0}} - {{1}} Kbps': '{{0}} - {{1}} Kbps',

      // /media/rtsp
      'Enable Audio over RTSP': 'RTSPでのオーディオ出力を有効する',
      'Require Authentication': 'アカウント認証を有効にする',
      'RTSP/TCP Port': 'RTSP/TCPポート',
      'Range: 1024-65535 Default: 8554': '入力範囲：1024-65535 デフォルト：8554',
      'RTSP/UDP Port': 'RTSP/UDPポート',
      'Range: 1024-65535 Default: 17300': '入力範囲：1024-65535 デフォルト：17300',
      'Maximum Number of Concurrent Connections': '最大同時接続クライアント数',

      // /media/hdmi
      HDMI: 'HDMI',
      'HDMI Title': 'HDMI設定',
      'Updating HDMI settings': 'HDMI設定を更新する',
      'Are you sure you want to update HDMI settings?': 'HDMI設定を変更しますか？',

      // /media/word
      'Enable On-Screen Display': 'OSDを有効にする',
      Size: '文字サイズ',
      Color: 'カラー',
      Word: '文字',
      Position: '表示位置',
      'Click the arrow on the preview window.': 'プレビュー画面中の青印をクリックして下さい',
      'Left Top': '左上',
      'Right Top': '右上',
      'Left Bottom': '左下',
      'Right Bottom': '右下',
      'Text Overlay': 'テキスト',
      // /media/word / Constants / Size
      'font-size-0': '小',
      'font-size-1': '中',
      'font-size-2': '大',
      // /media/word / Constants / Text Overlay
      'word-type-0': '時間',
      'word-type-1': 'デバイス名',
      'word-type-2': 'デバイス名と時間',
      'word-type-3': 'カスタム',
      'Enter custom text': 'カスタム内容を入力します',

      // /media/privacy-mask
      'Enable Privacy Mask': 'プライバシーマスクを有効にする',
      'Create mask areas on the preview window.': 'プレビューウィンドにマスクを追加してください',
      'Mask Area': 'マスクエリア',
      'Note Area': '説明',
      Drag: 'ドラッグ',
      'To set a mask:': 'マスクを追加する',
      'To erase a mask:': 'マスクを削除する',
      'Up to 4 mask areas can be set.': 'マスクは最大四ヶ所まで設定可能です',

      // /audio
      'Audio Title': 'オーディオ設定',
      'Enable Audio Input': 'オーディオ入力を有効にする',
      'Audio Quality': 'オーディオ品質',
      'Input Source': '入力ソース',
      'Internal Microphone': '內建式麥克風',
      'External Microphone': '外付けマイク',
      // /audio / Constans / Audio Quality
      'audio-quality-0': 'G.711, 8kHz, 64kbps, Mono',
      'audio-quality-1': 'AAC, 16kHz, 96kbps, Mono',

      // /notification
      'Notification Settings': '通知設定',
      'Notification Method': '通知方法',
      Email: 'メール',
      'I/O': 'デジタル入力および出力',
      'Smart Notification': 'スマート通知',

      // /notification/app
      'Device Token': '裝置金鑰',
      'Please enter your device token.': '請輸入您的金鑰',
      'Device Id': '裝置編碼',
      'Please enter your device id.': '請輸入您的編碼',

      // /notification/smtp
      'Enable Outgoing Email': 'メール送信を有効にします',
      'SMTP Server Address': 'SMTPサーバーアドレス',
      'Enter server address': 'サーバーアドレスを入力してください',
      'SMTP Logon Settings': 'SMTPサーバーログイン設定',
      Edit: '編集',
      'Some webmail providers may require app passwords for enhanced security, for example, Google and Yahoo Mail accounts. Please follow your webmail provider’s instructions to generate and use an app password.': 'ウェブメールプロバイダーのセキュリティー性向上対策により、アプリケーションのパスワード（例：GoogleまたはYahooのメールアカウントとパスワード）が要求される場合があります。プロバイダーの指示に従ってアプリケーションのパスワードの生成と使用を行ってください。',
      Port: 'ポート',
      Encryption: '暗号化方式',
      None: 'なし',
      'Enable Device Login Notification': 'カメラログイン通知を有効にする',
      'Please Enable SMTP Server': '請先開啟SMTP伺服器',
      'Sender Information': '差出人情報',
      'Enter sender\'s name': '差出人名を入力してください',
      'Enter sender\'s email': '差出人のメールアドレスを入力してください',
      'Notification Interval (seconds)': '通報間隔 (秒)',
      'Specify notification interval': '秒数を入力してください',
      '5-1,800 Seconds': '5-1800 秒',
      'Email Setting Success': 'メールアドレス設定に成功しました',
      'Mail Setting Failed': 'メールアドレス設定に失敗しました',
      'Sending Test Email': 'テストメールは発送されました',
      'Disabling Outgoing Email': 'SMTP送信を無効しました',
      'Email Title': 'メール設定',

      // /notification/io
      'Input & Output': 'デジタル入力および出力',
      Input: 'デジタル入力',
      'Enable Digital Input': '開啟數位輸入',
      'Normal State': '一般状態',
      'Normally Closed': '常時閉',
      'Normally Open': '常時開',
      'Output 1': 'デジタル出力 1',
      'Output 2': 'デジタル出力 2',
      'Output {{0}}': 'デジタル出力 {{0}}',
      'Enable Digital Output {{0}}': '開啟數位輸出 {{0}}',
      Type: '輸出類型',
      Normal: '一般',
      Buffer: 'バッファ',
      'Pulse Time (seconds)': 'パルス時間 (秒)',
      'Delay Time (seconds)': '間隔時間 (秒)',
      'Enter seconds': '秒数を入力してください',
      '{{0}}-{{1}} Seconds': '{{0}}-{{1}} 秒',

      // /notification/cards
      'Notification Filters': 'フィルター',
      Pinned: 'トップに移動する',
      Others: 'その他',
      'Unpin Card': '固定解除',
      'Pin this card': '置頂',
      'Enter card title': '通知カード名称を入力してください',
      'Email: On': 'メール: 有効',
      'Output: On': '出力: 有効',
      'VMS: On': '影像管理系統(VMS): 開',
      Schedule: 'スケジュール',
      Rule: 'ルール',
      Group: 'グループ',
      Condition: '條件',
      Method: '通知方式',
      Everyone: 'すべてのユーザー、グループ限定しない',
      'Email Attachment': '添付ファイル',
      Receiver: '受信者',
      'Enter email address': 'メールアドレスを入力してください',
      'Add a New Notification Card': '通知カードを追加する',
      'Notify by Recognition Result': '認証結果に応じて通知する',
      Add: '追加',
      Cancel: 'キャンセル',
      'Cannot create more than {{0}} cards': 'カードを {{0}} 以上に追加することができません',
      'Subject :': '主旨 :',
      'Content :': '內文 :',
      'Specify the Subject of Notification Emails': '請輸入通知郵件主旨',
      'Append Your Message to Notification Emails': '請輸入通知郵件內文',
      'Content Placement': '内容の位置',
      // /notification/card (AVN)
      'Video Management System': '影像管理系統(VMS)',
      // /notification/card / Constants / VMS (AVN)
      'notification-vms-event-0': '影像移動偵測事件',
      'notification-vms-event-1': '智慧分析事件',
      // /notification/cards / Constants / Notification Filters
      'notification-card-filter-all': '全て',
      'notification-card-0': '顔認証',
      'notification-card-1': '性別年齢推定',
      'notification-card-2': '人体検知',
      'notification-card-3': '動作検知',
      'notification-card-4': '破壊アラーム',
      'notification-card-5': 'デジタル入力',
      // /notification/cards / Constants / Face Recognition Condition
      'face-recognition-condition-0': 'すべて',
      'face-recognition-condition-1': '成功',
      'face-recognition-condition-2': '未登録者',
      'face-recognition-condition-3': 'なりすまし防止',
      // /notification/cards / Constants / Email Attachment
      'email-attachment-type-0': '顔ショット',
      'email-attachment-type-1': 'スクリーンショット',
      'email-attachment-type-2': 'なし',
      // /notification/cards / Constants / Content Placement
      'email-content-position-0': '置於開頭',
      'email-content-position-1': '置於結尾',

      // /users/members
      Members: 'メンバー',
      'All Members': '全メンバー表示',
      Groups: 'グループ',
      'Create a Group': 'グループを追加する',
      'Delete Group: {{0}}': 'グループを削除する：{{0}}',
      'Delete Group': 'グループを削除する',
      Database: 'データベースファイル',
      'Encryption Settings': '加密設定',
      Export: 'エクスポート',
      Import: 'インポート',
      'Updating Member Database': 'メンバーデータベースを更新します',
      'Database Encryption': 'データベース暗号化',
      'Current Password': '舊密碼',
      'Enter your Current password': '請輸入您的舊密碼',
      'Enter Keywords': 'キーワードを入力してください',
      Search: '検索',
      New: '追加',
      'Add a New Member': '新規追加',
      'Add a Member from Events': 'イベントから追加',
      'Edit Group: {{0}}': 'グループを編集する：{{0}}',
      'User Picture': '登録用写真',
      Actions: '操作',
      'Delete Member: {{0}}': 'グループを削除する：{{0}}',
      'Delete Member': 'メンバーを削除する',
      'Are you sure you want to delete member {{0}}?': 'メンバー {{0}} を削除しますか？',
      'Edit Member: {{0}}': 'メンバーを編集する：{{0}}',
      'Edit Member': 'メンバーを編集する',
      '{{0}}-{{1}} items. Total: {{2}}': '{{0}}-{{1}}個データ、合計: {{2}}',
      'Importing Member Database': 'メンバーデータベースをインポートします',
      'Exporting Member Database': 'メンバーデータベースをエクスポートします',
      'New Member': 'メンバーを追加する',
      'Please upload your face photo.': '請上傳正面照片',
      'Are you sure you want to delete group {{0}}?': 'グループ {{0}} を削除しますか？',
      // /users/members (AVN)
      'Upload Image': '写真をアップロードする',
      Delete: '削除',

      // /users/members/new-group
      Name: '名称',
      'Enter a name for this group': 'グループ名を入力してください',
      Note: '備考',
      'Enter a note': '備考を入力してください',
      'Maximum length: 256 characters': '最大256文字まで入力可能です',
      Create: '追加',
      Close: '閉じる',

      // /users/members/modify-group
      'Edit Group': 'グループを編集する',
      'Modify Group': 'グループを編集する',
      Confirm: '確認',

      // /users/members/new
      Primary: '主照片',
      'Photo 1': '照片1',
      'Photo 2': '照片2',
      'Photo 3': '照片3',
      'Photo 4': '照片4',
      'Upload Primary First': '請先上傳主照片',
      'Photo Editor': '写真編集',
      'Drag the image to position it correctly.': '写真をドラッグして調整してください',
      Organization: '組織',
      'Enter a name for this member': 'メンバー名を入力してください',
      'Enter an organization for this member': '組織名を入力してください',
      'Maximum length: 32 characters': '最大32文字まで入力可能です',
      'N/A': 'なし',
      'Are you sure you want to close this window? Any changes you have made will be lost.': '關閉此視窗將不會儲存任何成員資料，確認要離開嗎？',
      'Photo size should be less than 90 KB.': '写真サイズは90 KBを超えることができません',

      // /users/accounts
      Accounts: 'アカウント',
      'All Accounts': '全アカウント表示',
      Username: 'ユーザー名',
      'New User': '創建使用者',
      'Modify User': 'アカウントを編集する',
      'Enter a name for this account': 'アカウント名を入力してください',
      'Enter a password': 'パスワードを入力してください',
      'Enter a new password': '新しいパスワードを入力してください',
      'New Password': '新しいパスワード',
      'Confirm New Password': '新しいパスワードを確認してください',
      'Confirm Password': 'パスワードを確認する',
      'Enter the new password again': '新しいパスワードを再度入力してください',
      'Enter the password again': 'パスワードを再度入力してください',
      'Delete Account': 'アカウントを削除する',
      'Are you sure you want to delete account {{0}}?': 'アカウント {{0}} を削除しますか？',

      // /users/events
      Unknown: '未知',
      Events: 'イベント',
      Total: '合計データ数',
      Time: '時間',
      Capture: 'キャプチャー',
      Confidence: '相似度',
      'Can\'t find any data.': '一致するデータが見つかりません再検索して下さい',
      Filters: 'フィルター条件',
      Clear: 'クリア',
      'Start Date': '日付',
      'Start Time': '時間',
      'Start Datetime': '開始時間',
      'End Date': '日付',
      'End Time': '時間',
      'End Datetime': '終了時間',
      'Facial Recognition': '顔認証',
      'Age & Gender': '性別年齢推定',
      'Human Detection': '人体検知',
      Similarity: '相似性',
      'Recognition Result': '認証結果',
      'Add to Existing Member': '新增至現有成員',
      'Enter Keyword For Search': '請輸入關鍵字以便搜尋',
      'Add to {{0}}': '新增至 {{0}}',
      'Verifying Photo': '照片驗證中',
      'Invalid Photo': '照片不合格',
      'Updating Member': '更新成員',
      'Added Photo to {{0}} Successfully!': '新增照片至 {{0}} 成功!',
      // /users/events / Constants / Status
      'enroll-status-0': 'なりすまし防止',
      'enroll-status-1': '未登録者',
      'enroll-status-2': '登録者',
      // /users/events / Constants / Confidence
      'confidence-0': '低',
      'confidence-1': '中',
      'confidence-2': '高',

      // /analytic/face-recognition
      'Analytics Settings': '知能分析',
      'Enable Facial Recognition': '顔認証を有効します',
      'Anti-Image Spoof': 'なりすまし防止機能を有効する',
      'Level of Accuracy': '認証成功率',
      'Detection Zone': '検知区域',
      'Show/Hide Detection Zone': '認証区域を表示/非表示にする',
      'The default is the whole live view screen.': 'デフォルトはフルスクリーン',
      'Enable Facial Detection Size': '顔検知サイズフィルターを有効します',
      'Min. Facial Detection Size': '最小検知顔サイズ',
      'Live View Display': 'ライブ画面表示',
      'Display Name': 'メンバー名',
      'Display Group': 'メンバーグループ',
      'Display Unknown': '未登録者',
      'Display Image Spoof': 'なりすまし防止',
      'Facial Recognition is Disabled': '臉部辨識已關閉',
      // /analytic/face-recognition / Constants / Level of Accuracy
      'confidence-level-0': '低',
      'confidence-level-1': '中',
      'confidence-level-2': '高',

      // /analytic/motion-detection
      'Enable Motion Detection': '動作検知を有効します',
      'Motion Detection': '動作検知',
      'Create detection zones on the preview window.': 'プレビューウィンドに検知エリアを追加してください',
      'To set a zone:': 'エリアを追加する',
      'To erase a zone:': 'エリアを削除する',
      'Up to 4 detection zones can be set.': '検知エリアは最大四ヶ所まで設定可能です',

      // /analytic/license
      License: '映像分析ライセンス',
      'Enter your authentication key': 'ライセンスキーを入力してください',
      Activate: '有効',
      Activated: '有効にしました',
      'Activation Required': '無効',
      'Activated By': '有効にした者',
      'Authentication Key': 'ライセンスキー',
      'Activated Functions': '有効になった機能',
      'Enable Status': 'ステータス',
      'Activated Success': 'アクティベーションが成功しました',
      '{{0}} authorized successfully!': '{{0}} 許可されました',
      'Activation Failed': 'アクティベーションに失敗しました',
      'Authorization failed!': '許可されませんでした',
      'Key Already Registered': 'ライセンスキーが使われています',
      // /analytic/license / Constants / FR Auth key
      'face-recognition-key-thirtyThousand': '顔認証 30k',
      'face-recognition-key-threeThousand': '顔認証 3k',

      // /network/settings
      Success: '成功',
      'Internet & Network Settings': 'インターネット/ネットワーク設定',
      'IP Addressing': 'IP設定',
      'Network Status': 'ネットワークステータス',
      DHCP: 'DHCP',
      'Test DHCP': 'DHCPをテストする',
      'DHCP Testing Success': 'DHCPテストに成功しました',
      'DHCP Testing Failed': 'DHCPテストに失敗しました',
      'Fixed IP Address': '固定IPアドレス',
      'IP Address': 'IPアドレス',
      'MAC Address': 'MACアドレス',
      'Subnet Mask': 'サブネットマスク',
      'Router/Gateway': 'ルーター/ゲートウェイ',
      'Primary DNS': 'プライマリーDNS',
      'Secondary DNS (Optional)': 'セカンダリーDNS',
      Interface: 'インターフェース',
      'IP Assignment': 'IP 取得方式',
      'Secondary DNS': 'セカンダリーDNS (選択)',
      'No changes were made.': '変更がありません',
      'Please enable HTTPS first.': '先にHTTPS機能を有効にしてください',
      'Are you sure you want to update network settings?': '您即將要更改連線設定，確認是否繼續？',
      'Enter a fixed IP address': '固定IPアドレスを入力してください',
      'Enter Subnet Mask': 'サブネットマスクを入力してください',
      'Enter Router/Gateway': 'ルーター/ゲートウェイを入力してください',
      'Enter a primary DNS': 'プライマリーDNSを入力してください',
      'Enter a secondary DNS': 'セカンダリーDNSを入力してください',

      // /network/tcp-ip
      'Enable DDNS': 'DDNSサービスを有効にする',
      'Service Provider': 'サービスプロバイダー',
      'Host Name': 'ホスト名',
      'Enter DDNS host name.': 'DDNSホスト名を入力してください',
      'Enter DDNS username.': 'DDNSユーザー名を入力してください',
      'Enter DDNS password.': 'DDNSパスワードを入力してください',
      'Secondary HTTP Port': 'HTTPセカンダリーポート',
      'Enter Your Secondary Server Port': '請輸入您的服務埠',
      'Range: 1024-65535 Default: 8080': '入力範囲：1024-65535 デフォルト：8080',
      'Setting Success': '設定が成功しました',
      'Setting Failed': '設定が失敗しました',
      'DDNS Setting Success': 'DDNS 設定が成功しました',
      'DDNS Setting Failed': 'DDNS 設定が失敗しました',
      'Updating HTTP Settings': 'HTTP設定を更新する',
      Rebooting: 'デバイス再起動しています',

      // /network/https
      'Enable HTTPS': 'HTTPSサービスを有効にする',
      'Click confirm to redirect to the new address:': '確認をクリックして新しいアドレスにリダイレクトします：',
      'The website has been redirected to the new address': '下記のURLへアクセスして再度ログインしてください',
      'The specified port is reserved by system or in use!': '本ポートはシステム予備用または使用されています',
      'Redirection Success': '再ダイレクト',
      // /network/https / Constants / Certificate
      'certificate-type-0': `${window.isNoBrand ? '製造商' : 'AndroVideo'} 自己署名証明書`,
      'certificate-type-1': '署名証明書をアップロードする',
      'certificate-type-2': '本デバイスの署名証明書を生成する',

      // /system
      'System Settings': 'システム設定',
      'Software Upgrade': 'ソフトウェアアップグレード',
      'Import File': '設定ファイルをインポートする',
      'Only ZIP file format is supported': '.zipファイルのみサポートしています',
      'Select File': 'ファイルを選択する',
      'No file selected.': '選択されたファイルがありません',

      // /system/datetime
      Administration: '管理',
      'Date & Time': '日付と時間',
      'Time Zone': '時區',
      'Date and Time of the Device': 'デバイス時間',
      'Sync with Network Time Server (NTP)': 'ネットワークタイムサーバー (NTP)と同期する',
      'Host Name or IP Address': 'サーバーアドレス',
      'Sync Time': '時間同期',
      'Manual Date': '日付',
      'Manual Time': '時間',
      'Sync Interval (minutes)': '更新頻度 (分)',
      'Sync with Your Computer': 'コンピューターと同期する',
      'Set the Date & Time Manually': '手動設定',
      'Updating Date & Time': '更新日期與時間',
      'Updating date & time requires you to log in again. Are you sure you want to continue?': 'デバイス時刻を変更しますか？時刻を変更するためには再度ログインする必要があります',
      'Please Enable Sync with Network Time Server (NTP)': '請啟用與網路時間伺服器 (NTP) 同步',
      'Time Zone is disabled when syncing with your computer': '與電腦同步時時區將停用',

      // /system/maintain
      'Restore All Settings': '還原所有設定',
      'Device Maintenance': 'メンテナンス',
      'System Reboot': 'デバイスを再起動する',
      'Are you sure you want to reboot the device?': 'デバイスを再起動しますか？',
      Reboot: '再起動する',
      'Restore to Default Settings': '設定を初期値に戻す',
      'Restore to Factory Default Settings (Includes Network Settings)': '將所有設定恢復為預設值(包含IP位址)',
      Reset: '初期化',
      'Export System Settings': 'システム設定ファイルをエクスポートする',
      'Import System Settings': 'システム設定ファイルをインポートする',
      'The system will revert to factory default settings. All data and configurations you have saved will be overwritten.': 'デバイスは出荷時の初期設定に戻り、すべてのデータと設定が削除されます',
      'The system will reset the device. All configurations will be overwritten and settings will revert back to default, except the following': 'デバイスは出荷時の初期設定に戻り、下記の項目を除き、すべてのデータと設定は削除されます',
      '• Members and Groups': '• メンバーリストとグループデータ',
      '• System Accounts': '• アカウント設定',
      '• Focus and Zoom of Image settings': '• フォーカスとズーム設定',
      '• RTSP settings': '• RTSP設定',
      '• Internet & Network settings': '• インターネット/ネットワーク設定',
      '• Data on the SD Card': '• SDカード内のデータ',
      'The device has rebooted. Please log in again.': 'デバイスは再起動しましたため、再度ログインしてください',

      // /system/upgrade
      'Upload Software': 'ソフトウェアのアップロード',
      'Install Software': 'ソフトウェアのインストール',
      'Shut Down': 'デバイスをシャットダウンする',
      Restart: 'デバイスを再起動する',
      'Stage 01': 'ステージ1',
      'Stage 02': 'ステージ2',
      'Stage 03': 'ステージ3',
      'Stage 04': 'ステージ4',
      '※ Please do not close your browser during the upgrade.': '※ アップグレード中にはブラウザを閉じないでください',
      'Uploading Software': 'ソフトウェアをアップロードしています',
      'Installing Software': 'ソフトウェアをインストールしています',
      'Shutting Down': 'デバイスをシャットダウンしています',
      Restarting: 'デバイスを再起動しています',
      'Software Upgrade Success': 'ソフトウェアアップグレードは成功しました',
      'Redirect to the login page in {{0}} seconds': '{{0}} 秒後に再度ログインページへリダイレクトします',

      // /system/log
      Information: 'デバイス情報',
      'System Log': 'システムログ',
      'System Log File': 'システムログファイル',
      'Delete System Log File': 'システムログファイルを削除する',
      'Are you sure you want to delete system logs?': 'システムログファイルを削除しますか？',
      'Delete logs': '削除',
      Download: 'ダウンロード',
      // /system/information
      'Build Version': '開發版號',
      'S/N Code': 'S/N 碼',
      'Downloading System Log File': 'システムログをダウンロード',
      'Download progress': 'ダウンロードの進行状況',

      // /sd-card
      'Enable SD Card': '開啟記憶卡',
      'Disabling SD Card': '關閉記憶卡',
      'Event photos will not be available after the SD card is disabled. Are you sure you want to continue?': '您確定要關閉記憶卡嗎? 事件截圖將不會被儲存',
      'Off Line Record': '斷線錄影',
      'Are you sure you want to format the Micro SD card?': '您即將格式化 Micro SD 卡，確認是否繼續？',
      'Are you sure you want to unmount the Micro SD card?': '您即將卸除 Micro SD 卡，確認是否繼續？',
      Operation: '操作',
      Format: 'フォーマット',
      Mount: 'マウント',
      Unmount: 'マウントを解除',
      'Error Notification': '異常通知',
      'Email Notification Set': 'メールアドレスが設定されました',
      'SD Card Enable Outgoing Email': 'メールアドレスを設定する',
      Filesystem: 'ファイルシステム',
      'Storage Space': 'ストレージ容量',
      'Free: {{0}}': '{{0}} 使用可能',
      'Used: {{0}}': '{{0}} 使用されています',
      Unrecognized: '無法識別',
      Status: 'ステータス',
      // /sd-card / Status
      Functioning: '正常', // 0 - MOUNTED
      Unmounted: 'マウントされていません', // 1 - UNMOUNTED
      'Empty Slot': 'カードが挿入されていません', // 2 - SDCARDNOTEXIST
      Nonfunctioning: '異常', // 3 - ABNORMAL
      'Read-only Access': '読み取り専用', // 4 - READONLY
      'Unknown Error': '不明なエラー', // 5 - UNKNOWN

      // The error pages.
      'Not Found': 'このページは表示できません',
      'Back to Home': 'ホームページへ戻る',
      'Internal Server Error': 'サーバー内部エラー',
      'Sorry for any inconvenience, we are fixing this problem.': 'ご迷惑をおかけし申し訳ありません、問題の解消作業を行っていま',

      // Server error codes
      // 9001
      'Duplicate Member Names': '名称が重複しています。別の名称をご使用ください',
      // 9002
      'Login Failed': 'アカウントまたはパスワードが間違っています',
      // 9003
      'Empty Member Database': '間違ったデータベースファイルがインポートされています',
      // 9004
      // Unable to reset a forgotten password	AVN
      // 9005
      // Unable to reset a password	不支援此功能
      // 9007
      'Card Number Limit Exceeded': '通知カード数の上限に達しました',
      // 9008
      'Non-existent Card': '通知カードが存在していません',
      // 9009
      'Database Size Limit (3 GB) Exceeded': 'メンバー保存容量の上限に達しました',
      // 9010
      // Invalid Member Photo 不支援此功能
      // 9011
      // Unable to Process the Request (invalid token).	UI不支援此功能, 支援在工程模式
      // 9012
      'Group Number Limit Exceeded': 'グループ数の上限に達しました',
      // 9013
      // Incorrect Password	不支援此功能
      // 9014
      'Wrong Password for Database File': 'データベースファイル解凍パスワードが間違っています',
      // 9015
      'Wrong File Format': 'ファイルの形式が間違っています',
      // 9016
      'Corrupted Zip File': 'ファイルが破損しています',
      // 9017
      'Photo Limit of Member Database Exceeded': '写真数の上限に達しました',
      // 9018
      // Photo Size Limit Exceeded	不支援此功能
      // 9019
      // Invalid or Absent Photo	不支援此功能
      // 9020
      'Non-existent Group': 'グループが存在していません',
      // 9021
      'Non-existent Member': 'メンバーが存在していません',
      // 9022
      // Maximum Field Length Exceeded	不支援此UI
      // 9023
      // Maximum Field Length Exceeded	不支援此UI
      // 9024
      // Maximum Field Length Exceeded	不支援此UI
      // 9025
      'Duplicate Member Name': 'メンバー名が重複しています。別の名称をご使用ください',
      // 9026
      'Duplicate Card Name': '通知カード名が重複しています。別の名称をご使用ください',
      // 9027
      // VMS Reserved Port	AVN
      // 9028
      'Software Upgrade Failed': 'ソフトウェア更新失敗',
      // 9029
      'Unable to Complete the Format': 'SDカードのフォーマットが失敗しました',
      // 9030
      'Empty SMTP Server Address': 'SMTPサーバーアドレスを入力してください',
      // 9031
      'Empty SMTP Account': 'SMTPアカウントを入力してください',
      // 9032
      'Empty SMTP Account Password ': 'SMTPパスワードを入力してください',
      // 9033
      'Empty Sender Email': '差出人情報を入力してください',
      // 9034
      // Outgoing Email being Disabled	不支援此UI
      // 9035
      'Absent or Unmounted SD Card': 'SDカードが挿入されていません',
      // 9036
      // Maximum Field Length Exceeded	不支援此UI
      // 9037
      // Maximum Field Length Exceeded	不支援此UI
      // 9038
      // Maximum Field Length Exceeded	不支援此UI
      // 9039
      // Maximum Photo Number Exceeded	不支援此UI
      // 9040
      'Showing No Face': '写真には顔が存在していません',
      // 9041
      'Poor Photo Quality': '写真の品質が足りません',
      // 9042
      'Limitation of Yaw Angle is 30 Degrees': '顔の角度は上下20度や左右30度を超えています',
      // 9043
      'Limitation of Pitch Angle is 20 Degrees': '顔の角度は上下20度や左右30度を超えています',
      // 9044
      'More Than One Face in the Photo': '写真には顔が一個以上存在しています',
      // 9045
      'Non-existent Photo': '存在しない顔ショット',
      // 9046
      'Invalid Key': '無効なライセンスキー',
      // 9047
      'Duplicate Key': 'アクティベーションに失敗しました。ライセンスキーが重複してます',
      // 9048
      'Cannot Support Database Downgrade from 30,000 to 3000 People': 'アクティベーションに失敗しました。顔認証メンバー上限を30,000人から3,000人に下げることに対応していません'

      // -- Page -- END --
    }
  }
};
