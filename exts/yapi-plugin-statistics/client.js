/**
 * Created by gxl.gao on 2017/10/24.
 */
import StatisticsPage from './statisticsClientPage/index'

module.exports = function () {
  this.bindHook('header_menu', function (menu) {
    menu.statisticsPage = {
      path: '/statistic',
      name: 'System Info',
      icon: 'bar-chart',
      adminFlag: true
    }
  })
  this.bindHook('app_route', function (app) {
    app.statisticsPage = {
      path: '/statistic',
      component: StatisticsPage
    }
  })


}
