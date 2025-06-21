import { FC, useEffect } from "react";
import { useDrag } from "react-dnd";
import { getEmptyImage } from "react-dnd-html5-backend";
import styled, { css } from "styled-components";

export const CARD_WIDTH = 100;
export const CARD_HEIGHT = 50;

const StyledDiv = styled.div<{
  top: number;
  left: number;
  isDragging: boolean;
}>`
  position: absolute;
  box-sizing: border-box;
  display: grid;
  place-items: center;
  width: ${CARD_WIDTH}px;
  height: ${CARD_HEIGHT}px;
  color: white;
  background-color: blue;
  ${({ top, left }) => css`
    top: ${top}px;
    left: ${left}px;
  `};
  ${({ isDragging }) => (isDragging ? "opacity: 0;" : "")}
`;
const StyledP = styled.p`
  font-size: 20px;
  font-weight: bold;
`;

export const CARD_TYPE = "Card";

export type CardItem = {
  coordinates: {
    top: number;
    left: number;
  };
  name: string;
  id: string;
};

export const DraggableCard: FC<{
  top: number;
  left: number;
  name: string;
  id: string;
}> = ({ top, left, name, id }) => {
  const [{ isDragging }, drag, preview] = useDrag<
    CardItem,
    Record<string, never>,
    { isDragging: boolean }
  >(
    () => ({
      type: CARD_TYPE,
      item: {
        coordinates: {
          top,
          left,
        },
        name,
        id,
      },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [top, left, name, id]
  );
  useEffect(() => {
    preview(getEmptyImage());
  }, []);
  return (
   <StyledDiv ref={drag} top={top} left={left} isDragging={isDragging} >
      <StyledP>{name}</StyledP>
    </StyledDiv>
  );
};
