// add support for amd
if (typeof window.define === "function" && window.define.amd) {
  window.define("bridle", ['jquery', 'd3'], function() {
    return Bridle;
  });
// we're not using amd, then set up as 
// global var
} else {
  window.Bridle = Bridle;
}

})();