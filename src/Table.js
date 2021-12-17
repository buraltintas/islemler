import classes from "./Table.module.css";
import { useEffect, useState } from "react";

const Table = () => {
  const [isChecked, setIsChecked] = useState(false);
  const [data, setData] = useState([]);
  const [lastData, setLastData] = useState([]);
  const [id, setId] = useState("");
  const [filterText, setFilterText] = useState("");
  const [changeCategory, setChangeCategory] = useState(false);

  const changeCategoryHandler = () => {
    setChangeCategory(!changeCategory);
  };

  function fetchData() {
    fetch(
      "https://islemler-c05ec-default-rtdb.europe-west1.firebasedatabase.app/islemler.json"
    )
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        const loadedData = [];

        for (const key in data) {
          loadedData.push({
            id: data[key].PFM_TRX_CODE,
            category: data[key].CATEGORY,
            trx_definition: data[key].TRX_DEFINITION,
            trx_description: data[key].TRX_DESCRIPTION,
            source_trx_code: data[key].SOURCE_TRX_CODE,
            source_owner: data[key].SOURCE_OWNER,
            business_owner: data[key].BUSINESS_OWNER,
            trx_created: data[key].TRX_CREATED,
            trx_update: data[key].TRX_UPDATE,
            trx_created_date: data[key].TRX_CREATED_DATE,
            trx_update_date: data[key].TRX_UPDATE_DATE,
          });
        }

        setData(loadedData);
      });
  }

  function fetchLastData() {
    fetch(
      "https://islemler-c05ec-default-rtdb.europe-west1.firebasedatabase.app/sonislemler.json"
    )
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        const loadedData = [];

        for (const key in data) {
          loadedData.push({
            id: data[key].PFM_TRX_CODE,
            trx_description: data[key].TRX_DESCRIPTION,
            trx_date: data[key].TRX_DATE,
          });
        }

        setLastData(loadedData);
      });
  }

  const categories = data.map((item) => item.category);

  // categories.map((item) => console.log(item));

  const checkboxHandler = (event) => {
    const { name } = event.target;

    setId(!isChecked ? name : "");
    setIsChecked(!isChecked);
  };

  const onFilterTextHandler = (e) => {
    setFilterText(e.target.value.toLocaleLowerCase());
  };

  const filteredItems = data.filter(
    (item) =>
      item.id.toLocaleLowerCase().includes(filterText) ||
      item.trx_description.toLocaleLowerCase().includes(filterText)
  );

  const itemsToDisplay = filterText ? filteredItems : data;

  const filteredLastData = lastData.filter((item) => item.id.includes(id));

  //   console.log(data.map((item) => item).filter((item) => item.id === id));

  useEffect(() => {
    fetchData();
    fetchLastData();
    return () => {};
  }, []);

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
            placeholder="İşlem kodu veya Açıklama"
            value={filterText}
            onChange={onFilterTextHandler}
          />
        </div>
        <div className={classes.buttons}>
          <button onClick={changeCategoryHandler}>Değiştir</button>
          <button>Onayla</button>
        </div>
      </div>
      <table>
        <thead>
          <tr>
            <th>PFM TRX CODE</th>
            <th>CATEGORY</th>
            <th>TRX DEFINITION</th>
            <th>TRX DESCRIPTION</th>
            <th>SOURCE TRX CODE</th>
            <th>SOURCE OWNER</th>
            <th>BUSINESS OWNER</th>
            <th>TRX CREATED</th>
            <th>TRX UPDATE</th>
            <th>TRX CREATED DATE</th>
            <th>TRX UPDATE DATE</th>
          </tr>
        </thead>

        {itemsToDisplay.map((item) => {
          return (
            <tbody key={item.id}>
              <tr key={item.id}>
                <td className={classes.check}>
                  {item.id}

                  <input
                    type="checkbox"
                    checked={item[item.id]}
                    name={item.id}
                    onChange={checkboxHandler}
                  />
                </td>
                {!changeCategory ? (
                  <td>{item.category}</td>
                ) : (
                  <td>
                    <select disabled={item.id !== id} name={item.id}>
                      <option value={item.category}>{item.category}</option>
                      {categories.map((item) => {
                        return <option value="">{item}</option>;
                      })}
                    </select>
                  </td>
                )}
                <td>{item.trx_definition}</td>
                <td>{item.trx_description}</td>
                <td>{item.source_trx_code}</td>
                <td>{item.source_owner}</td>
                <td>{item.business_owner}</td>
                <td>{item.trx_created}</td>
                <td>{item.trx_update}</td>
                <td>{item.trx_created_date}</td>
                <td>{item.trx_update_date}</td>
              </tr>
            </tbody>
          );
        })}
      </table>
      {id && <h1>İLGİLİ SON İŞLEMLER</h1>}
      {id && (
        <table>
          <thead>
            <th>PFM TRX CODE</th>
            <th>TRX DESCRIPTION</th>
            <th>TRX DATE</th>
          </thead>

          {filteredLastData.map((item) => {
            return (
              <tbody>
                <td>{item.id}</td>
                <td>{item.trx_description}</td>
                <td>{item.trx_date}</td>
              </tbody>
            );
          })}
        </table>
      )}
    </div>
  );
};

export default Table;
