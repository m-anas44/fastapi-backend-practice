import axios from "axios";

export async function getMessages(room: string) {
  const res = await axios.get(`/api/messages?room=${room}`);
  return res.data;
}
