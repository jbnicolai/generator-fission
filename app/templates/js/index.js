'use strict';

//switching from this context and branching into coffeeGenerator
module.exports = function(jsGenerator){
  if(jsGenerator.createWithServer){
    //populate server
  }
  //populat client
  jsGenerator.src.copy('js/client/gulpfile.js', 'gulpfile.js');
  jsGenerator.src.copy('js/start.js', 'start.js');
  jsGenerator.src.copy('js/client/app.js', 'client/app.js');
  jsGenerator.src.copy('js/client/start.js', 'client/start.js');
  jsGenerator.src.copy('js/client/models/Item.js', 'client/models/Item.js');
  jsGenerator.src.copy('js/client/pages/Index/Index.View.js', 'client/pages/Index/Index.View.js');
  jsGenerator.src.copy('js/client/pages/NotFound/NotFound.View.js', 'client/pages/NotFound/NotFound.View.js');

};
