import {useParams} from 'react-router-dom';
import DogDetails from './DogDetails';

function FilterDogDetails({dogs}){
    const {name} = useParams();
    if (name){
        const currDog = dogs.find(dog => dog.name.toLowerCase() === name.toLowerCase());
        return <DogDetails dog={currDog}/>
    }
    return null;
}

export default FilterDogDetails;