import React, { useState, useEffect } from "react";
import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import "./SearchApp.css"; // Custom CSS for styling

const SearchApp = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

 
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get("https://jsonplaceholder.typicode.com/todos");
        setData(response.data);
        setFilteredData(response.data); 
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch data");
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Formik validation schema
  const validationSchema = Yup.object().shape({
    query: Yup.string().required("Search query is required"),
  });

  // Handle form submission
  const handleSearch = (values) => {
    const { query } = values;
    const results = data.filter((item) =>
      item.title.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredData(results);
  };

  return (
    <div className="search-app-container">
      <h1 className="title">Search Todos</h1>

      <Formik
        initialValues={{ query: "" }}
        validationSchema={validationSchema}
        onSubmit={handleSearch}
      >
        {() => (
          <Form className="search-form">
            <div className="input-group">
              <Field
                type="text"
                name="query"
                placeholder="Enter search query"
                className="search-input"
              />
              <ErrorMessage
                name="query"
                component="div"
                className="error-message"
              />
            </div>
            <button type="submit" className="search-button">
              Search
            </button>
          </Form>
        )}
      </Formik>

      {loading && <p className="loading-message">Loading...</p>}
      {error && <p className="error-message">{error}</p>}
      {!loading && !filteredData.length && <p className="no-results">No results found</p>}

      <ul className="results-list">
        {filteredData.map((item) => (
          <li key={item.id} className="result-item">
            {item.title}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchApp;
