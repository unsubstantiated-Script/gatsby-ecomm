import React, { useState } from 'react';
import GatsbyImage from 'gatsby-image';
import { ImageGalleryWrapper } from './styles';
import ImageThumbnail from './ImageThumbnail';

export function ImageGallery({ images }) {
  const [activeImageThumbnail, setActiveImageThumbnail] = useState(images[0]);

  //this comes in from the child
  const handleClick = image => {
    setActiveImageThumbnail(image);
  };

  return (
    <ImageGalleryWrapper>
      <div>
        <GatsbyImage
          fluid={activeImageThumbnail.localFile.childImageSharp.fluid}
        />
      </div>
      <div>
        {images.map(image => {
          return (
            <ImageThumbnail
              key={image.id}
              // If this is true, it'll give it a nice border
              isActive={activeImageThumbnail.id === image.id}
              handleClick={handleClick}
              image={image}
            />
          );
        })}
      </div>
    </ImageGalleryWrapper>
  );
}
