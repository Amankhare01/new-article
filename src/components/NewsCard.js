import React, { Component } from 'react';
import '../App.css'
export default class NewsCard extends Component {
  render() {
    let { title, description, imgurl, newsurl, author, Date, source } = this.props;
    return (
      <div className="news-card">
        <div className="card">
          <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
            {source}
          </span>
          <img 
            src={!imgurl ? "image.jpg" : imgurl} 
            className="card-img-top" 
            alt="news" 
          />
          <div className="card-body">
            <h5 className="card-title">{title}</h5>
            <p className="card-text">{description}</p>
            <p className="card-text">
              <small className="text-muted">By {!author ? "Unknown" : author} on {Date}</small>
            </p>
            <a href={newsurl} className="btn btn-primary">Read full article</a>
          </div>
        </div>
      </div>
    );
  }
}
