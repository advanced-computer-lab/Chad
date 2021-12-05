import { useContext, useEffect, useState } from "react";
import { ADMIN } from "../Constants/UserEnums";
import { getUserInfo, updateUserInfo } from "../APIs/UserAPI";
import Loading from "../Components/Loading";
import Paging from "../Components/Paging";
import ToastContext from "../Context/ToastContext";
import "../Styles/Components/Profile.scss";

function Profile() {
  const [loading, setLoading] = useState(false);
  const [loadingReservations, setLoadingReservations] = useState(false);
  const [editName, setEditName] = useState(false);
  const [editEmail, setEditEmail] = useState(false);
  const [changed, setChanged] = useState(false);
  const [reservations, setReservations] = useState([]);
  const [page, setPage] = useState(1);
  const [maxPage, setMaxPage] = useState(1);
  const [role, setRole] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const { addToasts } = useContext(ToastContext);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        let res = await getUserInfo();

        if (res.status !== 200) {
          addToasts({
            type: "danger",
            body: "unexpected error, try again later",
          });
          return;
        }

        let data = await res.json();
        if (!data?.success) {
          addToasts({
            type: "danger",
            body: "invalid action ??",
          });
          setLoading(false);
          return;
        }
        setName(data.user.name);
        setEmail(data.user.email);
        setRole(data.user.role);

        // TODO GET THE RESERVATIONS
        setLoading(false);
      } catch (err) {
        addToasts({
          type: "danger",
          body: "unexpected error, try again later",
        });
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    //TODO get next pages
    (async () => {})();
  }, [page, maxPage]);

  // TODO handle delete reservation
  const handleCancelReservations = (id) => {};

  const handleUpdate = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      let res = await updateUserInfo({
        name,
        email,
      });
      if (res.status !== 200) {
        setLoading(false);
        addToasts({
          type: "danger",
          body: "faild to update user",
        });
        return;
      }
      setLoading(false);
      addToasts({
        type: "success",
        body: "data updated successfully",
      });
      setChanged(false);
      setEditEmail(false);
      setEditName(false);
    } catch (err) {
      setLoading(false);
      addToasts({
        type: "danger",
        body: "unexpected error",
      });
    }
  };

  return (
    <div className="profile" style={{ position: "relative" }}>
      {loading ? (
        <Loading />
      ) : (
        <>
          <form className="row" onSubmit={handleUpdate} required>
            <div className="img-holder">
              <div title="img holder" className="img" />
            </div>
            <div className="profile__info">
              <div className="row input__wrap">
                <input
                  className="profile__name d-block"
                  title="username"
                  type="text"
                  value={name}
                  required
                  disabled={!editName}
                  onChange={({ target }) => {
                    setChanged(true);
                    setName(target.value);
                  }}
                />
                <button
                  type="button"
                  className="edit-btn clickable"
                  onClick={() => setEditName(true)}
                >
                  edit
                </button>
              </div>
              <div className="row input__wrap">
                <input
                  className="profile__email d-block"
                  title="email"
                  type="email"
                  value={email}
                  disabled={!editEmail}
                  required
                  onChange={({ target }) => {
                    setChanged(true);
                    setEmail(target.value);
                  }}
                />
                <button
                  type="button"
                  className="edit-btn clickable"
                  onClick={() => setEditEmail(true)}
                >
                  edit
                </button>
              </div>
              {role === ADMIN ? <p className="profile__role">{role}</p> : null}
            </div>
            {changed && (
              <button className="profile__update-btn clickable">UPDATE</button>
            )}
          </form>
          <div className="" style={{ marginTop: "40px" }}>
            <h3>Reservations</h3>
            <div className="reservation-list">
              {reservations.map((r, i) => (
                <div key={i} className="reservation">
                  TODO add reservations
                </div>
              ))}
            </div>
            {reservations.length ? (
              <Paging
                pageNumber={page}
                nextA={page < maxPage}
                onInc={() => setPage((prev) => prev + 1)}
                onDec={() => setPage((prev) => prev - 1)}
              />
            ) : null}
          </div>
        </>
      )}
    </div>
  );
}

export default Profile;
