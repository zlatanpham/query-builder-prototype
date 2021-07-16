import styled from '@emotion/styled';

export const Container = styled.div`
  max-width: 800px;
  padding: 40px;
  margin: auto;
  font-family: Arial, Helvetica, sans-serif;
  input {
    font-size: 18px;
    border: 1px solid #ddd;
    font-family: Arial, Helvetica, sans-serif;
  }
`;

export const Wrapper = styled.div`
  border: 1px solid #ddd;
  border-radius: 3px;
  padding: 2px;
  display: flex;
  flex-wrap: wrap;

  > *:first-child {
    margin-left: 0;
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
  border: none !important;
  background-color: transparent;
  outline: none !important;
  font-size: 18px;
  font-family: Arial, Helvetica, sans-serif;
`;

export const InputContainer = styled.div`
  display: inline-block;
  flex: 1;
  position: relative;
  margin-left: 5px;
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

export const Pill = styled.div<{ isBegin: boolean; active: boolean }>`
  background-color: ${(props) => (props.active ? '#ff8a8a' : '#efefef')};
  border-radius: 3px;
  padding: 2px 10px;
  font-size: 18px;
  display: inline-flex;
  height: 30px;
  align-items: center;
  margin-left: ${(props) => (props.isBegin ? '5px' : '1px')};
`;

export const Pre = styled.pre`
  margin-top: 30px;
  background-color: #ddd;
  font-size: 18px;
  font-family: 'Courier New', Courier, monospace;
  padding: 30px;
  border-radius: 10px;
  white-space: pre-wrap;
`;
