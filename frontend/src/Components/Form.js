import Input from "./Input";
function Form(props) {
  return (
    <div>
      {props.inputsList.map((input) => (
        <Input {...input} />
      ))}
    </div>
  );
}
export default Form;
