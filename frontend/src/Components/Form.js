import Input from "./Input";

const formStyles = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  textAlign: "center",
  minHeight: "100vh",
  border: "3px solid #555",
};

function Form(props) {
  return (
    <div style={formStyles}>
      <form>
        {props.inputsList.map((input) => (
          <Input {...input} />
        ))}
        <button>submit</button>
      </form>
    </div>
  );
}
export default Form;
