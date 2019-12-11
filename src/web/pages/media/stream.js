const React = require('react');
const PropTypes = require('prop-types');
const Base = require('../shared/base');
const _ = require('../../../languages');

module.exports = class Stream extends Base {
  static get propTypes() {
    return {
      streamSettings: PropTypes.shape({
        channelA: PropTypes.shape({
          format: PropTypes.string.isRequired,
          resolution: PropTypes.string.isRequired,
          frameRate: PropTypes.string.isRequired,
          bandwidthManagement: PropTypes.string.isRequired,
          vbrBitRateLevel: PropTypes.string.isRequired,
          vbrMaxBitRate: PropTypes.string.isRequired,
          cbrBitRate: PropTypes.string.isRequired,
          gop: PropTypes.string.isRequired
        }).isRequired,
        channelB: PropTypes.shape({
          format: PropTypes.string.isRequired,
          resolution: PropTypes.string.isRequired,
          frameRate: PropTypes.string.isRequired,
          bandwidthManagement: PropTypes.string.isRequired,
          vbrBitRateLevel: PropTypes.string.isRequired,
          vbrMaxBitRate: PropTypes.string.isRequired,
          cbrBitRate: PropTypes.string.isRequired,
          gop: PropTypes.string.isRequired
        }).isRequired
      }).isRequired
    };
  }

  render() {
    return (
      <div className="main-content left-menu-active">
        <section className="section-media">
          <div className="container-fluid">
            <div className="row">
              <div className="col-12">
                <nav>
                  <ol className="breadcrumb rounded-pill">
                    <li className="breadcrumb-item active">
                      <a href="/media/stream">{_('Multimedia settings')}</a>
                    </li>
                    <li className="breadcrumb-item">{_('Stream settings')}</li>
                  </ol>
                </nav>
              </div>

              <div className="col-6 col-xl-4">
                <div className="card shadow">
                  <div className="card-header">
                    串流01
                  </div>
                  <div className="card-body">
                    <div className="form-group">
                      <label>影像格式</label>
                      <div className="select-wrapper border rounded-pill overflow-hidden">
                        <select className="form-control border-0">
                          <option value="h264">H264</option>
                        </select>
                      </div>
                    </div>
                    <div className="form-group">
                      <label>解新度</label>
                      <div className="select-wrapper border rounded-pill overflow-hidden">
                        <select className="form-control border-0">
                          <option value="1280*720(16:9)">1280*720(16:9)</option>
                        </select>
                      </div>
                    </div>
                    <div className="form-group">
                      <label>每秒傳送張數</label>
                      <div className="select-wrapper border rounded-pill overflow-hidden">
                        <select className="form-control border-0">
                          <option value="30">30</option>
                        </select>
                      </div>
                    </div>
                    <div className="form-group">
                      <label>頻寬管理</label>
                      <div className="select-wrapper border rounded-pill overflow-hidden">
                        <select className="form-control border-0">
                          <option value="VBR">VBR</option>
                        </select>
                      </div>
                    </div>
                    <div className="form-group">
                      <label>可變比特率(VBR)</label>
                      <div className="select-wrapper border rounded-pill overflow-hidden">
                        <select className="form-control border-0">
                          <option value="完整">完整</option>
                        </select>
                      </div>
                    </div>
                    <div className="form-group">
                      <label>最佳可變比特率(VBR Max Bitrate)</label>
                      <div className="select-wrapper border rounded-pill overflow-hidden">
                        <select className="form-control border-0">
                          <option value="12Mb">12Mb</option>
                        </select>
                      </div>
                    </div>
                    <div className="form-group">
                      <label>固定比特率(CBR)</label>
                      <div className="select-wrapper border rounded-pill overflow-hidden">
                        <select className="form-control border-0">
                          <option value="2MB">2MB</option>
                        </select>
                      </div>
                    </div>
                    <div className="form-group">
                      <label>圖像群組(GOP)</label>
                      <div className="select-wrapper border rounded-pill overflow-hidden">
                        <select className="form-control border-0">
                          <option value="2">2</option>
                        </select>
                      </div>
                    </div>
                    <div className="form-group">
                      <button type="submit" className="btn btn-block btn-primary rounded-pill">套用</button>
                    </div>
                    <button type="button" className="btn btn-block btn-outline-primary rounded-pill">恢復預設</button>
                  </div>
                </div>
              </div>

              <div className="col-6 col-xl-4">
                <div className="card shadow">
                  <div className="card-header">
                    串流02
                  </div>
                  <div className="card-body">
                    <div className="form-group">
                      <label>影像格式</label>
                      <div className="select-wrapper border rounded-pill overflow-hidden">
                        <select className="form-control border-0">
                          <option value="h264">H264</option>
                        </select>
                      </div>
                    </div>
                    <div className="form-group">
                      <label>解新度</label>
                      <div className="select-wrapper border rounded-pill overflow-hidden">
                        <select className="form-control border-0">
                          <option value="1280*720(16:9)">1280*720(16:9)</option>
                        </select>
                      </div>
                    </div>
                    <div className="form-group">
                      <label>每秒傳送張數</label>
                      <div className="select-wrapper border rounded-pill overflow-hidden">
                        <select className="form-control border-0">
                          <option value="30">30</option>
                        </select>
                      </div>
                    </div>
                    <div className="form-group">
                      <label>頻寬管理</label>
                      <div className="select-wrapper border rounded-pill overflow-hidden">
                        <select className="form-control border-0">
                          <option value="VBR">VBR</option>
                        </select>
                      </div>
                    </div>
                    <div className="form-group">
                      <label>可變比特率(VBR)</label>
                      <div className="select-wrapper border rounded-pill overflow-hidden">
                        <select className="form-control border-0">
                          <option value="完整">完整</option>
                        </select>
                      </div>
                    </div>
                    <div className="form-group">
                      <label>最佳可變比特率(VBR Max Bitrate)</label>
                      <div className="select-wrapper border rounded-pill overflow-hidden">
                        <select className="form-control border-0">
                          <option value="12Mb">12Mb</option>
                        </select>
                      </div>
                    </div>
                    <div className="form-group">
                      <label>固定比特率(CBR)</label>
                      <div className="select-wrapper border rounded-pill overflow-hidden">
                        <select className="form-control border-0">
                          <option value="2MB">2MB</option>
                        </select>
                      </div>
                    </div>
                    <div className="form-group">
                      <label>圖像群組(GOP)</label>
                      <div className="select-wrapper border rounded-pill overflow-hidden">
                        <select className="form-control border-0">
                          <option value="2">2</option>
                        </select>
                      </div>
                    </div>
                    <div className="form-group">
                      <button type="submit" className="btn btn-block btn-primary rounded-pill">套用</button>
                    </div>
                    <button type="button" className="btn btn-block btn-outline-primary rounded-pill">恢復預設</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }
};
