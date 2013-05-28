Bridle 
======
version 0.0.7

A [d3](https://github.com/mbostock/d3) reusable chart library. Bridle v0.0.1 includes a line chart, bar chart (with stacked or grouped modes), a stacked area chart and a sortable html table generator. Each chart works with an external legend module, which allows you to hide data series.

## Installation

Ideally you want to use bower and just type:
```
bower install bridle
```

Then you can require it with require.js as you would normally do with any other AMD package

### Dependencies
Bridle depends on d3.js and jquery. Make sure they are loaded before you load bridle.

### CSS
Bridle comes with a minimal set of css classes to format the tooltips, and do some transitions. Load `bridle.css` on the head of your document to use.

## Usage


See the [Examples](http://ptdavteam.github.io/bridle/examples/) for more usage examples.



![line chart example](https://dl.dropboxusercontent.com/u/68514/bridle_line_chart_ex.png "line chart example")

```js

var lineData = [
  {
    "type": "apples",
    "values": [
      { "z": '2012-01-01', "v":  100*Math.random()},
      { "z": '2012-01-02', "v":  100*Math.random()},
      { "z": '2012-01-03', "v":  100*Math.random()}
    ]
  },
  {  
    "type": "oranges",
    "values": [
      { "z": '2012-01-01', "v":  100*Math.random()},
      { "z": '2012-01-02', "v":  100*Math.random()},
      { "z": '2012-01-03', "v":  100*Math.random()}
    ]
  },
  {
    "type": "pears",
    "values": [
      { "z": '2012-01-01', "v":  100*Math.random()},
      { "z": '2012-01-02', "v":  100*Math.random()},
      { "z": '2012-01-03', "v":  100*Math.random()}
    ]
  },
  {  
    "type": "kiwi",
    "values": [
      { "z": '2012-01-01', "v":  100*Math.random()},
      { "z": '2012-01-02', "v":  100*Math.random()},
      { "z": '2012-01-03', "v":  100*Math.random()}
    ]
  }  
];

var line = Bridle.LineChart()
  .duration(1000)
  .width(800)
  .title("Apples or Oranges?")
  .yAxisTitle("Label your axes")
  .legend(Bridle.LegendBox().height(100).nameAccessor(function(d) {return d.type}))
  .margin({top:50, bottom:30, left:100, right:200})
  .xValue(function (d) {
    return new Date (d.z)
  })
  .yValue(function (d) {
    return d.v
  })
  .nameValue(function (d) {
    return d.type
  });


d3.select('#line-chart')
  .datum(lineData)
  .call(line);
```

## Development

In order to develop you will need to run `npm install` on the local directory. This will install the dependencies listed on `package.json`. 

To compile the `scss` file you'll need sass - just install it by running 
```
$ gem install sass
```

now you can type `make` to build the js files and the css version of the library

#### Makefile
The concatenation happens on the makefile. If you're adding a new module, or a new visualisation, add it between `legendbox.js` and `footer.js`, then run `make`. This will concatenate the files inside `src` and create a new `bridle.js` and `bridle.min.js`


#### Running tests
At the moment the test are broken with mocha-phantomjs, you'll have to start a local server, i.e. with `twistd`:

```
$ cd bridle
$ twistd web --path . --port 8080
$ open http://localhost:8080/test
```
that will open a browser (if you're using mac os x) and run the mocha tests on the browser. 

We're working to fix the headless tests asap.

## License

    Copyright 2013 Pearson PLC

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.



