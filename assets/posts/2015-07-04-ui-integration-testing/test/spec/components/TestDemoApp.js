'use strict';
require('babel-core/polyfill');

let {mouse} = require('effroi-as-promised')(require('effroi'));
let $ = require('jquery');

describe('TestDemoApp', () => {
  let React = require('react/addons');
  let TestDemoApp, component;

  beforeEach(function(){
    jasmine.Ajax.install();
    this.container = document.createElement('div');
    this.container.id = 'content';
    document.body.appendChild(this.container);

    TestDemoApp = require('components/TestDemoApp.js');
    component = React.createElement(TestDemoApp);
  });

  afterEach(function(){
     this.container.parentElement.removeChild(this.container);
     jasmine.Ajax.uninstall();
  });

  it('should create a new instance of TestDemoApp', () => {
    expect(component).toBeDefined();
  });

  it('should query for apples when the image clicked', ()=>{    
    mouse.click($(".the-image")).then(()=>{
      expect(jasmine.Ajax.requests.count()).toBe(1);
      var request = jasmine.Ajax.requests.mostRecent();
      expect(request.url).toBe('/apples');
      request.respondWith('fooey');
    });
  });

});
