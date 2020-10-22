if (!window.languageResource['en-us']) {
  window.languageResource['en-us'] = {

    // Constants
    'permission-0': 'Admin',
    'permission-1': 'Guest',
    'permission-2': 'Viewer',
    'permission-99': 'Admin', // Super-Admin, for easier backend permission control, no difference for UI

    auto: 'Auto',
    off: 'Off',
    max: 'Max',
    outdoor: 'Outdoor',
    fluorescent: 'Fluorescent',
    incandescent: 'Incandescent',
    manual: 'Nanual',

    // Compoenet / Input / Validations
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
    'validation-stringAbortSpecialCharacters': 'This field cannot contain these symbols: #, %, &, `, ", /, \\, <, >, and space.',
    'validation-stringAcceptSpecialCharacters': 'This field must contain at least one symbol',
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

    // /home
    'Device Status': 'Status',
    // /home / Constans / Iris
    'aperture-0': 'Auto',
    'aperture-1': 'Max',
    // /home / Constans / Shutter speed
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
    // /home / Constans / White balance
    'white-balance-0': 'Auto',
    'white-balance-1': 'Outdoor',
    'white-balance-2': 'Fluorescent',
    'white-balance-3': 'Incandescent',
    'white-balance-4': 'Manual',
    // /home / Constans / Day/Night
    'daynight-mode-0': 'Auto',
    'daynight-mode-1': 'Color',
    'daynight-mode-2': 'Black and White',
    'daynight-mode-3': 'Manual',
    // /home / Constans / Rotation
    'orientation-0': 'Normal',
    'orientation-1': 'Vertical Flip',
    'orientation-2': 'Horizontal Flip',
    'orientation-3': '180 Degree Flip',
    // /home / Constans / Lighting Compensation Frequency (Hz)
    'refresh-rate-0': 'Auto',
    'refresh-rate-1': '50Hz',
    'refresh-rate-2': '60Hz',

    // /media/stream
    '{{0}} - {{1}} Kbps': '{{0}} - {{1}} Kbps',
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
    // /media/stream / Constans / Quality
    'quality-30': 'Low',
    'quality-50': 'Medium',
    'quality-80': 'High',
    // /media/stream / Constans / Bandwidth Management
    'stream-bandwidth-management-0': 'Maximum Bitrate',
    'stream-bandwidth-management-1': 'Variable Bitrate',
    'stream-bandwidth-management-2': 'Constant Bitrate',

    // /media/word
    // /media/word / Constants / Size
    'font-size-0': 'Small',
    'font-size-1': 'Medium',
    'font-size-2': 'Large',
    // /media/word / Constants / Text Overlay
    'word-type-0': 'Time',
    'word-type-1': 'Device Name',
    'word-type-2': 'Device Name and Time',
    'word-type-3': 'Custom',

    // /media/privacy-mask
    'Note Area': 'Note',

    // /audio
    // /audio / Constans / Audio Quality
    'audio-quality-0': 'G.711, 8kHz, 64kbps, Mono',
    'audio-quality-1': 'AAC, 16kHz, 96kbps, Mono',

    // /notification/cards
    'Notification Filters': 'Filters',
    // /notification/card / Constants / VMS (AVN)
    'notification-vms-event-0': 'Video Motion Detection Event',
    'notification-vms-event-1': 'Analytic Event',
    // /notification/cards / Constants / Notification Filters
    'notification-card-filter-all': 'All',
    'notification-card-0': 'Facial Recognition',
    'notification-card-1': 'Age & Gender',
    'notification-card-2': 'Humanoid Detection',
    'notification-card-3': 'Motion Detection',
    'notification-card-4': 'Tamper Alarm',
    'notification-card-5': 'Digital Input',
    // /notification/cards / Constants / Face Recognition Condition
    'face-recognition-condition-0': 'All',
    'face-recognition-condition-1': 'Success',
    'face-recognition-condition-2': 'Unknown',
    'face-recognition-condition-3': 'Image Spoof',
    // /notification/cards / Constants / Email Attachment
    'email-attachment-type-0': 'Face Thumbnail',
    'email-attachment-type-1': 'Screenshot',
    'email-attachment-type-2': 'None',
    // /notification/cards / Constants / Content Placement
    'email-content-position-0': 'Head',
    'email-content-position-1': 'Tail',

    // /users/members
    Database: 'Database',

    // /users/events
    'Recognition Result': 'Status',
    'Start Datetime': 'Start Time',
    'End Datetime': 'End Time',
    'Start Date': 'Date',
    'End Date': 'Date',
    'Start Time': 'Time',
    'End Time': 'Time',
    // /users/events / Constants / Status
    'enroll-status-0': 'Image Spoof',
    'enroll-status-1': 'Unknown',
    'enroll-status-2': 'Registered',
    // /users/events / Constants / Confidence
    'confidence-0': 'Low',
    'confidence-1': 'Medium',
    'confidence-2': 'High',

    // /analytic/face-recognition
    'Display Name': 'Name',
    'Display Group': 'Group',
    'Display Unknown': 'Unknown',
    'Display Image Spoof': 'Image Spoof',
    // /analytic/face-recognition / Constants / Level of Accuracy
    'confidence-level-0': 'Low',
    'confidence-level-1': 'Medium',
    'confidence-level-2': 'High',

    // /analytic/license
    'Enable Status': 'Status',
    // /analytic/license / Constants / FR Auth key
    'face-recognition-key-thirtyThousand': 'Face Recognition 30k',
    'face-recognition-key-threeThousand': 'Face Recognition 3k',

    // /network/https
    // /network/https / Constants / Certificate
    'certificate-type-0': `${window.isNoBrand ? 'Manufacturer' : 'AndroVideo'} Self-signed Certificate`,
    'certificate-type-1': 'Upload Your Certificate',
    'certificate-type-2': 'Generate a Certificate on the Device'
  };
}
