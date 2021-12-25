import React, { useContext, useEffect, useState } from "react";
import { ADMIN } from "../Constants/UserEnums";
import { getUserInfo, updateUserInfo, updatePassword } from "../APIs/UserAPI";
import { getReservations, deleteTicket } from "../APIs/ReservationAPI";
import Loading from "../Components/Loading";
import EditTicket from "../Components/EditTicket";
import Paging from "../Components/Paging";
import ToastContext from "../Context/ToastContext";
import UserLevelContext from "../Context/UserLevelContext";
import edit from "../Assets/edit.svg";
import "../Styles/Components/Profile.scss";

function Profile() {
  const [loading, setLoading] = useState(false);
  const [loadingReservations, setLoadingReservations] = useState(false);
  const [editName, setEditName] = useState(false);
  const [editPassword, setEditPassword] = useState(false);
  const [editEmail, setEditEmail] = useState(false);
  const [changed, setChanged] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [editData, setEditData] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [page, setPage] = useState(1);
  const [maxPage, setMaxPage] = useState(1);
  const [role, setRole] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [oldPassword, setOldPassword] = useState("notthepassword:)");
  const [newPassword, setNewPassword] = useState("");

  const { addToasts } = useContext(ToastContext);
  const { level, setLevel } = useContext(UserLevelContext);

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

        res = await getReservations(page);

        if (res.status !== 200) {
          addToasts({
            type: "danger",
            body: "unexpected error, try again later",
          });
          setLoading(false);
          return;
        }

        data = await res.json();
        setReservations(data.reservations);
        setMaxPage(data.maxPages);

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
    (async () => {
      await updateResr();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, maxPage]);

  const updateResr = async () => {
    try {
      setLoadingReservations(true);
      let res, data;
      res = await getReservations(page);

      if (res.status !== 200) {
        addToasts({
          type: "danger",
          body: "unexpected error, try again later",
        });
        setLoadingReservations(false);
        return;
      }

      data = await res.json();
      setLevel(
        `img-${
          (data.reservations.reduce(
            (acc, { tickets }) => acc + !!tickets.length,
            0
          ) %
            4) +
          1
        }`
      );
      setReservations(data.reservations);
      setMaxPage(data.maxPages);

      setLoadingReservations(false);
    } catch (err) {
      addToasts({
        type: "danger",
        body: "unexpected error, try again later",
      });
      setLoadingReservations(false);
    }
  };

  const handleCancelReservations = async (id) => {
    if (!window.confirm("are you sure you want to cancel the ticket")) return;
    try {
      setLoadingReservations(true);
      let res = await deleteTicket(id);
      let data = await res.json();

      if (res.status !== 200 || !data.success) {
        addToasts({
          type: "danger",
          body: "faild to delete the ticket",
        });
        setLoadingReservations(false);
        return;
      }

      addToasts({
        type: "success",
        body: "ticket deleted",
      });
      setLoadingReservations(false);
      await updateResr();
    } catch (err) {
      addToasts({
        type: "danger",
        body: "unexpected error",
      });
      setLoadingReservations(false);
    }
  };

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
      // incase if we want to change the password
      if (editPassword && newPassword.trim() !== oldPassword.trim()) {
        res = await updatePassword({
          newPassword: newPassword.trim(),
          oldPassword: oldPassword.trim(),
        });

        if (res.status !== 200) {
          setLoading(false);
          addToasts({
            type: "danger",
            body: "faild to update password",
          });
          return;
        }
      }

      setLoading(false);
      addToasts({
        type: "success",
        body: "data updated successfully",
      });
      setChanged(false);
      setEditEmail(false);
      setEditName(false);
      setOldPassword("notthepassword:)");
      setEditPassword(false);
    } catch (err) {
      setLoading(false);
      addToasts({
        type: "danger",
        body: "unexpected error",
      });
    }
  };

  const handleEditTicket = (ticket) => {
    setEditData(ticket);
    setShowEdit(true);
  };

  return (
    <div className="profile" style={{ position: "relative" }}>
      {loading ? (
        <Loading />
      ) : (
        <>
          <form className="row" onSubmit={handleUpdate} required>
            <div className="img-holder">
              <div title="img holder" className={`img ${level}`} />
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
              <div className="row input__wrap">
                <input
                  className="profile__name d-block"
                  title="old-password"
                  type="password"
                  value={oldPassword}
                  required
                  disabled={!editPassword}
                  onChange={({ target }) => {
                    setChanged(true);
                    setOldPassword(target.value);
                  }}
                />
                <button
                  type="button"
                  className="edit-btn clickable"
                  onClick={() => {
                    setEditPassword(true);
                    setOldPassword("");
                  }}
                >
                  edit
                </button>
              </div>
              <div className="row input__wrap">
                {editPassword && (
                  <input
                    className="profile__name d-block"
                    title="new-password"
                    type="password"
                    value={newPassword}
                    required
                    disabled={!editPassword}
                    onChange={({ target }) => {
                      setChanged(true);
                      setNewPassword(target.value);
                    }}
                  />
                )}
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
              {loadingReservations && <Loading />}
              {reservations.map((r, i) => (
                <React.Fragment key={i}>
                  {r.tickets.length ? (
                    <div key={i} className="reservation">
                      <div className="res__date">
                        Added At
                        <span>
                          {new Date(r.createdAt).toLocaleString("en-US")}
                        </span>
                      </div>
                      <div className="ticket-list">
                        {r.tickets.map((t, j) => (
                          <div key={`${i}-${j}`} className="ticket">
                            <h3 className="ticket__number">
                              <span>Ticket:</span>
                              {t.ticketNumber}
                            </h3>
                            <h3 className="ticket__number">
                              <span>Flight:</span>
                              {t.flightNumber}
                            </h3>
                            <h3 className="ticket__number">
                              <span>Dept:</span>
                              {new Date(t.departure).toLocaleString("en-US")}
                            </h3>
                            <h3 className="ticket__number">
                              <span>Arrival:</span>
                              {new Date(t.arrival).toLocaleString("en-US")}
                            </h3>
                            <h3 className="ticket__number">
                              <span>Dept:</span>
                              {t.departureLocation.name}
                            </h3>
                            <h3 className="ticket__number">
                              <span>Arrival:</span>
                              {t.arrivalLocation.name}
                            </h3>
                            <h3
                              className="ticket__number"
                              style={{ textTransform: "uppercase" }}
                            >
                              <span>Price:</span>
                              {t.classType} , {t.isChild ? "CHILD" : "ADULT"}
                            </h3>
                            <h3 className="ticket__number">
                              <span>Price:</span>
                              {t.price} EGP
                            </h3>
                            <h3 className="ticket__seats">
                              <span>Seat:</span>
                              <div className="seat">{t.seatNumber}</div>
                            </h3>
                            <h3
                              className="ticket__number"
                              style={{ letterSpacing: "unset" }}
                            >
                              <span>{t.paid ? "PAID" : "NOT PAID"}</span>
                            </h3>
                            <button
                              type="button"
                              className="cancel-btn clickable"
                              onClick={() => handleCancelReservations(t._id)}
                            >
                              x
                            </button>
                            <button
                              type="button"
                              className="edit-btn clickable"
                              onClick={() => handleEditTicket(t)}
                            >
                              <img src={edit} alt="edit" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </React.Fragment>
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
      {showEdit && (
        <EditTicket
          onExit={() => setShowEdit(false)}
          data={editData}
          onDoneEdit={async () => await updateResr()}
        />
      )}
    </div>
  );
}

export default Profile;
