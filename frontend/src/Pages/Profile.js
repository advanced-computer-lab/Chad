import { useContext, useEffect, useState } from "react";
import { getUserInfo } from "../APIs/UserAPI";
import Loading from "../Components/Loading";
import Paging from "../Components/Paging";
import { ADMIN } from "../Constants/UserEnums";
import ToastContext from "../Context/ToastContext";
import "../Styles/Components/Profile.scss";

function Profile() {
  const [loading, setLoading] = useState(false);
  const [loadingReservations, setLoadingReservations] = useState(false);
  const [editName, setEditName] = useState(false);
  const [editEmail, setEditEmail] = useState(false);
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
  }, [page, maxPage]);

  // TODO handle delete reservation
  const handleCancelReservations = (id) => {};

  return (
    <div className="profile" style={{ position: "relative" }}>
      {loading ? (
        <Loading />
      ) : (
        <>
          <div className="row">
            <div className="img-holder">
              <div title="img holder" className="img" />
            </div>
            <div className="profile__info">
              <input
                className="profile__name d-block"
                value={name}
                title="username"
                disabled={!editName}
                onClick={({ target }) => setName(target.value)}
              />
              <input
                className="profile__email d-block"
                value={email}
                title="email"
                disabled={!editEmail}
                onClick={({ target }) => setEmail(target.value)}
              />
              {role === ADMIN ? <p className="profile__role">{role}</p> : null}
            </div>
          </div>
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
