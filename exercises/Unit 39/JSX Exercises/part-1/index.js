const App = () => (
    <div>
        <FirstComponent/>
        <NamedComponent name="Emma"/>
    </div>
  );
  
  ReactDOM.render(<App/>,
    document.getElementById("root")); 