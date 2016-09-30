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
              task: 'have a conversation with my employer about time off for medical appointments and how work can be covered whilst I\'m away',
              why: 'manage her workloads so that she can access treatment services',
              date_day: '01',
              date_month: '01',
              date_year: '2017'
            },
            {
              person: 'employee',
              task: 'find out more about internal support groups in work',
              why: 'relieve stress and improve well being',
              date_day: '01',
              date_month: '02',
              date_year: '2017'
            },
            {
              person: 'employee',
              task: 'Have regular catch ups with employer about workloads and developing skills',
              why: 'feel more supported at work and motivated',
              date_day: '01',
              date_month: '02',
              date_year: '2017'
            },
            {
              person: 'employer',
              task: 'Have regular catch ups with Yamin about workloads and developing skills',
              date_day: '01',
              date_month: '02',
              date_year: '2017'
            },
            {
              person: 'employer',
              task: 'Tell Yasmin about any internal support groups',
              date_day: '01',
              date_month: '02',
              date_year: '2017'
            },
            {
              person: 'employer',
              task: 'Allocate Yasmin’s workload while she’s away at appointments.',
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
      case 'reset':
        req.session.destroy();
        return res.redirect('index');
        break;
      // change requested page name to the page that was requested
      case 'user':
      case 'advisor':
      
        console.log(requestedPage);
        console.log(subpage);
        
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
