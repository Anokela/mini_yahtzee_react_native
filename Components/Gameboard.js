import { View, Text, Pressable, ScrollView } from 'react-native';
import React, { useState, useEffect } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Col, Grid } from "react-native-easy-grid";
import styles from '../style/style';

let board = [];
const SPOTS = [{ value: 1, icon: 'numeric-1-circle' }, { value: 2, icon: 'numeric-2-circle' }, { value: 3, icon: 'numeric-3-circle' }, { value: 4, icon: 'numeric-4-circle' }, { value: 5, icon: 'numeric-5-circle' }, { value: 6, icon: 'numeric-6-circle' }];
const NBR_OF_THROWS = 3;
const NBR_OF_DICES = 5;

export default function Gameboard() {
    const [nbrOfThrowsLeft, setnbrOfThrowsLeft] = useState(NBR_OF_THROWS);
    const [status, setStatus] = useState('Throw dices.');
    const [bonusStatus, setBonusStatus] = useState('You are  63 points away from bonus');
    const [totalPoints, setTotalPoints] = useState(0);
    const [selectedDices, setSelectedDices] =
        useState(new Array(NBR_OF_DICES).fill(false));
    const [diceValues, setDiceValues] = useState([]);
    const [selectedPoints, setSelectedPoints] =
        useState(new Array(6).fill(false));
    const [points, setPoints] = useState(new Array(6).fill(0));

    useEffect(() => {
        if (nbrOfThrowsLeft > 0 && nbrOfThrowsLeft < NBR_OF_THROWS) {
            setStatus('Select and throw dices again.');
        }

        if (nbrOfThrowsLeft === 0) {
            setStatus('Select your points.');
        }
        checkBonusPoints();
    }, [nbrOfThrowsLeft]);

    // function to set the colors for selected and unselected dice
    function getDiceColor(i) {
        return selectedDices[i] ? "black" : "steelblue";
    }

    // function to set the colors for selected and unselected points
    function getPointsColor(i) {
        return selectedPoints[i] ? "black" : "steelblue";
    }

    // function for throwing the dices 
    function throwDices() {
        // if all points are selected game is started over
        if (selectedPoints.every(x => x === true)) {
            startOver();
            return;
        }
        // if user has thrown dices 3 times and tries to throw dices before selecting points
        if (nbrOfThrowsLeft === 0) {
            setStatus('Select your points before next throw.');
            return;
        }
        let dices = [...diceValues];
        let throws = nbrOfThrowsLeft - 1;
        // All dices that are not selected by the user are thrown and the images and values saved to respective variables 
        for (let i = 0; i < NBR_OF_DICES; i++) {
            if (!selectedDices[i]) {
                let randomNumber = Math.floor(Math.random() * 6 + 1);
                board[i] = 'dice-' + randomNumber;
                dices[i] = randomNumber;
            }
        }
        setnbrOfThrowsLeft(throws);
        setDiceValues(dices);
    }

    // function for selecting dices
    function selectDice(i) {
        // if user tries to select dices after all points are selected and the game is ended
        if (selectedPoints.every(x => x === true)) {
            setStatus('Press Start Over to play again.');
            return;
        }
        // if user tries to select dices before he/she has thrown 3 times
        if (nbrOfThrowsLeft === 3) {
            setStatus('You have to throw dices first.');
            return;
        }
        // When user clicks a dice, all the dice with same spotcount is selected (or unselected if already selected)
        let dices = [...selectedDices];
        dices[i] = selectedDices[i] ? false : true;
        for (let x = 0; x < diceValues.length; x++) {
            if (diceValues[i] === diceValues[x]) {
                dices[x] = selectedDices[i] ? false : true;
            }
        }
        setSelectedDices(dices);
    }

    // Function for selecting points
    function selectPoints(i) {
        // if user hasn't thrown dices 3 times
        if (nbrOfThrowsLeft > 0) {
            setStatus('Throw 3 times before setting points.')
            return;
        }
        // if user has already selected point
        else if (selectedPoints[i]) {
            setStatus('You already selected points for ' + SPOTS[i].value);
            return;
        }
        // User selects point, values of every dice with respective spotcount is calculated and saved to variable
        // Totalpoints is calculated
        let array = [...points];
        let sum = 0;
        let selected = [...selectedPoints];
        selected[i] = selectedPoints[i] ? false : true;
        setSelectedPoints(selected);
        if (selected[i]) {
            for (let x = 0; x < diceValues.length; x++) {
                if (diceValues[x] === SPOTS[i].value) {
                    sum = sum + diceValues[x];
                }
            }
            array[i] = sum;
            setPoints(array);
            calculateTotalPoints(array);
        }
        setStatus('Throw dices.');
        setSelectedDices(new Array(NBR_OF_DICES).fill(false));
        setnbrOfThrowsLeft(NBR_OF_THROWS);
    }

    // function to calculate total points from the selected points
    function calculateTotalPoints(arr) {
        let sum = arr.reduce((a, b) => a + b, 0);
        setTotalPoints(sum);
    }

    // function to check if user gets the bonus and has selected all the points
    function checkBonusPoints() {
        if (!selectedPoints.every(x => x === true) && totalPoints < 63) {
            setBonusStatus('You are ' + (63 - totalPoints) + ' points away from bonus');
        }
        if (!selectedPoints.every(x => x === true) && totalPoints >= 63) {
            setBonusStatus('You got the bonus!');
        }
        if (selectedPoints.every(x => x === true) && totalPoints < 63) {
            setBonusStatus('You were ' + (63 - totalPoints) + ' points away from bonus');
            setStatus('Game over. All points selected.');
        }
        if (selectedPoints.every(x => x === true) && totalPoints >= 63) {
            setBonusStatus('You got the bonus!');
            setStatus('Game over. All points selected.');
        }
    }

    // function to restart the game
    function startOver() {
        setnbrOfThrowsLeft(NBR_OF_THROWS);
        setStatus('Throw dices');
        setBonusStatus('');
        setTotalPoints(0);
        setSelectedDices(new Array(NBR_OF_DICES).fill(false));
        setDiceValues([]);
        setSelectedPoints(new Array(6).fill(false));
        setPoints(new Array(6).fill(0));
        board = [];
    }

    // For rendering the dices
    const row = [];
    for (let i = 0; i < NBR_OF_DICES; i++) {
        row.push(
            <Pressable
                key={row + i}
                onPress={() => selectDice(i)}>
                <MaterialCommunityIcons
                    name={board[i]}
                    key={"row" + i}
                    size={60}
                    color={getDiceColor(i)}>
                </MaterialCommunityIcons>
            </Pressable>
        )
    }

    // For rendering the points
    const spot_count_row = [];
    for (let i = 0; i < SPOTS.length; i++) {
        spot_count_row.push(
            <View key={'point' + i} style={styles.skills}>
                <Text>{points[i]}</Text>
                <Grid style={styles.grid}>
                    <Col size={80}>
                        <Pressable
                            key={spot_count_row + i}
                            onPress={() => selectPoints(i)}>
                            <MaterialCommunityIcons
                                name={SPOTS[i].icon}
                                key={"row" + i}
                                size={55}
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
            <ScrollView>
                <View style={styles.flex}><Text>{row}</Text></View>
                <Text style={styles.gameinfo}>Throws left: {!selectedPoints.every(x => x === true) ? nbrOfThrowsLeft : 0}</Text>
                <Text style={styles.gameinfo}>{status}</Text>
                <View style={styles.buttonContainer}>
                    <Pressable style={styles.button}
                        onPress={() => throwDices()}>
                        <Text style={styles.buttonText}>
                            {selectedPoints.every(x => x === true) ? 'Start Over' : 'Throw dices'}
                        </Text>
                    </Pressable>
                </View>
                <Text style={styles.totalPoints}>Total: {totalPoints}</Text>
                <Text style={styles.gameinfo}>{bonusStatus}</Text>
                <View style={styles.flex}>
                    <Text style={styles.pointsRow}>{spot_count_row}</Text>
                </View>
            </ScrollView>
        </View>
    );
}
