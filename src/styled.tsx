import styled from '@emotion/styled';

export const Container = styled.div`
  max-width: 800px;
  padding: 40px;
  margin: auto;
`;

export const Wrapper = styled.div`
  border: 1px solid #ddd;
  border-radius: 3px;
  padding: 2px;
  display: flex;
  flex-wrap: wrap;

  > *:not(:first-child) {
    margin-left: 3px;
  }
  > * {
    margin-top: 1px;
    margin-bottom: 1px;
  }
`;

export const Input = styled.input`
  display: block;
  width: 100%;
  height: 30px;
  border: none;
  background-color: transparent;
  outline: none !important;
`;

export const InputContainer = styled.div`
  display: inline-block;
  flex: 1;
  position: relative;
`;

export const Dropdown = styled.ul`
  position: absolute;
  left: 0;
  width: 300px;
  top: 24px;
  background-color: white;
  border: 1px solid #ddd;
  list-style: none;
  padding: 0;
  > li {
    padding: 5px 10px;
  }
`;

export const Pill = styled.div`
  background-color: #efefef;
  border-radius: 3px;
  padding: 2px 10px;
  font-size: 20px;
  display: inline-flex;
  height: 30px;
  align-items: center;
`;
