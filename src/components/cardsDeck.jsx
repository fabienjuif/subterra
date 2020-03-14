import React, { useState, useEffect } from "react";
import data from "../utils/cards";
import Card from "./card";

const CardsDeck = () => {
  const [cards, setCards] = useState([]);

  useEffect(() => {
    setCards(
      Array.from({ length: 64 })
        .map((_, index) => ({ id: index === 0 ? 0 : index === 1 ? 1 : 2 }))
        .map(({ id }) => data[id])
    );
  }, []);

  return (
    <div>
      {cards.map(tile => (
        <Card {...tile} />
      ))}
    </div>
  );
};

export default CardsDeck;
