import styled from 'styled-components';
import { shade } from 'polished';

export const Container = styled.div`
  > header {
    height: 144px;
    background: #28262e;
    display: flex;
    align-items: center;
    div {
      max-width: 1120px;
      margin: 0 auto;
      width: 100%;
      svg {
        color: #999591;
        height: 24px;
        width: 24px;
      }
    }
  }
`;
export const Content = styled.div`
  display: flex;
  flex-direction: column;
  place-content: center;
  align-items: center;

  width: 100%;
  max-width: 700px;
  margin: -90px auto 0;
  form {
    margin: 8px 0;
    width: 340px;
    text-align: center;
    h1 {
      margin-bottom: 24px;
      text-align: left;
      font-size: 20px;
    }

    a {
      color: #f4ede8;
      display: block;
      margin-top: 24px;
      text-decoration: none;
      transition: background-color 0.2s;
      &:hover {
        color: ${shade(0.2, '#f4ede8')};
      }
    }
  }
`;

export const AvatarInput = styled.div`
  margin-bottom: 32px;
  position: relative;
  width: 180px;
  align-self: center;
  img {
    width: 180px;
    height: 180px;
    border-radius: 50%;
  }
  label {
    position: absolute;
    width: 48px;
    height: 48px;
    background: #f99000;
    border-radius: 50%;
    cursor: pointer;
    border: 0;
    right: 0;
    bottom: 0;
    transition: background-color 0.2s;

    display: flex;
    justify-content: center;
    align-items: center;
    input {
      display: none;
    }
    svg {
      width: 20px;
      height: 20px;
      color: #312e38;
    }
    :hover {
      background: ${shade(0.2, '#ff9000')};
    }
  }
`;
