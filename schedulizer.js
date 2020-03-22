'use strict';

// This class holds all the data that is recursively passed on 
class AllData{
    
    teams;
    rows;
    columns;
    possibilities;
    currentRow;
    currentColumn;
    schedule;
    position;

    constructor(teams, prettify) {
        this.teams = teams;

        // Define #rows and #columns 
        this.rows = teams - 1; // -1, because teams have only teams-1 unique opponents
        this.columns = teams;

        // Define empty schedule
        this.schedule = [];
        for (let r=0; r<this.rows; r++) {
            this.schedule.push([]);            
            for (let c=0; c<this.columns; c++) {
                this.schedule[r][c] = [ undefined, undefined ];
            }
        }

        // Define possibilities for each position in the schedule
        // Define empty possibilities
        this.possibilities = [];
        for (let c=0; c<this.columns; c++) {
            this.possibilities.push([]);
        }

        // Fill all possibilities
        for (let r=0; r<this.rows; r++) {
            for (let c=0; c<this.columns; c++) {
                let teamCombinations = [];
                
                for(let teamOne=0; teamOne<this.teams; teamOne++) {
                    // Only add combinations where second team is bigger than first team
                    // That excludes doubles like adding firs 1-2 and later 2-1
                    for(let teamTwo=teamOne+1; teamTwo<this.teams; teamTwo++) {
                        teamCombinations.push([teamOne, teamTwo]);
                    }
                }

                this.possibilities[r][c] = teamCombinations;
            }
        }
        
        // If a prettier schedule is wanted, exclude possibilities where we don't want to have teams
        if (prettify) { 
            for (let r=0; r<this.rows; r++) {
                for (let c=this.columns/2; c<this.columns; c++) {
                    let column = c + r;
                    if (column >= this.columns) {
                        column -= this.columns;
                    }
                    this.possibilities[r][column] = [];
                }
            }
        }
    }
}

// A helper function to print the schedule in a nice format in the console
function printSchedule(data) {
    let styledString = '';

    for (let r=0; r<data.rows; r++) {
        for (let c=0; c<data.columns; c++) {
            if (data.schedule[r][c][0] == undefined) {
                styledString += "    "
            } else {
                styledString += data.schedule[r][c][0]+1 + "-" + (data.schedule[r][c][1]+1)
                if (data.schedule[r][c][1]+1 < 10) {
                    styledString += " ";
                }                
            }

            if (c != data.columns-1) { styledString += " | " }
        }
        styledString += "\n";
    } 

    console.log(styledString);
}

var recursions = 0;

