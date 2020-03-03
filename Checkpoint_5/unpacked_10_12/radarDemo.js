!function() {

   var operation = d3.select('body').append('div').append('h2');
var radarChart = d3.select('.radarChart');
   data = 
      [  
        {  
          "key":"Nokia Smartphone",
          "values":[  
            {  "axis":"Battery Life", "value":0.26 }, {  "axis":"Brand", "value":0.10 },
            {  "axis":"Contract Cost", "value":0.30 }, {  "axis":"Design And Quality", "value":0.14 },
            {  "axis":"Have Internet Connectivity", "value":0.22 }, {  "axis":"Large Screen", "value":0.04 },
            {  "axis":"Price Of Device", "value":0.41 }, {  "axis":"To Be A Smartphone", "value":0.30 }
          ]
        },
        {  
          "key":"Samsung",
          "values":[  
            {  "axis":"Battery Life", "value":0.27 }, {  "axis":"Brand", "value":0.16 },
            {  "axis":"Contract Cost", "value":0.35 }, {  "axis":"Design And Quality", "value":0.13 },
            {  "axis":"Have Internet Connectivity", "value":0.20 }, {  "axis":"Large Screen", "value":0.13 },
            {  "axis":"Price Of Device", "value":0.35 }, {  "axis":"To Be A Smartphone", "value":0.38 }
          ]
        },
        {  
          "key":"iPhone",
          "values":[  
            {  "axis":"Battery Life", "value":0.22 }, {  "axis":"Brand", "value":0.28 },
            {  "axis":"Contract Cost", "value":0.29 }, {  "axis":"Design And Quality", "value":0.17 },
            {  "axis":"Have Internet Connectivity", "value":0.22 }, {  "axis":"Large Screen", "value":0.02 },
            {  "axis":"Price Of Device", "value":0.21 }, {  "axis":"To Be A Smartphone", "value":0.50 }
          ]
        }
      ];

   setTimeout(function() { 
      operation.text(' radarChart.data(data).duration(1000).update(); ');
      radarChart.data(data).duration(1000).update();
   }, 200);
   
  
}();