const API_URL = "https://api.unsplash.com/";
const API_ACCESS_KEY = "TChMXJ-OnIlWM8zImV5xJWkFzKRuJdNClYTB8hrCEBw";

export async function getPhotos() {
  const response = await fetch(`${API_URL}/photos?client_id=${API_ACCESS_KEY}`);
  const data = await response.json();
  console.log(data);
  return data;
}

export async function getCollections() {
  const response = await fetch(`${API_URL}/collections?client_id=${API_ACCESS_KEY}`);
  const data = await response.json();
  console.log(data);
  return data;
}
