
// import {message} from 'antd'


function exportData(exportDataModule,pid){


    exportDataModule.html = {
        name: 'html',
        route: `/api/plugin/export?type=html&pid=${pid}`,
        desc: 'Export APIs as html document'
    }
    exportDataModule.markdown = {
        name: 'markdown',
        route: `/api/plugin/export?type=markdown&pid=${pid}`,
        desc: 'Export APIs as markdown document'
    },
    exportDataModule.json = {
        name: 'json',
        route: `/api/plugin/export?type=json&pid=${pid}`,
        desc: 'Export APIs as json document, this can be imported by other users'
    }
    // exportDataModule.pdf = {
    //     name: 'pdf',
    //     route: `/api/plugin/export?type=pdf&pid=${pid}`,
    //     desc: '导出项目接口文档为 pdf 文件'
    // }
}



module.exports = function(){
  this.bindHook('export_data', exportData)
}