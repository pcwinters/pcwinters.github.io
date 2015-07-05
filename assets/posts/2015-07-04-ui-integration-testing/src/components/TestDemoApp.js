'use strict';

var React = require('react/addons');
var ReactTransitionGroup = React.addons.TransitionGroup;

// CSS
require('normalize.css');
require('../styles/main.css');

var imageURL = require('../images/yeoman.png');

var TestDemoApp = React.createClass({
  onImageClick: function(){
  	$.get('/apples');
  },
  render: function() {
    return (
      <div className="main">
        <ReactTransitionGroup transitionName="fade">
          <img src={imageURL} className="the-image" onClick={this.onImageClick}/>
        </ReactTransitionGroup>
      </div>
    );
  }
});
React.render(<TestDemoApp />, document.getElementById('content')); // jshint ignore:line

module.exports = TestDemoApp;
