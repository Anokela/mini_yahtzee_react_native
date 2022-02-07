import { View, Text, Pressable } from 'react-native';
import React, {useState, useEffect, useCallback} from 'react';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import styles from '../style/style';

let board = [];
const NBR_OF_THROWS = 3;
const NBR_OF_DICES = 5;

export default function Gameboard() {
    const [nbrOfThrowsLeft, setnbrOfThrowsLeft] = useState(NBR_OF_THROWS);
    const [status, setStatus] = useState('');
    const [totalPoints, setTotalPoints] = useState(0);
    const [selectedDices, setSelectedDices] = 
        useState(new Array(NBR_OF_DICES).fill(false));

    function getDiceColor(i) {
        if (board.every((val, i, arr) => val === arr[0])) {
            return "orange";
        }
        else {
            return selectedDices[i] ? "black" : "steelblue";
        }
    }

    useEffect(() => {
     checkWinner();
     if (nbrOfThrowsLeft === NBR_OF_THROWS) {
         setStatus('Game has not started');
     }
     if (nbrOfThrowsLeft < 0) {
         setnbrOfThrowsLeft(NBR_OF_THROWS - 1);
     }
    }, [nbrOfThrowsLeft]);
    

    function selectDice(i) {
        let dices = [...selectedDices];
        dices[i] = selectedDices[i] ? false :true;
        setSelectedDices(dices);
    }

    function throwDices() {
        for (let i = 0; i < NBR_OF_DICES; i++) {
            if(!selectedDices[i]) {
                let randomNumber = Math.floor(Math.random() * 6 + 1);
                board[i] = 'dice-' + randomNumber;
            }
            setnbrOfThrowsLeft(nbrOfThrowsLeft - 1);
        }
    }

    function checkWinner() {
        if (board.every((val, i, arr) => val === arr[0]) && nbrOfThrowsLeft > 0) {
            setStatus('You, won');
            setSelectedDices(new Array(NBR_OF_DICES).fill(false));
        } 
        else if (board.every((val, i, arr) => val === arr[0]) && nbrOfThrowsLeft === 0) {
            setStatus('You, won, game over');
            setSelectedDices(new Array(NBR_OF_DICES).fill(false));
        }
        else if (nbrOfThrowsLeft === 0) {
            setStatus('Game over');
            setSelectedDices(new Array(NBR_OF_DICES).fill(false));
        }
        else {
            setStatus('Keep on throwing')
        };
    }

    const row = [];
    for (let i = 0; i < NBR_OF_DICES; i++) {
        row.push(
            <Pressable
                key={row + i}
                onPress={() => selectDice(i)}>
                <MaterialCommunityIcons
                    name={board[i]}
                    key={"row" + i}
                    size={50}
                    color={getDiceColor(i)}>
                </MaterialCommunityIcons>
            </Pressable>
        )
    }
  return (
    <View style={styles.gameboard}>
      <View style={styles.flex}>{row}</View>
      <Text style={styles.gameinfo}>Throws left: {nbrOfThrowsLeft}</Text>
      <Text style={styles.gameinfo}>{status}</Text>
      <Pressable style={styles.button}
      onPress={()=> throwDices()}>
          <Text style={styles.buttonText}>
              Throw dices
          </Text>
      </Pressable>
    </View>
  );
}