// The actual recursive function to find the schedule
// The data passed on is an instance of the class above
function findScheduleRecursively(data) {

    // Track the number of steps taken
    recursions++;

    // If half of the schedule is filled, the schedule is complete
    let filled = 0;
    for (let r=0; r<data.rows; r++) {
        for (let c=0; c<data.columns; c++) {
            if (data.schedule[r][c][0] != undefined ) {
                filled++;
            }
        }
    }
    if (filled == (data.rows * data.columns / 2)) {
        console.log('Solution found!');
        printSchedule(data);
        return true;        
    }

    // Find the place in the schedule that has the least #possibilities
    let bestRow;
    let bestColumn;
    let bestPossibilities = 999;
    for (let r=0; r<data.rows; r++) {
        for (let c=0; c<data.columns; c++) {
            if (data.possibilities[r][c].length < bestPossibilities && data.possibilities[r][c].length != 0) {
                bestRow = r;
                bestColumn = c;
                bestPossibilities = data.possibilities[r][c].length;
            }
        }
    }
    data.currentRow = bestRow;
    data.currentColumn = bestColumn;

    // No possibilities found? Then we can't go further, we need to go back(track).
    if (data.currentRpw == undefined && data.currentColumn == undefined) {
        return false;
    }

    // Possibilities found. Let's go through them one by one.
    let possibilities = data.possibilities[data.currentRow][data.currentColumn];

    let newTeamOne;
    let newTeamTwo;
    for(let p=0; p<possibilities.length; p++) {

        // Copy data to pass on
        let newData = JSON.parse(JSON.stringify(data));
        
        // Set the possibility in the schedule
        newData.schedule[newData.currentRow][newData.currentColumn] = possibilities[p];

        // Remove impossible possibilities
        newTeamOne = possibilities[p][0];
        newTeamTwo = possibilities[p][1];

        // Go through all positions in the schedule 
        for (let r=0; r<newData.rows; r++) {
            for (let c=0; c<newData.columns; c++) {
                // Go through all posibilities from that position (backwards)
                let possibilities = newData.possibilities[r][c];
                for(let i=possibilities.length-1; i>=0; i--) {
                    let possibleTeamOne = possibilities[i][0];
                    let possibleTeamTwo = possibilities[i][1];
                    if (
                        // It's on the same position
                        (newData.currentColumn == c && newData.currentRow == r)

                        // It's the same team combination
                        || (possibleTeamOne == newTeamOne && possibleTeamTwo == newTeamTwo)

                        // Same team on the same row
                        || (newData.currentRow == r && (possibleTeamOne == newTeamOne))
                        || (newData.currentRow == r && (possibleTeamOne == newTeamTwo))
                        || (newData.currentRow == r && (possibleTeamTwo == newTeamOne))
                        || (newData.currentRow == r && (possibleTeamTwo == newTeamTwo))

                        
                        // Same team on the same column
                        || (newData.currentColumn == c && (possibleTeamOne == newTeamOne))
                        || (newData.currentColumn == c && (possibleTeamOne == newTeamTwo))
                        || (newData.currentColumn == c && (possibleTeamTwo == newTeamOne))
                        || (newData.currentColumn == c && (possibleTeamTwo == newTeamTwo))
                        
                    ) {
                        // Remove the possibility
                        newData.possibilities[r][c].splice(i, 1);
                    }
                }
            }
        }

        // Check if it's still possible to complete the schedule
        let keepGoing = true;
        for (let r=0; r<newData.rows; r++) {
            for (let c=0; c<newData.columns; c++) {               
                // Check if a place in the schedule is empty and has no possibilities left
                if (newData.possibilities[r][c][0] == undefined && newData.schedule[r][c][0] == undefined) {

                    let rightPlaces;

                    // Count all places in the row that are filled in the schedule and/or have still possibilities
                    rightPlaces = 0;
                    for (let column=0; column<newData.columns; column++) {
                        if (newData.schedule[r][column][0] != undefined || newData.possibilities[r][column][0] != undefined) {
                            rightPlaces++;
                        }
                    }
                    // If that count is less than half of the teams, there is no way the schedule can be completed.
                    // (note: each position can have 2 teams)
                    if (rightPlaces < newData.teams / 2) {
                        keepGoing = false;
                        break;
                    }

                    // Count all places in the column that are filled in the schedule and/or have still possibilities
                    rightPlaces = 0;
                    for (let row=0; row<newData.rows; row++) {
                        if (newData.schedule[row][c][0] != undefined || newData.possibilities[row][c][0] != undefined) {
                            rightPlaces++;
                        }
                    }

                    // If that count is less than half of the teams, there is no way the schedule can be completed.
                    // (note: each position can have 2 teams)
                    // (note: because there is one row less than there are teams, see line #19)
                    if (rightPlaces < newData.teams / 2 - 1) {
                        keepGoing = false;
                        break;
                    }
                    
                }
            }
        }

        // If it's still possible to complete the schedule, go on.
        if (keepGoing) {
            if (findScheduleRecursively(newData)) {
                return true;
            }
        }
    }

    // Tried all possibilities. We can't go further, we need to go back(track).
    return false;
}

// Some initialization and logging around calling the actual function
function findSchedule(teams, prettify) {
    console.log('Finding schedule for %s teams.', teams);   
    
    let data = new AllData(teams, prettify);
    findScheduleRecursively(data);

    console.log('Steps taken: ' + recursions);
}

// Find the schedule!
findSchedule(
    10,     // number of teams
    false   // pretty schedule?
);