(function(){
  if(!! window.$) {
    
    /**
     * generic debounce function
     * @method debounce
     */
    function debounce(func, wait, immediate) {
        var timeout;
        return function() {
            var context = this, args = arguments;
            var later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    };
    
    var settings = {
        selector: '.js-payment-adjust-field',
        amountInputSel: '.js-payment-adjust-field__amount',
        errorMessageSel: '.js-error-message',
        hiddenClass: 'js-hidden',
        errorClass: 'error',
        predictionSel: '.js-payment-adjust-field__prediction',
        predictionDateSel: '.js-payment-adjust-field__prediction__date',
        formSel: ".js-validate-form",
        preventedClass: 'js-prevented'
    };
    
    var limitCharacters = {
      
      config: {
        selector: '.js-limit-characters'
      },
      
      init: function() {
        var $limitedFields = $(this.config.selector);
        
        if(!! $limitedFields.length) {
          
          $limitedFields.each(function(index,elm){
            
            var $thisField = $(elm),
                totalCharacters = $thisField.data().limit,
                hintText = $thisField.data().hint;
                $hint = $('<p class="form-hint">' + totalCharacters + ' ' + hintText + '</p>').insertAfter($thisField);
            
            $thisField.on('keyup', function(e){
              var currentCount = $thisField.val().length,
                  remaining = parseInt(totalCharacters - currentCount);   
              $hint.text(parseInt(totalCharacters - currentCount) + ' ' + hintText);
            }); 
            
          }.bind(this))
          
        }
        
      }
      
    }
    
    var calculateEndDate = function (data) {
      
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
          return console.log('There is no payment frequency in the session data!');
        }
      } else {
        return console.log('There is no session data!');
      }
    };
    
    var paymentAdjustField = {
      
      config: settings,
      
      /**
       * displays the date of the predicted repayment based on Chris's calculations
       */
      handleRepaymentPrediction: function handleRepaymentPrediction($module, data, amount){
        
        var $predictionContainer = $module.find(this.config.predictionSel),
            $predictionDate = $predictionContainer.find(this.config.predictionDateSel),
            predictionDateText = calculateEndDate({
              debt_amount: data.debtAmount,
              payment_amount: amount,
              payment_frequency: data.paymentFrequency
            });
            
            $predictionDate.text(predictionDateText);
            $predictionContainer.removeClass(this.config.hiddenClass);
      },
      
      /**
       * rough and ready error handler for the field, sets a bunch of classes or unsets them depending on flag
       * @method errorHandler
       * @param  {Object}     $module   the jQuery object of the field module
       * @param  {String}     errorText string of text to render in the correct error element 
       */
      errorHandler: function errorHandler($module, errorText) {
        var $form = $module.closest(this.config.formSel);
        var $errorMessage = $module.find(this.config.errorMessageSel);
        var $predictionContainer = $module.find(this.config.predictionSel);
        $predictionContainer.addClass(this.config.hiddenClass);
        if(errorText === 'reset') {
          $module.removeClass(this.config.errorClass);
          $errorMessage.addClass(this.config.hiddenClass);
          $errorMessage.text("");
          $predictionContainer.removeClass(this.config.hiddenClass);
          $form.removeClass(this.config.preventedClass);
        } else {          
          $module.addClass(this.config.errorClass);
          $errorMessage.removeClass(this.config.hiddenClass);
          $errorMessage.text(errorText);
          $predictionContainer.addClass(this.config.hiddenClass);
          $form.addClass(this.config.preventedClass);
        }
        
      },
      
      makeCurrency: function makeCurrency(val) {
        return parseFloat(Number(val).toFixed(2));
      },
      
      /**
       * proccess the input as the result of an event.
       * @method processInput
       * @param  {Object}     e             event Object
       * @param  {Object}     $module       jQuery object of the module
       * @param  {Object}     $amountInput jQuery object of the module's input
       * @param  {Object}     moduleData    Object of the data associated with this module (via data attributes)
       */
      processInput: function processInput(e, $module, $amountInput, moduleData) {
        
        var currentValue = $amountInput.val(),
            currentValueNum = this.makeCurrency(currentValue),
            minAmount = this.makeCurrency(moduleData.minAmount),
            maxAmount = this.makeCurrency(moduleData.maxAmount);
        
        if(currentValue.length < 1) {
          // if(e.type == "blur") {
              this.errorHandler($module, 'Please enter an amount');
          // }
        } else {
          if(currentValueNum > minAmount) {
            if(currentValueNum < maxAmount) {
              this.errorHandler($module, 'reset');
              this.handleRepaymentPrediction($module, moduleData, currentValueNum);
            } else {
              // if(e.type == "blur") {
                  this.errorHandler($module, moduleData.textGreaterthan);
              // }
            }
          } else {
            // if(e.type == "blur") {
                this.errorHandler($module, moduleData.textLessthan);
            // }
          }  
        }
      },
      
      /**
       * for each 'module' handle it's events and state
       */
      handleModule: function handleModule($module) {
        
        var $amountInput = $module.find(this.config.amountInputSel),
            moduleData = $module.data();
            $parentForm = $module.closest("form");
        
        if(!! $parentForm.length) {
          $parentForm.addClass(this.config.preventedClass);
        }
        
        $amountInput.on('keyup blur', debounce(function(e){
          this.processInput(e, $module, $amountInput, moduleData);
        }.bind(this), (moduleData.typeDelay ? moduleData.typeDelay : 700)).bind(this));
        
      },
      
      /**
       * init the payment adust fields - checks for existence,
       * if so loops each and handles them.
       */
      init: function init() {
        var $module = $(this.config.selector);
        if(!! $module.length){
          $module.each(function(index,$elm){            
            this.handleModule($($elm));
          }.bind(this));
        }
      }
    };
    
    var basicFormValidation = {
      
      config: settings,
      
      /**
       * basic temp validation, prevents the form submitting if there are any errors 
       * and the catch 'prevented' class is present on the form
       * @method handleForm
       * @param  {Object}   $form jQuery object for the individual form being handled
       * @return {Bool}     Will return true / false for the form action
       */
      handleForm: function handleForm($form) {
        $form.on('submit', function(e){
          
          var $errors = $form.find('.' + this.config.errorClass);
          
          if($errors.length > 0 || $form.hasClass(this.config.preventedClass)) {
            // hack for now to trigger the field validation... time is against me at the moment.
            $form.find('input').trigger('blur');
            $errors.find(this.config.errorMessageSel).animate({ backgroundColor: jQuery.Color('yellow') }, 450).animate({ backgroundColor: jQuery.Color('transparent') }, 450);
            return false;
          } else {
            return true;
          }
        
        }.bind(this));
        
      },
      
      /**
       * loop each 'form' and pass them to the handler
       */
      init: function init() {
        var $forms = $(this.config.formSel);
        if(!! $forms.length) {
          $forms.each(function(index,elm){
            var $thisForm = $(elm);
            $thisForm.addClass(this.config.preventedClass);
            this.handleForm($thisForm);
          }.bind(this));
        }
      }
      
    }
    
    $(function(){
      basicFormValidation.init();
      paymentAdjustField.init();
      limitCharacters.init();
    });
    
  } else {
    console.log('You don\'t some to have jQuery available');
  }
  
})();