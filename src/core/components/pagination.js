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

  state = {
    gotoIndex: 0
  };

  onChangeGotoIndex = event => {
    this.setState({gotoIndex: event.currentTarget.value - 1});
  }

  onKeyPress = event => {
    if (event.charCode === 13) {
      const {gotoIndex} = this.state;
      const router = getRouter();
      router.go(
        {name: router.currentRoute.name, params: {index: gotoIndex}},
        {reload: true}
      );
    }
  }

  render() {
    if (this.props.total === 0) {
      return <></>;
    }

    const numbers = [];
    const hasPrevious = this.props.index > 0;
    const hasNext = this.props.total > (this.props.index + 1) * this.props.size;
    const startItem = (this.props.index * this.props.size) + 1;
    const endItem = startItem + this.props.itemQuantity - 1;
    const {gotoIndex} = this.state;
    const maxGotoIndex = Math.ceil(this.props.total / this.props.size);

    for (let index = this.props.index - 3; index < this.props.index + 3; index += 1) {
      if (index < 0 || index >= maxGotoIndex) {
        continue;
      }

      numbers.push({
        key: `pagination-${index}`,
        pageNumber: index + 1,
        href: format(this.props.hrefTemplate, {index: index}),
        className: classNames('page-item', {disabled: index === this.props.index})
      });
    }

    return (
      <div className="col-12">
        <nav className="d-flex justify-content-center align-items-center">
          <p className="text-size-14 text-muted mr-auto invisible">
            {_('{0}-{1} items. Total: {2}', [startItem, endItem, this.props.total])}
          </p>
          <ul className="pagination">
            <li className={classNames('page-item', {disabled: !hasPrevious})}>
              <Link to={hasPrevious ? format(this.props.hrefTemplate, {index: this.props.index - 1}) : ''}
                className="page-link"
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
              <Link to={hasNext ? format(this.props.hrefTemplate, {index: this.props.index + 1}) : ''}
                className="page-link"
              >
                &raquo;
              </Link>
            </li>
            <li className="page-item">
              <input
                type="number"
                placeholder={1}
                min={1}
                max={maxGotoIndex}
                style={{
                  margin: '0px 8px',
                  lineHeight: 2,
                  textAlign: 'center',
                  paddingLeft: '8px'
                }}
                onChange={this.onChangeGotoIndex}
                onKeyPress={this.onKeyPress}
              />
            </li>
            <li className="page-item">
              <Link to={format(this.props.hrefTemplate, {index: gotoIndex})}
                className="page-link"
              >
                Go
              </Link>
            </li>
          </ul>
          <p className="text-size-14 text-muted ml-auto">
            {_('{0}-{1} items. Total: {2}', [startItem, endItem, this.props.total])}
          </p>
        </nav>
      </div>
    );
  }
};
