import styled, { css } from 'styled-components';

//Handle conditional styling with multiple lines of css
const fullWidthStyles = ({ fullWidth }) => {
  //If the component has this prop
  if (fullWidth) {
    return css`
      display: block;
      width: 100%;
    `;
  }
};

export const Button = styled.button`
  outline: none;
  padding: 0 10px;
  height: 44px;
  line-height: 44px;
  box-shadow: none;
  font-size: 16px;
  font-family: 'Open Sans', sans-serif;
  cursor: pointer;
  font-weight: bold;
  text-transform: uppercase;
  background: #fff;
  color: black;
  border: 1px solid black;
  white-space: nowrap;
  //This is interpolated from above
  ${fullWidthStyles}

  //This stuff won't work if the button is disabled
  &:hover:not(:disabled) {
    color: #fff;
    background: black;
    border: 1px solid rgba(0, 0, 0, 0);
  }

  &:disabled {
    border-color: #999;
    cursor: not-allowed;
    color: #999;
  }
`;
