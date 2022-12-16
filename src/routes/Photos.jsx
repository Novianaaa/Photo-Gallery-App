import { useEffect } from "react";
import { useState } from "react";
import Card from "../components/Card";

const Photos = () => {
  const [photos, setPhotos] = useState([]);
  const [sort, setSort] = useState("asc");
  const [submited, setSubmited] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const baseUrl = "http://localhost:3001/photos";
  const fetchImages = (url) => {
    fetch(url).then((response) => {
      if (response.status === 403) {
        setError("You are not authorized to view photos");
      }
      return response.json();
    }).then((data) => {
      setLoading(false);
      setPhotos(data);
    });
  }

  const deletePhoto = (id) => {
    fetch(baseUrl + "/" + id, {
      method: "DELETE",
    }).then((response) => {
      if (response.status === 403) {
        setError("You are not authorized to delete photos");
      }
      return response.json();
    }).then((data) => {
      const newPhotos = photos.filter((photo) => photo.id !== id);
      setPhotos(newPhotos);
    });
  };

  useEffect(() => {
    setLoading(true);
    let url = baseUrl + "?";

    if (sort) {
      url += '_sort=id&_order=' + sort;
    }

    if (submited) {
      url += '&q=' + submited;
    }

    fetchImages(url);
  }, [sort, submited]);

  useEffect(() => {
    setLoading(true);
    fetchImages(baseUrl);
  }, []);

  if (error) return <h1 style={{ width: "100%", textAlign: "center", marginTop: "20px" }}>Error!</h1>;

  return (
    <>
      <div className="container">
        <div className="options">
          <select onChange={(e) => setSort(e.target.value)} data-testid="sort" className="form-select" style={{}}>
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSubmited(search);
            }}
          >
            <input type="text" data-testid="search" onChange={(e) => setSearch(e.target.value)} className="form-input" />
            <input type="submit" value="Search" data-testid="submit" className="form-btn" />
          </form>
        </div>
        <div className="content">
          {loading ? (
            <h1 style={{ width: "100%", textAlign: "center", marginTop: "20px" }}>Loading...</h1>
          ) : (
            photos.map((photo) => {
              return <Card key={photo.id} photo={photo} deletePhoto={deletePhoto} />;
            })
          )}
        </div>
      </div>
    </>
  );
};

export default Photos;
