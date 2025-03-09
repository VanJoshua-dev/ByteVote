import { useEffect, useState } from "react";

function DebugPage() {
  const [getData, setGetData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/api/testPost", {
      method: "POST", // Set to POST
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key: "value" }) // Adjust if needed
    })
      .then(response => response.json())
      .then(data => {
        setGetData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []); // Empty dependency array = runs only once

  return (
    <div className='w-screen h-screen p-4'>
      <h1>This is debug page:</h1>
      {loading ? <p>Loading...</p> : <pre>{JSON.stringify(getData, null, 2)}</pre>}
    </div>
  );
}

export default DebugPage;
