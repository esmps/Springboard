const App = () => (
    <div>
        <Tweet username="user1" name="User 1" date="01/10/22" message="This is a message from user1." />
        <Tweet username="user2" name="User 2" date="01/10/22" message="This is a message from user2." />
        <Tweet username="user3" name="User 3" date="01/10/22" message="This is a message from user3." />
    </div>
  );

// ALTERNATIVE USING LOOPS
// const App = () => {
//     const tweets = [
//         {
//             username: 'user1',
//             name: 'User 1',
//             date: '01/10/22',
//             message: 'This is a message from user1'
//         },
//         {
//             username: 'user2',
//             name: 'User 2',
//             date: '01/10/22',
//             message: 'This is a message from user2'
//         },
//         {
//             username: 'user3',
//             name: 'User 3',
//             date: '01/10/22',
//             message: 'This is a message from user3'
//         }
//     ]
//     return (
//     <div>
//        { tweets.map(t => <Tweet username={t.username} name={t.name} date={t.date} message={t.message} />) }
//     </div>
//     );
// };
  
  ReactDOM.render(<App/>,
    document.getElementById("root")); 
