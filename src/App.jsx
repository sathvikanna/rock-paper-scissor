/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import './App.css';

// Item component
function Item({ type, x, y }) {
  const emoji = type === 'rock' ? '🪨' : type === 'scissor' ? '✂️' : '📄';
  return (
    <div id='item' style={{ position: 'absolute', left: `${x}%`, top: `${y}%` }}>
      {emoji}
    </div>
  );
}

// Create initial items with velocities
const createInitialItems = () => {
  const items = [];
  ['rock', 'paper', 'scissor'].forEach(type => {
    for (let i = 0; i < 10; i++) {
      items.push({
        type,
        x: Math.floor(Math.random() * 80) + 10, // Random x between 10 and 90
        y: Math.floor(Math.random() * 80) + 10, // Random y between 10 and 90
        vx: Math.random() * 0.5 - 0.25,// Random velocity between -1 and 1
        vy: Math.random() * 0.5 - 0.25, // Random velocity between -1 and 1
      });
    }
  });
  return items;
};

// Check for collisions between two items
const checkCollision = (item1, item2) => {
  const distance = Math.sqrt((item1.x - item2.x) ** 2 + (item1.y - item2.y) ** 2);
  return distance < 3; // Detect collision if distance is less than 5 (adjust as needed)
};

// Determine the winner of a Rock, Paper, Scissors interaction
const getWinner = (type1, type2) => {
  if (type1 === type2) return null; // No change if both are the same

  if (
    (type1 === 'rock' && type2 === 'scissor') ||
    (type1 === 'scissor' && type2 === 'paper') ||
    (type1 === 'paper' && type2 === 'rock')
  ) {
    return type1; // type1 wins
  }
  return type2; // type2 wins
};

function App() {
  const [items, setItems] = useState(createInitialItems);
  const [winner, setWinner] = useState('');

  // Update item positions and check for interactions every 30ms
  useEffect(() => {
    const interval = setInterval(() => {
      setItems(prevItems => {
        const newItems = [...prevItems];

        // Update positions and check for collisions
        newItems.forEach((item, idx) => {
          let newX = item.x + item.vx;
          let newY = item.y + item.vy;

          // Reflect off the bounds (10 and 90)
          if (newX < 10 || newX > 90) item.vx = -item.vx;
          if (newY < 10 || newY > 90) item.vy = -item.vy;

          // Update position
          item.x = Math.max(10, Math.min(newX, 90));
          item.y = Math.max(10, Math.min(newY, 90));
        });

        // Check for collisions and handle transformations
        for (let i = 0; i < newItems.length; i++) {
          for (let j = i + 1; j < newItems.length; j++) {
            const item1 = newItems[i];
            const item2 = newItems[j];

            if (checkCollision(item1, item2)) {
              const winner = getWinner(item1.type, item2.type);
              if (winner) {
                // If there's a winner, update the loser to the winner's type
                if (item1.type !== winner) item1.type = winner;
                if (item2.type !== winner) item2.type = winner;
              }
            }
          }
        }

        // Check winner
        const totalCount = newItems.length;
        let rockCount = 0;
        let paperCount = 0;
        let scissorCount = 0;
        for (let i = 0; i < newItems.length; i++) {
          if (newItems[i].type === 'rock') rockCount++;
          else if (newItems[i].type === 'paper') paperCount++;
          else scissorCount++
        }
        if (rockCount === totalCount) setWinner('Rock');
        else if (paperCount === totalCount) setWinner('Paper');
        else if (scissorCount === totalCount) setWinner('Scissor');
        return newItems;
      });
    }, 30); // Update every 30ms

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, []);

  return (
    <div>
      <div id='winner'>{ winner ? `🎉🎉🎉 Winner: ${winner} 🎉🎉🎉`: '⚔️⚔️⚔️ Battle In Progress ⚔️⚔️⚔️'}</div>
      {items.map((item, idx) => (
        <Item type={item.type} x={item.x} y={item.y} key={idx} />
      ))}
    </div>
  );
}

export default App;
