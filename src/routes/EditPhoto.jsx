import { useEffect } from "react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const EditPhoto = () => {
  const [imageUrl, setImageUrl] = useState("");
  const [captions, setCaptions] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();

  const baseUrl = "http://localhost:3001/photos";
  const editPhoto = (e) => {
    e.preventDefault();
    fetch(baseUrl + '/' + id, {
      method: "PATCH",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        imageUrl: imageUrl,
        captions: captions,
        updatedAt: new Date(),
      }),
    }).then((response) => {
      if (response.status === 403) {
        setError("You are not authorized to edit photos");
      } else {
        navigate("/photos");
      }
    });
  };

  useEffect(() => {
    setLoading(true);
    fetch(baseUrl + '/' + id).then((response) => response.json()).then((data) => {
      setImageUrl(data.imageUrl);
      setCaptions(data.captions);
      setLoading(false);
    })
  }, [id]);

  if (error) return <div>Error!</div>;

  return (
    <>
      {loading ? (
        <h1 style={{ width: "100%", textAlign: "center", marginTop: "20px" }}>Loading...</h1>
      ) : (
        <div className="container">
          <form className="edit-form" onSubmit={editPhoto}>
            <label>
              Image Url:
              <input className="edit-input" type="text" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
            </label>
            <label>
              Captions:
              <input
                className="edit-input"
                type="text"
                value={captions}
                data-testid="captions"
                onChange={(e) => setCaptions(e.target.value)}
              />
            </label>
            <input className="submit-btn" type="submit" value="Submit" data-testid="submit" />
          </form>
        </div>
      )}
    </>
  );
};

export default EditPhoto;
