/**
 * 
 * Validate the values in all sheets.
 * 
 * - Are there any duplicate fields?
 * - Are there any unused fields?
 * - Are there any teams not listed in teams sheet?
 * - Are there any teams not scheduled for matches?
 * - Are there any teams scheduled for more or fewer matches than expected?
 */

// RUN THIS FUNCTION TO VALIDATE ALL SHEETS FROM HERE
const main = () => {
    if (validateTeams() != '0') {
        Logger.log('Teams alidation failed');
        return;
    }
    if (validateGroups() != '0') {
        Logger.log('Groups validation failed');
        return;
    }
    if (validateFixtures() != '0') {
        Logger.log('Fixtures validation failed');
        return;
    }
    Logger.log('Validation successful !');
    
}

const validateTeams = () => {
    console.log('Validating teams')
}

const validateGroups = () => {
    console.log('Validating groups')
}

const validateFixtures = () => {
    console.log('Validating fixtures')
}