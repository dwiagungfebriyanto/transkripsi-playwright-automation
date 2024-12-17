// Used to store the user's credit in the tests
let credit = 0;

/**
 * Sets the user's credit to the specified value.
 * @param {number} value - The value to set the user's credit to.
 */
function setCredit(value) {
    credit = value;
}

/**
 * Increases the user's credit by 1.
 */
function creditPlusOne() {
    credit += 1;
}

/**
 * Decreases the user's credit by 1.
 */
function creditMinusOne() {
    credit -= 1;
}

/**
 * Resets the user's credit back to 0.
 */
function resetCredit() {
    credit = 0;
}

/**
 * Returns the current value of the user's credit.
 * @returns {number} The current value of the user's credit.
 */
function getCredit() {
    return credit;
}

export default { setCredit, creditPlusOne, creditMinusOne, resetCredit, getCredit };