import "bootswatch/dist/journal/bootstrap.min.css";
// import "bootstrap/dist/css/bootstrap.css";
import {Component} from 'react';
import {Table, Col, Container, Image, Nav, Navbar, Row} from "react-bootstrap";

const PLACES = [
    {name: "Москва", zip: "101000"},
    {name: "Санкт-Петербург", zip: "197198"},
    {name: "Краснодар", zip: "350000"},
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

class YesNoMaybe extends Component {
    constructor() {
        super();
        this.state = {
            yesNoMaybeData: null
        };
    }

    componentDidMount() {
        const URL = "https://yesno.wtf/api";
        fetch(URL).then(res => res.json()).then(json => {
            this.setState({yesNoMaybeData: json});
        });
    }

    rel() {
        this.setState({yesNoMaybeData: null});
        const URL = "https://yesno.wtf/api";
        fetch(URL).then(res => res.json()).then(json => {
            this.setState({yesNoMaybeData: json});
        });
    }

    render() {
        const yesNoMaybeData = this.state.yesNoMaybeData;
        if (!yesNoMaybeData) return null;
        let answer = yesNoMaybeData.answer;
        if (answer === "yes") {
            answer = "да";
        } else if (answer === "no") {
            answer = "нет";
        } else if (answer === "maybe") {
            answer = "может быть";
        }
        return (
            <div>
                <Row>
                    <Col>
                        <Image src={yesNoMaybeData.image} height="auto" width="100%"/>
                    </Col>
                    <Col>
                        <form onSubmit={() => this.rel()}>
                            <input placeholder="Ваш вопрос"/>
                            <button>Получить ответ</button>
                        </form>
                        <p>
                            Ваш ответ: {answer}
                        </p>
                    </Col>
                </Row>
            </div>
        );
    }
}

class CoinGecko extends Component {
    constructor() {
        super();
        this.state = {
            coinData: null
        };
    }

    componentDidMount() {
        const URL = "https://api.coingecko.com/api/v3/coins/list";
        fetch(URL).then(res => res.json()).then(json => {
            this.setState({coinData: json});
        });
    }

    render() {
        const coinData = this.state.coinData;
        if (!coinData) return <div>Loading</div>
        return (
            <div>
                <Table>
                    {coinData.map((coin) => (
                        <tr>
                            <td>{coin.id}</td>
                            <td>{coin.symbol}</td>
                            <td>{coin.name}</td>
                        </tr>
                    ))}
                </Table>
            </div>
        )
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
                                variant={"pills"}
                                className={"flex-column"}
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
                <Container>
                    <Navbar>
                        <Navbar.Brand>
                            Да, Нет, Может быть
                        </Navbar.Brand>
                    </Navbar>
                    <YesNoMaybe/>
                </Container>
                <Container>
                    <Navbar>
                        <Navbar.Brand>
                            Криптовалюты
                        </Navbar.Brand>
                    </Navbar>
                    <CoinGecko/>
                </Container>
            </div>
        );
    }
}

export default App;
