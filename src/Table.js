import classes from "./Table.module.css";
import { useEffect, useState, useRef } from "react";

const Table = () => {
  const newCategoryRef = useRef();
  const [showInput, setShowInput] = useState(false);
  const [hoverId, setHoverId] = useState("");
  const [filterText, setFilterText] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [categoryData, setCategoryData] = useState([]);

  function fetchCategory() {
    fetch("http://bc04-46-1-227-153.ngrok.io/categories")
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setCategoryData(data);
      });
  }

  const confirmChangeCategory = (e) => {
    e.preventDefault();

    console.log(hoverId);
    console.log(newCategory);

    fetch(
      `http://bc04-46-1-227-153.ngrok.io/categories/${hoverId}/${newCategory}`,
      {
        method: "PUT",
      }
    )
      .then((response) => {
        if (response.ok) {
          window.location.reload();
        } else if (!response.ok) {
          throw new Error("Bir hata oldu, yeniden deneyiniz!");
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
      })
      .catch((err) => alert(err.message));
  };

  const onFilterTextHandler = (e) => {
    setFilterText(e.target.value.toLocaleLowerCase());
  };

  //   console.log(data.map((item) => item).filter((item) => item.id === id));

  useEffect(() => {
    fetchCategory();
    return () => {};
  }, []);

  categoryData.sort((a, b) => (a.mcc_code > b.mcc_code ? 1 : -1));

  const filteredItems = categoryData.filter((item) =>
    item.category_name.toLocaleLowerCase().includes(filterText)
  );

  return (
    <div className={classes.container}>
      <h1>İŞLEM KATEGORİ DEĞİŞİMİ</h1>
      <div className={classes.nav}>
        <div className={classes.search}>
          <label htmlFor="search">İşlem Ara</label>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={classes.icon}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            id="search"
            placeholder="Category Name"
            value={filterText}
            onChange={onFilterTextHandler}
          />
        </div>
        <div></div>
      </div>
      <table>
        <thead>
          <tr>
            <th>PFM MCC CODE</th>
            <th>CATEGORY NAME</th>
            <th>CATEGORY NAME PREVIOUS</th>
            <th>UPDATE DATE</th>
          </tr>
        </thead>

        {filteredItems.map((item) => {
          return (
            <tbody key={item.mcc_code}>
              <tr key={item.mcc_code}>
                <td className={classes.check}>{item.mcc_code}</td>

                <td className={classes.categoryName} id={item.mcc_code}>
                  {item.category_name}
                  {showInput && hoverId === item.mcc_code && (
                    <form onSubmit={confirmChangeCategory}>
                      <input
                        type="text"
                        ref={newCategoryRef}
                        onChange={() =>
                          setNewCategory(newCategoryRef.current.value)
                        }
                      />
                      <button type="submit" className={classes.confirmBtn}>
                        Güncelle
                      </button>
                    </form>
                  )}
                  {!showInput && (
                    <button
                      className={classes.changeButton}
                      onClick={() => {
                        setShowInput(true);
                        setHoverId(item.mcc_code);
                      }}
                      id={item.mcc_code}
                    >
                      Değiştir
                    </button>
                  )}
                  {showInput && hoverId === item.mcc_code && (
                    <div>
                      <button
                        onClick={() => {
                          setShowInput(false);
                          setHoverId("");
                        }}
                        className={classes.cancelBtn}
                      >
                        İptal
                      </button>
                    </div>
                  )}
                </td>

                <td>{item.category_name_previous}</td>
                <td>{item.update_date}</td>
              </tr>
            </tbody>
          );
        })}
      </table>
    </div>
  );
};

export default Table;
