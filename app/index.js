'use strict';

var path = require('path');
var yeoman = require('yeoman-generator');
var yosay = require('yosay');


var fissionCoffee = require(path.join(__dirname,'templates/coffee'));
var fissionJs = require(path.join(__dirname, 'templates/js'));
var FissionGenerator = yeoman.generators.Base.extend({
  initializing: function () {
    //this.pkg = require('../package.json');
    this.option('coffee');

  },

  prompting: function () {
    var done = this.async();

    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the dazzling Fission generator!'
    ));

    var prompts = [{
        type: 'input',
        name: 'projectName',
        message: 'Your project name: ',
        default: 'fissionProject'
      },
      {
        type: 'confirm',
        name: 'createWithServer',
        message: 'Would you like to create with a server?',
        default: true
      },
      {
        type: 'list',
        name: 'authentication',
        message: 'Choose an authentication method: ',
        choices: ['Twitter', 'Facebook'] //,'email/username'] // email does not function
      }];

    this.prompt(prompts, function (props) {
      this.createWithServer = props.createWithServer;
      this.projectName = props.projectName;
      this.authChoice = props.authentication;
      console.log(this.authChoice);
      done();
    }.bind(this));
  },

  configuring: function() {
  },

  writing: {
    app: function () {
      this.dest.mkdir(this.projectName);
      this.destinationRoot(this.projectName);

      if(this.options.coffee){
        this.config.set({'coffee': 'true'});
      }
      else{
        this.config.set({'coffee': 'false'});
      }

      //create client directory
      this.dest.mkdir('client');
      this.dest.mkdir('client/css');
      this.dest.mkdir('client/models');
      this.dest.mkdir('client/pages');
      this.dest.mkdir('client/pages/Index');
      this.dest.mkdir('client/pages/NotFound');


      //copy in shared files
      this.src.copy('shared/client/index.html', 'client/index.html');
      this.src.copy('shared/client/css/app.styl', 'client/css/app.styl');
      this.src.copy('shared/client/pages/Index/Index.styl', 'client/pages/Index/Index.styl');

      if(this.createWithServer){
        this.dest.mkdir('server');
        this.dest.mkdir('server/config');
        this.dest.mkdir('server/db');
        this.dest.mkdir('server/http/apis');
        this.dest.mkdir('server/http/express');
        this.dest.mkdir('server/http/passport');
        this.dest.mkdir('server/lib');
        this.dest.mkdir('server/models');
        this.dest.mkdir('server/user');
        this.dest.mkdir('server/seed');
        this.dest.mkdir('server/test');
        this.dest.mkdir('server/test/lib');
        this.dest.mkdir('server/test/user');

        //require server package.json
        this.pkg = require(path.join(__dirname,'templates/_withServerPackage.json'));
        this.src.copy('_withServerPackage.json', 'package.json');
      }
      else{
        this.pkg = require(path.join(__dirname,'templates/_withoutServerPackage.json'));
        this.src.copy('_withoutServerPackage.json', 'package.json');
      }

      if(this.options.coffee){
         this.npmInstall(['coffee-script'], {'save': true}, function(err){
           if(err){console.log('err installing dependencies');}
           else{console.log('installed coffee to pkg.json');}
         });
         this.npmInstall(['coffeeify'], {'savedev': true}, function(err){
           if(err){console.log('err installing dev dependencies');}
           else{console.log('Installed dev coffee to pkg.json-dev');}
         });
        fissionCoffee(this);
      }
      else{
        fissionJs(this);
      }
    },

    projectfiles: function () {
      this.src.copy('editorconfig', '.editorconfig');
      this.src.copy('jshintrc', '.jshintrc');
    }
  },

  end: function () {
    var toInstall = [];
    var dependencies = this.pkg.dependencies;

    for(var k in dependencies){
      toInstall.push(k);
      console.log('depends: '+k);
    }

    for (var x in this.pkg.devDependencies){
      toInstall.push(x);
      console.log('devDepends: '+x);
    }

    this.npmInstall(toInstall, function(err){
      if(err) {console.log('Err installing dependencies');}
      else{console.log('dependencies have been installed');}
    });
  }
});

module.exports = FissionGenerator;
