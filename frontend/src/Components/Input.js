function Input(props) {
  const InputStyle = {
    padding: 10,
  };
  return (
    <div style={InputStyle}>
      <h1>{props.label}</h1>
      <input type={props.type} name={props.name} required={props.required} />
      <br />
    </div>
  );
}

export default Input;
