import React from "react";

const Player = ({ actionPoints, health, name, archetype }) => {
  return (
    <table>
      <tbody>
        <tr>
          <td>name</td>
          <td>{name}</td>
        </tr>
        <tr>
          <td>archetype</td>
          <td>{archetype}</td>
        </tr>
        <tr>
          <td>action points</td>
          <td>{actionPoints}</td>
        </tr>
        <tr>
          <td>health</td>
          <td>{health}</td>
        </tr>
      </tbody>
    </table>
  );
};

export default Player;
