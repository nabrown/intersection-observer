(function() {
  var numSteps = 10;
  var minOpacity = .3;

  // on load, select our elements and pass them to createObserver
  window.addEventListener("load", function(event) {
    var elements = [].slice.call(document.querySelectorAll("figure"));
    createObserver(elements);
  }, false);

  function createObserver(elements) {
    var observer;

    // 1. set the options from our observer
    // buildThresholdList returns an array of ratios, based on the number of steps we specified
    var options = {
      threshold: buildThresholdList(numSteps)
    };

    // 2. create the new observer, passing in the function to execute when 
    // intersections are observed, and the options
    observer = new IntersectionObserver(handleIntersect, options);

    // 3. deploy the observer for each element
    elements.forEach(function(el) {
        observer.observe(el);
      });
  }

  function buildThresholdList(numSteps) {
    var thresholds = [0];

    for (var i = 1.0; i <= numSteps; i++) {
      var ratio = i/numSteps;
      thresholds.push(ratio);
    }
    return thresholds;
  }
  
  function handleIntersect(changes) {
    changes.forEach((change) => {
      let figure = change.target;
      let ratio = change.intersectionRatio; 
      let img = figure.getElementsByTagName('img')[0];         
      let caption = figure.getElementsByTagName('figcaption')[0];

      img.style.opacity = minOpacity + (1 - minOpacity) * ratio;

      if(ratio < .9){
        caption.style.opacity = 1
      } else {
        caption.style.opacity = 0
      }

      if(ratio > .8 && figure.dataset.startTime === undefined){
        figure.dataset.startTime = change.time;
      }
      if(ratio < .8 && figure.dataset.startTime !== undefined){
        // console.log(change.time - figure.dataset.startTime)
        // ga('send', {
        //   hitType: 'timing',
        //   timingCategory: 'Images',
        //   timingVar: 'view_time',
        //   timingValue: change.time - figure.dataset.startTime,
        //   timingLabel: figure.getElementsByTagName('img')[0].getAttribute('src')
        // });
        delete figure.dataset.startTime;
      }
    });
  }

})();	