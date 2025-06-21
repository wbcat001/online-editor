import { FC } from "react";
import { useDragLayer } from "react-dnd";
import styled from "styled-components";
import { CardItem, CARD_HEIGHT, CARD_WIDTH } from "./draggable-card";

type StyledDivProps = {
  top: number;
  left: number;
  x: number;
  y: number;
};
const StyledDiv = styled.div.attrs<StyledDivProps>(({ top, left, x, y }) => ({
  style: {
    left: `${left}px`,
    top: `${top}px`,
    transform: `translate(${x}px, ${y}px)`,
  },
}))<StyledDivProps>`
  position: absolute;
  will-change: transform;
  box-sizing: border-box;
  display: grid;
  place-items: center;
  width: ${CARD_WIDTH}px;
  height: ${CARD_HEIGHT}px;
  color: white;
  background-color: #2bff00;
`;

const StyledP = styled.p`
  font-size: 20px;
  font-weight: bold;
`;

export const DragLayer: FC = () => {
  const { item, offsetDifference, isDragging } = useDragLayer((monitor) => ({
    item: monitor.getItem() as CardItem,
    offsetDifference: monitor.getDifferenceFromInitialOffset(),
    isDragging: monitor.isDragging(),
  }));

  if (!isDragging || !offsetDifference || !item) {
    return null;
  }
  return (
    <StyledDiv
      top={item.coordinates.top}
      left={item.coordinates.left}
      x={offsetDifference.x}
      y={offsetDifference.y}
    >
      <StyledP>{item.name}</StyledP>
    </StyledDiv>
  );
};
