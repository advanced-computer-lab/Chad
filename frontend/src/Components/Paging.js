import "../Styles/Components/Paging.scss";

function Paging({ pageNumber, onInc, onDec, nextA }) {
  return (
    <div className="row paging">
      <button
        className={` ${
          pageNumber !== 1 ? "available" : "empty"
        } page__cntrl-btn`}
        disabled={pageNumber === 1}
        onClick={onDec}
      >
        {"<"}
      </button>
      <div className="page__number">{pageNumber}</div>
      <button
        className={` ${nextA ? "available" : "empty"} page__cntrl-btn`}
        onClick={onInc}
        disabled={!nextA}
      >
        {">"}
      </button>
    </div>
  );
}

export default Paging;
