import React, { useState } from 'react';
import {useHistory} from 'react-router-dom';
import "./NewColorForm.css";

function NewColorForm({addColor}) {

  const [form, updateForm] = useState({name: "", hex:"#ffffff"});
  const history = useHistory();

  function handleChange(e) {
    e.persist();
    updateForm(f => ({ ...f, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    addColor({ [form.name]: form.hex });
    history.push("/colors");
  }

  const {hex, name} = form;

  return (
    <div className="NewColor">
      <form onSubmit={handleSubmit}>
        <div className="NewColor-input">
          <label htmlFor="name">Color name</label>
          <br/>
          <input
            name="name"
            id="name"
            placeholder="Enter color name"
            onChange={handleChange}
            value={name}
          />
        </div>
        <div className="NewColor-input">
          <label htmlFor="hex">Color value</label>
          <br/>
          <input
            type="color"
            name="hex"
            id="hex"
            onChange={handleChange}
            value={hex}
          />
        </div>
        <input className="NewColor-submit" type="submit" value="Add this color" />
      </form>
    </div>
  );
}

export default NewColorForm;