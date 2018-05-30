module.exports = {
  "title": "YApi API Management Platform",
  "keywords": "API Management, API Documentation",
  "author": "ymfe",
  "description": "YApi is easy to use and improves your work efficiency",
  "plugins": ["search", "img-view"],
  "dist": "static/doc",
  "pluginsConfig": {
    "import-asset": {
      "css": "web.css"
    } 
  },
  version: require('./package.json').version,
  markdownIt: function(md){
    md.use(require('markdown-it-include'), __dirname)
  }
}
