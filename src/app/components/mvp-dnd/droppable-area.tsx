import { FC, useState } from "react";
import { useDrop } from "react-dnd";
import styled from "styled-components";
import {
  CardItem,
  CARD_HEIGHT,
  CARD_TYPE,
  CARD_WIDTH,
  DraggableCard,
} from "./draggable-card";
import { DragLayer } from "./drag-layer";

const AREA_SIDE_LENGTH = 500;

const StyledDiv = styled.div`
  position: relative;
  display: grid;
  place-items: center;
  width: ${AREA_SIDE_LENGTH}px;
  height: ${AREA_SIDE_LENGTH}px;
  background-color: #fcf;
  border: 1px;
`;

const StyledP = styled.p`
  font-size: 50px;
  font-weight: bold;
`;

export const DroppableArea: FC = () => {
  const [cardData, setCardData] = useState([
    { top: 100, left: 100, name: "CARD1", id: "1" },
    { top: 200, left: 200, name: "CARD2", id: "2" },
  ]);
  const [, drop] = useDrop<CardItem, void, Record<string, never>>(
    () => ({
      accept: [CARD_TYPE],
      drop: (item, monitor) => {
        const coord = monitor.getSourceClientOffset();
        if (coord === null) return;
        if (
          coord.x < 0 ||
          coord.x > AREA_SIDE_LENGTH - CARD_WIDTH ||
          coord.y < 0 ||
          coord.y > AREA_SIDE_LENGTH - CARD_HEIGHT
        ) {
          return;
        }
        if (coord) {
          setCardData((prev) => [
            ...prev.filter((data) => data.id !== item.id),
            {
              top: coord.y,
              left: coord.x,
              name: item.name,
              id: item.id,
            },
          ]);
        }
      },
    }),
    [setCardData]
  );
  return (
  <StyledDiv ref={drop}>
      <StyledP>Droppable Area</StyledP>
      <DragLayer />
      {cardData.map(({ top, left, name, id }) => (
        <DraggableCard key={id} top={top} left={left} name={name} id={id} />
      ))}
    </StyledDiv>
  );
};