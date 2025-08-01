import Profile from "./Profile.jsx";
export default function Gallery() {
  const profile = {
    name: "Catline",
    url: "https://i.imgur.com/MK3eW3As.jpg",
  };
  const profile2 = {
    name: "Catline",
    url: "https://i.imgur.com/QIrZWGIs.jpg",
  };

  const showTitle = false;

  return (
    <div>
      {showTitle ? <h1>Scientists</h1> : <h1>Gallery of Scientists</h1>}

      <Profile size={100} prof={profile} />
      <Profile prof={profile2} />
      <Profile size={1000} prof={profile} />
    </div>
  );
}
