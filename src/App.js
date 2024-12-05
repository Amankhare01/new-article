import React, { Component } from 'react';
import './App.css';
import Newphone from './components/Newphone';
import PropTypes from 'prop-types';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      articles: [],
      loading: false,
    };
    document.title = `${this.capitalize(this.props.category)} - News Tak`;
  }

  capitalize = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  async componentDidMount() {
    this.props.setprogress(10);
    const apiKey = "e92fe607bf0f01dbd6c3f4cc0b39dbd2"; // Replace with your GNews API key
    const url = `https://gnews.io/api/v4/top-headlines?token=${apiKey}&lang=en&country=us&q=${this.props.category}`;

    try {
      let response = await fetch(url);
      let parsedData = await response.json();
      console.log(parsedData);
      this.setState({ articles: parsedData.articles });
    } catch (error) {
      console.error("Error fetching GNews data:", error);
    }
    this.props.setprogress(100);
  }

  render() {
    return (
      <div className="container">
        <center>
          <h1 className="text-danger" style={{ marginTop: '50px' }}>
            News Tak - {this.capitalize(this.props.category)}
          </h1>
          <h4 className="p-1s">
            <em>
              <u>Aapko Rakhe aage</u>
            </em>
          </h4>
        </center>
        <div className="row mt-1 mb-1">
          {this.state.articles && this.state.articles.length > 0 ? (
            this.state.articles.map((element) => (
              <div className="col-md-4" key={element.url}>
                <Newphone
                  title={element.title}
                  description={element.description}
                  imgurl={element.image}
                  newsurl={element.url}
                  author={element.source?.name}
                  Date={element.publishedAt}
                  source={element.source?.name}
                />
              </div>
            ))
          ) : (
            <p>Loading</p>
          )}
        </div>
      </div>
    );
  }

  static defaultProps = {
    category: 'general',
  };

  static propTypes = {
    category: PropTypes.string,
  };
}
