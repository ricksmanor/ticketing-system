import React, { Component } from 'react';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';
import { Link } from 'react-router-dom';

class Featured extends Component {
    constructor(props) {
        super(props);
        this.state = {
            featuredItems: [
                {
                    id: 1,
                    title: "Captain America: Civil War",
                    subtitle: "BigFilms Cinemas",
                    imageUrl: "https://react.semantic-ui.com/images/wireframe/image.png",
                    link: "/movies/captain-america-civil-war"
                },
                {
                    id: 2,
                    title: "Hulk: Awakening",
                    subtitle: "Shree Krishna Films",
                    imageUrl: "https://react.semantic-ui.com/images/wireframe/image.png",
                    link: "/movies/hulk-awakening"
                }
            ]
        };
    }

    render() {
        return (
            <div>
                <Carousel showThumbs={false} showStatus={false} infiniteLoop autoPlay>
                    {this.state.featuredItems.map(item => (
                        <div key={item.id}>
                            <Link to={item.link}>
                                <img src={item.imageUrl} alt={item.title} />
                                <p className="legend">
                                    <h3>{item.subtitle}</h3>
                                    {item.title}
                                </p>
                            </Link>
                        </div>
                    ))}
                </Carousel>
            </div>
        );
    }
}

export default Featured;