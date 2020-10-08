if (!window.languageResource['zh-tw']) {
  window.languageResource['zh-tw'] = {

    // -- Component -- START --

    // Component / Button
    Apply: '套用',

    // Component / Loading Spinner
    Loading: '載入中',

    // Component / Date Picker
    Su: '日',
    Mo: '一',
    Tu: '二',
    We: '三',
    Th: '四',
    Fr: '五',
    Sa: '六',
    // Component / API Processing Modal
    'Please wait': '請稍候',

    // Component / Switch component
    ON: '開',
    OFF: '關',

    // Component / Navigation
    Home: '首頁',
    Image: '圖像',
    Video: '影像設定',
    Audio: '聲音',
    'Notification Settings': '通知設定',
    'User Management': '用戶管理',
    Analytic: '智慧分析',
    Network: '網路',
    System: '系統',
    SDCard: 'SD卡',

    // Component / App Bar
    About: '關於',
    'Model Name': '裝置名稱',
    Firmware: '韌體版本',
    'Serial Number': '產品序號',
    Support: '支援',
    'Online Support Request': '線上支援',
    'Firmware Downloads': '韌體下載',
    'Software Downloads': '軟體下載',
    Downloads: '下載中心',
    'Product Selector': '產品選擇',
    'Technical Updates': '技術更新',
    Resources: '資源',

    // Component / App Bar / Support
    'Product Use': '產品使用',
    'Technical Support': '技術問題信箱',
    'Product Information': '其他產品資訊',
    'Sign Out': '登出',

    // Compoenet / Input / Validations (By Pages)
    'Incorrect confirm password.': '兩次密碼不一致。',
    'validation-required': '此欄位必填。',
    'validation-string': '此欄位必須是字串。',
    'validation-stringEmpty': '此欄位必填。',
    'validation-stringMin': '此欄位必須輸入 {expected} 個以上的字元。',
    'validation-stringMax': '此欄位必須輸入 {expected} 個以下的字元。',
    'validation-stringLength': '此欄位必須輸入 {expected} 個字元。',
    'validation-stringPattern': '此欄位與要求的格式不符合。',
    'validation-stringContains': '此欄位必須輸入包含 {expected} 的文字。',
    'validation-stringContainsLowerCaseLatter': '此欄位必須輸入包含小寫英文字母。',
    'validation-stringContainsUpperCaseLatter': '此欄位必須輸入包含大寫英文字母。',
    'validation-stringContainsNumber': '此欄位必須輸入包含數字。',
    'validation-stringAbortSpecialCharacters': '此欄位禁用全形或半形特殊符號(#, %, &, `, “, \\, <, >, 跟空白)。',
    'validation-stringAcceptSpecialCharacters': '此欄必須至少有一個特殊符號。',
    'validation-stringEnum': '此欄位與要求的內容不符合。',
    'validation-number': '此欄位必須是數字。',
    'validation-numberMin': '此欄位必須為 {expected} 以上的數字。',
    'validation-numberMax': '此欄位必須為 {expected} 以下的數字。',
    'validation-numberEqual': '此欄位必須為等於 {expected} 的數字。',
    'validation-numberNotEqual': '此欄位不可輸入等於 {expected} 的數字。',
    'validation-numberInteger': '此欄位必須為整數。',
    'validation-numberPositive': '此欄位必須為正數。',
    'validation-numberNegative': '此欄位必須為負數。',
    'validation-array': '此欄位必須為陣列。',
    'validation-arrayEmpty': '此欄位不可為空陣列。',
    'validation-arrayMin': '此欄位最少包含 {expected} 個項目。',
    'validation-arrayMax': '此欄位最多包含 {expected} 個項目。',
    'validation-arrayLength': '此欄位只必須為 {expected} 個項目。',
    'validation-arrayContains': '此欄位必須包含 {expected} 項目。',
    'validation-arrayEnum': '此欄位使用了不允許的項目 {expected}。',
    'validation-boolean': '此欄位必須為布林值。',
    'validation-function': '此欄位必須為函數。',
    'validation-date': '此欄位必須為日期。',
    'validation-dateMin': '此欄位必須為 {expected} 以後的日期。',
    'validation-dateMax': '此欄位必須為 {expected} 以前的日期。',
    'validation-forbidden': '此欄位為隱藏欄位。',
    'validation-email': '請使用正確的電子信箱格式。',
    'validation-url': '請使用正確的網址格式。',
    'validation-birthday': '請使用正確的生日格式。',
    'validation-countryCode': '國家代碼錯誤。',
    'Same name found, please use a different name.': '名字重複，請使用不同的名字',
    // /network/tcp-ip
    'The port number must not empty.': '網頁服務埠不能為空',

    // Component / CustomTooltip
    'Please Enter Start and End Datetime': '請先選擇開始與結束時間',
    // /system/maintain
    'Please Select a File First': '請先選擇一個檔案',
    'Check or uncheck this option to overwrite or preserve these settings: Members and Groups, System Accounts, Focus and Zoom settings of Image, RTSP settings, Internet/Network settings, and data on the SD card.': '勾選或不勾選此選項以清除或保留以下的設定：成員及群組、系統帳號、圖像中對焦跟Zoom的設定、RTSP設定、網路設定及SD卡的資料',
    // /sd-card
    'Please Disable SD Card First': '請先關掉SD卡',
    'Group Limit Reached': '已達群組數量限制',
    'This Account is Protected': '此帳戶不可刪除',
    'Cannot Delete Account That is Currently Logged In': '無法刪除正在使用的帳號',
    'Maximum Allowed Number of Schedule is 5': '最多可輸入5個通知時間',
    'Please Enter an Email Address': '請先輸入電子郵件',
    'Please Setup Email Notifications': '請設定電子郵件通知',
    'Hide Password': '隱藏密碼',
    'Show Password': '顯示密碼',

    // -- Component -- END --

    // -- Page -- START --

    // /setup
    'INITIAL PASSWORD SETUP': '初始密碼設定',
    'Prior to accessing this device for the first time a unique admin password must be created': '首次使用時，請先創建一個管理員密碼',
    '8-16 characters: at least one uppercase and lowercase letter, number, and symbol excluding #, %, &, `, ", \\, <, > and space': '8-16個字元：必須包含英文大寫和小寫字元、數字和符號，但符號不能為 #, %, &, `, “, \\, <, >跟空白',
    '1-32 characters: letters, numbers and symbols excluding #, %, &, `, ", \\, <, > and space': '1-32個字元：可包含字母、數字以及符號，但符號不能為 # % & ` “ \\ < >跟空白',
    Welcome: '歡迎',
    'For a better experience,': '為了使您有更好的體驗，',
    'please press continue to complete the simple three-step installation setup!': '請您先按下繼續來完成簡單三步驟的安裝設定！',
    Continue: '繼續',
    Submit: '確認',

    // /setup/language
    'Setup Language': '選擇語言',
    Language: '選擇語言',
    HTTPS: '安全傳輸方式',
    Next: '下一步',

    // /setup/account
    'Setup Account': '初始帳號設定',
    Account: '帳號',
    'Please enter your account.': '請輸入您的帳號名稱',
    Permission: '權限',
    Password: '密碼',
    Birthday: '生日',
    'This is used for resetting password.': '生日將會用於重置密碼',
    'Enter your account': '請輸入您的帳號',
    'Enter your password': '請輸入您的密碼',
    'Confirm Your Password': '請再次輸入您的密碼',
    // /setup/account / Constants / Permission
    'permission-0': '管理者',
    'permission-1': '訪客',
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
    '1024 - 65535, except for 5555, 8080, 8554, 17300.': '1024 - 65535，除了5555、8080、8554, 17300.',

    // /login
    Login: '登入',
    'ACCOUNT LOGIN': '帳號登入',
    'Enter Your Username and Password': '請輸入您的帳號與密碼',
    'Enter Your Username': '請輸入您的帳號',
    'Password Reset': '重置密碼',

    // /login-error
    'Password Incorrect': '密碼輸入錯誤',
    'You have {0} attemps remaining...': '您尚可嘗試 {0} 次...',
    'Incorrect password x {0}': '密碼錯誤 x {0}',
    'Expires in 10 minutes': '10 分鐘後過期',
    'Expires in 30 minutes': '30 分鐘後過期',
    'Expires in 1 hour': '1 小時後過期',
    'Expires in 12 hours': '12 小時後過期',

    // /login-lock
    'Too Many Login Attempts!': '密碼嘗試輸入錯誤次數過多！',
    'Please try again in 5 minutes.': '請於五分鐘後再次登入',
    'Tech Support Phone Number: +1 (818) 937-0700': '支援專線：+1 (818) 937-0700',
    'Login Lock': '登入鎖定',
    'Forgot password?': '忘記密碼？',
    'Incorrect password 5 times! Please wait for 5 minutes.': '密碼錯誤五次囉！請於五分鐘後再登入。',
    '{0} Remaining': '還剩 {0}',
    'Login Again': '重新登入',

    // /forgot-password
    'Forgot Password': '忘記密碼',
    OK: '確定',

    // /reset-password
    'Reset Password': '重設密碼',
    'New Password': '新密碼',
    'Enter Your New Password': '請輸入您的新密碼',
    'Confirm Password': '確認密碼',
    'Enter Your New Password Again': '請再次輸入您的新密碼',

    // /reset-password-success
    'Reset password success.': '重設密碼成功',
    Done: '完成',

    // /home
    'Image Settings': '圖像設定',
    'Device Name': '裝置名稱',
    'Device Status': '裝置狀態',
    'SD Card': 'SD卡',
    'Please enter letters between 1 and 32.': '請輸入1-32字元',
    Unlicensed: '未授權',
    'Facial Recognition: ': '臉部辨識 : ',
    'Age Gender: ': '性別年齡 : ',
    'Human Detection: ': '人形偵測 : ',
    'Free: {0}, Total: {1}': '{0} 可用 (共 {1})',
    'Image Adjustment': '圖像調整',
    Brightness: '亮度',
    Contrast: '對比',
    Sharpness: '銳利度',
    Saturation: '飽和度',
    'Lens Control': '鏡頭控制',
    'Select Focus Type': '選擇對焦方式',
    'Full-Range Focus': '全範圍對焦',
    'Short-Range Focus': '短距離對焦',
    Focus: '對焦',
    Zoom: '焦距',
    'Auto Focus after Zoom': '調整焦距時自動對焦',
    Iris: '光圈',
    'Shutter Speed': '快門速度',
    'Image Configuration': '影像屬性',
    'White Balance': '白平衡',
    'Color Temperature': '色溫',
    'IR Control': '紅外線燈',
    Level: '強度',
    'D/N': '黑白模式',
    Sensitivity: '靈敏度',
    'Day Mode': '日光時段',
    Rotation: '影像方向',
    Defog: '除霧',
    'Lighting Compensation Frequency (Hz)': '刷新頻率',
    'Auto Focus': '自動對焦',
    'Focal Length': '焦距',
    'Reset to Default Settings': '恢復預設',
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
    'white-balance-2': '日光燈',
    'white-balance-3': '白熱燈泡',
    'white-balance-4': '手動調整',
    // /home / Constans / Day/Night
    'daynight-mode-0': '自動',
    'daynight-mode-1': '彩色',
    'daynight-mode-2': '黑白',
    'daynight-mode-3': '指定時段',
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
    'Stream Settings': '串流設定',
    OSD: '顯示資訊',
    'Privacy Mask': '隱私遮罩',

    // /media/stream
    Settings: '設定',
    'Stream {0}': '串流 {0}',
    Codec: '影像格式',
    Resolution: '解析度',
    'Frame Rate (FPS)': '每秒傳送張數 (FPS)',
    'Bandwidth Management': '頻寬管理',
    Quality: '影像品質',
    'Are you sure you want to update stream settings?': '您即將更改串流設定，確認是否繼續？',
    'Updating Stream Settings': '更新串流設定',
    'Changing the aspect ratio of Stream 1 will also update Stream 2 settings. Are you sure you want to continue?': '改變串流1解析度的畫面比例會造成串流2的設定被改變，請確認是否繼續？',
    // /media/stream / Constans / Resolution
    'stream-resolution-0': '3840*2160(16:9)',
    'stream-resolution-1': '2560*1440(16:9)',
    'stream-resolution-2': '1920*1080(16:9)',
    'stream-resolution-3': '1280*720(16:9)',
    'stream-resolution-4': '640*360(16:9)',
    'stream-resolution-5': '2560*1920(4:3)',
    'stream-resolution-6': '2048*1536(4:3)',
    'stream-resolution-7': '1600*1200(4:3)',
    'stream-resolution-8': '1280*960(4:3)',
    'stream-resolution-9': '1024*768(4:3)',
    'stream-resolution-10': '640*480(4:3)',
    'stream-resolution-11': '320*240(4:3)',
    // /media/stream / Constans / Bandwidth Management
    'stream-bandwidth-management-0': '最佳位元速率 (MBR)',
    'stream-bandwidth-management-1': '可變位元速率 (VBR)',
    'stream-bandwidth-management-2': '固定位元速率 (CBR)',
    // /media/stream / Constans / Quality
    'quality-30': '低',
    'quality-50': '中',
    'quality-80': '高',

    // /media/rtsp
    'Enable Audio over RTSP': '將聲音記錄至串流',
    'Require Authentication': '連線時需帳號密碼認證',
    'RTSP/TCP Port': 'RTSP/TCP 連接埠',
    '1024 - 65535, except for 5555, 8080, 8443, 17300.': '1024 - 65535，除了5555、8080、8443、17300',
    'RTSP/UDP Port': 'RTSP/UDP 連接埠',
    '1024 - 65535, except for 5555, 8080, 8443, 8554.': '1024 - 65535，除了5555、8080、8443、8554',
    'Maximum Number of Connection': '最大連接數',

    // /media/hdmi
    'HDMI Settings': 'HDMI設定',
    'Updating hdmi settings': '更新HDMI設定',
    'Are you sure you want to update hdmi settings?': '您即將更改HDMI設定，確認是否繼續？',

    // /media/word
    'On/Off': '開/關',
    Size: '大小',
    Color: '顏色',
    Word: '文字',
    Position: '位置',
    'Select Position': '請於畫面中點選文字顯示位置',
    'Text Overlay': '文字浮水印',
    // /media/word / Constants / Size
    'font-size-0': '小',
    'font-size-1': '中',
    'font-size-2': '大',
    // /media/word / Constants / Text Overlay
    'word-type-0': '時間',
    'word-type-1': '相機名稱',
    'word-type-2': '相機名稱+時間',
    'word-type-3': '自訂文字',
    'Enter Custom Text': '輸入自訂文字',

    // /media/privacy-mask
    'Drag a Mask Area.': '請拖曳新增遮罩',
    'Mask Area': '遮罩區域',
    'Note Area': '說明',
    Drag: '拖曳',
    'Set a Mask.': '新增遮罩',
    'Erase a Mask.': '刪除遮罩',
    'Up to 4 Mask Areas.': '最多至4個遮罩',

    // /audio
    'Audio In': '聲音輸入',
    'Audio Settings': '聲音設定',
    'Audio Quality': '聲音品質',
    'Input Source': '聲音輸入來源',
    'Internal Microphone': '內建式麥克風',
    'External Microphone': '外接麥克風',
    'Audio Out': '聲音輸出',
    // /audio / Constans / Audio Quality
    'audio-quality-0': 'G.711, 8kHz, 64kbps, Mono',
    'audio-quality-1': 'AAC, 16kHz, 96kbps, Mono',

    // /notification
    'Notification Setting': '通知設定',
    'Basic Setting': '基本設定',
    App: 'APP設定',
    Mail: '郵件設定',
    'I/O': 'I/O設定',
    'Smart Notification': '智慧通知',

    // /notification/app
    'Device Token': '裝置金鑰',
    'Please enter your device token.': '請輸入您的金鑰',
    'Device Id': '裝置編碼',
    'Please enter your device id.': '請輸入您的編碼',

    // /notification/smtp
    'SMTP Server': 'SMTP 伺服器',
    'Host Address': 'HOST位址',
    'Enter Your Host Address': '請輸入您的 Host 位址',
    'SMTP Account Settings': '電子郵件登入認證',
    'Edit Account and Password': '編輯帳號密碼',
    'Some webmail providers may require app passwords for enhanced security, for example, Google and Yahoo Mail accounts. Please follow your webmail provider’s instructions to generate and use an app password.': '有些網路郵件供應商為了提高安全性， 可能會需要應用程式密碼，例如Google和Yahoo奇摩電子信箱帳號。請依照您郵件供應商的指示產生並使用應用程式密碼。',
    'Email and login settings': '電子郵件登入認證設定',
    Port: '埠',
    Encryption: '加密',
    None: '無',
    'Login Notification': '登入通知信',
    'Please Enable SMTP Server': '請先開啟SMTP伺服器',
    Sender: '寄件人',
    'Enter Your Name': '請輸入您的名稱',
    Email: '電子郵件',
    'Enter Your Email': '請輸入您的電子郵件',
    'Notification Interval (Seconds)': '通知時間間隔 (秒)',
    'Enter your notification interval': '請輸入通知時間',
    '5 - 1,800 Seconds': '5 - 1800 秒',
    'Mail Setting Success': '電子郵件設定成功',
    'Mail Setting Failed': '電子郵件設定失敗',
    'Test Mail Sent': '測試郵件已寄出',
    'Account Auth is Off, Test Mail not Sent.': '登入認證設定為關閉，測試郵件未寄出',

    // /notification/io
    'Input and Output Setting': 'I/O設定',
    Input: '硬體輸入',
    'Normal State': '平常狀態',
    'Normally Closed': '常關',
    'Normally Open': '常開',
    'Output {0}': '硬體輸出 {0}',
    Type: '輸出類型',
    Normal: '一般',
    Buffer: '緩衝',
    'Pulse Time (Seconds)': '訊號緩衝時間 (秒)',
    'Delay Time (Seconds)': '延後間隔時間 (秒)',
    'Enter Seconds': '請輸入秒數',
    '{0} - {1} Seconds': '{0} - {1} 秒',

    // /notification/cards
    'Notification Filters': '通知篩選',
    Pinned: '置頂項目',
    Others: '其他項目',
    'Unpin Card': '解除置頂',
    'Pin Card': '置頂',
    'Enter Your Title': '輸入通知名稱',
    'Email: On': '電子郵件: 開',
    'Output: On': '數位輸出: 開',
    'VMS: On': '影像管理系統(VMS): 開',
    Schedule: '通知時間',
    Rule: '通知條件',
    Condition: '條件',
    Subject: '通知對象',
    'All Groups': '所有群組',
    Everyone: '所有人',
    'Email Attachment': '附件檔案',
    Receiver: '收件人',
    'Enter Email Address': '請輸入電子郵件',
    'Add New Notification Card': '增加新通知卡',
    Add: '新增',
    Cancel: '取消',
    Recognition: '辨識',
    'Cards Limit Error': '通知卡數量限制',
    'Cannot Create More Than {0} Cards': '無法新增超過 {0} 張卡',
    'Subject :': '主旨 :',
    'Content :': '內文 :',
    'Specify the Subject of Notification Emails': '請輸入通知郵件主旨',
    'Append Your Message to Notification Emails': '請輸入通知郵件內文',
    'Email Content Order': '內文位置',
    // /notification/card (AVN)
    'Video Management System': '影像管理系統(VMS)',
    Method: '傳送方式',
    // /notification/card / Constants / VMS (AVN)
    'notification-vms-event-0': '影像動態偵測事件',
    'notification-vms-event-1': '智慧分析事件',
    // /notification/cards / Constants / Notification Filters
    'notification-card-filter-all': '所有通知',
    'notification-card-0': '臉部辨識',
    'notification-card-1': '性別年齡',
    'notification-card-2': '人形偵測',
    'notification-card-3': '移動偵測',
    'notification-card-4': '破壞警報',
    'notification-card-5': '數位輸出',
    // /notification/cards / Constants / Face Recognition Condition
    'Group Type': '群組類型',
    'face-recognition-condition-0': '不限',
    'face-recognition-condition-1': '成功',
    'face-recognition-condition-2': '未知',
    'face-recognition-condition-3': '圖像偽裝',
    // /notification/cards / Constants / Email Attachment
    'email-attachment-type-0': '臉部快照',
    'email-attachment-type-1': '完整快照',
    'email-attachment-type-2': '不傳附件',
    // /notification/cards / Constants / Email Content Order
    'email-content-position-0': '置於開頭',
    'email-content-position-1': '置於結尾',

    // /users/members
    Members: '成員管理',
    'All Members': '所有成員',
    Groups: '群組',
    'Create a Group': '新增群組',
    'Delete Group: {0}': '刪除群組: {0}',
    'Delete Group': '刪除群組',
    Database: '資料庫檔案',
    'Encryption Settings': '加密設定',
    Export: '匯出',
    Import: '匯入',
    'Database Encryption': '資料庫加密',
    'Current Password': '舊密碼',
    'Enter your Current password': '請輸入您的舊密碼',
    'Enter Keywords': '請輸入關鍵字',
    Search: '搜尋',
    New: '新增',
    'Add a New Member': '新增成員',
    'Add a Member from Events': '從事件新增',
    'Edit Group: {0}': '編輯群組: {0}',
    'User Picture': '註冊照片',
    Actions: '操作',
    'Delete Member: {0}': '刪除成員: {0}',
    'Delete Member': '刪除成員',
    'Are you sure you want to delete member {0}?': '您即將刪除成員 {0}，確認要刪除嗎？',
    'Edit Member: {0}': '編輯成員: {0}',
    'Edit Member': '編輯成員',
    '{0}-{1} items. Total: {2}': '目前 {0}-{1} 筆，總筆數 {2} 筆',
    'Updating Members': '更新成員',
    'Exporting Member Database': '導出成員資料庫中',
    'New Member': '新增成員',
    'Please upload your face photo.': '請上傳正面照片',
    'Are you sure you want to delete group {0}?': '您即將刪除 {0} 群組，確認要刪除嗎？',
    // /users/members (AVN)
    'Upload Image': '上傳照片',
    Delete: '刪除',

    // /users/members/new-group
    Name: '名稱',
    'Enter Your Group Name': '請輸入群組名稱',
    Note: '備註',
    'Enter Your Note': '請輸入您的備註',
    Create: '新增',
    Close: '關閉',

    // /users/members/modify-group
    'Edit Group': '編輯群組',
    'Modify Group': '編輯群組',
    Confirm: '確認',

    // /users/members/new
    Primary: '主照片',
    'Photo 1': '照片1',
    'Photo 2': '照片2',
    'Photo 3': '照片3',
    'Photo 4': '照片4',
    'Upload Primary First': '請先上傳主照片',
    Organization: '組織',
    'Enter Your Organization': '請輸入您的組織',
    'Letters within 32 characters.': '32 字元以內的中英文大寫或小寫',
    Group: '群組',
    'N/A': '無',
    'Are you sure you want to close this window? Any changes you have made will be lost.': '關閉此視窗將不會儲存任何成員資料，確認要離開嗎？',

    // /users/accounts
    Accounts: '帳號管理',
    'All Accounts': '所有帳號',
    Username: '帳號',
    'New User': '創建使用者',
    'Modify User': '編輯帳號',
    'Confirm New Password': '確認新密碼',
    'Confirm Your New Password': '請再次輸入您的新密碼',
    'Delete Account': '刪除帳號',
    'Are you sure to delete account {0}?': '您即將刪除 {0}，確認要刪除這個帳號嗎？',

    // /users/events
    Events: '智慧搜尋',
    Total: '總筆數',
    Time: '時間',
    Capture: '辨識照片',
    Confidence: '相似度',
    'Can\'t find any data.': '查無相符資料，請重新搜尋。',
    Filters: '篩選條件',
    Clear: '清除條件',
    'Start Date': '開始日期',
    'Start Time': '開始時間',
    'Start Datetime': '開始日期時間',
    'End Date': '結束日期',
    'End Time': '結束時間',
    'Facial Recognition': '臉部辨識',
    'Age Gender': '性別年齡',
    'Human Detection': '人形偵測',
    Similarity: '相似度',
    'Recognition Result': '辨識狀態',
    'End Datetime': '結束日期時間',
    'Add as New Member': '新增為新成員',
    'Add to Existing Member': '新增至現有成員',
    'Enter Keyword For Search': '請輸入關鍵字以便搜尋',
    'Add to {0}': '新增至 {0}',
    'Photo Limit Reached': '已達照片上限',
    'Verifying Photo': '照片驗證中',
    'Invalid Photo': '照片不合格',
    'Updating Member': '更新成員',
    'Added Photo to {0} Successfully!': '新增照片至 {0} 成功!',
    // /users/events / Constants / Status
    'enroll-status-0': '圖像偽裝',
    'enroll-status-1': '未知',
    'enroll-status-2': '註冊',
    // /users/events / Constants / Confidence
    'confidence-0': '低',
    'confidence-1': '中',
    'confidence-2': '高',

    // /analytic/face-recognition
    'Anti-Image Spoof': '防止圖像偽裝',
    'Level of Accuracy': '相似度層級',
    'Detection Zone': '觸發區域',
    'Show/Hide Detection Zone': '顯示/隱藏觸發區域',
    'Default is Fullscreen': '預設為全畫面',
    'Facial Detection Size': '人臉大小',
    'Live View Display:': '即時影像顯示：',
    Unknown: '未知',
    'Image Spoof': '圖像偽裝',
    'Facial Recognition is Disabled': '辨識功能已關閉',
    // /analytic/face-recognition / Constants / Level of Accuracy
    'confidence-level-0': '低',
    'confidence-level-1': '中',
    'confidence-level-2': '高',

    // /analytic/motion-detection
    'Motion Detection': '移動偵測',
    'Please Drag a Detection Zone Area.': '請拖曳新增觸發區域',
    'Set a Zone.': '新增區域',
    'Erase a Zone.': '刪除區域',
    'Up to 4 Zone Areas.': '最多至4個觸發區域',

    // /analytic/license
    License: '智慧授權',
    'Enter your authentication key': '請輸入授權碼',
    Activate: '啟用',
    Activated: '已啟用',
    Inactive: '未啟用',
    'Activate User': '啟用者',
    'Authentication Key': '授權碼',
    'Activate Functions': '啟用功能',
    'Enable Status': '狀態',
    'Activated Successfully': '啟用成功',
    '{0} authorized successfully!': '{0}已授權成功！',
    'Activation Failed': '啟用失敗',
    'Authorization failed!': '授權失敗！',
    'Key Already Registered!': '授權碼已註冊!',
    // /analytic/license / Constants / FR Auth key
    'face-recognition-key-thirtyThousand': '臉部辨識 30k',
    'face-recognition-key-threeThousand': '臉部辨識 3k',

    // /network/settings
    'Internet/Network Settings': '網路',
    'Network Settings': '連線設定',
    'LAN Configuration': 'LAN組態',
    'Network Status': '連線狀態',
    'Enable DHCP': '使用DHCP',
    'Test DHCP': '測試DHCP',
    'DHCP Testing Success!': 'DHCP 測試成功！',
    'DHCP Testing Failed!': 'DHCP 測試失敗！',
    'Fixed IP Address': '固定IP位址',
    'Enter a Fixed IP Address': '請輸入固定IP位址',
    'IP Address': 'IP 位址',
    'MAC Address': '網路卡硬體位址',
    'Subnet Mask': '子網路遮罩',
    'Router/Gateway': '路由器/閘道',
    'Primary DNS': '慣用 DNS',
    'Secondary DNS (Optional)': '其他 DNS (選填)',
    Interface: '介面',
    'IP Status': 'IP 取得方式',
    'Secondary DNS': '其他 DNS',
    'No Values Have Changed': '數值沒有更動',
    'Please Enable HTTPS': '請開啟HTTPS功能',
    'Are you sure you want to update network settings?': '您即將要更改連線設定，確認是否繼續？',

    // /network/tcp-ip
    'DDNS Server': 'DDNS 伺服器',
    'Server Provider': '服務提供',
    'Host Name': '主機名稱',
    'Secondary Web Server Port': '次網頁服務埠',
    'Enter Your Secondary Server Port': '請輸入您的服務埠',
    '1024 - 65535, except for 5555, 8443, 8554, 17300. Default primary port is 80.': '1024 - 65535，除了5555、8443、8554、17300，預設主要埠為80',
    'Setting Success': '設定成功',
    'Setting Failed': '設定失敗',
    'DDNS Setting Success!': 'DDNS 設定成功！',
    'DDNS Setting Failed!': 'DDNS 設定失敗！',
    'Updating Http Settings': '更新HTTP設定',
    'Device Rebooting': '裝置重新開機',

    // /network/https
    'Click confirm to redirect to the new address:': '按確認重新導向新的網址 :',
    'Please Redirect Manually to the New Address': '請自行手動重新導向新的網址',
    'The specified port is reserved by system or in use!': '輸入的連接埠為系統預留或使用中!',
    Success: '成功',
    // /network/https / Constants / Certificate
    'certificate-type-0': `${window.isNoBrand ? '製造商' : 'AndroVideo'} 自簽憑證`,
    'certificate-type-1': '上傳您的憑證',
    'certificate-type-2': '在此裝置上產生憑證',

    // /system
    'System Settings': '系統設定',
    'Firmware Upgrade': '韌體升級',
    'Import File': '匯入設定檔',
    'Only .Zip File Supported': '僅支援 .zip 檔案',
    'Select File': '選擇檔案',
    'No Files Selected': '未選任何檔案',

    // /system/datetime
    'Date & Time': '日期與時間',
    'Time Zone': '時區',
    'Date and Time of the Device': '裝置的日期與時間',
    'Sync with Network Time Server (NTP)': '與網路時間伺服器 (NTP) 同步',
    'Host Name and IP Address': '主機名稱或 IP 位址',
    'Update Time': '更新時間',
    'Manual Date': '自訂日期',
    'Manual Time': '自訂時間',
    'Update Frequency (Minutes)': '更新頻率 (分)',
    'Sync with Computer': '與電腦同步',
    'Set Date/Time Manually': '手動編輯日期與時間',
    'Updating Date & Time': '更新日期與時間',
    'Update date & time need to log in again. Are you sure you want to continue?': '更新日期與時區需要重新登入，確認是否繼續？',
    'Please Enable Sync with Network Time Server (NTP)': '請啟用與網路時間伺服器 (NTP) 同步',
    'Time Zone Disabled when Sync with Computer': '與電腦同步時時區將停用',

    // /system/maintain
    'Restore All Settings': '還原所有設定',
    'Device Maintenance': '裝置維護',
    'System Reboot': '重新啟動裝置',
    'Are you sure you want to reboot the system?': '您即將要重新啟動裝置，確認是否繼續？',
    Reboot: '重啟',
    'Restore to Default Setting': '將裝置還原成原始預設值',
    'Restore to Factory Default Settings (Includes Network Settings)': '將所有設定恢復為預設值(包含IP位址)',
    Reset: '重設設定',
    'Export System Settings': '匯出系統設定值',
    'Import System Settings': '匯入系統設定值',
    'Check or clear this option to overwrite or preserve these settings: Members and Groups, System Accounts, Focus and Zoom settings of Image, RTSP settings, Internet/Network settings, and data on the SD Card.': '勾選或清除此選項以清除或保留以下的設定：成員及群組、系統帳號、圖像設定中對焦跟Zoom的設定、RTSP設定、網路設定並清空SD卡的資料',
    'The system will revert to factory default settings. Any data and configurations you have saved will be overwritten.': '系統將回歸至原廠設定，任何已儲存的資訊和設定將會被清除',
    'The system will reset the device. All configurations will be overwritten and settings will revert back to default, except the following': '所有設定將被清除並回復成出廠預設值，但將保留以下設定',
    '• Members and Groups': '• 成員跟群組',
    '• System Accounts': '• 系統帳號',
    '• Focus and Zoom settings of the Image': '• 圖像設定中"對焦"和"Zoom"的設定',
    '• RTSP settings': '• RTSP設定',
    '• Internet/Network settings': '• 網路設定',
    '• SD Card settings.': '• SD卡設定',

    // /system/upgrade
    'Upload Firmware': '上傳韌體',
    'Install Firmware': '安裝韌體',
    'Shutdown Device': '關閉裝置',
    'Restart Device': '重啟裝置',
    'Stage 01': '階段 01',
    'Stage 02': '階段 02',
    'Stage 03': '階段 03',
    'Stage 04': '階段 04',
    '※ Please do not close browser or tab during upgrade': '※ 升級時請勿關閉瀏覽器或分頁',
    'Uploading Firmware': '韌體上傳中',
    'Installing Firmware': '韌體安裝中',
    'Device Shutting Down': '裝置關閉中',
    'Device Restarting': '裝置重啟中',
    'Firmware Upgrade Success': '韌體升級成功',
    'Redirect to login page in {0} seconds': '於 {0} 秒後重新導向至登入頁面',

    // /system/log
    'System Information': '資訊',
    Information: '裝置資訊',
    'System Log': 'Log 紀錄',
    'System Log File Record': '系統 Log 檔紀錄',
    'Delete System Log File Record': '刪除系統 Log 檔紀錄',
    'Are you sure you want to delete record?': '您即將刪除系統 Log 檔紀錄，確認是否繼續？',
    'Delete Record': '刪除紀錄',
    Download: '下載',
    // /system/information
    'Build Version': '開發版號',
    'S/N Code': 'S/N 碼',

    // /sd-card
    'Disable SD Card': '關閉 SD Card',
    'Event photos will not be available after disabling the SD card. Are you sure you want to continue?': '關閉 SD Card 卡後事件照片將無法顯示，確認是否繼續？',
    'Off Line Record': '斷線錄影',
    'Are you sure you want to format the Micro SD card?': '您即將格式化 Micro SD 卡，確認是否繼續？',
    'Are you sure you want to unmount the Micro SD card?': '您即將卸除 Micro SD 卡，確認是否繼續？',
    'SD Card Settings': 'SD卡設定',
    'SD Card Operation': '操作',
    Format: '格式化',
    Unmount: '卸載',
    'SD Card Notification': '異常通報',
    'Email Notification Set': '透過電子郵件通報',
    'Setup Email Notifications': '未設定電子郵件',
    'File Format': '檔案格式',
    'Storage Space': '儲存空間',
    'Free: {0}': '{0} 可用',
    'Used: {0}': '{0} 已使用',
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
    'Not Found': '找不到此網頁',
    'Please click the button to go back to home!': '您可以從下面按鈕回首頁！',
    'Back to Home': '回首頁',
    'Internal Server Error': '內部伺服器問題',
    'Sorry for your inconvenience, we are actively process with it!': '造成您的不便不好意思，我們正在積極處理中！'

    // -- Page -- END --
  };
}
