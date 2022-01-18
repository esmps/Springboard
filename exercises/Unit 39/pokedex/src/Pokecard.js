import './Pokecard.css';

const Pokecard = ({id, name, type, base_experience}) => {
    const photo_url = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
    return (
        <div className="Pokecard-card">
            <p>{name}</p>
            <img className="Pokecard-img" src={photo_url}/>
            <p>Type: {type}</p>
            <p>EXP: {base_experience}</p>
        </div>
    )
}

export default Pokecard;