var _ = require('lodash');
var qs = require('qs');
var moment = require('moment');

module.exports = function(env) {
  var nunjucksSafe = env.getFilter('safe');
  /**
   * Instantiate object used to store the methods registered as a
   * 'filter' (of the same name) within nunjucks. You can override
   * gov.uk core filters by creating filter methods of the same name.
   * @type {Object}
   */
  var filters = {};

/**
	 * ensure input is an array
	 * @param  {*} i an item
	 * @return {Array}   the item as an array
	 */
	filters.plural = function plural(i) {
		return Array.isArray(i) ? i : typeof i !== 'undefined' ? [i] : [];
	};

	/**
	 * ensure input is not an array
	 * @param  {*} a any variable
	 * @return {*}   anything that isn't an array.
	 */
	filters.singular = function singular(a) {
		return _.isArray(a) ? a[0] : a;
	};

	/**
	 * converts an array of objects or singular object to a list of pairs.
	 * @param  {Array|Object} a  an array of objects or singular object
	 * @param  {String} (optional) kp key property name, used if array of objects. defaults to 'key'
	 * @param  {String} (optional) vp value property name, used if array of objects. defaults to 'value'
	 * @return {Array}    array of key-value arrays
	 */
	filters.pairs = function pairs(a, kp, vp) {
		return _.isPlainObject(a) ? Object.keys(a).map(function(k) { return ! _.isEmpty(k) ? [k, a[k]] : '' }) :
					 _.isArray(a) ? a.map(function(b) { return _.isPlainObject(b) ? [ _.get(b, kp || 'key'), _.get(b, vp || 'value') ] : b }) :
					 a;
	};

	/**
	 * maps pair values to object keys.
	 * @param  {Array|Object} p  an array
	 * @param  {String} (optional) k1 key 1 will point to first value in array
	 * @param  {String} (optional) k2 key 2 will point to second value in array
	 * @return {Object} 	object with two key/values
	 */
	filters.unpackPair = function unpackPair(p, k1, k2) {
		var o = {}; return ( o[k1] = p[0], o[k2] = p[1], o);
	};

	/**
	 * prefixes each item in a list
	 * @param  {*} is a list of items, or a single item.
	 * @param  {String|Function} p  a string or function to prefix the first item with.
	 * @return {Array}    a list of prefixed items.
	 */
	filters.prefix = function prefix(is, p) {
		return filters.plural(is).map(function(i, index) {
			return _.isFunction(p) ? p(i, index) : _.isArray(p) ? p[index] + i : p + i;
		});
	};

	/**
	 * in a list of lists (is), prefixes a string (p) to the first item of the inner list
	 * @param  {Array} is a list of lists
	 * @param  {String|Function} p  a string or function to prefix the first item with
	 * @return {Array}    a list of items with the first item of the inner item prefixed
	 */
	filters.prefixFirst = function prefixFirst(is, p) {
		return filters.plural(is).map(function(i) {
			return _.isArray(i) ? (i[0] = _.isFunction(p) ? p(i[0]) : i[0], i) : i;
		});
	};

	/**
	 * postfixes each item in a list
	 * @param  {*} is a list of items, or a single item.
	 * @param  {String|Number} p  used to postfix item.
	 * @return {Array}    a list of postfixed items.
	 */
	filters.postfix = function postfix(is, p) {
		return filters.plural(is).map(function(i) { return _.isArray(i) ? filters.postfix(i, p) : i + p });
	};

	/**
	 * wrap a string or a list of strings in two strings.
	 * @param  {Array|String} w the string or list of strings to wrap
	 * @param  {String} b the before string
	 * @param  {String} a the after string
	 * @return {Array}   the wrapped item
	 */
	filters.wrap = function wrap(w,a,b) {
		return a + w + b;
	};

	/**
	 * gets the css modifiers of a base class names.
	 * @param  {String} b  base class name
	 * @param  {Array|String} ms modifiers
	 * @return {string}    modifiers
	 */
	filters.modifiers = function modifiers(b, ms) {
		return filters.plural(ms).map(function(m) { return b + '--' + m }).join(' ');
	};

	/**
	 * prepends a base class with the modifiers of the base class.
	 * @param  {String} b  base class
	 * @param  {Array|String} ms modifiers
	 * @return {String}    base class name and modifiers
	 */
	filters.withModifiers = function withModifiers(b, ms) {
		return [b].concat(filters.modifiers(b, ms) || []).join(' ');
	};

	/**
	 * composes the classes for the component
	 * @param  {String} b  base module class
	 * @param  {Object} md the metadata object
	 * @return {String}    component classes
	 */
   filters.setClasses = function setClasses(b, md) {
		return (md = md || {}, [filters.withModifiers(b, md.modifiers)].concat(md.classes || []).join(' '));
	};

  /**
  * checks if string contains passed substring
  * @param {*} a variable - the string you want to test
  * @param {String} the string you want to test for
  * @return {Boolean} true if found else false
   */
  filters.contains = function contains(a, s) {
    return a && s ? !!~a.indexOf(s) : false;
  };
  
  /**
   * filter for javascript substring
   * @method substring
   * @param  {string}  s the string to be manipulated
   * @param  {integer}  p the position within the string
   * @return {string}    the transformed string
   */
  filters.substring = function substring(s,p) {
    return s.substring(p);
  }
  
  /**
   * logs an object in the template to the console on the client.
   * @param  {Any} a any type
   * @param  {bool} fancy will make the log message stand out a bit
   * @return {String}   a script tag with a console.log call.
   * @example {{ "hello world" | log }}
   */
  filters.log = function log(a, fancy) {
  	return nunjucksSafe('<script>console.log' + '(' + (fancy? '"%c%s","background: yellow; font-size: 14px;",' : '') + JSON.stringify(a, null, '\t') + ');</script>');
  };
  
  /**
	 * deep merge that supports concating arrays & strings.
	 * @param  {Object} o1           a plain object to merge
	 * @param  {Object} o2           a plain object to merge
	 * @param  {Boolean} mergeStrings will merge strings together if true
	 * @return {Object}              the resulting merged object
	 */
	filters.deeperMerge = function deeperMerge(o1, o2, mergeStrings) {

		mergeStrings = typeof mergeStrings !== undefined ? mergeStrings : false;

		// exit conditions
		if      ( ! o1 && ! o2 )          { return; }
		else if ( ! _.isPlainObject(o1) ) { return o2; }
		else if ( ! _.isPlainObject(o2) ) { return o1; }

		return _
			.union(Object.keys(o1), Object.keys(o2))
			.map(function(k) {
				return [k, (
					( typeof o1[k] === 'string' && typeof o2[k] === 'string' ) ? ( mergeStrings ? o1[k] + o2[k] : o2[k] ) :
					( _.isPlainObject(o1[k]) || _.isPlainObject(o2[k]) ) ? deeperMerge(o1[k], o2[k], mergeStrings) :
					( _.isArray(o1[k]) && _.isArray(o2[k]) ) ? o1[k].concat(o2[k]) :
					( o1[k] && !o2[k] ) ? o1[k] : o2[k]
				)];
			})
			.reduce(function(a, b) { return (a[b[0]] = b[1], a) }, {});
	};
  
  /**
   * converts string to camelCase
   * @method toCamelCase
   * @param  {string}    s original string
   * @return {string}      converted string
   */
	filters.toCamelCase = function toCamelCase(s) {
		return s.trim().split(/-| /).reduce(function (pw, cw, i) {
			return pw += (i === 0 ? cw[0].toLowerCase() : cw[0].toUpperCase()) + cw.slice(1);
		}, '');
	};
  
  /**
   * hypthenates given string
   * @method toHyphenated
   * @param  {string}     s original string
   * @return {string}       converted string
   */
	filters.toHyphenated = function toHyphenated(s) {
		return s.trim().toLowerCase().replace(/\s+/g, '-');
	};
  
  /**
   * takes the session data object and calculates an end payment date based on
   * the users answers
   * @method calculateEndDate
   * @param  {object}         session the users data submitted in the form-hint
   * @return {String}                 Date string derived from the user's input
   */
  filters.calculateEndDate = function calculateEndDate(data) {
    
    if (data) {
      // we need the payment frequency
      if(!! data.payment_frequency) {
        // calculate the number of payments that will need to be made
        var numberOfPayments = Math.ceil(data.debt_amount / data.payment_amount),
            endDate = new Date();
        
        // use the frequency to calculate the date
        switch(data.payment_frequency) {
          case 'weekly':
            endDate.setDate(numberOfPayments * 7);
          break;        
          case 'fortnightly': 
            // console.log("It's fortnightly");
            endDate.setDate(numberOfPayments * 14);
          break;
          case 'four-weekly': 
            endDate.setDate(numberOfPayments * 28);
          break;
          case 'monthly': 
            endDate.setMonth(endDate.getMonth() + numberOfPayments);
          break;
        }
        
        // return the date in a formatted string
        return ("1 " + endDate.toLocaleString("en-gb", { month: "long" }) + " " + endDate.getUTCFullYear());
        
      } else {
        return filters.log('There is no payment frequency in the session data!');
      }
    } else {
      return filters.log('There is no session data!');
    }
  };
  
  filters.getPaymentAmount = function getPaymentAmount(data) {
    if(data) {
      if(!! data.payment_amount) {
        return parseFloat(data.payment_amount).toFixed(2);
      }
    } else {
      return filters.log('There is no session data!');
    }
  };
  
  filters.getPaymentCycle = function getPaymentCycle(data) {
    if(data) {
      if(!! data.payment_frequency) {
        return data.payment_frequency;
      }
    } else {
      return filters.log('There is no session data!');
    }
  };
  
  filters.getTotalDebt = function getTotalDebt(data) {
    if(data) {
      if(!! data.debt_amount) {
        return data.debt_amount;
      }
    } else {
      return filters.log('There is no session data!');
    }
  };
  
  /**
   * converts number to decimal 
   * @method toDecimal
   * @param  {Number}  num the number to be converted
   * @param  {Number}  p   the number of decimal places (defaults to 2)
   * @return {Number}      the converted number
   */
  filters.toDecimal = function toDecimal(num,p){
    if(num && typeof num == 'number'){
      return Number(num).toFixed(!! p ? p : 2);
    }
  };
  
  filters.getMinimalAmount = function getMinimalAmount(data) {
    if(data) {
      if(!! data.payment_frequency) {
        
        var finalAmount,
            minimalAmount = 3.40;
        
        // use the frequency to calculate the date
        switch(data.payment_frequency) {
          case 'weekly':
            finalAmount = minimalAmount;
          break;        
          case 'fortnightly': 
            // console.log("It's fortnightly");
            finalAmount = minimalAmount * 2;
          break;
          case 'four-weekly': 
            finalAmount = minimalAmount * 4;
          break;
          case 'monthly': 
            finalAmount = (minimalAmount * 4) + minimalAmount;
          break;
        }
        
        // return amount but converted to 2 decimal places
        return filters.toDecimal(finalAmount);
        
      }
    } else {
      return filters.log('There is no session data!');
    }
  };
  
  filters.getFromSession = function getFromSession(path){
    var session = env.globals.sessionData;
    return path && session ? _.get(session,path) : 'No path or session present';
  };
  
  filters.pct = function pct(amount, percent) {
    return ((parseInt(amount)/100)* parseInt(percent)).toFixed(2);
  };
  
  filters.toPercentageValue = function toPercentageValue(total,divisions,index) {
    if(total && divisions && index) {
      
      var splitInto = (divisions.constructor === Array ? divisions.length : parseInt(divisions)),
          percentageSplits,
          index = index -1;
          
      switch (splitInto) {
        case 1:
          percentageSplits = [1];
        break;
        case 2:
          percentageSplits = [0.60, 0.40];
        break;
        case 3:
          percentageSplits = [0.20,0.50,0.30];
        break;
        case 4:
          percentageSplits = [0.20,0.20,0.30,0.30];
        break;
        case 5:
          percentageSplits = [0.05,0.25,0.10,0.40,0.20];
        break;
        case 6:
          percentageSplits = [0.30,0.10,0.10,0.30,0.10,0.10];
        break;
      }
      
      return parseFloat(parseInt(total) * percentageSplits[parseInt(index)]).toFixed(2);
      
    }
  };
  
  filters.arrayContains = function arrauContains(a,s) {
    return a.constructor === Array ? _.some(a, _.method('includes', s ? s : 'no string')) : log("You didn't pass me an array!");
  }
  
  filters.querystringify = function querystringify(o) {
    return o ? qs.stringify(o) : log('You didn\'t pass me an object');
  };

	/**
	 * writes the context as the value of an attribute
	 * @param  {String} v the attribute value
	 * @param  {String} a attribute name
	 * @return {String}
	 */
  filters.attr = function attr(v, a, p) {
    return (!_.isEmpty(v) ? (p || '') + a + '="' + v + '"' : '');
  };
  
  filters.get = _.get;
  filters.find = _.find;
  
  filters.getUserNameFromEmail = function getUserNameFromEmail(email) {
    return (email ? email.split('@')[0].replace('.',' ') : false);
  };
  
	/**
	 * translate characters in a string
	 * @param  {String} s  the string to translate
	 * @param  {String} ss the substring to replace
	 * @param  {String} r  the replacee string
	 * @param  {String} f  regex flags, 'g' by default
	 * @return {String}    a translated string
	 */
	filters.trC = function trC(s, ss, r, f) {
		return ((s||'').replace(ss,r));
	};
  
  /**
   * creates rearranges values and creates new date object
   * @param  {String} d   A date string (must be) formatted (d)d/(m)m/yyy - in parens means optional
   * @return {String}     a javascript date string
   */
  filters.newDate = function date(d) {
  	var dateArr = d.split('/');
  	return dateArr.length === 3 ? new Date(dateArr[2], parseInt(dateArr[1]) - 1, dateArr[0]) : NaN;
  };

  /**
   * returns a standard gov.uk date from a string using momentjs
   * moment documentation: http://momentjs.com/docs/
   * @method function
   * @param  {string} d date e.g 09/12/1981 or 9-12-1981
   * @param  {string} f moment.js format string (to override the default if needed)
   * @return {string} date string as per the current gov.uk standard 09/12/1981 -> 09 December 1981
   */
  filters.formatDate = function(d,f) {
    return moment(filters.newDate(d)).locale('en-gb').format(f ? f : 'LL');
  };
  
  filters.taskPerson = function(person) {
    if(person == 'employee') {
      return 'I need to';
    } else if (person == 'coach') {
      return 'My coach needs to';
    } else if (person == 'employer') {
      return 'My employer needs to';
    }  
  }

  /* ------------------------------------------------------------------
    keep the following line to return your filters to the app
  ------------------------------------------------------------------ */
  return filters;

};
