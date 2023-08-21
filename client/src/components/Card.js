import React from 'react';
import { Link } from 'react-router-dom';
import '../assets/css/Card.css';

const Card = ({url, title, description, imageUrl, difficulty, stageNumber, status, type }) => {
  return (
    <>
    {type == 'Learning-Game' ? 
    <div className="card-custom">
    <Link to={url}>
      <img src={process.env.PUBLIC_URL + imageUrl} alt="Card" className="card-image-custom" />
      <h3 className="card-title-custom">{title}</h3>
      <div className="card-content-custom">
        <p className="card-description-custom" style={{textAlign: 'center'}}>{description}</p>
        <p className="card-difficulty-custom" style={{color:'gray'}}>Difficulty: <span style={{color:'white'}}>{difficulty}</span></p>
        <p className="card-stage-custom"> {status}</p>
      </div>
      </Link>
    </div> :
    
    <div className="card-custom-hacking">
    <Link to={url}>
      <img src={process.env.PUBLIC_URL + imageUrl} alt="Card" className="card-image-custom-hacking" />
      <h3 className="card-title-custom-hacking">{title}</h3>
      <h5 className="card-title-type-hacking">{type}</h5>
      <div className="card-content-custom-hacking">
        <p className="card-description-custom-hacking" style={{textAlign: 'center'}}>{description}</p>
        <p className="card-difficulty-custom-hacking" style={{color:'gray'}}>Difficulty: <span style={{color:'white'}}>{difficulty}</span></p>
        <p className="card-stage-custom-hacking"> {status}</p>
      </div>
      </Link>
    </div>
    
    }
    </>
  );
};

export default Card;