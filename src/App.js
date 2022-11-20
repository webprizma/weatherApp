import "bootswatch/dist/morph/bootstrap.min.css";
// import "bootstrap/dist/css/bootstrap.css";
import { Component } from 'react';
import { Navbar, Nav, Container, Row, Col } from "react-bootstrap";

const PLACES = [
  { name: "Mexico City", zip: "94303" },
  { name: "Sunnyvale", zip: "94088" },
  { name: "Santa Cruz", zip: "95062" },
  { name: "Honolulu", zip: "96803" }
];

class WeatherDisplay extends Component {
  constructor() {
    super();
    this.state = {
      weatherData: null
    };
  }
  componentDidMount() {
    const zip = this.props.zip;
    const URL = "https://api.openweathermap.org/data/2.5/weather?q=" +
        zip +
        "&appid=b1b35bba8b434a28a0be2a3e1071ae5b&units=imperial";
    fetch(URL).then(res => res.json()).then(json => {
      this.setState({ weatherData: json });
    });
  }
  render() {
    const weatherData = this.state.weatherData;
    if (!weatherData) return <div>Loading</div>;
    const weather = weatherData.weather[0];
    const iconUrl = "http://openweathermap.org/img/w/" + weather.icon + ".png";
    return (
        <div>
          <h1>
            {weather.main} in {weatherData.name}
            <img src={iconUrl} alt={weatherData.description} />
          </h1>
          <p>Current: {weatherData.main.temp}°</p>
          <p>High: {weatherData.main.temp_max}°</p>
          <p>Low: {weatherData.main.temp_min}°</p>
          <p>Wind Speed: {weatherData.wind.speed} mi/hr</p>
        </div>
    );
  }
}

class App extends Component {
  constructor() {
    super();
    this.state = {
      activePlace: 0
    };
  }
  render() {
    const activePlace = this.state.activePlace;
    return (
        <div>
          <Container>
            <Navbar>
              <Navbar.Brand>
                React Simple Weather App
              </Navbar.Brand>
            </Navbar>
            <Row>
              <Col md={4} sm={4}>
                <h3>Select a city</h3>
                <Nav
                    className="flex-column"
                    activeKey={activePlace}
                    onSelect={index => {
                      this.setState({ activePlace: index });
                    }}
                >
                  {PLACES.map((place, index) => (
                      <Nav.Item>
                        <Nav.Link key={index} eventKey={index}>{place.name}</Nav.Link>
                      </Nav.Item>
                  ))}
                </Nav>
              </Col>
              <Col md={8} sm={8}>
                <WeatherDisplay key={activePlace} zip={PLACES[activePlace].zip} />
              </Col>
            </Row>
          </Container>
        </div>
    );
  }
}

export default App;
