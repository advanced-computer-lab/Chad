function Input(props) {
  return (
    <div>
      <h1>{props.label}</h1>
      <input type={props.type} name={props.name} required={props.required} />
    </div>
  );
}

export default Input;
