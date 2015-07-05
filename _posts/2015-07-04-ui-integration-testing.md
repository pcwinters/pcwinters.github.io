---
layout: post
title: "UI Integration Testing"
tagline: "Testing browser applications without Selenium"
description: ""
tags: [testing, karma, webpack, react]
---
{% include JB/setup %}

# Introduction
At [Rally Software](https://www.rallydev.com/), the client side development teams were faced with the need for automating testing in our new React ecosystem. Unsurprisingly, the organization's appetite for Selenium based full stack testing was weak. After years of flakey test failures and rspec bloat, developers wanted to focus on lean testing their applications (not the systems or APIs they depend on). To make matters worse, Jest tests suffer from performance problems due to the aggressive auto-mocking they employ on imports [facebook/jest #116](https://github.com/facebook/jest/issues/116). Would it be possible to lean on Jest (a unit test framework) for all our needs? The solution, encouraged by Mike Cohn's [Succeeding with Agile: Software Development Using Scrum](http://www.amazon.com/gp/product/0321579364), seemed to lie somewhere in the middle layer of the testing pyramid. At our last company hackathon, I decided to take a shot at what we had been calling UI integration testing; and here are some of my thoughts.

# Problem Statement
We would like to exercise our React components/applications to ensure browser compatibility, reduce functional regressions, and increase confidence in our continuous delivery pipeline.

The major goals:

* Test applications, not just components
* Mock APIs
* Visual Regression Testing

# Example
For the purposes of bootstrapping a simple app for this post, I've made use of the [react-webpack generator](https://github.com/newtriks/generator-react-webpack) for [Yeoman](http://yeoman.io/). The code has been checked in to my blog as static assets [here](https://github.com/pcwinters/pcwinters.github.io/tree/master/assets/posts/2015-07-04-ui-integration-testing/). I've included [karma-effroi](https://github.com/francejs/karma-effroi) and [jasmine-ajax](https://github.com/jasmine/jasmine-ajax) for event simulation and API mocking, respectively.

In this toy example, you can see a couple of things going on:

```javascript
  it('should query for apples when the image clicked', ()=>{    
    mouse.click($(".the-image")).then(()=>{
      expect(jasmine.Ajax.requests.count()).toBe(1);
      var request = jasmine.Ajax.requests.mostRecent();
      expect(request.url).toBe('/apples');
      request.respondWith('fooey');
    });
  });
```

First, we're interacting with the application as if a user device. We initiate a click event instead of invoking component methods or manipulating state directly. Second, we've mocked XMLHttpRequest with jasmine-ajax, and we can control API responses. While this is pretty simple stuff, something like the [Page Object pattern](http://martinfowler.com/bliki/PageObject.html) and more complex stubs and API mocking would make this approach more robust in the face of a real application.

## Visual Regressions
With some teaks to [karma-phantomjs-launcher](https://github.com/karma-runner/karma-phantomjs-launcher/blob/master/index.js), it's possible to connect both the client testing framework and phantomjs runtime in order to capture screenshots. As a part of my hackathon, I prototyped this approach, taking snapshots before the cleanup/completion of each spec. With tools like [webdrivercss-adminpanel](https://github.com/webdriverio/webdrivercss-adminpanel), it should be possible to review visual changes across many states of your application's state machine. Although many of visual regression tools prefer to operate on full-stack web servers, I believe the middle-of-the-pyramid karma integration test to be a real sweet spot for this kind of thing. It's possible, although unnatural, to ensure that karma tests render components with styling ([stackoverflow: Including CSS in Karma Tests](http://stackoverflow.com/a/22030221)). The headless phantom rendering engine is based on an older version of WebKit, which makes it possible in principle. At the very least, it can be helpful when debugging tests to inspect them visually; and karma has plugins to launch browsers like Chrome and Firefox.

## Browser Compatibility
This is perhaps my only regret, not having prototyped or delivered cross-browser test execution. It should be relatively simple with [karma-browserstack-launcher](https://github.com/karma-runner/karma-browserstack-launcher) or [karma-sauce-launcher](https://github.com/karma-runner/karma-sauce-launcher). There was a particularly unfortunate (albeit short) outage at Rally caused by use of the ```const``` keyword. Services like BrowserStack should make it impossible for this to reoccur.

# Reflections
After developing a number of these tests at Rally, I'm left with a conflicted attitude about this approach. My destination ended up looking very different from where I had expected to arrive. This snippet from a sample test shows how operations look eerily like the kind of ```wait.for``` and selectors that make selenium tests brittle.

```javascript
wait.for.visible('.feature-bar.fbg-fb').then((bar) => {
	expect(bar).toBeVisible();
	return mouse.click($('.col-2', bar));
}).then(() => {
	return wait.for.visible('.feature-popover');
}).then((popover) => {
	expect(popover).toBeVisible();
});
```

In addition, the need to stub and mock a multitude of API requests and responses led to a need for more complex data scenario management. An effort is underway in Rally to abstract API mocks in order to declare the data we expect to be available in our API instead of manipulating API responses for tests directly.

```
jasmine.Ajax.stubRequest(/\/Project\/[0-9]+/).andReturn
	status: 200
	responseText: JSON.stringify({Project: scenario.project})
jasmine.Ajax.stubRequest(/\/Release/).andReturn
	status: 200
	responseText: JSON.stringify(scenario.Releases)
jasmine.Ajax.stubRequest(/\/Feature/).andReturn
	status: 200
	responseText: JSON.stringify(scenario.Features)
```

# Conclusion
Would I try this approach again? Sure! I may, however, restrict my testing to smaller portions of functionality. Instead of rendering an entire application's entry point, I may isolate container components for testing. Rendering the entirety of a client-side application still seems like something best left to full-stack selenium testing. On a large application with a large development team at Rally, we have the resources to maintain testing infrastructure on all levels of the pyramid. But, if I was short on time and money, I'd put more confidence in exercising all facets of my application (not just the client).
