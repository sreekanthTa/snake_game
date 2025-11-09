import React, { useEffect, useState, useRef } from "react";
import styles from "./snake.module.css"


const Snake = () => {


    const grid_size = 30
    const rows =   10
    const cols =   10

 

 const [snake, set_snake] = useState([
    { row: 2, col: 2 },
    { row: 2, col: 1 },
    { row: 2, col: 0 },
  ]);   

    const [food, set_food] = useState({ row: 5, col: 5 });
    const [direction, setDirection] = useState("RIGHT");

    let grid_numbers = Math.floor(rows / grid_size) * Math.floor(cols / grid_size)
    
    const grid_items = () =>{
        const items = []

        for(let i= 0; i < rows; i++){
            for(let j=0; j < cols; j++){

                const isSnake = snake.some((s) => s.row === i && s.col === j);
                const isFood = food.row === i && food.col === j;

                items.push(<div 
                    className={
                        `${styles.grid_item}
                         ${isSnake ?  styles.snake : ''}
                         ${isFood ?  styles.food : ''}`
                    } 
                    style={{
                        height: `${grid_size}px`,
                        width: `${grid_size}px`
                    }}
                    key={`${i}-${j}`}
                   
                ></div>)
            }
        }

 

        return items

    }


    const update_food = (newSnake) =>{
       let newFood ;
        while(true){
        const newCol = Math.floor(Math.random() * rows)
        const newRow = Math.floor(Math.random() * cols)

        const isOnSnake = newSnake.some(
            (cell) => cell.row ===newRow && cell.col === newCol
        );
        if (!isOnSnake){

        newFood = {row:newRow, col:newCol}
            break
        };
        }
        set_food(newFood)

    }
 


    const move_snake = () => {
        console.log("direction is", direction)
       set_snake((prevSnake) => {
  const head = prevSnake[0];
  let newHead = { ...head };

  if (direction === "RIGHT") newHead.col += 1;
  if (direction === "LEFT") newHead.col -= 1;
  if (direction === "UP") newHead.row -= 1;
  if (direction === "DOWN") newHead.row += 1;

  // Wrap-around logic
  const maxRow = rows - 1;
  const maxCol = cols - 1;

  if (newHead.row > maxRow) newHead.row = 0;
  if (newHead.row < 0) newHead.row = maxRow;
  if (newHead.col > maxCol) newHead.col = 0;
  if (newHead.col < 0) newHead.col = maxCol;

  let newSnake ;
  if(newHead.col == food.col && newHead.row == food.row){
   newSnake = [newHead, ...prevSnake];
      update_food(newSnake)

  }else{
    newSnake = [newHead, ...prevSnake.slice(0, -1)];
  }

  return newSnake;
});

    }
    
    let timeOutRef = useRef(null);
    console.log("snake positions", direction)
 useEffect(() => {
    if (timeOutRef.current) clearInterval(timeOutRef.current);
    timeOutRef.current = setInterval(() => move_snake(), 1000);
    return () => clearInterval(timeOutRef.current);
  }, [direction]);



    useEffect(()=>{
        const handleKeyDown = (e)=>{
            console.log("Event is",e.key =="ArrowUp")
            if(e.key =="ArrowUp"){
                setDirection("UP")
            }
            if(e.key =="ArrowLeft"){
                setDirection("LEFT")
            }
            if(e.key =="ArrowRight"){
                setDirection("RIGHT")
            }
            if(e.key=="ArrowDown"){
                setDirection("DOWN")
            }
        }

        window.addEventListener("keydown", handleKeyDown)

        return ()=>{
            window.removeEventListener("keydown",handleKeyDown)
        }
    },[])

    return   <div
      className={styles.grid_container}
      style={{
        gridTemplateRows: `repeat(${rows}, ${grid_size}px)`,
        gridTemplateColumns: `repeat(${cols}, ${grid_size}px)`,
      }}
    >
      {[...grid_items()]}
    </div>
}

export default Snake