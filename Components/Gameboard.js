import { View, Text, Pressable } from 'react-native';
import React, {useState, useEffect, useCallback} from 'react';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Col, Grid } from "react-native-easy-grid";
import styles from '../style/style';

let spot = ['','numeric-1-circle', 'numeric-2-circle', 'numeric-3-circle', 'numeric-4-circle', 'numeric-5-circle', 'numeric-6-circle'];
let board = [];
const NBR_OF_THROWS = 3;
const NBR_OF_DICES = 5;

export default function Gameboard() {
    const [nbrOfThrowsLeft, setnbrOfThrowsLeft] = useState(NBR_OF_THROWS);
    const [status, setStatus] = useState('');
    const [bonusStatus, setBonusStatus] = useState('You are 63 points away from bonus');
    const [totalPoints, setTotalPoints] = useState(60);
    const [selectedDices, setSelectedDices] = 
        useState(new Array(NBR_OF_DICES).fill(false));
    const [diceValues, setDiceValues] = useState([]);
    const [selectedPoints, setSelectedPoints] = 
    useState(new Array(6).fill(false));
    const [points, setPoints] = useState([]);

    function getDiceColor(i) {
        if (board.every((val, i, arr) => val === arr[0])) {
            return "orange";
        }
        else {
            return selectedDices[i] ? "black" : "steelblue";
        }
    }

    function getPointsColor(i) {
        return selectedPoints[i] ? "black" : "steelblue";
    }

    useEffect(() => {
    console.log(selectedPoints);
    console.log(selectedPoints.every(x => x === false));
    checkBonusPoints();
     if (nbrOfThrowsLeft === NBR_OF_THROWS) {
         setStatus('Throw Dices');
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

    function selectPoints(i) {
        if (nbrOfThrowsLeft > 0) {
            setStatus('Throw 3 times before setting points')
            return;
        }
        /* else if(selectedPoints.every(x => x === false) !== true) {
            alert('Choose only one of the points!');
            return;
        } */
       /*  else if (selectedPoints[i] === true) {

        } */
        else {
            let sum = 0;
            let points = [...points];
            let selected = [...selectedPoints];
            selected[i] = selectedPoints[i] ? false : true;
            setSelectedPoints(selected);
            if(selected[i]) {
                for(let x = 0; x < diceValues.length; x++) {
                    if (diceValues[x] === i) {
                        sum = sum + diceValues[x];
                        
                    }
                }
            points[i]= sum;
            }
            setPoints(points); 
        } 
    }

    function throwDices() {
        let dices = [...diceValues];
        for (let i = 0; i < NBR_OF_DICES; i++) {
            if(!selectedDices[i]) {
                let randomNumber = Math.floor(Math.random() * 6 + 1);
                board[i] = 'dice-' + randomNumber;
                dices[i] = randomNumber;
            }
            setnbrOfThrowsLeft(nbrOfThrowsLeft - 1);
        }
        setDiceValues(dices);
        setTotalPoints(totalPoints + 1);
    }

    function  checkBonusPoints() {
        if (nbrOfThrowsLeft > 0 && totalPoints < 63 ) {
            setStatus('Select and throw dices again');
            setBonusStatus('You are ' +( 63 - totalPoints) + ' points away from bonus');
        }
        else if (nbrOfThrowsLeft === 0 && totalPoints < 63) {
            setStatus('Select your points');
            setBonusStatus('You are ' +( 63 - totalPoints) + ' points away from bonus');
        }
        else if (nbrOfThrowsLeft === 0 && totalPoints >= 63) {
            setStatus('Select your points');
            setBonusStatus('You got the bonus!');
        }
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

    const spot_count_row = [];
    for (let i = 1; i < spot.length; i++) {
        spot_count_row.push(
            <View key={'point' + i} style={styles.skills}>
                <Text>{points[i] != undefined ? points[i] : 0}</Text>
                <Grid style={styles.grid}>
                    <Col size={80}>
                        <Pressable
                            key={spot_count_row + i}
                            onPress={() => selectPoints(i)}>
                            <MaterialCommunityIcons
                                name={spot[i]}
                                key={"row" + i}
                                size={50}
                                color={getPointsColor(i)}>
                            </MaterialCommunityIcons>
                        </Pressable>
                    </Col>
                </Grid>
            </View>   
        )
    }

  return (
    <View style={styles.gameboard}>
      <View style={styles.flex}>{row}</View>
      <Text style={styles.gameinfo}>Throws left: {nbrOfThrowsLeft}</Text>
      <Text style={styles.gameinfo}>{status}</Text>
      <View style={styles.flex}>{spot_count_row}</View>
      <Text style={styles.gameinfo}>Total points: {totalPoints}</Text>
      <Text>{bonusStatus}</Text>
      <Pressable style={styles.button}
      onPress={()=> throwDices()}>
          <Text style={styles.buttonText}>
              Throw dices
          </Text>
      </Pressable>
    </View>
  );
}
