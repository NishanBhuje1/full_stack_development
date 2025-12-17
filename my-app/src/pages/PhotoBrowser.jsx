import React, { useState, useEffect } from "react";
import { getPhotos } from "../actions/photoActions";
import { ColumnsPhotoAlbum } from "react-photo-album";
import "react-photo-album/columns.css";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

// import optional lightbox plugins
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Slideshow from "yet-another-react-lightbox/plugins/slideshow";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/plugins/thumbnails.css";

export default function PhotoBrowser() {
  const [photos, setPhotos] = useState([]);
  const [collections, setCollections] = useState([]);
  const [index, setIndex] = useState(-1);

  useEffect(() => {
    (async () => {
      try {
        const data = await getPhotos();
        const transformedPhotos = data.map((photo) => ({
          src: photo.urls.small,
          width: photo.width,
          height: photo.height,
          id: photo.id,
          description: photo.description || "Photo",
          alt: photo.alt_description || "Photo",
          regular: photo.urls.regular,
          link: photo.links.html,
        }));
        setPhotos(transformedPhotos);
      } catch (error) {
        console.error("Error fetching photos:", error);
      }
    })();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4 text-center">Photo Browser</h2>
      <ColumnsPhotoAlbum
        photos={photos}
        onClick={({ index }) => setIndex(index)}
        columns={(containerWidth) => {
          if (containerWidth < 400) return 1;
          if (containerWidth < 800) return 2;
          return 3;
        }}
        spacing={10}
        padding={0}
        renderPhoto={({ photo, wrapperStyle, renderDefaultPhoto }) => (
          <a
            href={photo.link}
            target="_blank"
            rel="noopener noreferrer"
            style={wrapperStyle}
          >
            {renderDefaultPhoto({ alt: photo.alt })}
          </a>
        )}
      />
      <Lightbox
        open={index >= 0}
        close={() => setIndex(-1)}
        index={index}
        slides={photos.map((photo) => ({
          src: photo.regular,
          title: photo.description,
          alt: photo.alt,
        }))}
        plugins={[Fullscreen, Slideshow, Thumbnails, Zoom]}
      />
    </div>
  );
}
