import styled from '@emotion/styled';

export const Container = styled.div`
  max-width: 800px;
  padding: 40px;
  margin: auto;
`;

export const Wrapper = styled.div`
  border: 1px solid #ddd;
  border-radius: 3px;
  padding: 10px;
  display: flex;
  width: 800px;
  flex-wrap: wrap;
`;

export const Input = styled.input`
  display: block;
  width: 100%;
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
  top: 10px;
  background-color: white;
  border: 1px solid #ddd;
`;
