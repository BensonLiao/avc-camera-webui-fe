const classNames = require('classnames');
const PropTypes = require('prop-types');
const React = require('react');
const {Link, getRouter} = require('@benson.liao/capybara-router');
const i18n = require('../../i18n').default;

module.exports = class Pagination extends React.Component {
  static get propTypes() {
    return {
      index: PropTypes.number.isRequired,
      size: PropTypes.number.isRequired,
      total: PropTypes.number.isRequired,
      currentPageItemQuantity: PropTypes.number.isRequired,
      hrefTemplate: PropTypes.string.isRequired,
      setPageIndexState: PropTypes.func
    };
  }

  static get defaultProps() {
    return {setPageIndexState: null};
  }

  constructor(props) {
    super(props);
    this.maxGotoIndex = Math.ceil(props.total / props.size);
  }

  state = {gotoIndex: 0};

  onChangeGotoIndex = event => {
    let validateValue = event.currentTarget.value;
    if (!isNaN(validateValue)) {
      validateValue = event.currentTarget.value >= this.maxGotoIndex ?
        this.maxGotoIndex :
        event.currentTarget.value;
      validateValue = validateValue < 1 ? 1 : validateValue;
      this.setState({gotoIndex: validateValue - 1});
    }
  }

  onKeyPress = event => {
    if (event.charCode === 13) {
      const {hrefTemplate, setPageIndexState} = this.props;
      const {gotoIndex} = this.state;
      if (typeof setPageIndexState === 'function') {
        setPageIndexState(gotoIndex);
      } else {
        getRouter().go(hrefTemplate + gotoIndex);
      }
    }
  }

  // Override default onClick in Capybara-Router.
  onClickLink = pageIndex => event => {
    event.preventDefault();
    if (event.metaKey) {
      return;
    }

    const {setPageIndexState} = this.props;
    if (typeof setPageIndexState === 'function') {
      setPageIndexState(pageIndex);
    } else {
      getRouter().go(event.target.href);
    }
  }

  render() {
    const {
      index,
      size,
      total,
      currentPageItemQuantity,
      hrefTemplate,
      setPageIndexState
    } = this.props;
    if (total === 0) {
      return <></>;
    }

    const numbers = [];
    const hasPrevious = index > 0;
    const hasNext = total > (index + 1) * size;
    const startItem = (index * size) + 1;
    const endItem = startItem + currentPageItemQuantity - 1;
    const {gotoIndex} = this.state;
    this.maxGotoIndex = Math.ceil(total / size);

    for (let idx = index - 3; idx < index + 3; idx += 1) {
      if (idx < 0 || idx >= this.maxGotoIndex) {
        continue;
      }

      numbers.push({
        key: `pagination-${idx}`,
        pageNumber: idx + 1,
        href: typeof setPageIndexState === 'function' ? '' : hrefTemplate + idx,
        className: classNames('page-item', {disabled: idx === index})
      });
    }

    return (
      <div className="col-12 border border-top-none pagination-component">
        <nav
          className="d-flex justify-content-center align-items-center"
          style={{
            padding: '0px 2px',
            height: '42px'
          }}
        >
          <div className="border rounded d-flex align-items-center">
            <span className="text-size-14 text-muted mx-2 my-1">
              {`${i18n.t('common.pagination.total')}: ${total}`}
            </span>
            <div className="vertical-border m-0" style={{height: '1.85rem'}}/>
            <span className="text-size-14 text-muted mx-2 my-1">
              {`${startItem} - ${endItem} ${i18n.t('common.pagination.items')}`}
            </span>
          </div>
          <ul className="pagination my-auto ml-auto">
            <li className={classNames('page-item', {disabled: !hasPrevious})}>
              <Link
                to={hasPrevious && typeof setPageIndexState !== 'function' ? hrefTemplate + (index - 1) : ''}
                className="page-link prev"
                onClick={this.onClickLink(index - 1)}
              >
                &laquo;
              </Link>
            </li>
            {
              numbers.map(number => (
                <li key={number.key} className={number.className}>
                  <Link
                    to={number.href}
                    className="page-link"
                    onClick={this.onClickLink(number.pageNumber - 1)}
                  >
                    {number.pageNumber}
                  </Link>
                </li>
              ))
            }
            <li className={classNames('page-item', {disabled: !hasNext})}>
              <Link
                to={hasNext && typeof setPageIndexState !== 'function' ? hrefTemplate + (index + 1) : ''}
                className="page-link next"
                onClick={this.onClickLink(index + 1)}
              >
                &raquo;
              </Link>
            </li>
            <li className="page-item">
              <input
                type="number"
                className="page-input"
                min={1}
                max={this.maxGotoIndex}
                onChange={this.onChangeGotoIndex}
                onKeyPress={this.onKeyPress}
              />
            </li>
            <li className="page-item">
              <Link
                to={typeof setPageIndexState === 'function' ? hrefTemplate : hrefTemplate + gotoIndex}
                className="page-link go"
                onClick={this.onClickLink(gotoIndex)}
              >
                Go
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    );
  }
};
