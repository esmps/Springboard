const Person = (props) => {
    const {name, age, hobbies} = props;
    return (
        <div>
            <p>Learn some information about this user.</p>
            <p>Name: {name.length > 8 ? name.slice(0,6) : name}</p>
            <h3>{age > 18 ? "Please go vote!" : "You must be 18."}</h3>
            Hobbies:
            <ul>
                {hobbies.map(h => <li>{h}</li>)}
            </ul>
        </div>
    );
}