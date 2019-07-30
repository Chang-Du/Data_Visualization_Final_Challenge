d3.csv("https://raw.githubusercontent.com/Williamburgson/DataViz/master/vehicle_paths_normal_dist.csv?token=AHBQH2F6E4AXI37KBJN2G4K5JDLOU")
    .then((d) => barChart(d, "chart1", "Count of Vehicles with Normal Number of Passengers"))
    .catch(err => {
        console.log(err);
    });

d3.csv("https://raw.githubusercontent.com/Williamburgson/DataViz/master/erronous_counts.csv?token=AHBQH2D23DPEYTAGPKWPXY25JDPZC")
    .then((d) => barChart(d, "chart2", "Count of Vehicles with Erronous Number of Passengers"))
    .catch(err => {
        console.log(err);
    });

d3.csv("https://raw.githubusercontent.com/Williamburgson/DataViz/master/erronous_vehicles.csv?token=AHBQH2CROEJTBFH3B2T5YS25JDVZW")
    .then((d) => {
        let gChart = document.getElementById("chart3").getContext("2d");
        let label = d.map(d=>(d.Vehicle_id));
        let line1 = d.map(d=>(d.Count));
        let line2 = d.map(d=>(Number(d.Mean).toFixed(2)));
        let myLineChart = new Chart(gChart, {
            type: 'line',
            data: {
                labels: label,
                datasets:[
                    {
                        label: 'Count',
                        data: line1
                    },
                    {
                        label: 'Mean',
                        data: line2
                    }
                ]
            },
            options:{
                legend: {
                    display: true
                },
                scales: {
                    xAxes: [{
                        scaleLabel: {
                            type: 'id',
                            display: true,
                            labelString: 'Vehicle ID'
                        }
                    }]
                  }
            }  
        });
    })
    .catch(err => {
        console.log(err);
    });

let client    = new carto.Client({
                    apiKey: 'default_public',
                    username: 'willwang1994',
                });

let sql = 
        `SELECT * 
         FROM vehicle_paths_pnas_sample
         WHERE num_passengers >= 0
         OR num_passengers <= 4
         `;
let css =
        `#layer {
            marker-width: 7;
            marker-fill: #EE4D5A;
            marker-fill-opacity: 0.9;
            marker-line-color: #FFFFFF;
            marker-line-width: 1;
            marker-line-opacity: 1;
            marker-placement: point;
            marker-type: ellipse;
            marker-allow-overlap: true;
        }`;
baseMap = createBaseMap("map1");
createCartoLayer(sql, css, client, baseMap);

sql = 
        `SELECT * 
        FROM vehicle_paths_pnas_sample
        WHERE num_passengers > 4
        OR num_passengers < 0
        `;
let client2     = new carto.Client({
                    apiKey: 'default_public',
                    username: 'willwang1994',
                });
baseMap2 = createBaseMap("map2");
createCartoLayer(sql, css, client2, baseMap2);

function createBaseMap(id){
    let center    = [40.730995, -73.998815],
        baseLight = L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png',
                                { maxZoom: 12, }),
        dMap      = L.map(id, {
                    center: center,
                    zoom: 13,
                    layers: [baseLight]
                    }),
        svg       = d3.select(dMap.getPanes().overlayPane).append("svg"),
        g         = svg.append("g").attr("class", "leaflet-zoom-hide");
        
        return [svg, g, dMap];
}

function createCartoLayer(sql, css, client, base) {
    let sqlSource = new carto.source.SQL(sql);
    let style = new carto.style.CartoCSS(css);
    let layer = new carto.layer.Layer(sqlSource, style);
    client.addLayer(layer);
    client.getLeafletLayer().addTo(base[2]);
}

function barChart(d, id, title){
    let gChart = document.getElementById(id).getContext("2d");
    let label = d.map(d=>(d.Num_Passengers));
    let entry = d.map(d=>(d.datetime));
    let myLineChart = new Chart(gChart, {
            type: 'bar',
            data: {
                labels: label,
                datasets:[
                    {
                        data: entry,
                        fillColor: 'rgba(220,220,220,0.5)'
                    }
                ]
            },
            options:{
                legend: {
                    display: false
                },
                title: {
                    display: true,
                    text: title
                }
            }  
        });
    return myLineChart;
}   