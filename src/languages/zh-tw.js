module.exports = {
  'zh-tw': {
    translation: {

      // -- Component -- START --

      // Component / Button
      Apply: '套用',

      // Component / Loading Spinner
      Loading: '載入中',

      // Component / Date Picker
      Sun: '日',
      Mon: '一',
      Tue: '二',
      Wed: '三',
      Thu: '四',
      Fri: '五',
      Sat: '六',

      // Component / API Processing Modal
      'Please wait': '請稍候',

      // Component / Session Expired Modal
      'Session Expired': '自動登出',
      'Your session has expired. You will be redirected to the login page in {{0}} second(s).': '閒置時間過長，{{0}} 秒後登出並重新導向登入頁面',
      'Renew Session': '未閒置',

      // Component / Switch component
      ON: '開啟',
      OFF: '關閉',

      // Component / Navigation
      Home: '首頁',
      Image: '圖像',
      Video: '影像',
      Audio: '聲音',
      Notification: '通報',
      'User Management': '人員',
      Analytics: '影像分析',
      Network: '網路',
      System: '系統',
      'SD Card': '記憶卡',

      // Component / App Bar
      About: '關於',
      'Model Name': '裝置名稱',
      Software: '軟體版本',
      'Serial Number': '裝置序號',
      Support: '支援',
      'Online Support Request': '線上支援',
      'Firmware Downloads': '韌體下載',
      'Software Downloads': '軟體下載',
      Downloads: '下載中心',
      'Product Selector': '產品選擇',
      'Technical Updates': '技術更新',
      Resources: '資源',

      // Component / App Bar / Support
      'Device Help': '裝置使用幫助',
      'Technical Support': '裝置使用幫助',
      'Product Information': '其他產品資訊',
      'Sign Out': '登出',

      // Compoenet / Input / Validations
      'These passwords didn\'t match.': '兩次密碼不一致',
      'validation-required': '必須輸入',
      'validation-string': '必須是字串',
      'validation-stringEmpty': '必須輸入',
      'validation-stringMin': '必須輸入{expected}個以上的字',
      'validation-stringMax': '必須輸入{expected}個以下的字',
      'validation-stringLength': '必須輸入{expected}個字',
      'validation-stringPattern': '不符合格式要求',
      'validation-stringContains': '必須包含{expected}的文字',
      'validation-stringContainsLowerCaseLatter': '必須包含小寫英文字母',
      'validation-stringContainsUpperCaseLatter': '必須包含大寫英文字母',
      'validation-stringContainsNumber': '必須包含數字',
      'validation-stringAbortSpecialCharacters': '禁用全形或半形符號: # % & ` “ \\ / < > 和空白',
      'validation-stringAcceptSpecialCharacters': '必須包含符號',
      'validation-stringEnum': '不符合內容要求',
      'validation-number': '必須為數字',
      'validation-numberMin': '必須為{expected}以上的數字',
      'validation-numberMax': '必須為{expected}以下的數字',
      'validation-numberEqual': '必須為等於{expected}的數字',
      'validation-numberNotEqual': '不可輸入等於{expected}的數字',
      'validation-numberInteger': '必須為整數',
      'validation-numberPositive': '必須為正數',
      'validation-numberNegative': '必須為負數',
      'validation-array': '必須為陣列',
      'validation-arrayEmpty': '不可為空陣列',
      'validation-arrayMin': '此欄位最少包含 {expected} 個項目',
      'validation-arrayMax': '此欄位最多包含 {expected} 個項目',
      'validation-arrayLength': '必須為 {expected} 個項目',
      'validation-arrayContains': '必須包含 {expected} 個項目',
      'validation-arrayEnum': '使用了不允許的項目{expected}',
      'validation-boolean': '必須為布林值',
      'validation-function': '必須為函數',
      'validation-date': '必須為日期',
      'validation-dateMin': '必須為{expected}以後的日期',
      'validation-dateMax': '必須為{expected}以前的日期',
      'validation-forbidden': '隱藏欄位',
      'validation-email': '請使用正確的電子信箱格式',
      'validation-url': '請使用正確的網址格式',
      'validation-birthday': '請使用正確的生日格式',
      'validation-countryCode': '國家代碼錯誤',
      'This name already exists in the system. Please use a different name.': '名稱重複，請使用不同名稱',
      'The port number must not be empty.': '此欄位必需輸入',

      // Component / CustomTooltip
      'Hide Password': '隱藏密碼',
      'Show Password': '顯示密碼',
      'Please select a file first.': '請先選擇一個檔案',
      // CustomTooltip / /notification/cards
      'Please enter start and end time.': '必須選擇起始和終止日期時間',
      'The maximum number of allowed schedules is 5.': '已達數量限制',
      'Please enter an email address.': '請輸入電子郵件地址',
      // CustomTooltip / /users/members
      'Group number limit exceeded.': '已達數量限制',
      // CustomTooltip / /users/accounts
      'This Account is Protected': '此帳戶不可刪除',
      'This account cannot be deleted because it is currently logged in to the device.': '無法刪除正在使用的帳號',
      // CustomTooltip / /system/maintain
      'Check this option to overwrite these settings: Members and Groups, System Accounts, Focus and Zoom of Image settings, RTSP settings, Internet & Network settings, app settings and data on the SD Card.': '勾選此項目會清除並還原成員及群組、系統帳號、縮放及對焦、RTSP、網路、應用程式、儲存在記憶卡的資料...等，所有資料和設定',
      // CustomTooltip / /sd-card
      'Please disable the SD card first.': '請先關閉記憶卡功能',
      'Please enable Outgoing Email first.': '必須設定電子郵件',

      // -- Component -- END --

      // -- Page -- START --

      // /setup
      Welcome: '歡迎',
      'For a better experience,': '為了使您有更好的體驗，',
      'Please click Continue to complete the initial setup!': '按繼續開始初始設定',
      Continue: '繼續',

      // /setup/language
      Language: '選擇語言',
      HTTPS: '安全傳輸方式',
      Next: '下一步',

      // /setup/account
      'Setup Account': '初始帳號設定',
      Account: '帳號',
      'Enter a name for this account': '輸入帳號名稱',
      Permission: '權限',
      Password: '密碼',
      '8-16 characters: at least one uppercase and lowercase letter, number, and symbol excluding #, %, &, `, ", \\, <, > and space': '8 - 16個字: 必須包含英文大寫和小寫字元, 數字和符號, 但符號不能為 # % & ` “ \\ / < > 和空白',
      '1-32 characters: letters, numbers and symbols excluding #, %, &, `, ", \\, <, > and space': '1-32個字：可包含字母、數字以及符號，但符號不能為 # % & ` “ \\ < >跟空白',
      Done: '完成',
      // /setup/account / Constants / Permission
      'permission-0': '管理者',
      'permission-1': '來賓',
      'permission-2': '訪客',
      'permission-99': '管理者', // Super-Admin, for easier backend permission control, no difference for UI

      // /setup/https
      'Certificate Type': '憑證方式',
      'SSL certificate.': 'SSL 憑證方式',
      Certificate: '憑證',
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

      // /login
      Login: '登入',
      'ACCOUNT LOGIN': '帳號登入',
      'Enter your username': '請輸入您的帳號',
      'Password Reset': '重置密碼',
      'Enter your password': '請輸入您的密碼',

      // /login-error
      'Incorrect Password': '密碼輸入錯誤',
      'You have {{0}} attempt(s) remaining...': '您尚可嘗試 {{0}} 次...',
      'Expires in 10 minutes': '10 分鐘後過期',
      'Expires in 30 minutes': '30 分鐘後過期',
      'Expires in 1 hour': '1 小時後過期',
      'Expires in 12 hours': '12 小時後過期',

      // /login-lock
      'Too Many Login Attempts!': '登入帳號密碼錯誤5次以上',
      'Please try again in 5 minutes.': '請5分鐘後再嘗試登入',
      'Tech Support Phone Number: +1 (818) 937-0700': '支援專線：+1 (818) 937-0700',
      'Login locked': '鎖定登入',
      'Forgot password?': '忘記密碼？',
      '{{0}} Remaining': '還需 {{0}} 才能再次登入',
      'Login Again': '重新登入',

      // Deprecated
      // /forgot-password
      'Forgot Password': '忘記密碼',
      OK: '確定',

      // Deprecated
      // /reset-password
      'Reset Password': '重設密碼',

      // /reset-password-success
      'Reset password success.': '重設密碼成功',

      // /home
      'Device Name': '裝置名稱',
      'Device Status': '裝置狀態',
      'Authentication Required': '未啟用',
      'Facial Recognition: ': '臉部辨識：',
      'Age & Gender: ': '性別年齡：',
      'Human Detection: ': '人形偵測：',
      'Free: {{0}}, Total: {{1}}': '{{0}} 可用 (共 {{1}})',
      'Enable HDR': '開啟HDR',
      Adjustments: '屬性',
      Brightness: '亮度',
      Contrast: '對比',
      Sharpness: '銳利度',
      Saturation: '飽和度',
      'Lens Control': '鏡頭',
      'Select Focus Type': '選擇對焦方式',
      'Full-Range Focus': '全範圍對焦',
      'Short-Range Focus': '短距離對焦',
      Focus: '對焦',
      Zoom: '縮放',
      'Auto Focus after Zoom': '縮放時自動對焦',
      Iris: '光圈',
      'Shutter Speed': '快門速度',
      Advanced: '進階',
      'White Balance': '白平衡',
      'Color Temperature': '色溫',
      'IR Control': '紅外線燈',
      Level: '強度',
      'Day/Night': '日間/夜間模式',
      Sensitivity: '靈敏度',
      'Day Mode': '日間模式',
      Rotation: '旋轉',
      Defog: '除霧',
      'Lighting Compensation Frequency (Hz)': '電源頻率',
      'Auto Focus': '自動對焦',
      'Reset to Default Settings': '恢復預設值',
      // /home / Constans
      Auto: '自動',
      On: '開',
      Off: '關',
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
      'white-balance-1': '戶外',
      'white-balance-2': '螢光燈',
      'white-balance-3': '白熾燈',
      'white-balance-4': '手動調整',
      // /home / Constans / Day/Night
      'daynight-mode-0': '自動',
      'daynight-mode-1': '彩色',
      'daynight-mode-2': '黑白',
      'daynight-mode-3': '手動調整',
      // /home / Constans / Rotation
      'orientation-0': '正常',
      'orientation-1': '垂直翻轉',
      'orientation-2': '水平翻轉',
      'orientation-3': '180 度翻轉',
      // /home / Constans / Lighting Compensation Frequency (Hz)
      'refresh-rate-0': '自動',
      'refresh-rate-1': '50Hz',
      'refresh-rate-2': '60Hz',

      // /media
      'Video Settings': '影像',
      Streams: '串流',
      OSD: '文字貼圖',
      'Privacy Mask': '隱私遮罩',

      // /media/stream
      Settings: '設定',
      'Stream 01': '串流 01',
      'Stream 02': '串流 02',
      Codec: '影像編碼',
      Resolution: '解析度',
      'Frame Rate (FPS)': '每秒幀數',
      'Bandwidth Management': '位元率管理',
      Quality: '品質',
      'Are you sure you want to update stream settings?': '您確定要更改串流設定嗎？',
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
      'stream-bandwidth-management-0': '最大位元速率',
      'stream-bandwidth-management-1': '可變位元速率',
      'stream-bandwidth-management-2': '固定位元速率',
      // /media/stream / Constans / Quality
      'quality-30': '低',
      'quality-50': '中',
      'quality-80': '高',
      // /media/stream / Constans / Bitrate
      '{{0}} - {{1}} Kbps': '{{0}} - {{1}} Kbps',

      // /media/rtsp
      'Enable Audio over RTSP': '開啟將聲音紀錄至串流',
      'Require Authentication': '開啟帳號密碼認證',
      'RTSP/TCP Port': 'RTSP/TCP 連接埠',
      'Range: 1024-65535 Default: 8554': '範圍：1024-65535，預設：8554',
      'RTSP/UDP Port': 'RTSP/UDP 連接埠',
      'Range: 1024-65535 Default: 17300': '範圍：1024-65535，預設：17300',
      'Maximum Number of Concurrent Connections': '同時最大連接數',

      // /media/hdmi
      HDMI: 'HDMI',
      'HDMI Title': 'HDMI',
      'Updating HDMI settings': '更新HDMI設定',
      'Are you sure you want to update HDMI settings?': '您確定要更改 HDMI 設定嗎?',

      // /media/osd
      'Enable On-Screen Display': '開啟文字貼圖',
      Size: '文字大小',
      Color: '顏色',
      Position: '位置',
      'Click the arrow on the live view screen.': '請在預覽窗格中點選箭頭',
      'Left Top': '左上',
      'Right Top': '右上',
      'Bottom Left': '左下',
      'Bottom Right': '右下',
      'Text Overlay': '內容',
      // /media/osd / Constants / Size
      'font-size-0': '小',
      'font-size-1': '中',
      'font-size-2': '大',
      // /media/osd / Constants / Text Overlay
      'osd-type-0': '時間',
      'osd-type-1': '裝置名稱',
      'osd-type-2': '裝置名稱和時間',
      'osd-type-3': '自訂文字',
      'Enter custom text': '輸入自訂文字',

      // /media/privacy-mask
      'Enable Privacy Mask': '開啟隱私遮罩',
      'Create mask areas on the preview window.': '請在預覽窗格新增隱私遮罩',
      'Mask Area': '遮罩區域',
      'Note Area': '說明',
      Drag: '拖曳',
      'To set a mask:': '新增遮罩',
      'To erase a mask:': '刪除遮罩',
      'Up to 4 mask areas can be set.': '最多4個遮罩',

      // /audio
      'Audio Title': '聲音',
      'Enable Audio Input': '開啟聲音輸入',
      'Audio Quality': '品質',
      'Input Source': '輸入來源',
      'Internal Microphone': '內建式麥克風',
      'External Microphone': '外接麥克風',
      // /audio / Constans / Audio Quality
      'audio-quality-0': 'G.711, 8kHz, 64kbps, 單聲道',
      'audio-quality-1': 'AAC, 16kHz, 96kbps, Mono',

      // /notification
      'Notification Settings': '通報',
      'Notification Method': '通報方式',
      Email: '電子郵件',
      'I/O': '數位輸出及輸入',
      'Smart Notification': '智慧通知',

      // /notification/app
      'Device Token': '裝置金鑰',
      'Please enter your device token.': '請輸入您的金鑰',
      'Device Id': '裝置編碼',
      'Please enter your device id.': '請輸入您的編碼',

      // /notification/smtp
      'Enable Outgoing Email': '開啟電子郵件傳輸',
      'SMTP Server Address': '外送伺服器位址',
      'Enter server address': '輸入伺服器位址',
      'SMTP Logon Settings': '外送伺服器登入設定',
      Edit: '編輯',
      'Some webmail providers may require app passwords for enhanced security, for example, Google and Yahoo Mail accounts. Please follow your webmail provider’s instructions to generate and use an app password.': '有些網路郵件供應商為了提高安全性， 可能會需要應用程式密碼，例如Google和Yahoo奇摩電子信箱帳號。請依照您郵件供應商的指示產生並使用應用程式密碼。',
      'Enter your account': '請輸入您的帳號',
      Port: '連接埠',
      Encryption: '加密方式',
      None: '無',
      'Enable Device Login Notification': '開啟裝置登入通報',
      'Sender Information': '寄件人資訊',
      'Enter sender\'s name': '輸入寄件人名稱',
      'Enter sender\'s email': '輸入寄件人電子郵件',
      'Notification Interval (seconds)': '通報間隔 (秒)',
      'Specify notification interval': '輸入秒數',
      '5-1,800 Seconds': '5-1800 秒',
      'Email Setting Success': '電子郵件設定成功',
      'Mail Setting Failed': '電子郵件設定失敗',
      'Sending Test Email': '測試郵件已寄出',
      'Disabling Outgoing Email': '設定成功',
      'Email Title': '電子郵件',

      // /notification/io
      'Input & Output': '數位輸出及輸入',
      Input: '數位輸入',
      'Enable Digital Input': '開啟數位輸入',
      'Normal State': '平常狀態',
      'Normally Closed': '常關',
      'Normally Open': '常開',
      'Output 1': '數位輸出 1',
      'Output 2': '數位輸出 2',
      'Output {{0}}': '數位輸出 {{0}}',
      'Enable Digital Output {{0}}': '開啟數位輸出 {{0}}',
      Type: '輸出類型',
      Normal: '一般',
      Buffer: '緩衝',
      'Pulse Time (seconds)': '訊號緩衝時間 (秒)',
      'Delay Time (seconds)': '延後間隔時間 (秒)',
      'Enter seconds': '請輸入秒數',
      '{{0}}-{{1}} Seconds': '{{0}}-{{1}} 秒',

      // /notification/cards
      'Notification Filters': '篩選通報卡',
      Pinned: '置頂',
      Others: '其他',
      'Unpin Card': '解除置頂',
      'Pin this card': '置頂',
      'Enter card title': '輸入通報卡名稱',
      'Email: On': '電子郵件: 開啟',
      'Output: On': '數位輸出: 開啟',
      'VMS: On': '影像管理系統(VMS): 開',
      Schedule: '排程',
      'Enable Schedule': '開啟排程',
      Rule: '規則',
      Group: '群組',
      Condition: '條件',
      Method: '通報方式',
      Everyone: '所有人，不限定群組',
      'Email Attachment': '附件檔案',
      Receiver: '收件人',
      'Enter email address': '輸入電子郵件地址',
      'Add a New Notification Card': '增加通報卡',
      'Notify by Recognition Result': '依據辨識結果通報',
      Add: '新增',
      Cancel: '取消',
      'Cannot create more than {{0}} cards': '無法新增超過 {{0}} 張卡',
      'Subject :': '主旨 :',
      'Content :': '內文 :',
      'Specify the subject': '輸入主旨',
      'Add your message': '輸入內文',
      'Content Placement': '內文位置',
      'Face Recognition Event on [{{0}}]': '臉部辨識事件 [{{0}}]',
      'Motion Detection Event on [{{0}}]': '移動偵測事件 [{{0}}]',
      'Digital Input Event on [{{0}}]': '數位輸入事件 [{{0}}]',
      'Invalid email address.': '不符合格式要求',
      'The maximum number of recipients is 64.': 'The maximum number of recipients is 64.',
      'Duplicate email address.': 'Duplicate email address.',
      // /notification/card (AVN)
      'Video Management System': '影像管理系統(VMS)',
      // /notification/card / Constants / VMS (AVN)
      'notification-vms-event-0': '影像移動偵測事件',
      'notification-vms-event-1': '智慧分析事件',
      // /notification/cards / Constants / Notification Filters
      'notification-card-filter-all': '所有通報',
      'notification-card-0': '臉部辨識',
      'notification-card-1': '性別年齡',
      'notification-card-2': '人形偵測',
      'notification-card-3': '移動偵測',
      'notification-card-4': '破壞警報',
      'notification-card-5': '數位輸入',
      // /notification/cards / Constants / Face Recognition Condition
      'face-recognition-condition-0': '所有類型',
      'face-recognition-condition-1': '成功',
      'face-recognition-condition-2': '未知',
      'face-recognition-condition-3': '圖像偽裝',
      // /notification/cards / Constants / Email Attachment
      'email-attachment-type-0': '臉部截圖',
      'email-attachment-type-1': '全畫面截圖',
      'email-attachment-type-2': '無',
      // /notification/cards / Constants / Content Placement
      'email-content-position-0': '置於開頭',
      'email-content-position-1': '置於結尾',

      // /users/members
      Members: '成員',
      'All Members': '清單',
      Groups: '群組',
      'Create a Group': '新增群組',
      'Delete Group: {{0}}': '刪除群組: {{0}}',
      'Delete Group': '刪除群組',
      Database: '資料庫檔案',
      'Encryption Settings': '加密設定',
      Export: '匯出',
      Import: '匯入',
      'Updating Member Database': '更新成員資料',
      'Database Encryption': '資料庫加密',
      'Current Password': '舊密碼',
      'Enter your Current password': '請輸入您的舊密碼',
      'Enter Keywords': '輸入關鍵字',
      Search: '搜尋',
      New: '新增',
      'Add a New Member': '新增成員',
      'Add a Member from Events': '從事件新增',
      'Edit Group: {{0}}': '編輯群組: {{0}}',
      'User Picture': '註冊照片',
      Actions: '操作',
      'Delete Member: {{0}}': '刪除成員: {{0}}',
      'Delete Member': '刪除成員',
      'Are you sure you want to delete member {{0}}?': '您確定要刪除成員 {{0}} 嗎？',
      'Edit Member: {{0}}': '編輯成員: {{0}}',
      'Edit Member': '編輯成員',
      '{{0}}-{{1}} items. Total: {{2}}': '{{0}}-{{1}} 筆資料，總計：{{2}}',
      'Importing Member Database': '匯入成員資料庫',
      'Exporting Member Database': '匯出成員資料庫',
      'New Member': '新增成員',
      'Please upload your face photo.': '請上傳正面照片',
      'Are you sure you want to delete group {{0}}?': '您確定要刪除群組 {{0}} 嗎？',
      // /users/members (AVN)
      'Upload Image': '上傳照片',
      Delete: '刪除',

      // /users/members/new-group
      Name: '名稱',
      'Enter a name for this group': '輸入群組名稱',
      Note: '備註',
      'Enter a note': '輸入備註',
      'Maximum length: 256 characters': '最多256個字',
      Create: '新增',
      Close: '關閉',

      // /users/members/modify-group
      'Edit Group': '編輯群組',
      'Modify Group': '編輯群組',
      Confirm: '確定',

      // /users/members/new
      Primary: '主照片',
      'Photo 1': '照片1',
      'Photo 2': '照片2',
      'Photo 3': '照片3',
      'Photo 4': '照片4',
      'Upload the Primary Photo First': '請先上傳主照片',
      'Photo Editor': '編輯',
      'Drag the image to position it correctly.': '拖曳調整照片',
      Organization: '組織',
      'Enter a name for this member': '輸入成員名稱',
      'Enter an organization for this member': '輸入組織名稱',
      'Maximum length: 32 characters': '最多32個字',
      'N/A': '無',
      'Are you sure you want to close this window? All changes you have made will be lost.': '關閉此視窗將不會儲存任何修改的資料，確認要離開嗎？',
      'Photo size should be less than 90 KB.': '照片大小不可以超過90 KB',
      Save: '儲存',
      'Change Photo': '更換照片',

      // /users/accounts
      Accounts: '帳號',
      'All Accounts': '帳號清單',
      Username: '名稱',
      'New User': '創建使用者',
      'Modify User': '編輯帳號',
      'Enter a password': '輸入密碼',
      'Enter a new password': '輸入新密碼',
      'New Password': '新密碼',
      'Confirm New Password': '確認新密碼',
      'Confirm Password': '確認密碼',
      'Enter the new password again': '再次輸入新密碼',
      'Enter the password again': '再次輸入密碼',
      'Delete Account': '刪除帳號',
      'Are you sure you want to delete account {{0}}?': '您確定要刪除帳號 {{0}} 嗎？',

      // /users/events
      Unknown: '未知',
      Events: '事件',
      Total: '筆資料',
      Time: '時間',
      Capture: '臉部截圖',
      Confidence: '相似度',
      'Couldn\'t find any data.': '沒有符合的資料, 請重新設置條件',
      Filters: '篩選條件',
      Clear: '清除條件',
      'Start Date': '日期',
      'Start Time': '時刻',
      'Start Datetime': '起始時間',
      'End Date': '日期',
      'End Time': '時刻',
      'End Datetime': '終止時間',
      'Facial Recognition': '臉部辨識',
      'Age & Gender': '性別年齡',
      'Human Detection': '人形偵測',
      Similarity: '相似度',
      'Recognition Result': '結果',
      'Add to an Existing Member': '新增至現有成員',
      'Enter keywords in the input field to search for members.': '請輸入關鍵字以便搜尋',
      'Add to {{0}}': '新增至 {{0}}',
      'Verifying Photo': '照片驗證中',
      'Invalid Photo': '照片不合格',
      'Updating Member': '更新成員',
      'Photo Has Been Added to {{0}}': '新增照片至 {{0}} 成功!',
      // /users/events / Constants / Status
      'enroll-status-0': '圖像偽裝',
      'enroll-status-1': '未知',
      'enroll-status-2': '成功',
      // /users/events / Constants / Confidence
      'confidence-0': '低',
      'confidence-1': '中',
      'confidence-2': '高',

      // /analytic/face-recognition
      'Analytics Settings': '智慧分析',
      'Enable Facial Recognition': '開啟臉部辨識',
      'Enable Anti-Image Spoof': '開啟防止圖片偽裝',
      'Level of Accuracy': '辨識成功閥值',
      'Detection Zone': '觸發區域',
      'Show/Hide Detection Zone': '顯示或隱藏區域',
      'The default is the whole live view screen.': '預設為全畫面',
      'Enable Facial Detection Size': '開啟最小辨識尺寸',
      'Min. Facial Detection Size': '最小臉部尺寸',
      'Live View Display': '即時影像顯示',
      'Display Name': '成員名稱',
      'Display Group': '成員群組',
      'Display Unknown': '辨識結果：未知',
      'Display Image Spoof': '辨識結果：圖像偽裝',
      'Facial Recognition is disabled.': '臉部辨識已關閉',
      'analytic.face-recognition.modal.spoofing': '您確定要開啟Alpha版防止圖像偽裝嗎? 圖像偽裝是一個Alpha版的功能, 判定成圖像偽裝的人臉不會被辯識, 我們會在之後的軟體更新優化並完善此功能',
      // /analytic/face-recognition / Constants / Level of Accuracy
      'confidence-level-0': '低',
      'confidence-level-1': '中',
      'confidence-level-2': '高',

      // /analytic/motion-detection
      'Enable Motion Detection': '開啟移動偵測',
      'Motion Detection': '移動偵測',
      'Create detection zones on the live view screen.': '請在預覽窗格新增觸發區域',
      'To set a zone:': '新增區域',
      'To erase a zone:': '刪除區域',
      'Up to 4 detection zones can be set.': '最多4個區域',

      // /analytic/license
      License: '智慧分析授權',
      'Enter your authentication key': '請輸入啟用碼',
      Activate: '啟用',
      Activated: '已啟用',
      'Activation Required': '未啟用',
      'Activated by': '啟用者',
      'Authentication Key': '啟用碼',
      'Activated Functions': '啟用功能',
      'Enable Status': '狀態',
      'Activated Success': '啟用成功',
      '{{0}} authorized successfully!': '{{0}} 啟用成功',
      'Activation Failed': '啟用失敗',
      'Authorization failed!': '啟用失敗',
      'Key Already Registered': '重複輸入啟用碼',
      // /analytic/license / Constants / FR Auth key
      'face-recognition-key-thirtyThousand': '臉部辨識 30k',
      'face-recognition-key-threeThousand': '臉部辨識 3k',

      // /network/settings
      'Internet & Network Settings': '網路',
      'IP Addressing': 'LAN 組態',
      'Network Status': '網路狀態',
      DHCP: 'DHCP',
      'Test DHCP': '測試DHCP',
      'DHCP Testing Success': 'DHCP 測試成功',
      'DHCP Testing Failed': 'DHCP 測試失敗',
      'Fixed IP Address': '固定IP位址',
      'IP Address': 'IP 位址',
      'MAC Address': '實體位址',
      'Subnet Mask': '子網路遮罩',
      'Router/Gateway': '路由器/閘道',
      'Primary DNS': '主要 DNS',
      'Secondary DNS (Optional)': '次要 DNS',
      Interface: '連接方式',
      'IP Assignment': 'IP 取得方式',
      'Secondary DNS': '次要 DNS',
      'No changes were made.': '沒有設定被更改',
      'Please enable HTTPS first.': '請先開啟 HTTPS 功能',
      'Are you sure you want to update network settings?': '您確定要更改網路設定嗎？',
      'Enter a fixed IP address': '請輸入固定IP位址',
      'Enter Subnet Mask': '請輸入子網路遮罩',
      'Enter Router/Gateway': '請輸入路由器/閘道',
      'Enter a primary DNS': '請輸入主要DNS',
      'Enter a secondary DNS': '請輸入次要DNS',

      // /network/tcp-ip
      'Enable DDNS': '開啟 DDNS 服務',
      'Service Provider': '服務提供者',
      'Host Name': '主機名稱',
      'Enter DDNS host name.': '輸入 DDNS 主機名稱',
      'Enter DDNS username.': '輸入 DDNS 使用者名稱',
      'Enter DDNS password.': '輸入 DDNS 密碼',
      'Secondary HTTP Port': 'HTTP 次要連接埠',
      'Range: 1024-65535 Default: 8080': '範圍：1024-65535，預設：8080',
      'Setting Success': '設定成功',
      'Setting Failed': '設定失敗',
      'DDNS Setting Success': 'DDNS 設定成功！',
      'DDNS Setting Failed': 'DDNS 設定失敗！',
      'Updating HTTP Settings': '更新HTTP設定',
      Rebooting: '重新啟動裝置中',

      // /network/https
      'Enable HTTPS': '開啟HTTPS服務',
      'Click confirm to redirect to the new address:': '請按確認導向新的網址：',
      'The website has been redirected to the new address': '請利用下列網址重新登入',
      'The specified port is reserved by system or in use!': '此連接埠為系統預留或使用中',
      'Redirection Success': '重新導向',
      'Range: 1024-65535 Default: 8443': '範圍：1024-65535，預設：8443',
      // /network/https / Constants / Certificate
      'certificate-type-0': `${window.isNoBrand ? '製造商' : 'AndroVideo'} 自簽憑證`,
      'certificate-type-1': '上傳您的憑證',
      'certificate-type-2': '在此裝置上產生憑證',

      // /system
      'Software Upgrade': '軟體更新',
      'Import File': '軟體檔案',
      'Only ZIP file format is supported': '僅支援 .zip 檔案格式',
      'Select File': '選擇檔案',
      'No file selected.': '未選擇任何檔案',

      // /system/datetime
      Administration: '管理',
      'Date & Time': '日期與時刻',
      'Time Zone': '時區',
      'Date and Time of the Device': '裝置時間',
      'Sync with Network Time Server (NTP)': '與網路時間伺服器 (NTP) 同步',
      'Host Name or IP Address': '伺服器位址',
      'Sync Time': '每日更新時刻',
      'Manual Date': '日期',
      'Manual Time': '時刻',
      'Sync Interval (minutes)': '更新頻率 (分)',
      'Sync with Your Computer': '與您的電腦同步',
      'Set the Date & Time Manually': '手動調整',
      'Updating Date & Time': '更新日期與時間',
      'Updating date and time requires you to log in again. Are you sure you want to continue?': '您確定要更裝置時間嗎? 更改裝置時間必須重新登入',

      // /system/maintain
      'Restore All Settings': '還原所有設定',
      'Device Maintenance': '維護',
      'System Reboot': '重新啟動裝置',
      'Are you sure you want to reboot the device?': '您確定要重新啟動裝置嗎？',
      Reboot: '重新啟動',
      'Restore to Default Settings': '還原成原廠設定',
      Reset: '清除資料',
      Resetting: '清除資料中',
      'Export System Settings': '匯出系統設定值',
      'Import System Settings': '匯入系統設定值',
      'The system will revert to factory default settings. All data and configurations you have saved will be overwritten.': '裝置將還原成原廠設定，所有資料和設定將會被清除',
      'The system will reset the device. All configurations will be overwritten and settings will revert back to default, except the following': '裝置將還原成原廠設定，除了下列項目，其他所有的資料和設定將會被清除',
      '• Members and Groups': '• 成員清單和成員群組資料',
      '• System Accounts': '• 帳號資料',
      '• Focus and Zoom of Image settings': '• 對焦及縮放設定',
      '• RTSP settings': '• RTSP設定',
      '• Internet & Network settings': '• 網路設定',
      '• Data on the SD Card': '• 記憶卡儲存資料',
      'The device has rebooted. Please log in again.': '裝置已重新啟動，請重新登入',
      'Reset Success': '重設成功',
      'Please go through the Initial Setup procedure. Refer to the Quick Installation Guide for instructions.': '請參閱安裝說明執行初始設定',

      // /system/upgrade
      'Upload Software': '上傳軟體',
      'Install Software': '安裝軟體',
      'Shut Down': '關閉裝置',
      Restart: '重新啟動裝置',
      'Stage 01': '階段 1',
      'Stage 02': '階段 2',
      'Stage 03': '階段 3',
      'Stage 04': '階段 4',
      '※ Please do not close your browser during the upgrade.': '※ 升級時請勿關閉瀏覽器',
      'Uploading Software': '軟體上傳中',
      'Installing Software': '軟體安裝中',
      'Shutting Down': '裝置關閉中',
      Restarting: '裝置重新啟動中',
      'Software Upgrade Success': '軟體升級成功',
      'Redirect to the login page in {{0}} seconds': '於 {{0}} 秒後重新導向至登入頁面',

      // /system/log
      Information: '裝置資訊',
      'System Log': '系統紀錄',
      'System Log File': '系統紀錄檔案',
      'Delete System Log File': '刪除系統紀錄檔案',
      'Are you sure you want to delete system logs?': '您確定要刪除系統紀錄檔案嗎？',
      'Delete logs': '刪除',
      Download: '下載',

      // /system/information
      'Build Version': '開發版號',
      'S/N Code': 'S/N 碼',
      'Downloading System Log File': '下載系統紀錄檔案',
      'Download progress': '下載進度',

      // /sd-card
      'Enable SD Card': '開啟記憶卡',
      'Disabling SD Card': '關閉記憶卡',
      'Event photos will not be available after the SD card is disabled. Are you sure you want to continue?': '您確定要關閉記憶卡嗎? 事件截圖將不會被儲存',
      'Off Line Record': '斷線錄影',
      'Are you sure you want to format the Micro SD card?': '您即將格式化 Micro SD 卡，確認是否繼續？',
      'Are you sure you want to unmount the Micro SD card?': '您即將卸除 Micro SD 卡，確認是否繼續？',
      Operation: '操作',
      Format: '格式化',
      Mount: '掛載',
      Unmount: '卸載',
      'Error Notification': '異常通報',
      'Email Notification Set': '已設定電子郵件',
      'SD Card Enable Outgoing Email': '設定電子郵件',
      Filesystem: '檔案系統格式',
      'Storage Space': '儲存空間',
      'Free: {{0}}': '{{0}} 可用',
      'Used: {{0}}': '{{0}} 已使用',
      Unrecognized: '無法識別',
      Status: '狀態',
      // /sd-card / Status
      Functioning: '正常', // 0 - MOUNTED
      Unmounted: '未掛載', // 1 - UNMOUNTED
      'Empty Slot': '未插卡', // 2 - SDCARDNOTEXIST
      Nonfunctioning: '不正常', // 3 - ABNORMAL
      'Read-only Access': '唯獨', // 4 - READONLY
      'Unknown Error': '未知錯誤', // 5 - UNKNOWN

      // The error pages.
      'Not Found': '此網頁不存在',
      'Back to Home': '回首頁',
      'Internal Server Error': '內部伺服器問題',
      'Sorry for any inconvenience, we are fixing this problem.': '抱歉造您的不便，正在處理中',

      // Server error codes
      // 9001
      'Duplicate Member Names': '名稱重複，請使用不同名稱',
      // 9002
      'Login Failed': '帳號或密碼錯誤',
      // 9003
      'Empty Member Database': '匯入錯誤的資料庫檔案',
      // 9004
      // Unable to reset a forgotten password	AVN
      // 9005
      // Unable to reset a password	不支援此功能
      // 9007
      'Card Number Limit Exceeded': '已達數量限制',
      // 9008
      'Non-existent Card': '記憶卡異常，無法正常操作',
      // 9009
      'Database Size Limit (3 GB) Exceeded': '已達儲存限制',
      // 9010
      // Invalid Member Photo 不支援此功能
      // 9011
      // Unable to Process the Request (invalid token).	UI不支援此功能, 支援在工程模式
      // 9012
      'Group Number Limit Exceeded': '已達數量限制',
      // 9013
      // Incorrect Password	不支援此功能
      // 9014
      'Wrong Password for Database File': '資料庫解壓縮密碼錯誤',
      // 9015
      'Wrong File Format': '檔案格式錯誤',
      // 9016
      'Corrupted Zip File': '檔案毀損',
      // 9017
      'Photo Limit of Member Database Exceeded': '已達數量限制',
      // 9018
      // Photo Size Limit Exceeded	不支援此功能
      // 9019
      // Invalid or Absent Photo	不支援此功能
      // 9020
      'Non-existent Group': '成員群組不存在',
      // 9021
      'Non-existent Member': '成員名稱不存在',
      // 9022
      // Maximum Field Length Exceeded	不支援此UI
      // 9023
      // Maximum Field Length Exceeded	不支援此UI
      // 9024
      // Maximum Field Length Exceeded	不支援此UI
      // 9025
      'Duplicate Member Name': '名稱重複，請使用不同名稱',
      // 9026
      'Duplicate Card Name': '名稱重複，請使用不同名稱',
      // 9027
      // VMS Reserved Port	AVN
      // 9028
      'Software Upgrade Failed': '軟體更新失敗',
      // 9029
      'Unable to Complete the Format': '記憶卡格式化失敗',
      // 9030
      'Empty SMTP Server Address': '必須輸入外送伺服器位址',
      // 9031
      'Empty SMTP Account': '必須輸入帳號和密碼',
      // 9032
      'Empty SMTP Account Password': '必須輸入帳號和密碼',
      // 9033
      'Empty Sender Email': '必須輸入寄件人資訊',
      // 9034
      // Outgoing Email being Disabled	不支援此UI
      // 9035
      'Absent or Unmounted SD Card': '記憶卡異常,無法正常操作',
      // 9036
      // Maximum Field Length Exceeded	不支援此UI
      // 9037
      // Maximum Field Length Exceeded	不支援此UI
      // 9038
      // Maximum Field Length Exceeded	不支援此UI
      // 9039
      // Maximum Photo Number Exceeded	不支援此UI
      // 9040
      'Showing No Face': '照片中沒有人臉',
      // 9041
      'Poor Photo Quality': '照片品質不佳',
      // 9042
      'Limitation of Yaw Angle is 30 Degrees': '人臉角度超過上下20度或左右30度',
      // 9043
      'Limitation of Pitch Angle is 20 Degrees': '人臉角度超過上下20度或左右30度',
      // 9044
      'More Than One Face in the Photo': '照片中超過1張人臉',
      // 9045
      'Non-existent Face Thumbnail': '事件截圖不存在',
      // 9046
      'Invalid Key': '啟用失敗，錯誤的啟動碼',
      // 9047
      'Duplicate Key': '啟用失敗，重複的啟動碼',
      // 9048
      'Cannot Support Database Downgrade from 30,000 to 3000 People': '啟用失敗，不支援臉部辨識成員上限從30,000人下降到3,000人'

      // -- Page -- END --
    }
  }
};
