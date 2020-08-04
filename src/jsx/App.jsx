import React, {Component} from 'react';
import style from './../styles/styles.less';

// https://d3js.org/
import * as d3 from 'd3';

let interval;

let path_prefix;
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
      data.map((values, i) => {
        console.log(i)
        images[i] = new Image();
        images[i].src = path_prefix + 'img/1600px-' + values.year + '_Atlantic_hurricane_season_summary_map-min.png'
      });
      console.log(images)

      this.createInterval(data);
    });
  }
  createInterval(data) {
    interval = setInterval(() => {
      this.appRef.current.style.display = 'block';
      if (data[0]) {
        let current_data = data.shift();
        this.setState((state, props) => ({
          current_data:current_data,
          img_src:'1600px-' + current_data.year + '_Atlantic_hurricane_season_summary_map-min.png'
        }));
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
        <div className={style.background_container} style={{backgroundImage:'url(' + path_prefix + 'img/' + this.state.img_src + ')'}}></div>
      </div>
    );
  }
}
export default App;