
function DogDetails({dog}){
    return (
        <div>
            <h1>This is {dog.name}</h1>
            <img src={dog.src} alt={dog.name}/>
            <h3>Some fun facts about {dog.name}:</h3>
            <ul className="DogDetails-facts">
                {dog.facts.map(fact => (
                    <li>
                        {fact}
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default DogDetails;