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
    
    // if (!sessionData.actions) {
    //   sessionData.actions = [];
    // }
    
    // create a deep object of the setting the current prototype's nav data
    _.set(res.locals, 'prototype.current.sitemap', sitemap);
    res.locals.planData = {};
    
    // employee data
    res.locals.planData.employee = [
      {
        wish: 'to recover from cancer and improve my mental health',
        outcome: 'feel healthy again',
        obstacle: ['name of obstacle'],
        actions: [
          {
            person: 'employee',
            task: 'book an appointment with GP to discuss referral services and try to speed things up.',
            date_day: '01',
            date_month: '01',
            date_year: '2017'
          },
          {
            person: 'employee',
            task: 'Task title here 2',
            date_day: '01',
            date_month: '02',
            date_year: '2017'
          },
          {
            person: 'employee',
            task: 'Task title here 3',
            date_day: '01',
            date_month: '03',
            date_year: '2017'
          }
        ]
      }
    ];
    
    // coach data
    res.locals.planData.coach = [
      {
        wish: 'to recover from cancer and improve my mental health',
        outcome: 'feel healthy again',
        obstacle: ['name of obstacle'],
        actions: []
      }
    ];
    
    // employer data
    res.locals.planData.employer = [
      {
        wish: 'to recover from cancer and improve my mental health',
        outcome: 'feel healthy again',
        obstacle: ['name of obstacle'],
        actions: []
      }
    ];
    
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
