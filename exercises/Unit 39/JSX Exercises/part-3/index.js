const App = () => (
    <div>
      <Person name="Susan B" age={55} hobbies={["knitting", "baking", "walking group"]}/>
      <Person name="Antonio H" age={15} hobbies={["basketball", "skiing"]}/>
      <Person name="Jeremy S" age={29} hobbies={["partying", "sunbathing", "video games"]}/>
    </div>
  );
  
  ReactDOM.render(<App/>,
    document.getElementById("root")); 
