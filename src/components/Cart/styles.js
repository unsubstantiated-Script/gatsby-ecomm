import styled from 'styled-components';
import { StyledLink } from '../StyledLink';

//This bit at the end loads up any attributes or props we wanna pass on this wrapper
export const CartWrapper = styled(StyledLink).attrs(() => ({
  to: '/cart',
}))`
  margin-left: 16px;
  display: flex;
  color: black;
  text-decoration: none;

  > svg {
    margin: auto 0;
  }

  > div:last-child {
    padding-left: 8px;
    margin: auto 0;
  }

  &:hover {
    text-decoration: underline;
  }

  @media (max-width: 460px) {
    margin-left: 0;
  }
`;
