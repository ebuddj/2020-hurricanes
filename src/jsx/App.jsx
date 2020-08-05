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
      backgrounds:[],
      current_data:{
        hurricanes:0
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
      let backgrounds = [];
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
        backgrounds.push(path_prefix + 'img/1600px-' + values.year + '_Atlantic_hurricane_season_summary_map-min.png');
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

        bar_chart_data.datasets[2].data.push(parseInt(values.hurricanes));
        bar_chart_data.datasets[2].backgroundColor.push('rgba(254, 91, 89, 0.45)');
      });
      this.setState((state, props) => ({
        backgrounds:backgrounds,
        data:{...data}
      }), this.createChart(bar_chart_data, data));
    });
  }
  createChart(bar_chart_data, data) {
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
        onClick:this.handleClick.bind(this),
        onHover:(event, chartElement) => {
          event.target.style.cursor = chartElement[0] ? 'pointer' : 'default';
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
    this.createInterval(data);
  }
  handleClick(evt) {
    clearInterval(interval);
    let active_element = chart.getElementAtEvent(evt)[0];
    if (active_element) {
      this.changeData(active_element._index, this.state.data[active_element._index])
    }
  }
  createInterval(data) {
    let i = 0;
    interval = setInterval(() => {
      this.appRef.current.style.display = 'block';
      if (data[0]) {
        let current_data = data.shift();
        this.changeData(i, current_data);
        i++;
      }
      else {
        clearInterval(interval);
      }
    }, 1250);
  }
  changeData(i, current_data) {
    this.setState((state, props) => ({
      current_data:current_data,
      img_src:'1600px-' + current_data.year + '_Atlantic_hurricane_season_summary_map-min.png'
    }));
    chart.data.datasets[0].backgroundColor = chart.data.datasets[0].backgroundColor.map((background) => {
      return 'rgba(0, 247, 243, 0.45)';
    });
    chart.data.datasets[1].backgroundColor = chart.data.datasets[1].backgroundColor.map((background) => {
      return 'rgba(254, 142, 0, 0.45)';
    });
    chart.data.datasets[2].backgroundColor = chart.data.datasets[2].backgroundColor.map((background) => {
      return 'rgba(254, 91, 89, 0.45)';
    });
    chart.data.datasets[0].backgroundColor[i] = 'rgba(0, 247, 243, 1)';
    chart.data.datasets[1].backgroundColor[i] = 'rgba(254, 142, 0, 1)';
    chart.data.datasets[2].backgroundColor[i] = 'rgba(254, 91, 89, 1)';
    chart.update(0);
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
          <div className={style.meta_wrapper}>
            <h3>Year {this.state.current_data.year}</h3>
            <div>
              <div className={style.label}>Total deaths</div>
              <div className={style.value_container}>
                <span className={style.value}>{this.state.current_data.deaths}</span>
              </div>
            </div>
            <div>
              <div className={style.label}>Strongest storm</div>
              <div className={style.value_container}>
                <span className={style.value}>{this.state.current_data.strongest_storm}</span>
              </div>
            </div>
          </div>
          <div className={style.meta_wrapper}>
            <h3>Number of</h3>
            <div>
              <div className={style.label}>Tropical cyclones</div>
              <div className={style.value_container}>
                <span className={style.indicator} style={{backgroundColor:'rgba(0, 247, 243, 1)'}}></span>
                <span className={style.value}>{this.state.current_data.cyclones}</span>
              </div>
            </div>
            <div>
              <div className={style.label}>Tropical storms</div>
              <div className={style.value_container}>
                <span className={style.indicator} style={{backgroundColor:'rgba(254, 142, 0, 1)'}}></span>
                <span className={style.value}>{this.state.current_data.storms}</span>
              </div>
            </div>
            <div>
              <div className={style.label}>Hurricanes</div>
              <div className={style.value_container}>
                <span className={style.indicator} style={{backgroundColor:'rgba(254, 91, 89, 1)'}}></span>
                <span className={style.value}>{parseInt(this.state.current_data.hurricanes)}</span>
              </div>
            </div>
          </div>
        </div>
        <div className={style.chart_container}>
          <canvas id={style.chart} ref={this.chartRef}></canvas>
        </div>
        <div className={style.hidden}>
          {this.state.backgrounds && this.state.backgrounds.map((background, i) => {
            return (<img src={background} key={i}/>)
          })}
        </div>
        <div className={style.background_container} style={{backgroundImage:'url(' + path_prefix + 'img/' + this.state.img_src + ')'}}></div>
      </div>
    );
  }
}
export default App;