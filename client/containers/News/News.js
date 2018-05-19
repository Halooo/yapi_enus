import './News.scss'
import React, { PureComponent as Component } from 'react'
import NewsTimeline from './NewsTimeline/NewsTimeline'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb'
import { Button } from 'antd'
import { getMockUrl } from '../../reducer/modules/news.js'
import Subnav from '../../components/Subnav/Subnav.js';

@connect(
  state => {
    return {
      uid: state.user.uid + ''
    }
  },
  {
    getMockUrl: getMockUrl
  }
)

class News extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mockURL:""
    }
  }
  static propTypes = {
    uid: PropTypes.string,
    getMockUrl: PropTypes.func
  }
  componentWillMount(){
    //const that = this;
    // this.props.getMockUrl(2724).then(function(data){
    //   const { prd_host, basepath, protocol } = data.payload.data.data;
    //   const mockURL = `${protocol}://${prd_host}${basepath}/{path}`;
    //   that.setState({
    //     mockURL: mockURL
    //   })
    // })
  }
  render () {
    return (
      <div>
        <Subnav
          default={'Activities'}
          data={[{
            name: 'Activities',
            path: '/news'
          }, {
            name: 'Test',
            path: '/follow'
          }, {
            name: 'Setting',
            path: '/follow'
          }]}/>
        <div className="g-row">
          <section className="news-box m-panel">
            <div className="logHead">
              <Breadcrumb />
              <div className="Mockurl">
                <span>Mock URL：</span>
                <p>{this.state.mockURL}</p>
                <Button type="primary">Download mock data</Button>
              </div>
            </div>
            <NewsTimeline/>
          </section>
        </div>
      </div>
    )
  }
}

export default News
