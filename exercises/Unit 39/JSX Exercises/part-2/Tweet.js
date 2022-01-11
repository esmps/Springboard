const Tweet = (props) => {
    const {username, name, date, message} = props;
    return (
        <div>
            <h3>@{username}</h3>
            <p>{name}</p>
            <i>{date}</i>
            <p>{message}</p>
        </div>
    );
}