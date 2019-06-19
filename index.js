import React from "react";
import ReactDOM from "react-dom";
import axios from 'axios';
import './index.css';
import { delay } from "q";

global.currentActorId = [];

class SevenStepsToKevinBacon extends React.Component {
    
    state = {
        currentActor: [],
        actorId: [],
        count: 0,
    }

    constructor(props) {
        super(props);
        var setActorId = this.setActorId.bind(this);
        this.state = {currentActor: [], actorId: [], count: 0};
    }

    componentDidMount() {
        if (this.state.count == 0)
        {
            this.setRandomActorId();
        }
    }

    getActorCredits() {
        axios.get(`https://api.themoviedb.org/3/person/${this.state.actorId.id}/movie_credits?api_key=424d43aaa12eccf314ed94c529efce15&language=en-US`)
        .then( res => {
            const currentActor = res.data.cast;
            this.setState({currentActor});
        })
    }

    setActorId(id) {
        axios.get(`https://api.themoviedb.org/3/person/${id}?api_key=424d43aaa12eccf314ed94c529efce15&language=en-US`)
        .then( res => {
            const actorId = res.data;
            this.setState({ actorId });
            window.alert(`just set actor id to ${this.state.actorId}`);
            this.getActorCredits();
        })
    }
    

    setRandomActorId() {
        var number = Math.floor(Math.random() * 1291445 + 1);
        axios.get(`https://api.themoviedb.org/3/person/${number}?api_key=424d43aaa12eccf314ed94c529efce15&language=en-US`)
        .then( res => {
            const actorId = res.data;
            console.log(`set actorId to: ${actorId.id}`);
            this.setState({actorId})
            if (this.state.actorId.profile_path == null || this.state.actorId.adult == true)
            {
                this.setRandomActorId();
            } else {
                this.getActorCredits();
            }
        })
        .catch(error => {
            console.log(error);
            console.log(`error with Id: ${number}`);
            number = this.setRandomActorId();
        })
    }

    //TODO instead of rendering each movie title as a string, render them as a <Movie/> react componant with their title as a prop
    //The componant will return a list of actors that were in the movie, clicking on one of the actors will update current actor state,
    //and will increment "steps" state. Clicking kevin bacon is win condition
    render() {
      
        return (
            <div className="currentActorPanel"> 
              <h4 className="actorName"> {this.state.actorId.name} </h4>
              <img className="actorPicture" src={`https://image.tmdb.org/t/p/original/${this.state.actorId.profile_path}`} alt="actorImg"/>

              <div className="appearsInMoviesPanel">
                <ActorCredits setState={this.setActorId} credits={this.state.currentActor} />
              </div>
            </div>

        )
    }
}

class ActorCredits extends React.Component {
    state = {
        credits: []
    }

    render() {
        return (
            <ul className="moviesList">
              {this.props.credits.map(movie => <MovieCard setState={this.props.setState} movieData={movie}/>)}
            </ul>
        )
    }
}

class MovieCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {movieData: [], cast: [], showCast: false};
        this.showCast = this.showCast.bind(this);
    }

    getCast() {
        axios.get(`https://api.themoviedb.org/3/movie/${this.props.movieData.id}/credits?api_key=424d43aaa12eccf314ed94c529efce15`)
        .then(res => {
            const cast = res.data.cast;
            this.setState({ cast });
        })
    }

    componentDidMount() {
        this.getCast();
    }

    showCast() {
        this.setState(state => ({
            showCast: !state.showCast
        }));
    }

    render() {
        this.getCast();

        return (
            <div className="movieCard">
              <h4> { this.props.movieData.title }</h4>
              <img className="moviePoster" src={`https://image.tmdb.org/t/p/original/${this.props.movieData.poster_path}`} alt="movie poster" />
              <button onClick={this.showCast}> Show Cast </button>
              <ul className="castList">> 
                {this.state.showCast ? this.state.cast.map(actor => <ActorCard setState={this.props.setState} actor={actor}/>) : ""} 
              </ul>
            </div>
        )
    }
}

class ActorCard extends React.Component {


    render() {
        const handleClick = () => this.props.setState;
        return (
            <span>
                <button onClick={ () => handleClick( this.props.actor.id ) }> {this.props.actor.name} </button>
            </span>
            // <span>
            // <button onClick={ this.setGlobalState( this.props.actor.id ) }> {this.props.actor.name} </button>
            // </span>
        )
    }
}

ReactDOM.render(<SevenStepsToKevinBacon/>, document.getElementById("root"));