import { View, Text, Pressable, ScrollView } from 'react-native';
import React, { useState, useEffect } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Col, Grid } from "react-native-easy-grid";
import styles from '../style/style';

// Setting constants for the game
let board = [];
const SPOTS = [
    { value: 1, icon: 'numeric-1-circle' },
    { value: 2, icon: 'numeric-2-circle' },
    { value: 3, icon: 'numeric-3-circle' },
    { value: 4, icon: 'numeric-4-circle' },
    { value: 5, icon: 'numeric-5-circle' },
    { value: 6, icon: 'numeric-6-circle' }
];
const NBR_OF_THROWS = 3;
const NBR_OF_DICES = 5;

export default function Gameboard() {
    // state variables
    const [nbrOfThrowsLeft, setnbrOfThrowsLeft] = useState(NBR_OF_THROWS); // How many throws user has left
    const [status, setStatus] = useState('Throw dices.'); // Message to the user
    const [bonusStatus, setBonusStatus] = useState('You are  63 points away from bonus'); // Message for the user what is the status to get the bonus
    const [totalPoints, setTotalPoints] = useState(0); // Calculated total of selected points
    const [selectedDices, setSelectedDices] =
        useState(new Array(NBR_OF_DICES).fill(false)); // variable to hold data of the selected dices
    const [diceValues, setDiceValues] = useState([]); // variable to save the values of dices that are thrown
    const [selectedPoints, setSelectedPoints] =
        useState(new Array(6).fill(false)); // variable to hold data of the selected points
    const [points, setPoints] = useState(new Array(6).fill(0)); // variable to save the sum of spotcounts for each point

    // call useEffect everytime variable nbrOfThrowsLeft changes
    useEffect(() => {
        // Check whether user still hass to throw dices before setting the points
        if (nbrOfThrowsLeft < NBR_OF_THROWS) {
            setStatus('Select and throw dices again.');
        }
        // Check if user has to select points for this turn
        if (nbrOfThrowsLeft === 0) {
            setStatus('Select your points.');
        }
        // Check if user has gotten the bonus and if game has ended
        checkBonusPoints();
    }, [nbrOfThrowsLeft]);

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
        // local variable to add values for each dices that are thrown
        let dices = [...diceValues];
        // local variable to reduce the number of throws left for this turn
        let throws = nbrOfThrowsLeft - 1;
        // All dices that are not selected by the user are thrown and the images and values saved to respective variables 
        for (let i = 0; i < NBR_OF_DICES; i++) {
            if (!selectedDices[i]) {
                let randomNumber = Math.floor(Math.random() * 6 + 1);
                board[i] = 'dice-' + randomNumber;
                dices[i] = randomNumber;
            }
        }
        // update the state variables with local variables
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

        // create local variables to check which dices are selected
        let dices = [...selectedDices];
        // When user clicks a dice, all the dice with same spotcount are selected (or unselected if already selected)
        for (let x = 0; x < diceValues.length; x++) {
            if (diceValues[i] === diceValues[x]) {
                dices[x] = selectedDices[i] ? false : true;
            }
        }
        // update state variable
        setSelectedDices(dices);
    }

    // function to set the colors for selected and unselected dice if selected black and if unselected steelblue
    function getDiceColor(i) {
        return selectedDices[i] ? "black" : "steelblue";
    }

    // Function for selecting points
    function selectPoints(i) {
        // if user tries to select points after all points are selected and the game is ended
        if (selectedPoints.every(x => x === true)) {
            setStatus('Press Start Over to play again.');
            return;
        }
        // if user hasn't thrown dices 3 times
        if (nbrOfThrowsLeft > 0) {
            setStatus('Throw 3 times before setting points.')
            return;
        }
        // if user has already selected point
        if (selectedPoints[i]) {
            setStatus('You already selected points for ' + SPOTS[i].value);
            return;
        }
        // declare local variable to check the selected point
        let selected = [...selectedPoints];
        // When point is selected that point is chaged from false (unselected) to true (selected)
        selected[i] = true;
        // state variable for selected points is updated with the local variable
        setSelectedPoints(selected);
        // Function is called to calculate the spot counts of  dices with thes selected point (index of the selected point)
        calculateSpotCountPoints(i);
        // New turn starts and proper message to user is set
        setStatus('Throw dices.');
        // After the points are selected all dices are set to unselected
        setSelectedDices(new Array(NBR_OF_DICES).fill(false));
        // Update the state variable and set number that user has left for the next turn
        setnbrOfThrowsLeft(NBR_OF_THROWS);
    }

    // function to set the colors for selected and unselected points if selected black and if unselected steelblue
    function getPointsColor(i) {
        return selectedPoints[i] ? "black" : "steelblue";
    }

    // Function to calculate the spotcounts of dices based on the selected point. Function takes the index of the selected point as parameter
    function calculateSpotCountPoints(i) {
        // declare local variable to calculate the sum for the dices with selected point
        let sum = 0;
        // The values for all the dices are checked
        for (let x = 0; x < diceValues.length; x++) {
            // If the value of a dice is equal with the selected point it's added to the sum
            if (diceValues[x] === SPOTS[i].value) {
                sum = sum + diceValues[x];
            }
        }
        // local variable is declared to save the sum of dices for the selected point
        let array = [...points];
        // Sum is saved to local variable in the index for respected spotcount
        array[i] = sum;
        // State variable for the points is updated with local variable
        setPoints(array);
        // Totalpoints is calculated by sending the local variable to the function
        calculateTotalPoints(array);
    }

    // function to calculate total points from the selected points
    function calculateTotalPoints(arr) {
        // function takes an array and calcluates the sum of the values in that array and saves in local variable
        let sum = arr.reduce((a, b) => a + b, 0);
        // state variable is updated with the local variable
        setTotalPoints(sum);
    }

    // function to check if user gets the bonus and has selected all the points
    function checkBonusPoints() {
        // If game hasn't ended and user hasn't got the bonus
        if (!selectedPoints.every(x => x === true) && totalPoints < 63) {
            setBonusStatus('You are ' + (63 - totalPoints) + ' points away from bonus');
        }
        // If game hasn't ended and user has got the bonus
        if (!selectedPoints.every(x => x === true) && totalPoints >= 63) {
            setBonusStatus('You got the bonus!');
        }
        // If game has ended and user hasn't got the bonus
        if (selectedPoints.every(x => x === true) && totalPoints < 63) {
            setBonusStatus('You were ' + (63 - totalPoints) + ' points away from bonus');
            setStatus('Game over. All points selected.');
        }
        // If game has ended and user has got the bonus
        if (selectedPoints.every(x => x === true) && totalPoints >= 63) {
            setBonusStatus('You got the bonus!');
            setStatus('Game over. All points selected.');
        }
    }

    // function to restart the game.
    function startOver() {
        setnbrOfThrowsLeft(NBR_OF_THROWS);
        setStatus('Throw dices');
        setBonusStatus('You are  63 points away from bonus');
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
                key={'row' + i}
                onPress={() => selectDice(i)}>
                <MaterialCommunityIcons
                    name={board[i]}
                    key={'dice' + i}
                    size={60}
                    color={getDiceColor(i)}>
                </MaterialCommunityIcons>
            </Pressable>
        )
    }

    // For rendering the points
    const points_row = [];
    for (let i = 0; i < SPOTS.length; i++) {
        points_row.push(
            <View key={'point' + i} style={styles.skills}>
                <Text>{points[i]}</Text>
                <Grid style={styles.grid}>
                    <Col size={80}>
                        <Pressable
                            key={'points_row' + i}
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
                    <Text style={styles.pointsRow}>{points_row}</Text>
                </View>
            </ScrollView>
        </View>
    );
}
