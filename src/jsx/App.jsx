import React, {Component} from 'react';
import style from './../styles/styles.less';

// https://d3js.org/
import * as d3 from 'd3';

// https://www.chartjs.org/
import Chart from 'chart.js';

let path_prefix, chart, interval;
if (location.href.match('localhost')) {
  path_prefix = './';
}
else {
  path_prefix = 'https://raw.githubusercontent.com/ebuddj/2020-hurricanes/master/public/';
}

class App extends Component {
  constructor(props) {
    super(props);

    this.appRef = React.createRef();
    this.chartRef = React.createRef();

    this.state = {
      'current_data':{
        hurricanes:0,
        major_hurricanes:0
      },
      'img_src':'1600px-1990_Atlantic_hurricane_season_summary_map-min.png'
    }
  }
  componentDidMount() {
    this.getData();
  }
  componentDidUpdate(prevProps, prevState, snapshot) {

  }
  componentWillUnMount() {
    clearInterval(interval);
  }
  getData() {
    d3.csv('./data/data - data.csv').then((data) => {
      let images = new Array()
      let bar_chart_data = {
        labels:[],
        datasets:[{
          backgroundColor:[],
          data:[],
          label:'Cyclones'
        },{
          backgroundColor:[],
          data:[],
          label:'Storms'
        },{
          backgroundColor:[],
          data:[],
          label:'Hurricanes'
        }]
      };
      data.map((values, i) => {
        images[i] = new Image();
        images[i].src = path_prefix + 'img/1600px-' + values.year + '_Atlantic_hurricane_season_summary_map-min.png';
        if (values.year === '1990' || values.year === '2000' || values.year === '2010' || values.year === '2019') {
          bar_chart_data.labels.push(values.year);
        }
        else {
          bar_chart_data.labels.push('');
        }
        bar_chart_data.datasets[0].data.push(values.cyclones);
        bar_chart_data.datasets[0].backgroundColor.push('rgba(0, 247, 243, 0.45)');

        bar_chart_data.datasets[1].data.push(values.storms);
        bar_chart_data.datasets[1].backgroundColor.push('rgba(254, 142, 0, 0.45)');

        bar_chart_data.datasets[2].data.push(parseInt(values.hurricanes) + parseInt(values.major_hurricanes));
        bar_chart_data.datasets[2].backgroundColor.push('rgba(254, 91, 89, 0.45)');
      });
      this.createChart(bar_chart_data)
      this.createInterval(data);
    });
  }
  createChart(bar_chart_data) {
    let ctx = this.chartRef.current.getContext('2d');

    chart = new Chart(ctx, {
      data:bar_chart_data,
      options:{
        hover:{
          enabled:false,
        },
        legend:{
          display:false
        },
        scales:{
          xAxes: [{
            display:true,
            gridLines:{
              display:false
            },
            ticks: {
              autoSkip:false,
              fontColor:'#fff',
              fontSize:12,
              fontStyle:'bold',
              maxRotation:0,
              minRotation:0
            },
            stacked:true
          }],
          yAxes: [{
            display:false,
            stacked:true
          }]
        },
        title:{
          display:false,
        },
        tooltips:{
          enabled:false
        }
      },
      type:'bar'
    });
  }
  createInterval(data) {
    let i = 0;
    interval = setInterval(() => {
      this.appRef.current.style.display = 'block';
      if (data[0]) {
        let current_data = data.shift();
        this.setState((state, props) => ({
          current_data:current_data,
          img_src:'1600px-' + current_data.year + '_Atlantic_hurricane_season_summary_map-min.png'
        }));
        if (i > 0) {
          chart.data.datasets[0].backgroundColor[i - 1] = 'rgba(0, 247, 243, 0.45)';
          chart.data.datasets[1].backgroundColor[i - 1] = 'rgba(254, 142, 0, 0.45)';
          chart.data.datasets[2].backgroundColor[i - 1] = 'rgba(254, 91, 89, 0.45)';
        }
        chart.data.datasets[0].backgroundColor[i] = 'rgba(0, 247, 243, 1)';
        chart.data.datasets[1].backgroundColor[i] = 'rgba(254, 142, 0, 1)';
        chart.data.datasets[2].backgroundColor[i] = 'rgba(254, 91, 89, 1)';
        chart.update(0);
        i++;
      }
      else {
        clearInterval(interval);
      }
    }, 1250);
  }
  // shouldComponentUpdate(nextProps, nextState) {}
  // static getDerivedStateFromProps(props, state) {}
  // getSnapshotBeforeUpdate(prevProps, prevState) {}
  // static getDerivedStateFromError(error) {}
  // componentDidCatch() {}
  render() {
    return (
      <div className={style.app} ref={this.appRef}>
        <div className={style.meta_container}>
          <h3>{this.state.current_data.year}</h3>
          <div><span className={style.label}>Total deaths</span> <span className={style.value}>{this.state.current_data.deaths}</span></div>
          <div><span className={style.label}>Strongest storm</span> <span className={style.value}>{this.state.current_data.strongest_storm}</span></div>
          <h3>Number of</h3>
          <div><span className={style.label}>Tropical cyclones</span> <span className={style.value}>{this.state.current_data.cyclones}</span></div>
          <div><span className={style.label}>Tropical storms</span> <span className={style.value}>{this.state.current_data.storms}</span></div>
          <div><span className={style.label}>Hurricanes</span> <span className={style.value}>{parseInt(this.state.current_data.hurricanes) + parseInt(this.state.current_data.major_hurricanes)}</span></div>
        </div>
        <div className={style.chart_container}>
          <canvas id={style.chart} ref={this.chartRef}></canvas>
        </div>
        <div className={style.background_container} style={{backgroundImage:'url(' + path_prefix + 'img/' + this.state.img_src + ')'}}></div>
      </div>
    );
  }
}
export default App;