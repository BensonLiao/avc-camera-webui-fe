const PropTypes = require('prop-types');
const React = require('react');
const {createRef, useState} = require('react');
const styled = require('styled-components').default;

const Wrapper = styled.div`
  display: flex;
  min-width: 0px;
  width: 100%;
  flex: 1 1 auto;
  margin-left: 1rem;
  color: #0049ad;
`;

const ModalTitleWrapper = styled(Wrapper)`
  line-height: 40px;
  font-size: 20px;
  font-weight: bold;
  max-width: 240px;
`;

const RootWrapper = styled.div`
  flex-direction: column;
  width: 100%;
  display: flex;
  max-width: 100%;
  flex: 0 1 auto;
`;

const InputContainer = styled.div`
  width: ${props => (props.width === 'auto' ? 'auto' : `${props.width}px`)};
  text-align: left;
  outline: none;
`;

const InputWrapper = styled.div`
  width: ${props => (props.width === 'auto' ? 'auto' : `${props.width}px`)};
  * {
    outline: none;
  }
  .text {
    ${({isOnFocus}) => isOnFocus ?
    '' :
    `overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;`}
    background-color: transparent;
    width: ${props => (props.width === 'auto' ? 'auto' : `${props.width}px`)};
    text-align: left;
    transition: border-color 0.2s ease-in-out 0s;
    border: ${props =>
    props.isReadOnly ? '2px solid white' : '2px solid black'};
    border-radius: 3px;
  }
  .textarea {
    overflow-y: scroll;
  }
  ::-webkit-scrollbar {
    -webkit-appearance: none;
  }
  ::-webkit-scrollbar-thumb {
    width: 0;
  }
  ::-webkit-scrollbar-track {
    width: 0;
  }
  ::-webkit-scrollbar-thumb:horizontal {
    width: 0;
  }
`;

const Editable = ({
  onChange,
  contentType,
  type,
  maxLength,
  height,
  width,
  value,
  isReadOnly,
  tag,
  innerRef
}) => {
  const inputRef = innerRef || createRef();
  const [data] = useState(value);
  const [borderBottom, setBorderBottom] = useState('none');
  const [inputWidth, setInputWidth] = useState(width);
  const [InputHeight, setInputHeight] = useState(height);
  const [isOnFocus, setOnFocus] = useState(false);
  const placeCaretAtEnd = el => {
    el.focus();
    if (
      typeof window.getSelection !== 'undefined' &&
      typeof document.createRange !== 'undefined'
    ) {
      const range = document.createRange();
      range.selectNodeContents(el);
      range.collapse(false);
      var sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
    } else if (typeof document.body.createTextRange !== 'undefined') {
      const textRange = document.body.createTextRange();
      textRange.moveToElementText(el);
      textRange.collapse(false);
      textRange.select();
    }
  };

  const onFocus = () => {
    setOnFocus(true);
    if (!isReadOnly) {
      setInputWidth(width);
      setInputHeight(height);
      setBorderBottom('2px solid #1DA1F1');
    }
  };

  const onBlur = () => {
    setOnFocus(false);
    setBorderBottom('none');
    setInputHeight('auto');
    setInputWidth('auto');
  };

  const onKeyUp = e => {
    const {textContent} = e.currentTarget;
    const rem = Number(maxLength) - inputRef.current.innerText.length;
    if (rem <= 0) {
      const slicedText = textContent.slice(0, Number(maxLength));
      inputRef.current.innerText = slicedText;
      placeCaretAtEnd(inputRef.current);
      onChange(slicedText);
    } else {
      onChange(textContent);
    }
  };

  const onPaste = e => {
    const rem = Number(maxLength) - inputRef.current.innerText.length;
    const selection = window.getSelection() || '';
    const isSelectedAll = selection.toString().length === inputRef.current.innerText.length || false;
    if (rem <= 0) {
      e.preventDefault();
      const {textContent} = e.currentTarget;
      const text = e.clipboardData.getData('text/plain');
      const fullText = isSelectedAll ? text : textContent + text;
      const mData = fullText.slice(0, Number(maxLength));
      inputRef.current.innerText = mData;
    }
  };

  const CustomWrapper = type === 'modal-title' ? ModalTitleWrapper : Wrapper;
  const CustomTag = `${tag}`;
  return (
    <CustomWrapper>
      <RootWrapper>
        <InputContainer width={width}>
          <InputWrapper width={inputWidth} isReadOnly={isReadOnly} isOnFocus={isOnFocus}>
            <CustomTag
              ref={inputRef}
              className={contentType}
              contentEditable={!isReadOnly}
              style={{
                height: InputHeight === 'auto' ? 'auto' : `${InputHeight}px`,
                border: borderBottom,
                minWidth: inputWidth,
                marginBottom: 0
              }}
              dangerouslySetInnerHTML={{__html: data.replace(/\n/g, '<br/>')}}
              onFocus={onFocus}
              onBlur={onBlur}
              onInput={onKeyUp}
              onPaste={onPaste}
            />
          </InputWrapper>
        </InputContainer>
      </RootWrapper>
    </CustomWrapper>
  );
};

Editable.defaultProps = {
  width: 'auto',
  height: 'auto',
  contentType: 'text',
  type: 'default',
  value: '',
  isReadOnly: false,
  innerRef: null
};

Editable.propTypes = {
  value: PropTypes.string,
  width: PropTypes.string,
  height: PropTypes.string,
  maxLength: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  contentType: PropTypes.string,
  type: PropTypes.string,
  isReadOnly: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  tag: PropTypes.string.isRequired,
  innerRef: PropTypes.oneOfType([PropTypes.object, PropTypes.func])
};

module.exports = Editable;
