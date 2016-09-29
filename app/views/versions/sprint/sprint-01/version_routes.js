var qs = require('qs');
var url = require('url');
var _ = require('lodash');
var sitemap = require(__dirname + '/version_nav');

module.exports = function(router, config) {
  
  router.all(config.routes.step, function(req,res, next){
    
    var requestedPage = req.params.step,
    postData = req.body ? req.body : {},
    sessionData = req.session.data ? req.session.data : {},
    queryData = url.parse(req.url,true).query;
    
    var planData = [
      {
        wish: 'Name of wish',
        outcome: 'outcome text',
        obstacle: ['name of obstacle'],
        actions: [
          {
            task: 'Task title here 1',
            date_day: '01',
            date_month: '01',
            date_year: '2017'
          },
          {
            task: 'Task title here 2',
            date_day: '01',
            date_month: '02',
            date_year: '2017'
          },
          {
            task: 'Task title here 3',
            date_day: '01',
            date_month: '03',
            date_year: '2017'
          },
        ]
      }
    ];
    
    if (!sessionData.actions) {
      sessionData.actions = [];
    }
    
    // create a deep object of the setting the current prototype's nav data
    _.set(res.locals, 'prototype.current.sitemap', sitemap);

    switch(requestedPage) {
      
      // change requested page name to the page that was requested
      case 'store_action':
        
        sessionData.actions.push(postData);
        
        return res.redirect('plan');
        
      break;
      
    }
    
    next();
  
  });

  return router;
}
