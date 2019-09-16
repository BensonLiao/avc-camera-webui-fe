const React = require('react');
const Base = require('./shared/base');

module.exports = class Home extends Base {
  render() {
    return (
      <div className="main-content">
        <div className="page-home">
          <div className="container-fluid">
            <div className="row">
              <div className="col-8 pr-24">
                {/* The video */}
                <div className="video-wrapper mb-5">
                  <video width="100%">
                    <source src="https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4" type="video/mp4"/>
                  </video>
                  <div className="cover d-flex justify-content-center align-items-center">
                    <button className="btn-play" type="button"><i className="fas fa-play fa-fw"/></button>
                  </div>
                  <div className="controls d-flex justify-content-between align-items-center">
                    <div>
                      <button className="btn-stream active" type="button">串流 01</button>
                      <button className="btn-stream" type="button">串流 02</button>
                    </div>
                    <div>
                      <button className="btn-action" type="button"><i className="fas fa-camera"/></button>
                      <button className="btn-action" type="button"><i className="fas fa-expand-arrows-alt"/></button>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
};
