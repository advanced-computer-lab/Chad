import "../Styles/Components/AppBar.scss";

function AppBar() {
  return (
    <div className="app-bar">
      <h2 className="app-bar__logo">LOGO</h2>
      <button className="app-bar__login-btn clickable">lOGIN</button>
    </div>
  );
}
export default AppBar;
