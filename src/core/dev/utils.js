// utils for mock db

/**
 * The four functions below are for FR ROI Update and Getting FR Settings
 */

exports.decompressMapping = source => {
  const result = new Array(100);
  const _numberMapping = [128, 64, 32, 16, 8, 4, 2, 1];

  for (let col = 0; col < 100; col += 1) {
    result[col] = new Array(100);
    for (let row = 0; row < 100; row += 1) {
      result[col][row] = (source[col][Math.floor(row / 8)] & _numberMapping[row % 8]) === 0 ? 0 : 1;
    }
  }

  return result;
};

module.exports.convertMappingToPercentage = mapping => {
  const data = exports.decompressMapping(mapping);
  const result = {
    x: null,
    y: null,
    width: null,
    height: null
  };

  for (let col = 0; col < 100; col += 1) {
    for (let row = 0; row < 100; row += 1) {
      if (data[col][row]) {
        result.x = row;
        result.y = col;
        break;
      }
    }

    if (result.x != null) {
      break;
    }
  }

  for (let col = 99; col >= 0; col -= 1) {
    for (let row = 99; row >= 0; row -= 1) {
      if (data[col][row]) {
        result.width = row - result.x + 1;
        result.height = col - result.y + 1;
        break;
      }
    }

    if (result.width != null) {
      break;
    }
  }

  return result.x == null ? null : result;
};

exports.compressMapping = source => {
  const result = new Array(100);
  const _numberMapping = [128, 64, 32, 16, 8, 4, 2, 1];

  for (let col = 0; col < 100; col += 1) {
    result[col] = new Array(13);
    for (let row = 0; row < 13; row += 1) {
      let value = 0;
      for (let bit = 0; bit < 8; bit += 1) {
        if (source[col][(row * 8) + bit]) {
          value |= _numberMapping[bit];
        }
      }

      result[col][row] = value;
    }
  }

  return result;
};

module.exports.convertPercentageToMapping = area => {
  const result = new Array(100);

  const leftTopPoint = {
    x: area.x,
    y: area.y
  };
  const rightBottomPoint = {
    x: area.x + area.width - 1,
    y: area.y + area.height - 1
  };

  for (let col = 0; col < 100; col += 1) {
    result[col] = new Array(100);
    for (let row = 0; row < 100; row += 1) {
      if (
        col >= leftTopPoint.y && row >= leftTopPoint.x &&
          col <= rightBottomPoint.y && row <= rightBottomPoint.x
      ) {
        result[col][row] = 1;
      } else {
        result[col][row] = 0;
      }
    }
  }

  return exports.compressMapping(result);
};
