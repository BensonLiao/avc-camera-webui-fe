const classNames = require('classnames');
const PropTypes = require('prop-types');
const React = require('react');
const format = require('string-template');
const {Link, getRouter} = require('capybara-router');
const _ = require('../../languages');

module.exports = class Pagination extends React.PureComponent {
  static get propTypes() {
    return {
      index: PropTypes.number.isRequired,
      size: PropTypes.number.isRequired,
      total: PropTypes.number.isRequired,
      itemQuantity: PropTypes.number.isRequired,
      hrefTemplate: PropTypes.string.isRequired
    };
  }

  constructor(props) {
    super(props);
    this.maxGotoIndex = Math.ceil(this.props.total / this.props.size);
  }

  state = {gotoIndex: 0};

  onChangeGotoIndex = event => {
    let validateValue = event.currentTarget.value;
    if (Number(event.currentTarget.value)) {
      validateValue = event.currentTarget.value >= this.maxGotoIndex ?
        this.maxGotoIndex :
        event.currentTarget.value;
      validateValue = validateValue < 1 ? 1 : validateValue;
      this.setState({gotoIndex: validateValue - 1});
    }
  }

  onKeyPress = event => {
    if (event.charCode === 13) {
      const {gotoIndex} = this.state;
      getRouter().go(format(this.props.hrefTemplate, {index: gotoIndex}));
    }
  }

  render() {
    const {
      index,
      size,
      total,
      itemQuantity,
      hrefTemplate
    } = this.props;
    if (total === 0) {
      return <></>;
    }

    const numbers = [];
    const hasPrevious = index > 0;
    const hasNext = total > (index + 1) * size;
    const startItem = (index * size) + 1;
    const endItem = startItem + itemQuantity - 1;
    const {gotoIndex} = this.state;

    for (let idx = index - 3; idx < index + 3; idx += 1) {
      if (idx < 0 || idx >= this.maxGotoIndex) {
        continue;
      }

      numbers.push({
        key: `pagination-${idx}`,
        pageNumber: idx + 1,
        href: format(hrefTemplate, {index: idx}),
        className: classNames('page-item', {disabled: idx === index})
      });
    }

    return (
      <div className="col-12">
        <nav className="d-flex justify-content-center align-items-center" style={{padding: '0px 2px', height: '36px'}}>
          <p className="text-size-14 text-muted mb-0 mr-auto invisible">
            {_('{0}-{1} items. Total: {2}', [startItem, endItem, total])}
          </p>
          <ul className="pagination my-auto">
            <li className={classNames('page-item', {disabled: !hasPrevious})}>
              <Link
                to={hasPrevious ? format(hrefTemplate, {index: index - 1}) : ''}
                className="page-link prev"
              >
                &laquo;
              </Link>
            </li>
            {
              numbers.map(number => (
                <li key={number.key} className={number.className}>
                  <Link to={number.href} className="page-link">
                    {number.pageNumber}
                  </Link>
                </li>
              ))
            }
            <li className={classNames('page-item', {disabled: !hasNext})}>
              <Link
                to={hasNext ? format(hrefTemplate, {index: index + 1}) : ''}
                className="page-link next"
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
                to={format(hrefTemplate, {index: gotoIndex})}
                className="page-link go"
              >
                Go
              </Link>
            </li>
          </ul>
          <p className="text-size-14 text-muted mb-0 ml-auto">
            {_('{0}-{1} items. Total: {2}', [startItem, endItem, total])}
          </p>
        </nav>
      </div>
    );
  }
};
