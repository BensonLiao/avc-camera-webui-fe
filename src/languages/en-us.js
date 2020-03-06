window.languageResource = {
  _code: 'en-us',

  // Constants
  'permission-0': 'Admin',
  'permission-1': 'Viewer',

  'certificate-type-0': 'AndroVideo Self-signed',
  'certificate-type-1': 'Upload Certificate',
  'certificate-type-2': 'Generate Certificate on This Device',

  'confidence-1': 'Low',
  'confidence-2': 'Medium',
  'confidence-3': 'High',

  'enroll-status-1': 'Registered',
  'enroll-status-2': 'Unknown',

  auto: 'Auto',
  off: 'Off',
  max: 'Max',
  outdoor: 'Outdoor',
  fluorescent: 'Fluorescent',
  incandescent: 'Incandescent',
  manual: 'Nanual',

  // Shutter speed
  'shutter-speed-0': 'Auto',
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

  // Aperture (Iris)
  'aperture-0': 'Auto',
  'aperture-1': 'Max',

  // White balance
  'white-balance-0': 'Auto',
  'white-balance-1': 'Outdoor',
  'white-balance-2': 'Fluorescent',
  'white-balance-3': 'Incandescent',
  'white-balance-4': 'Manual',

  // D/N
  'daynight-mode-0': 'Auto',
  'daynight-mode-1': 'Color',
  'daynight-mode-2': 'Black and White',
  'daynight-mode-3': 'Manual',

  // Orientation
  'orientation-0': 'Normal',
  'orientation-1': 'Vertical Flip',
  'orientation-2': 'Horizontal Flip',
  'orientation-3': '180 Degree Flip',

  // Refresh rate
  'refresh-rate-0': 'Auto',
  'refresh-rate-1': '50Hz',
  'refresh-rate-2': '60Hz',

  // 解析度
  'stream-resolution-0': '3840*2160(16:9)',
  'stream-resolution-1': '2560*1440(16:9)',
  'stream-resolution-2': '1920*1080(16:9)',
  'stream-resolution-3': '1280*720(16:9)',
  'stream-resolution-4': '640*360(16:9)',
  'stream-resolution-5': '2048*1536(4:3)',
  'stream-resolution-6': '1600*1200(4:3)',
  'stream-resolution-7': '1280*960(4:3)',
  'stream-resolution-8': '640*480(4:3)',

  // 可變比特率 (VBR)
  'stream-vbr-bit-rate-level-0': 'Best',
  'stream-vbr-bit-rate-level-1': 'Complete',
  'stream-vbr-bit-rate-level-2': 'Good',
  'stream-vbr-bit-rate-level-3': 'Normal',
  'stream-vbr-bit-rate-level-4': 'Bad',

  // 相似度層級
  'confidence-level-0': 'Low',
  'confidence-level-1': 'Medium',
  'confidence-level-2': 'High',

  // 聲音品質
  'audio-quality-0': 'G.711, 8kHz, 64kbps, Mono',
  'audio-quality-1': 'AAC, 16kHz, 96kbps, Mono',

  // 文字大小
  'font-size-0': 'Small',
  'font-size-1': 'Medium',
  'font-size-2': 'Large',

  // 文字貼圖
  'word-type-0': 'Time',
  'word-type-1': 'Camera Name',
  'word-type-2': 'Camera Name and Time',
  'word-type-3': 'Custom',

  // 通知類型
  'notification-card-0': 'Face Recognition',
  'notification-card-1': 'Age Gender',
  'notification-card-2': 'Humanoid Detection',

  // 辨識通知條件
  'face-recognition-condition-0': 'Always',
  'face-recognition-condition-1': 'Success',
  'face-recognition-condition-2': 'Unknown',

  // 通知附件檔案
  'email-attachment-type-0': 'Face Thumbnail',
  'email-attachment-type-1': 'Screenshot',
  'email-attachment-type-2': 'None',

  // Validations
  'validation-required': 'This field is required.',
  'validation-string': 'This field must be a string.',
  'validation-stringEmpty': 'This field is required.',
  'validation-stringMin': 'This field length must be greater than or equal to {expected} characters long.',
  'validation-stringMax': 'This field length must be less than or equal to {expected} characters long.',
  'validation-stringLength': 'This field length must be {expected} characters long.',
  'validation-stringPattern': 'This field fails to match the required pattern.',
  'validation-stringContains': 'This field must contain the {expected} text.',
  'validation-stringContainsLowerCaseLatter': 'This field must contain the lower case letter.',
  'validation-stringContainsUpperCaseLatter': 'This field must contain the upper case letter.',
  'validation-stringContainsNumber': 'This field must contain the number.',
  'validation-stringAbortSpecialCharacters': 'This field can\'t use special characters.',
  'validation-stringEnum': 'This field does not match any of the allowed values.',
  'validation-number': 'This field must be a number.',
  'validation-numberMin': 'This field must be greater than or equal to {expected}.',
  'validation-numberMax': 'This field must be less than or equal to {expected}.',
  'validation-numberEqual': 'This field must be equal with {expected}.',
  'validation-numberNotEqual': 'This field can\'t be equal with {expected}.',
  'validation-numberInteger': 'This field must be an integer.',
  'validation-numberPositive': 'This field must be a positive number.',
  'validation-numberNegative': 'This field must be a negative number.',
  'validation-array': 'This field must be an array.',
  'validation-arrayEmpty': 'This field must not be an empty array.',
  'validation-arrayMin': 'This field must contain at least {expected} items.',
  'validation-arrayMax': 'This field must contain less than or equal to {expected} items.',
  'validation-arrayLength': 'This field must contain {expected} items.',
  'validation-arrayContains': 'This field must contain the {expected} item.',
  'validation-arrayEnum': 'This field value {expected} does not match any of the allowed values.',
  'validation-boolean': 'This field must be a boolean.',
  'validation-function': 'This field must be a function.',
  'validation-date': 'This field must be a Date.',
  'validation-dateMin': 'This field must be greater than or equal to {expected}.',
  'validation-dateMax': 'This field must be less than or equal to {expected}.',
  'validation-forbidden': 'This field is forbidden.',
  'validation-email': 'This field must be a valid e-mail.',
  'validation-url': 'This field must be a valid URL.',
  'validation-birthday': 'This field must be a valid birthday.',
  'validation-countryCode': 'This field must be a valid country code.',

  // /
  'Device Status': 'Status',
  Green: 'Normal',

  // /members
  Database: 'Database',

  // /events
  'Recognition Result': 'Status',

  // /license
  'Enable Status': 'Status'
};
