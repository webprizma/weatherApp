import "bootswatch/dist/lux/bootstrap.min.css";
// import "bootstrap/dist/css/bootstrap.css";
import {Component} from 'react';
import {Col, Container, Nav, Navbar, Row} from "react-bootstrap";

const PLACES = [
    {name: "Москва", zip: "101000"},
    {name: "Санкт-Петербург", zip: "197198"},
    {name: "Краснодар", zip: "350000"},
    {name: "Воронеж", zip: "394000"}
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
            this.setState({weatherData: json});
        });
    }

    render() {
        const weatherData = this.state.weatherData;
        if (!weatherData) return <div>Loading</div>;
        const weather = weatherData.weather[0];
        const iconUrl = "https://openweathermap.org/img/w/" + weather.icon + ".png";
        const curTemp = ((weatherData.main.temp - 32) * 5 / 9).toFixed(2);
        const highTemp = ((weatherData.main.temp_max - 32) * 5 / 9).toFixed(2);
        const lowTemp = ((weatherData.main.temp_min - 32) * 5 / 9).toFixed(2);
        const windSpeed = ((weatherData.wind.speed * 1.609344) * 5 / 18).toFixed(2);
        return (
            <div>
                <h1>
                    {weather.main} in {weatherData.name}
                    <img src={iconUrl} alt={weatherData.description}/>
                </h1>
                <p>Текущая температура: {curTemp} C°</p>
                <p>Макс. температура: {highTemp} C°</p>
                <p>Мин. температура: {lowTemp} C°</p>
                <p>Скорость ветра: {windSpeed} м/сек</p>
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
                            Прогноз погоды
                        </Navbar.Brand>
                    </Navbar>
                    <Row>
                        <Col md={4} sm={4}>
                            <h3>Выберите город</h3>
                            <Nav
                                className="flex-column"
                                activeKey={activePlace}
                                onSelect={index => {
                                    this.setState({activePlace: index});
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
                            <WeatherDisplay key={activePlace} zip={PLACES[activePlace].zip}/>
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }
}

export default App;
