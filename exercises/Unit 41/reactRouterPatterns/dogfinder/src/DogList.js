import {Link} from 'react-router-dom';

function DogList({dogs}){
    const listOfDogs = dogs.map(d => (
        <div className="DogList-dog" key={d.name}>
            <img src={d.src} alt={d.name}/>
            <h3>
               <Link to={`/dogs/${d.name.toLowerCase()}`}>{d.name}</Link> 
            </h3>
        </div>
    ))
    return (
        <div className="DogList">
            <h1>List of All Dogs</h1>
            <div className="DogList-container">
                {listOfDogs}
            </div>
        </div>
    )
}

export default DogList;