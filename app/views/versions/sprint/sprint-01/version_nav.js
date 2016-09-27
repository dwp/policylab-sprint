var version_navigation = {
  levels: [
    {
      label: 'primary',
      items: [
        {
          // primary link text
          text: 'Cases', // Top level menu name
          // primary file name
          url: 'your-cases', // Link to tthe top level menu name
          // subnav
          items: [
            { 
              text: 'Current', // Sub menu item
              url: 'your-cases' // link for sub menu
            },
            { 
              text: 'Incoming',
              url: 'cases-incoming'
            },
            { 
              text: 'All your cases',
              url: 'cases-all'
            },
            { 
              text: 'Day in view',
              url: 'diary-day'
            },
            { 
              text: 'Week in view',
              url: 'diary-week'
            },
            { 
              text: 'Day in detail',
              url: 'diary-detail'
            }
          ]
        },




        {
          // primary link text
          text: 'Information',
          // primary link file name
          url: '#',
          // subnav
          items: [
            { 
              text: 'Link',
              url: ''
            },
            { 
              text: 'Link',
              url: ''
            },
            { 
              text: 'Link',
              url: ''
            }
          ]
        },



         {
          // primary link text
          text: 'Contact',
          // primary link file name
          url: '#',
          // subnav
          items: [
            { 
              text: 'Link',
              url: ''
            },
            { 
              text: 'Link',
              url: ''
            },
            { 
              text: 'Link',
              url: ''
            }
          ]
        },


        {
          text: 'Escalate',
          url: '#',
          // subnav
          items: [
            { 
              text: 'Link',
              url: ''
            },
            { 
              text: 'Link',
              url: ''
            },
            { 
              text: 'Link',
              url: ''
            }
          ]
        },




        {
          text: 'Refer',
          url: '#',
          // subnav
          items: [
            { 
              text: 'Link',
              url: ''
            },
            { 
              text: 'Link',
              url: ''
            },
            { 
              text: 'Link',
              url: ''
            }
          ]
        },



        {
          text: 'Reject',
          url: '#',
          // subnav
          items: [
            { 
              text: 'Link',
              url: ''
            },
            { 
              text: 'Link',
              url: ''
            },
            { 
              text: 'Link',
              url: ''
            }
          ]
        },


        {
          text: 'Close',
          url: '#',
          // subnav
          items: [
            { 
              text: 'Link',
              url: ''
            },
            { 
              text: 'Link',
              url: ''
            },
            { 
              text: 'Link',
              url: ''
            }
          ]
        }





      ]
    },
    {
      label: 'tertiary',
      items: [
        {
          text: 'User settings',
          url: 'user-settings'
        }
      ]
    }    
  ]
}

module.exports = version_navigation;