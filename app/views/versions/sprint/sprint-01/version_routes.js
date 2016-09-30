var qs = require('qs');
var url = require('url');
var _ = require('lodash');
var sitemap = require(__dirname + '/version_nav');

module.exports = function(router, config) {
  
  router.all(config.routes.step, function(req,res, next){
    
    var requestedPage = req.params.step,
    subpage = req.params.substep,
    postData = req.body ? req.body : {},
    sessionData = req.session.data ? req.session.data : {},
    queryData = url.parse(req.url,true).query;
    
    // if (!sessionData.actions) {
    //   sessionData.actions = [];
    // }
    
    // create a deep object of the setting the current prototype's nav data
    _.set(res.locals, 'prototype.current.sitemap', sitemap);
    res.locals.query = queryData;
    
    if(!sessionData.planData) {
      sessionData.planData = {};
    }
    
    if (!sessionData.planData.employee) {
      // employee data
      sessionData.planData.employee = [
        {
          wish: 'to recover from tummy problem and improve my mental health',
          outcome: 'feel healthy again',
          actions: [
            {
              person: 'employee',
              task: 'register for online counselling with The Big White Wall',
              why: 'overcome her mental health problems',
              date_day: '01',
              date_month: '01',
              date_year: '2017'
            },
            {
              person: 'employee',
              task: 'speak to stepchange.com about ways of getting debt free',
              why: 'manage her money and relieve some stress',
              date_day: '01',
              date_month: '02',
              date_year: '2017'
            },
            {
              person: 'employee',
              task: 'find out about local gardening clubs and join up',
              why: 'feel less isolated',
              date_day: '01',
              date_month: '02',
              date_year: '2017'
            },
            {
              person: 'employer',
              task: 'find out about any internal support groups and contact them on [ name ]’s behalf',
              date_day: '01',
              date_month: '02',
              date_year: '2017'
            },
            {
              person: 'employer',
              task: 'allocate [ name ]’s workload while she’s away at appointments',
              date_day: '01',
              date_month: '02',
              date_year: '2017'
            }
          ]
        },
        {
          wish: 'to get out more and meet new people',
          outcome: 'feel less isolated and lonely',
          actions: [
            {
              person: 'employee',
              task: 'Join a support group to meet others in similar situation.',
              why: 'feel more supported and motivated',
              date_day: '01',
              date_month: '01',
              date_year: '2017'
            },
            {
              person: 'employee',
              task: 'Join a local gardening group to meet new people and learn new skills.',
              why: 'relieve stress and improve well being',
              date_day: '01',
              date_month: '02',
              date_year: '2017'
            }
          ]
        }
      ];  
    }
    
    if (!sessionData.planData.advisor) {
      // coach data
      sessionData.planData.advisor = [
        {
          wish: 'to recover from tummy problem and improve my mental health',
          outcome: 'feel healthy again',
          actions: []
        },
        {
          wish: 'to get out more and meet new people',
          outcome: 'feel less isolated and lonely',
          actions: []
        }
      ]; 
    }
    
    // employer data
    sessionData.planData.employer = [
      {
        wish: 'to recover from cancer and improve my mental health',
        outcome: 'feel healthy again',
        obstacle: ['name of obstacle'],
        actions: []
      }
    ];
    
    switch(requestedPage) {
      // change requested page name to the page that was requested
      case 'user':
      case 'advisor':
        
        if (subpage == 'store_action') {
          
          var thisRecord,
              newData = {
                why: postData.why,
                task: postData.task,
                person: postData.person.toLowerCase(),
                date_day: postData.date_day,
                date_month: postData.date_month,
                date_year: postData.date_year
              };
          
          /** I did this at 06:17 in the morning after a near 20 hour day! */
          
          if(postData.mode == 'edit') {
            Object.assign(sessionData.planData[(requestedPage == 'user' ? 'employee' : requestedPage)][parseInt(postData.wishID)].actions[parseInt(postData.actionID)], newData);
          } else {
            sessionData.planData[(requestedPage == 'user' ? 'employee' : requestedPage)][parseInt(postData.wishID)].actions.push(newData);
          }
          
          return res.redirect('plan');
          
        }
        
        break;
      
    }
    
    next();
      
  });

  return router;
}
