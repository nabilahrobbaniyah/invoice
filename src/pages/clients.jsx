import { useEffect, useState } from "react";
import { apiFetch } from "../api/http";

export default function Clients() {
  const [clients, setClients] = useState([]);

  useEffect(() => {
    apiFetch("/clients")
      .then(res => setClients(res.data))
      .catch(err => {
        if (err.message === "UNAUTHORIZED") {
          window.location.href = "/login";
        }
      });
  }, []);

  return (
    <ul>
      {clients.map(c => (
        <li key={c.id}>{c.name}</li>
      ))}
    </ul>
  );
}
