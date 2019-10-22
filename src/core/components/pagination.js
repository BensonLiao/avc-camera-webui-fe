const classNames = require('classnames');
const PropTypes = require('prop-types');
const React = require('react');
const format = require('string-template');
const {Link} = require('capybara-router');
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

  render() {
    if (this.props.total === 0) {
      return <></>;
    }

    const numbers = [];
    const hasPrevious = this.props.index > 0;
    const hasNext = this.props.total > (this.props.index + 1) * this.props.size;
    const startItem = (this.props.index * this.props.size) + 1;
    const endItem = startItem + this.props.itemQuantity - 1;

    for (let index = this.props.index - 3; index < this.props.index + 3; index += 1) {
      if (index < 0 || index >= Math.ceil(this.props.total / this.props.size)) {
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
          </ul>
          <p className="text-size-14 text-muted ml-auto">
            {_('{0}-{1} items. Total: {2}', [startItem, endItem, this.props.total])}
          </p>
        </nav>
      </div>
    );
  }
};
