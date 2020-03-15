import React from "react";
import Card from "./card";

const CardsDeck = ({ size, card }) => {
  return (
    <div>
      <div>Remaining cards: {size}</div>
      <Card
        {...card}
        text={
          card
            ? undefined
            : "First card will be revealed after the first turn ends"
        }
      />
    </div>
  );
};

export default CardsDeck;
