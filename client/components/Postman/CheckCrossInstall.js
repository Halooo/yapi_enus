import React from 'react'
import { Alert } from 'antd'
import PropTypes from 'prop-types'

exports.initCrossRequest = function initCrossRequest(fn) {
  let startTime = 0;
  let _crossRequest = setInterval(() => {
    startTime += 500;
    if (startTime > 5000) {
      clearInterval(_crossRequest);
    }
    if (window.crossRequest) {
      clearInterval(_crossRequest);
      fn(true)
    } else {
      fn(false)
    }
  }, 500)
  return _crossRequest;
}

CheckCrossInstall.propTypes = {
  hasPlugin: PropTypes.bool
}

function CheckCrossInstall(props) {
  const hasPlugin = props.hasPlugin;
  return <div className={hasPlugin ? null : 'has-plugin'} >
    {hasPlugin ? '' : <Alert
      message={
        <div>
          Important：Current API testing requires Chrome and chrome plugin, please add the plugin through:
          <div>
            <a
              target="blank"
              href="https://chrome.google.com/webstore/detail/cross-request/cmnlfmgbjmaciiopcgodlhpiklaghbok?hl=en-US"
            >[Google Store]</a>
          </div>
          <div>
            <a
              target="blank"
              href="/api/interface/download_crx"
            > [Download] </a>
            <span> unzip and move .crx to chrome://extensions/ </span>
            <a
              target="blank"
              href="http://www.jianshu.com/p/12ca04c61fc6"
            > [More details] </a>
          </div>
        </div>
      }
      type="warning"
    />
    }
  </div>
}

export default CheckCrossInstall
