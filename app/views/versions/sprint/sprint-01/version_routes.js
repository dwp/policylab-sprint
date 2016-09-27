var qs = require('qs');
var url = require('url');
var _ = require('lodash');
var sitemap = require(__dirname + '/version_nav');

module.exports = function(router, config) {
  
  router.all(config.routes.step, function(req,res, next){
    
    var requestedPage = req.params.step,
    postData = req.body || {};
    
    // create a deep object of the setting the current prototype's nav data
    _.set(res.locals, 'prototype.current.sitemap', sitemap);

    switch(requestedPage) {
      
      // change requested page name to the page that was requested
      case 'request_page_name_here': 
        
        // do some logic stuff here and then typically return a render or redirect
      
        return res.redirect('index');
        
      break;
      
    }
    
    next();
  
  });

  return router;
}
