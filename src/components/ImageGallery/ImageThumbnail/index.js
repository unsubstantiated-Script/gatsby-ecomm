import React from 'react';
import GatsbyImage from 'gatsby-image';
import { ImageThumbnailWrapper } from './styles';

export default function ImageThumbnail({ isActive, handleClick, image }) {
  return (
    <ImageThumbnailWrapper
      onClick={() => handleClick(image)}
      isActive={isActive}
    >
      <GatsbyImage fluid={image.localFile.childImageSharp.fluid} />
    </ImageThumbnailWrapper>
  );
}
