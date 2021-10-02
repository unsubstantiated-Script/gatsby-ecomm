import React, { useState, useEffect } from 'react';
import GatsbyImage from 'gatsby-image';
import { ImageGalleryWrapper } from './styles';
import ImageThumbnail from './ImageThumbnail';

export function ImageGallery({
  selectedVariantImageId,
  images,
  showVariantGallery,
}) {
  //Making the image change up based on the selection or it will return the first image in the array
  const [activeImageThumbnail, setActiveImageThumbnail] = useState(
    images.find(({ id }) => id === selectedVariantImageId) || images[0]
  );

  //Loads up the page with this when stuff changes
  useEffect(() => {
    setActiveImageThumbnail(
      images.find(({ id }) => id === selectedVariantImageId) || images[0]
    );
  }, [selectedVariantImageId, setActiveImageThumbnail, images]);

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
        {/* Not gonna show the smaller gallery if there's no variants */}
        {showVariantGallery && (
          <>
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
          </>
        )}
      </div>
    </ImageGalleryWrapper>
  );
}
