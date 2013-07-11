/* A Line Chart */

Bridle.LineChart = function() {

  'use Strict'

  // define dimensions of graph
  var margin = {
    top: 50,
    bottom: 30,
    left: 100,
    right: 100
  };
  var height = 400;
  var width = 1000;
  var xValue = function(d) {
    return d.x;
  };
  var yValue = function(d) {
    return d.y;
  };
  var nameValue = function(d) {
    return d.name;
  };
  var title = 'Chart Title';
  var yAxisTitle = 'Axis Title';
  var duration = 1000;
  var xScale = d3.time.scale.utc();
  var yScale = d3.scale.linear().nice();
  var xAxis = d3.svg.axis().scale(xScale).orient("bottom");
  xAxis.tickSize(-height + margin.top + margin.bottom, 0); // get/set?
  xAxis.tickSubdivide(true); // get/set?
  var yAxis = d3.svg.axis().scale(yScale).orient("left");
  var colors = d3.scale.category10();
  var legend = Bridle.LegendBox().nameAccessor(function(d) {
    return nameValue(d)
  });
  var dispatch = d3.dispatch('showTooltip', 'hideTooltip', "pointMouseover", "pointMouseout");


  function chart(selection) {
    selection.each(function(rawData) {
      var containerID = this;
      var data = rawData.filter(function(d) {
        return !d.disabled
      })

      // get max and min date(s)
      var maxDates = data.map(function(d) {
        return d3.max(d.values, function(e) {
          return xValue(e)
        });
      });
      var minDates = data.map(function(d) {
        return d3.min(d.values, function(e) {
          return xValue(e)
        });
      });


      xScale
        .domain([d3.min(minDates), d3.max(maxDates)])
        .range([0, width - margin.left - margin.right]);


      var amt = xScale(xValue(data[0].values[1])) - xScale(xValue(data[0].values[0]));

      // X scale will fit all values from data[] within pixels 0-w
      //var x = d3.scale.linear().domain([0, data.length]).range([0, w]);
      // Y scale will fit values from 0-10 within pixels h-0 (Note the inverted domain for the y-scale: bigger is up!)

      // find out the y max
      var maxYs = data.map(function(d) {
        return d3.max(d.values, function(e) {
          return yValue(e);
        })
      })

      yScale.domain([0, d3.max(maxYs)])
        .range([height - margin.top - margin.bottom, 0]);

      // create a line function that can convert data[] into x and y points
      var line = d3.svg.line()
      // assign the X function to plot our line as we wish
      .x(function(d, i) {
        // return the X coordinate where we want to plot this datapoint
        return xScale(xValue(d));
      })
        .y(function(d) {
        // return the Y coordinate where we want to plot this datapoint
        return yScale(yValue(d));
      });


      function xx(d) {
        return xScale(xValue(d));
      };

      function yy(d) {
        return yScale(yValue(d));
      };


      // set up the scaffolding
      var svg = d3.select(this).selectAll("svg").data([data]);
      var gEnter = svg.enter().append("svg").attr("class", "bridle").append("g");
      gEnter.append("defs").append("clipPath").attr("id", "clip").append("rect")
        .attr("width", width - margin.left - margin.right)
        .attr("height", height - margin.top - margin.bottom);
      gEnter.append("g").attr("class", "x axis");
      gEnter.append("g").attr("class", "y axis").append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".72em")
        .attr("class", "y axis label")
        .attr("text-anchor", "middle");
      gEnter.append("svg:text").attr("class", "chartTitle label")
        .attr("text-anchor", "middle")
        .attr("dy", "1em")
        .attr("transform", "translate(" + (width - margin.left - margin.right + 20) / 2 + "," + (-margin.top) + ")");
      gEnter.append("g")
        .attr("class", "legend")
        .attr("transform", "translate(" + (width - margin.left - margin.right + 20) + "," + 0 + ")")
        .style("font-size", "12px");
      gEnter.append("g").attr("class", "lines")

      // update the outer dimensions
      svg.attr("width", width)
        .attr("height", height)

      // update the inner dimensions
      var g = svg.select("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      // reasign the data to trigger addition/deletion and add
      // a series group per series in the data
      var gSeries = svg.select('.lines').selectAll('g.series')
        .data(function(d) {
            return d
          }, function(d) {
            return nameValue(d)
        })
        .classed('hover', function(d) {
          return d.hover
        });

      gSeries.exit()
        .transition()
        .duration(duration)
        .style('opacity', 0)
        .remove();


      var gSeriesEnter = gSeries.enter()
          .append('g')
          .attr('class', 'series')
          .attr('id', function(d) {
            return 'series_' + nameValue(d);
          });
      
      // add paths
      var linePaths = gSeries.selectAll('path.line')
        .data(function(d) { 
          return [d];
        });
      
      linePaths.enter().append("path")
          .attr("stroke", function(d, i) {
            return colors(nameValue(d));
          })
          .attr("class", "line")
          .attr("stroke-opacity", 0)
          .attr("d", function(d) {
            return line(d.values);
          });

      // add points
      var circlesGroup = gSeries.selectAll("g.circles")
        .data(function(d) {
          d.values.forEach(function(v) {
            v.name = nameValue(d)
          });
          return [d.values];
        });

      circlesGroup.enter()
        .append('g')
        .attr("class", "circles")

      var circles = gSeries
        .selectAll('circle')
        .data(function(d) {
          return d.values;
        }, function(d) {
          return xValue(d);
        });
        
      // add the points
      var circlesEnter = circles.enter();

      circlesEnter.append('circle')
        .attr("opacity", 0.1)
        .attr("class", "seriespoint")
        .attr('r', 0)
        .attr('cx', function(d) {
          return xScale(xValue(d))
        })
        .attr('cy', function(d) {
          return yScale(yValue(d))
        })
        .on('mouseover', function(d, i, j) {
          dispatch.pointMouseover({
            x: xValue(d),
            y: yValue(d),
            series: d.name,
            pos: [xScale(xValue(d)), yScale(yValue(d))],
            pointIndex: i,
            seriesIndex: j
          });
        })
        .on('mouseout', function(d) {
          dispatch.pointMouseout({
            // point: d,
            // series: data[d.series],
            // pointIndex: d.point,
            // seriesIndex: d.series
          });
        });

      circles.exit()
        .attr('fill-opacity', 0)
        .attr('r', 0)
        .remove();

      // update the lines
      gSeries.selectAll('path.line')
        .attr("stroke", function(d, i) {
            return colors(nameValue(d));
        })
        .attr("fill", "none")
        .attr("d", function(d) {
          return line(d.values);
        })
        .attr("clip-path", "url(#clip)")
        .transition()
        .duration(duration)
        .ease('linear')
        .attr("stroke-opacity", 1)
        .attr("stroke-width", 1.5)
        
        
        

      // update the circles
      gSeries.selectAll('circle.seriespoint')
        .transition()
        .duration(duration)
        .ease('linear')
        .attr('r', 5)
        .attr('cx', function(d) {
          return xScale(xValue(d))
        })
        .attr('cy', function(d) {
          return yScale(yValue(d))
        });

      // update the title
      g.select("text.chartTitle")
        .text(title)

      // update the x-axis
      g.select(".x.axis")
        .attr("transform", "translate(0," + yScale.range()[0] + ")")
        .transition()
        .duration(duration)
        .ease("linear")
        .call(xAxis);

      // update the y-axis
      g.select(".y.axis")
      //.attr("transform", "translate(")
      .transition()
        .duration(duration)
        .attr("transform", "translate(-25,0)")
        .call(yAxis)

      g.select(".y.axis.label")
        .attr("y", -45)
        .attr("x", (-height + margin.top + margin.bottom) / 2)
        .attr("dy", ".1em")
        .text(yAxisTitle);



      if (legend.numData() != rawData.length) {
        // update the legend
        g.select('.legend')
          .datum(data)
          .call(legend);
      }

      legend.dispatch.on('legendClick', function(d, i) {
        d.disabled = !d.disabled;

        if (!data.filter(function(d) {
          return !d.disabled
        }).length) {
          data.forEach(function(d) {
            d.disabled = false;
          });
        }
        selection.call(chart)
      });


      legend.dispatch.on('legendMouseover', function(d, i) {
        d.hover = true;
        selection.call(chart)
      });

      legend.dispatch.on('legendMouseout', function(d, i) {
        d.hover = false;
        selection.call(chart)
      });

      dispatch.on('pointMouseover.tooltip', function(e) {
        var offset = $(containerID).offset(), // { left: 0, top: 0 }
          left = e.pos[0] + offset.left + margin.left,
          top = e.pos[1] + offset.top + margin.top,
          formatterX = d3.time.format("%Y-%m-%d")
          formatterY = d3.format(".02f");

        var content = '<h3>' + e.series + '</h3>' +
          '<p>' +
          '<span class="value">[' + formatterX(e.x) + ', ' + formatterY(e.y) + ']</span>' +
          '</p>';

        Bridle.tooltip.show([left, top], content);
      });

      dispatch.on('pointMouseout.tooltip', function(e) {
        Bridle.tooltip.cleanup();
      });

    });


  }

  chart.dispatch = dispatch;

  // x accessor

  function X(d) {
    return xScale(d.x);
  }

  // y-0 accessor

  function Y0(d) {
    return yScale(d.y0);
  }

  // y-1 accessor

  function Y1(d) {
    return yScale(d.y0 + d.y);
  }

  chart.margin = function(_) {
    if (!arguments.length) return margin;
    margin = _;
    return chart;
  };

  chart.width = function(_) {
    if (!arguments.length) return width;
    width = _;
    return chart;
  };

  chart.height = function(_) {
    if (!arguments.length) return height;
    height = _;
    return chart;
  };

  chart.value = function(_) {
    if (!arguments.length) return value;
    value = _;
    return chart;
  };

  chart.label = function(_) {
    if (!arguments.length) return label;
    label = _;
    return chart;
  };

  chart.title = function(_) {
    if (!arguments.length) return title;
    title = _;
    return chart;
  };

  chart.xAxis = function(_) {
    if (!arguments.length) return xAxis;
    xAxis = _;
    return chart;
  }

  chart.yAxis = function(_) {
    if (!arguments.length) return yAxis;
    yAxis = _;
    return chart;
  }

  chart.yAxisTitle = function(_) {
    if (!arguments.length) return yAxisTitle;
    yAxisTitle = _;
    return chart;
  };

  chart.duration = function(_) {
    if (!arguments.length) return duration;
    duration = _;
    return chart;
  }

  chart.legend = function(_) {
    if (!arguments.length) return legend;
    legend = _;
    return chart;
  }

  chart.xValue = function(_) {
    if (!arguments.length) return xValue;
    xValue = _;
    return chart;
  }

  chart.yValue = function(_) {
    if (!arguments.length) return yValue;
    yValue = _;
    return chart;
  }

  chart.nameValue = function(_) {
    if (!arguments.length) return nameValue;
    nameValue = _;
    return chart;
  }

  chart.colors = function(_) {
    if (!arguments.length) return colors;
    colors = _;
    return chart;
  };

  return chart;
};