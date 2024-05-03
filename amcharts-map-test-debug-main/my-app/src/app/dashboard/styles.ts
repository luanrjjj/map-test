import styled from "@emotion/styled";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  background-color: white;

  .container {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 800px;
  } 

  .select-container {
    select {
      padding: 10px;
      border: 1px solid #ccc;
      border-radius: 5px;
      width: 250px;   
    }
  }
`;

export const Map = styled.div`
  min-height: 23.3125rem;
  @media (max-width: 1440px) {
    width: 100%;
  }
`;