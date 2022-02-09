import React from "react";
import { Link } from "react-router-dom";
import './ListColors.css'

function ListColors({colors}) {
  const listOfColors = Object.keys(colors).map(colorName => (
    <li className="ListColor-color" key={colorName}>
      <Link to={`/colors/${colorName}`}>{colorName}</Link>
    </li>
  ));

  return (
    <div className="ListColor">
      <header className="ListColor-header">
        <h1 className="ListColor-title">Color Factory</h1>
        <h3>
          <Link to="/colors/new">Add New Color</Link>
        </h3>
      </header>
      <div>
        <p>Please select a color.</p>
        <ul className="ListColor-options">
            {listOfColors}
        </ul>
      </div>
    </div>
  );
}


export default ListColors;