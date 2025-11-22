import { showTable } from "./showTable.js";

function fnNavMenus(pgHide, pgShow) {
    console.log("fnNavMenus() is running");
    console.log("Coming from: " + pgHide);
    console.log("Going to: " + pgShow);
    document.querySelector(pgHide).style.display = "none";  
    document.querySelector(pgShow).style.display = "block";
    document.querySelector("#pGameInputWarning").style.display = "none";
}; // END fnNavMenus()

const arrStats = [10, 25, 50, 75, 100];
const arrMoney = ["Gold", "Silver", "Iron", "Bronze", "Seashells", "Copper", "Platinum", "RareEarth"];
const arrWeapons = ["Staff", "Dagger", "Chain", "Katana", "Axe", "Laser", "PitchFork", "FireBomb", "Rocks", "Sword"];
const arrClasses = ["Healer", "Warrior", "Thief", "Knight", "Damsel", "Gnome", "Ninja", "Gladiator", "Farmer"];
const arrFamiliars = ["Capuchin", "Hawk", "Lynx", "Wolf", "Wyvern"];
const arrNames = ["Abakor", "Bandala", "Cartin", "Dariane", "Fezzor", "Gizleeni", "Halor", "Iaono", "Jeepenn", "Kalindaa", "Lineuss", "Mordana", "Nazzor", "Ortery", "Pandora", "Quonta", "Rozoro", "Spruyo", "Taranza", "Ulytana", "Voltera", "Whez", "Xanado", "Yogito", "Zzaru"];
const arrNamesBosses = ["AA", "BB", "CC", "DD"];

// Array to keep track of all Emails associated with each Saved game
let arrEmails = [];

// Global Scope Random Number Generator (min, max) inclusive
function fnRandomNumRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}; // END fnRandomNumRange()

function fnGenArray(anArray){
    console.log("fnGenArray() is running with " + anArray);
    let tmpNumber = Math.floor(Math.random() * anArray.length);
    return anArray[tmpNumber];
}; // END fnGenArray()


//========================================================================
//  fnCharCreate - this function creates game characters
//========================================================================
function fnCharCreate(){
console.log("fnCharCreate() is running");

let valinCreateGameName = document.querySelector("#inCreateGameName").value;
let valinCreateGameEmail = document.querySelector("#inCreateGameEmail").value;
console.log(valinCreateGameName, valinCreateGameEmail);

// Validate that BOTH name and email have been entered - if not, display a warning message and loop back for input
if ((valinCreateGameName != null && valinCreateGameName !="") &&
    (valinCreateGameEmail != null && valinCreateGameEmail != "")) 
  {
    document.querySelector("#pGameInputWarning").style.display = "none";

    // Create the Main Character
    let tmpMainCharacter = new PartyMember(valinCreateGameName, 
            fnGenArray(arrStats), 
            fnGenArray(arrStats), 
            fnGenArray(arrStats), 
            fnGenArray(arrStats),
            fnGenArray(arrStats),
            fnGenArray(arrWeapons),
            fnGenArray(arrClasses)
        ); // END Main PartyMember() creation

    console.log(tmpMainCharacter, tmpMainCharacter.cTotals());

    // Generate Companion_#1 and Companion_#2
    let tmpCompanion01 = new PartyMember(fnGenArray(arrNames),
        fnGenArray(arrStats),
        fnGenArray(arrStats),
        fnGenArray(arrStats),
        fnGenArray(arrStats),
        fnGenArray(arrStats),
        fnGenArray(arrWeapons),
        fnGenArray(arrClasses)
    ); // END Companion #1 creator
    console.log(tmpCompanion01);

    let tmpCompanion02 = new PartyMember(fnGenArray(arrNames),
        fnGenArray(arrStats),
        fnGenArray(arrStats),
        fnGenArray(arrStats),
        fnGenArray(arrStats),
        fnGenArray(arrStats),
        fnGenArray(arrWeapons),
        fnGenArray(arrClasses)
    ); // END Companion #2 creator
    console.log(tmpCompanion02);

    document.querySelector("#pCreateGameInputs").style.display = "none";
    document.querySelector("#pCreateGameControls").style.display = "block";

    // "Join" this Party internally
    let tmpParty = {
        "_id" : valinCreateGameEmail,
        "_currentScreen" : "#pgTavern",
        "cMain" : tmpMainCharacter,
        "cComp01" : tmpCompanion01,
        "cComp02" : tmpCompanion02
    }; // END of complete party in JSON
    console.log(tmpParty);

    // Display the party of one main character and two companions in a table format
    const partyTable = showTable(
        [tmpParty.cMain, tmpParty.cComp01, tmpParty.cComp02],
        [
            { label: 'cHP', name: 'Hit Points' },
            { label: 'cStr', name: 'Strength' },
            { label: 'cSpd', name: 'Speed' },
            { label: 'cMp', name: 'Magic' },
            { label: 'cLuck', name: 'Luck' },
            { label: 'cWep', name: 'Weapon' },
            { label: 'cClass', name: 'Class' }
        ],
        'cName', 'name');
    const partyContainer = document.querySelector('#spnCreateGameOutput');
    partyContainer.innerHTML = ''; // clear any existing content
    partyContainer.innerHTML = "<p>Your party is ready at your command. Start your quest.</p>";
    partyContainer.appendChild(partyTable);

    // Save this new party in localStorage (Save Email ONLY), but first check if anything has been previously saved
    let tmpAllEmails =  JSON.parse(localStorage.getItem("allEmails"));
    if(!tmpAllEmails){
        arrEmails.push(tmpParty._id);
        localStorage.setItem("allEmails", JSON.stringify(arrEmails));
        localStorage.setItem(tmpParty._id, JSON.stringify(tmpParty));
        console.log("Success: we saved a game for the first time!");
    } else {
        tmpAllEmails.push(tmpParty._id);
        localStorage.setItem("allEmails", JSON.stringify(tmpAllEmails));
        localStorage.setItem(tmpParty._id, JSON.stringify(tmpParty));
        console.log("Added a new game successfully!");
    }; // END If..Else

    // Add "Start Quest" button to move to the next level
    document.querySelector("#spnCreateGameOutput").innerHTML += "<br><button id='btnStartQuest'>Start Quest</button>";
    document.querySelector("#btnStartQuest").addEventListener("click", function(){fnNavQuest("#pgCreateGame", "#pgTavern", tmpParty._id)});

 }
 else {
    document.querySelector("#pGameInputWarning").style.display = "block";
 }
}; // END fnCharCreate()

// Define the PartyMember class using OCN - to group a Main Character and its companions
function PartyMember(cName, cHP, cStr, cSpd, cMp, cLuck, cWep, cClass){
    this.cName  = cName;
    this.cHP    = cHP;
    this.cStr   = cStr;
    this.cSpd   = cSpd;
    this.cMp    = cMp;
    this.cLuck  = cLuck;
    this.cWep   = cWep;
    this.cClass = cClass; 
    // cTotals is a Method to add up all the power points
    this.cTotals = function(){
        let tmpVal = this.cHP + this.cStr + this.cSpd + this.cMp + this.cLuck;
        return tmpVal;
    }; // END .cTotals()
}; // END PartyMember() OCN

// Define the Enemy class using JCN - align Enemy class to PartyMember class
class Enemy {
    constructor(eType, eHp, eStr, eSpd, eMp, eWep, eClass, eStatus){
        this.eType = eType;
        this.eHp = eHp;
        this.eStr = eStr
        this.eSpd = eSpd;
        this.eMp = eMp;
        this.eWep = eWep;
        this.eClass = eClass;
        this.eStatus = eStatus;
    }; // END Properties
    eLuck() {
        let tmpLuck = Math.ceil(Math.random() * 100);
        return tmpLuck;
    }; // END .eLuck() Method
}; // END Enemy class (JCN)


//===================================================================================================
//  fnGameInit - this function initialize the game - loads previously saved games from localStorage
//===================================================================================================
function fnGameInit(){
    console.log("fnGameInit() is running");
    document.querySelector("#pgWelcome").style.display = "block";

    // At game start, get the Array of all emails in localStorage
    let tmpGamesAll = JSON.parse(localStorage.getItem("allEmails"));

    console.log(tmpGamesAll);

    // If no previous data was saved, tell user to go back to create a new game, otherwise show previous saved list
    if(!tmpGamesAll){
        console.log("TRUE that we have NO saves");
        document.querySelector("#pLGPartyMessage").innerHTML = "Hello, you are new... Go back and click on 'Create Game' to begin the game<br>";
        document.querySelector("#spnLGPartyTotals").innerHTML = "0";
    } else {
        console.log("FALSE we do NOT have an EMPTY save slot");
        document.querySelector("#pLGPartyMessage").innerHTML = "Welcome back! Continue your quest!";
        document.querySelector("#spnLGPartyTotals").innerHTML = tmpGamesAll.length;
        document.querySelector("#pLGPartySelect").innerHTML = "&nbsp;";

        // Show the Saved Games (Parties) to select from
        for(let i = 0; i < tmpGamesAll.length; i++){
            let tmpPartyData = JSON.parse(localStorage.getItem(tmpGamesAll[i]));
            // if a previously saved game has reached the Dungeon, disable it
            if (tmpPartyData._currentScreen == "#pgEndGood" || tmpPartyData._currentScreen == "#pgEndBad" || tmpPartyData._currentScreen == "#pgEndOK") {
            document.querySelector("#pLGPartySelect").innerHTML += 
                "<p>" + tmpPartyData.cMain.cName + " - Game Over @Dungeon</p>";
            } else {
            document.querySelector("#pLGPartySelect").innerHTML += 
                "<p>" + tmpPartyData.cMain.cName + " <button onclick='fnGameLoad(`" + tmpGamesAll[i] + "`);'>" + "Enter Game" + "</button></p>";
            }
        }; //END For()
        
    }; // END If..Else()
}; // END fnGameInit()

//===================================================================================================
//  Initialize the game - Let the game begin!
//===================================================================================================
fnGameInit();


//============================================================================
//  fnGameLoad - this function loads ONE previously saved game using email id
//============================================================================
function fnGameLoad(gData){
    console.log("fnGameLoad() is running, loading " , gData);
    // Get data from localStorage and Parse it back into a JSON object
    let tmpLoadAllData = JSON.parse(localStorage.getItem(gData));
    console.log(tmpLoadAllData);

    // if a previous game has ended after Dungeon, go back to the welcome screen
    if (tmpLoadAllData._currentScreen == "#pgEndGood" || tmpLoadAllData._currentScreen == "#pgEndOK" || tmpLoadAllData._currentScreen == "#pgEndBad") {
        fnNavMenus("#pgLoadGame", "#pgWelcome");
    } else {
        // Use the _currentScreen Property to go to the correct screen
        fnNavQuest("#pgLoadGame", tmpLoadAllData._currentScreen, gData);
    }
}; // END fnGameLoad()


//============================================================================
//  fnNavQuest - this function tracks current player location
//============================================================================
function fnNavQuest(pgHide, pgShow, currParty) {
    console.log("fnNavQuest() is running");
    console.log("Coming from: " + pgHide);
    console.log("Going to: " + pgShow);
    console.log("Current party: " + currParty);
    document.querySelector(pgHide).style.display = "none";
    document.querySelector(pgShow).style.display = "block";
    
    // Switch screen based on parameter pgShow
    switch(pgShow){
        case "#pgTavern":
            console.log("About to initialize The Tavern");
            fnTavern(currParty);
            break;
        case "#pgForest":
            console.log("About to initialize The Forest");
            fnForest(currParty);
            break;
        case "#pgLake":
            console.log("About to initialize The Lake");
            fnLake(currParty);
            break;
        case "#pgMountain":
            console.log("About to initialize The Mountain");
            fnMountain(currParty); 
            break;
        case "#pgBridge":
            console.log("About to initialize The Bridge");
            fnBridge(currParty); 
            break;
        case "#pgDungeon":
            console.log("About to initialize The Dungeon");
            fnDungeon(currParty); 
            break;
        // case "#pgEndGood":
        //     console.log("About to initialize The Good Job screen");
        //     fnDungeon(currParty); 
        //     break;

        default: 
            console.log("Unknown - going nowhere", pgShow);
            break;
    }; // END switch()
}; // END fnNavQuest()

//============================================================================
//  fnTavern - the Main Event at the Tavern
//========================================================================
function fnTavern(currParty){
    console.log("At the Tavern with ", currParty);

    let myParty = JSON.parse(localStorage.getItem(currParty));
    console.log(myParty);

    document.querySelector("#pTvnMsg").innerHTML = "Welcome travelers!<br> Try a Game of Strength, Game of Speed, or a Game of Luck? There are many willing participants to challenge!";

    // Display party members in a table format
    const partyTable = showTable(
        [myParty.cMain, myParty.cComp01, myParty.cComp02],
        [
            { label: 'cStr', name: 'STR' },
            { label: 'cSpd', name: 'SPD' },
            { label: 'cLuck', name: 'LUK' }
        ],
        'cName', 'name');
    const partyContainer = document.querySelector('#pTvnParty');
    partyContainer.innerHTML = ''; // clear any existing content
    partyContainer.appendChild(partyTable);

    // Pick from a drop down menu of myParty members to participate in the Tavern action
    document.querySelector("#pTvnParty").innerHTML += "<p><form id='frmTvnSlctChar'>" + 
        "<label>Choose a Party Member: </label>" +
            "<select id='selTvnChar'>" + 
                "<option value='0'>&nbsp;</option>" +
                "<option value='cMain'   id='cMain'>" + myParty.cMain.cName + "</option>" +
                "<option value='cComp01' id='cComp01'>" + myParty.cComp01.cName + "</option>" +
                "<option value='cComp02' id='cComp02'>" + myParty.cComp02.cName + "</option>" +
            "</select>" +
    "</form></p>"; // END the <form> to pick a Party member

    document.querySelector("#frmTvnSlctChar").addEventListener("change", function(){
        // Player must select a character to participate in battle
        let valSelTvnChar = document.querySelector("#selTvnChar");
        let valSelTvnCharObj = valSelTvnChar.options[valSelTvnChar.selectedIndex];
    
        // Player must pick an action for the battle
        if(valSelTvnCharObj.value == 0){
            console.log("true, we picked NOTHING");
        } else {
            console.log("false, we didn't pick nothing, web picked a character");
            console.log("Which <td>", valSelTvnCharObj);
            console.log("Member Name:", myParty[valSelTvnCharObj.value].cName);

                document.querySelector("#pTvnAction").innerHTML = "<p>Have " + myParty[valSelTvnCharObj.value].cName + " do this:</p>" +  "<button id='btnTvFight'>STR Contest</button> <button id='btnTvnRace'>SPD Contest</button> <button id='btnTvnGamble'>LUK Contest</button>";

                let elBtnTvFight = document.querySelector("#btnTvFight"); 
                elBtnTvFight.addEventListener("click", function(){fnTvFight(myParty[valSelTvnCharObj.value]);});

                function fnTvFight(currHero){
                    console.log("fnTvFight is running with: ", currHero.cName, currHero.cStr);
                    
                    valSelTvnChar.disabled = true;
                    elBtnTvFight.disabled = true;
                    elBtnTvnRace.disabled = true;
                    elBtnTvnGamble.disabled = true;

                    document.querySelector("#pTvnResults").innerHTML = "<p>You decided to fight it out. I hope your STR is worthy enough!</p>" +
                        "<table style='margin: auto;'><tr><td style='padding-right: 0.5em; border-right: 2px solid goldenrod;'>" + 
                            currHero.cName + 
                            "<br>STR: " + currHero.cStr +
                        "</td> <td style='padding-left: 0.5em; border-left: 2px solid goldenrod;'>" + 
                            tvEnemy01.eType + 
                            "<br>" + tvEnemy01.eClass +
                        "</td></tr></table>";

                    console.log("Comparing stats: ", currHero.cStr, tvEnemy01.eStr);
                    
                    if(currHero.cStr > tvEnemy01.eStr){
                        console.log("WIN!");
                    
                        let tmpRndVal = fnRandomNumRange(7, 10);
                        console.log(currParty, "Adding: ", tmpRndVal);
                        
                        myParty.cMain.cStr += tmpRndVal;
                        myParty.cComp01.cStr += tmpRndVal;
                        myParty.cComp02.cStr += tmpRndVal;
                        
                        myParty._currentScreen = "#pgForest";
                        
                        localStorage.setItem(currParty, JSON.stringify(myParty));
                        
                        document.querySelector("#pTvnResults").innerHTML += "<p>Wonderful! Your STR was high enough! You have increased your STR by " + tmpRndVal + ". <br> Now venture to the forest</p>"+
                        "<p><button id='btnTvnGoForest'>Forest</button></p>";
                        let elBtnTvnGoForest = document.querySelector("#btnTvnGoForest");
                        elBtnTvnGoForest.addEventListener("click", function(){fnNavQuest("#pgTavern", "#pgForest", myParty._id)});
                    }else if(currHero.cStr == tvEnemy01.eStr){
                        console.log("Tie");
                        
                        let tmpRndVal = fnRandomNumRange(3, 6);
                        console.log(currParty, "Adding: ", tmpRndVal);
                        myParty.cMain.cStr += tmpRndVal;
                        myParty.cComp01.cStr += tmpRndVal;
                        myParty.cComp02.cStr += tmpRndVal;
                        myParty._currentScreen = "#pgForest";
                        localStorage.setItem(currParty, JSON.stringify(myParty));
                        document.querySelector("#pTvnResults").innerHTML += "<p>Close call! Your STR was good enough! You have increased your STR by " + tmpRndVal + ". <br> Now head over to the forest</p>"+
                        "<p><button id='btnTvnGoForest'>Forest</button></p>";
                        let elBtnTvnGoForest = document.querySelector("#btnTvnGoForest");
                        elBtnTvnGoForest.addEventListener("click", function(){fnNavQuest("#pgTavern", "#pgForest", myParty._id)});
                    } else {
                        console.log("loss...");
                        
                        let tmpRndVal = fnRandomNumRange(1, 2);
                        console.log(currParty, "Adding: ", tmpRndVal);
                        myParty.cMain.cStr += tmpRndVal;
                        myParty.cComp01.cStr += tmpRndVal;
                        myParty.cComp02.cStr += tmpRndVal;
                        myParty._currentScreen = "#pgForest";
                        localStorage.setItem(currParty, JSON.stringify(myParty));
                        document.querySelector("#pTvnResults").innerHTML += "<p>Alas! Your STR failed you! You have barely increased your STR by " + tmpRndVal + ". <br> Away from my sight, to the forest!!</p>"+
                        "<p><button id='btnTvnGoForest'>Forest</button></p>";
                        let elBtnTvnGoForest = document.querySelector("#btnTvnGoForest");
                        elBtnTvnGoForest.addEventListener("click", function(){fnNavQuest("#pgTavern", "#pgForest", myParty._id)});
                    }; // END If..Else If() win/loss/draw
                }; // END fnTvFight()

                let elBtnTvnRace = document.querySelector("#btnTvnRace"); 
                elBtnTvnRace.addEventListener("click", function(){fnTvnRace(myParty[valSelTvnCharObj.value]);});
                function fnTvnRace(currHero){
                    console.log("fnTvnRace is running with: ", currHero.cName, currHero.cSpd);

                    valSelTvnChar.disabled = true;
                    elBtnTvFight.disabled = true;
                    elBtnTvnRace.disabled = true;
                    elBtnTvnGamble.disabled = true;

                    document.querySelector("#pTvnResults").innerHTML = "<p>You decided on a race off. I hope your SPD is worthy enough!</p>" +
                        "<table style='margin: auto;'><tr><td style='padding-right: 0.5em; border-right: 2px solid goldenrod;'>" + 
                            currHero.cName + 
                            "<br>SPD: " + currHero.cSpd +
                        "</td> <td style='padding-left: 0.5em; border-left: 2px solid goldenrod;'>" + 
                            tvEnemy02.eType + 
                            "<br>" + tvEnemy02.eClass +
                        "</td></tr></table>";

                    console.log("Comparing stats: ", currHero.cSpd, tvEnemy02.eSpd);
                    
                    if(currHero.cStr > tvEnemy02.eSpd){
                        console.log("WIN!");

                        let tmpRndVal = fnRandomNumRange(7, 10);
                        console.log(currParty, "Adding: ", tmpRndVal);
                        
                        myParty.cMain.cSpd += tmpRndVal;
                        myParty.cComp01.cSpd += tmpRndVal;
                        myParty.cComp02.cSpd += tmpRndVal;
                        
                        myParty._currentScreen = "#pgForest";
                        
                        localStorage.setItem(currParty, JSON.stringify(myParty));
                        
                        document.querySelector("#pTvnResults").innerHTML += "<p>Wonderful! Your SPD was high enough! You have increased your SPD by " + tmpRndVal + ". <br> Now venture to the forest</p>"+
                        "<p><button id='btnTvnGoForest'>Forest</button></p>";
                        let elBtnTvnGoForest = document.querySelector("#btnTvnGoForest");
                        elBtnTvnGoForest.addEventListener("click", function(){fnNavQuest("#pgTavern", "#pgForest", myParty._id)});
                    }else if(currHero.cSpd == tvEnemy02.eSpd){
                        console.log("Tie");
                        
                        let tmpRndVal = fnRandomNumRange(3, 6);
                        console.log(currParty, "Adding: ", tmpRndVal);
                        myParty.cMain.cSpd += tmpRndVal;
                        myParty.cComp01.cSpd += tmpRndVal;
                        myParty.cComp02.cSpd += tmpRndVal;
                        myParty._currentScreen = "#pgForest";
                        localStorage.setItem(currParty, JSON.stringify(myParty));
                        document.querySelector("#pTvnResults").innerHTML += "<p>Close call! Your SPD was good enough! You have increased your SPD by " + tmpRndVal + ". <br> Now head over to the forest</p>"+
                        "<p><button id='btnTvnGoForest'>Forest</button></p>";
                        let elBtnTvnGoForest = document.querySelector("#btnTvnGoForest");
                        elBtnTvnGoForest.addEventListener("click", function(){fnNavQuest("#pgTavern", "#pgForest", myParty._id)});
                    } else {
                        console.log("loss...");
                        
                        let tmpRndVal = fnRandomNumRange(1, 2);
                        console.log(currParty, "Adding: ", tmpRndVal);
                        myParty.cMain.cSpd += tmpRndVal;
                        myParty.cComp01.cSpd += tmpRndVal;
                        myParty.cComp02.cSpd += tmpRndVal;
                        myParty._currentScreen = "#pgForest";
                        localStorage.setItem(currParty, JSON.stringify(myParty));
                        document.querySelector("#pTvnResults").innerHTML += "<p>Alas! Your SPD failed you! You have barely increased your SPD by " + tmpRndVal + ". <br> Away from my sight, to the forest!!</p>"+
                        "<p><button id='btnTvnGoForest'>Forest</button></p>";
                        let elBtnTvnGoForest = document.querySelector("#btnTvnGoForest");
                        elBtnTvnGoForest.addEventListener("click", function(){fnNavQuest("#pgTavern", "#pgForest", myParty._id)});
                    }; // END If..Else If() win/loss/draw
                }; // END fnTvRace()

                let elBtnTvnGamble = document.querySelector("#btnTvnGamble");
                elBtnTvnGamble.addEventListener("click", function(){fnTvnGamble(myParty[valSelTvnCharObj.value]);});
                function fnTvnGamble(currHero){
                    console.log("fnTvnGambol is running with: ", currHero.cName, currHero.cLuck);

                    valSelTvnChar.disabled = true;
                    elBtnTvFight.disabled = true;
                    elBtnTvnRace.disabled = true;
                    elBtnTvnGamble.disabled = true;

                    document.querySelector("#pTvnResults").innerHTML = "<p>You decided to gamble your luck. I hope your LUK is worthy enough!</p>" +
                        "<table style='margin: auto;'><tr><td style='padding-right: 0.5em; border-right: 2px solid goldenrod;'>" + 
                            currHero.cName + 
                            "<br>LUK: " + currHero.cLuck +
                        "</td> <td style='padding-left: 0.5em; border-left: 2px solid goldenrod;'>" + 
                            tvEnemy03.eType + 
                            "<br>" + tvEnemy03.eClass +
                        "</td></tr></table>";

                    const tvEnemy03CurrLuck = tvEnemy03.eLuck();
                    console.log(currHero.cLuck, tvEnemy03CurrLuck);
                    
                    if(currHero.cLuck > tvEnemy03CurrLuck){
                        console.log("WIN!");
                    
                        let tmpRndVal = fnRandomNumRange(7, 10);; 
                        console.log(currParty, "Adding: ", tmpRndVal);
                        
                        myParty.cMain.cLuck += tmpRndVal;
                        myParty.cComp01.cLuck += tmpRndVal;
                        myParty.cComp02.cLuck += tmpRndVal;
                        
                        myParty._currentScreen = "#pgForest";
                        
                        localStorage.setItem(currParty, JSON.stringify(myParty));
                        
                        document.querySelector("#pTvnResults").innerHTML += "<p>Wonderful! Your LUK was high enough! You have increased your LUK by " + tmpRndVal + ". <br> Now venture to the forest</p>"+
                        "<p><button id='btnTvnGoForest'>Forest</button></p>";
                        let elBtnTvnGoForest = document.querySelector("#btnTvnGoForest");
                        elBtnTvnGoForest.addEventListener("click", function(){fnNavQuest("#pgTavern", "#pgForest", myParty._id)});
                    }else if(currHero.cLuck == tvEnemy03CurrLuck){
                        console.log("Tie");
                        
                        let tmpRndVal = fnRandomNumRange(3, 6);;
                        console.log(currParty, "Adding: ", tmpRndVal);
                        myParty.cMain.cLuck += tmpRndVal;
                        myParty.cComp01.cLuck += tmpRndVal;
                        myParty.cComp02.cLuck += tmpRndVal;
                        myParty._currentScreen = "#pgForest";
                        localStorage.setItem(currParty, JSON.stringify(myParty));
                        document.querySelector("#pTvnResults").innerHTML += "<p>Close call! Your LUK was good enough! You have increased your LUK by " + tmpRndVal + ". <br> Now head over to the forest</p>"+
                        "<p><button id='btnTvnGoForest'>Forest</button></p>";
                        let elBtnTvnGoForest = document.querySelector("#btnTvnGoForest");
                        elBtnTvnGoForest.addEventListener("click", function(){fnNavQuest("#pgTavern", "#pgForest", myParty._id)});
                    } else {
                        console.log("loss...");
                        
                        let tmpRndVal = fnRandomNumRange(1, 2);;
                        console.log(currParty, "Adding: ", tmpRndVal);
                        myParty.cMain.cLuck += tmpRndVal;
                        myParty.cComp01.cLuck += tmpRndVal;
                        myParty.cComp02.cLuck += tmpRndVal;
                        myParty._currentScreen = "#pgForest";
                        localStorage.setItem(currParty, JSON.stringify(myParty));
                        document.querySelector("#pTvnResults").innerHTML += "<p>Alas! Your LUK failed you! You have barely increased your LUK by " + tmpRndVal + ". <br> Away from my sight, to the forest!!</p>"+
                        "<p><button id='btnTvnGoForest'>Forest</button></p>";
                        let elBtnTvnGoForest = document.querySelector("#btnTvnGoForest");
                        elBtnTvnGoForest.addEventListener("click", function(){fnNavQuest("#pgTavern", "#pgForest", myParty._id)});
                    }; // END If..Else If() win/loss/draw
                }; // END fnTvGamble()
            }; // END If..Else for Selecting a character
        }); // END .addEventListener on the <select>

    // Generate enemies
    let tvEnemy01 = new Enemy("Ogre", 
        fnGenArray(arrStats), fnGenArray(arrStats), fnGenArray(arrStats), fnGenArray(arrStats),
        fnGenArray(arrWeapons), fnGenArray(arrClasses), "Normal");
    let tvEnemy02 = new Enemy("Goblin",   
        fnGenArray(arrStats), fnGenArray(arrStats), fnGenArray(arrStats), fnGenArray(arrStats),
        fnGenArray(arrWeapons), fnGenArray(arrClasses), "Normal");
    let tvEnemy03 = new Enemy("Troll",   
        fnGenArray(arrStats), fnGenArray(arrStats), fnGenArray(arrStats), fnGenArray(arrStats),
        fnGenArray(arrWeapons), fnGenArray(arrClasses), "Normal");

    // Display enemies in a table
    const enemyTable = showTable(
        [tvEnemy01, tvEnemy02, tvEnemy03],
        [            
            { label: 'eClass', name: 'Class' },
            { label: 'eStr', name: 'STR' },
            { label: 'eSpd', name: 'SPD' },
            { label: 'eHp', name: 'HP' },
        ],
        'eType', 'name');
    const enemyContainer = document.querySelector('#pTvnEnemy');
    enemyContainer.innerHTML = '';
    enemyContainer.appendChild(enemyTable);
   
}; // END fnTavern()


// TMP function for the future levels
function fnTmpPath(currParty){
    console.log("tmppath", currParty);
}; // END fnTmpPath()


//========================================================================
//  fnForest - Function for the all the action in the Forest
//========================================================================
function fnForest(currParty){
    console.log("At the forest with", currParty);

    let myParty = JSON.parse(localStorage.getItem(currParty));
    console.log(myParty._id);

    // Set up Lookup Tables (Multi-Dimensional Array) for the Forest Intro Message
    // arrFstMessage[PERSON, ITEM, TRAIT]
    const arrFstMessages = [
            ["Aba", "Beb", "Cab", "Dek", "Eep"], 
            ["Secret Book", "Holy Codex", "Lost Parchment", "Gothic Scroll"], 
            ["Power", "Wisdom", "Validation", "Insight", "Experience", "Adventure", "Love", "Treasure"]
        ]; // END arrFstMessages
    // Pick randomly for each
    let valFstPerson    = arrFstMessages[0][fnRandomNumRange(0, 4)];
    let valFstItem      = arrFstMessages[1][fnRandomNumRange(0, 3)];
    let valFstTrait     = arrFstMessages[2][fnRandomNumRange(0, 7)];

    document.querySelector("#pFstMsg").innerHTML = "You have reached The Forbidden Forest. You meet a lone traveller. <br><br>Say hello to " + valFstPerson + " who possesses the " + valFstItem + " and seeks " + valFstTrait + "!"; 

    document.querySelector("#pFstParty").innerHTML = "<table><tr><td style='padding-right: 0.5em; border-right: 2px solid goldenrod;'>" + 
            myParty.cMain.cName +
            "<br>The " + myParty.cMain.cClass +
            "<br>HP: " + myParty.cMain.cHP +
            "<br>MP: " + myParty.cMain.cMp +

            "</td><td style='padding-right: 0.5em; border-right: 2px solid goldenrod; padding-left: 0.5em;'>" + 
            myParty.cComp01.cName +
            "<br>The " + myParty.cComp01.cClass +
            "<br>HP: " + myParty.cComp01.cHP +
            "<br>MP: " + myParty.cComp01.cMp +

            "</td><td style='padding-left: 0.5em;'>" + 
            myParty.cComp02.cName +
            "<br>The " + myParty.cComp02.cClass +
            "<br>HP: " + myParty.cComp02.cHP +
            "<br>MP: " + myParty.cComp02.cMp +
    
        "</td></tr></table>"; // END <table> of Party

        document.querySelector("#pFstAction").innerHTML = "You will ask " + valFstPerson + 
         " to help you on your quest by giving you some of their " + valFstTrait + " from their " + valFstItem + "!" +
         "<p><button id='btnFstHP'>Ask for HP</button> <button id='btnFstMP'>Ask for MP</button></p>"
        ; // END #pFstAction

        // Set up an Object for that <button> and then Event Listener, then Function
        let elBtnFstHP = document.querySelector("#btnFstHP");
        let elBtnFstMP = document.querySelector("#btnFstMP");

        elBtnFstHP.addEventListener("click", fnFstGetHP);
        elBtnFstMP.addEventListener("click", fnFstGetMP);

        function fnFstGetHP(){
            console.log("fnFstGetHP() is running");
            elBtnFstMP.disabled = true;
            elBtnFstHP.disabled = true;
            // Generate this character
                // constructor(eType, eHp, eStr, eSpd, eMp, eWep, eClass, eStatus){ .eLuck()
            let fstNPC = new Enemy(valFstPerson, fnGenArray(arrStats), null, null, fnGenArray(arrStats), valFstItem, null, valFstTrait);
            console.log(fstNPC);
            // Generate a Random fraction to take some of their Stat
            let tmpRndFrac = Math.random();
            console.log(tmpRndFrac);
            // Generate a random boon of HP, based on their Stat
            let tmpNewHP = fstNPC.eHp * tmpRndFrac;
            console.log(Math.ceil(tmpNewHP));
            // Then add the new boon (values)
            myParty.cMain.cHP   += Math.ceil(tmpNewHP);
            myParty.cComp01.cHP += Math.ceil(tmpNewHP);
            myParty.cComp02.cHP += Math.ceil(tmpNewHP);
            // Also, create a new Property for the ITEM!
            myParty._inventory = [fstNPC.eWep];

            // Pick from the 3 possible paths:  #pgLake (1)  #pgMountain (2)  #pgBridge (3)
            let tmpRndPath = ["#pgLake", "#pgMountain", "#pgBridge"];
            let tmpRndNextPath = tmpRndPath[fnRandomNumRange(0, 2)];
            switch(tmpRndNextPath){
                case "#pgLake":
                    console.log("About to go to Lake");
                    myParty._currentScreen = "#pgLake";
                    localStorage.setItem(myParty._id, JSON.stringify(myParty));
                    tmpRndNextPath = "Lake"
                    break;
                case "#pgMountain":
                    console.log("About to go to Mountain");
                    myParty._currentScreen = "#pgMountain";
                    localStorage.setItem(myParty._id, JSON.stringify(myParty));
                    tmpRndNextPath = "Mountain"
                    break;
                case "#pgBridge":
                    console.log("About to go to Bridge");
                    myParty._currentScreen = "#pgBridge"
                    localStorage.setItem(myParty._id, JSON.stringify(myParty));
                    tmpRndNextPath = "Bridge"
                    break;
                default:
                    console.log(tmpRndNextPath);
                    break;
            }; // END Switch() for next path

            // Show the updated stats
            document.querySelector("#pFstResults").innerHTML = "<table><tr><td style='padding-right: 0.5em; border-right: 2px solid goldenrod;'>" + 
            myParty.cMain.cName +
            "<br>HP: " + myParty.cMain.cHP +
            
            "</td><td style='padding-right: 0.5em; border-right: 2px solid goldenrod; padding-left: 0.5em;'>" + 
            myParty.cComp01.cName +
            "<br>HP: " + myParty.cComp01.cHP +
            
            "</td><td style='padding-left: 0.5em;'>" + 
            myParty.cComp02.cName +
            "<br>HP: " + myParty.cComp02.cHP +
            
            "</td></tr></table>" + 
            
            "<p>Amazing! " + valFstPerson + " has bestowed upon you " + (Math.ceil(tmpRndFrac*100)) + "% of their Power and gifted you their " + valFstItem  +"!</p>" + 
            "<p>Now, head for the " + tmpRndNextPath + " with your boon.</p>" +
            "<p><button id='btnFstGoNext'>Go</button></p>"
            ; // END <table> updated    
            let elBtnFstGoNext = document.querySelector("#btnFstGoNext");
            elBtnFstGoNext.addEventListener("click", function(){fnNavQuest("#pgForest", myParty._currentScreen, myParty._id)});
        }; // END fnFstGetHP()

        function fnFstGetMP(){
            console.log("fnFstGetMP() is running");
            elBtnFstMP.disabled = true;
            elBtnFstHP.disabled = true;
            let fstNPC = new Enemy(valFstPerson, fnGenArray(arrStats), null, null, fnGenArray(arrStats), valFstItem, null, valFstTrait);
            console.log(fstNPC);
            // Generate a Random fraction to take some of their Stat
            let tmpRndFrac = Math.random();
            console.log(tmpRndFrac);
            // Generate a random boon of HP, based on their Stat
            let tmpNewMP = fstNPC.eMp * tmpRndFrac;
            console.log(Math.ceil(tmpNewMP));
            myParty.cMain.cMp   += Math.ceil(tmpNewMP);
            myParty.cComp01.cMp += Math.ceil(tmpNewMP);
            myParty.cComp02.cMp += Math.ceil(tmpNewMP);
            myParty._inventory = [fstNPC.eWep];

            // Pick from the 3 possible paths:  #pgLake (1)  #pgMountain (2)  #pgBridge (3)
            let tmpRndPath = ["#pgLake", "#pgMountain", "#pgBridge"];
            let tmpRndNextPath = tmpRndPath[fnRandomNumRange(0, 2)];
            switch(tmpRndNextPath){
                case "#pgLake":
                    console.log("About to go to Lake");
                    myParty._currentScreen = "#pgLake";
                    localStorage.setItem(myParty._id, JSON.stringify(myParty));
                    tmpRndNextPath = "Lake";
                    break;
                case "#pgMountain":
                    console.log("About to go to Mountain");
                    myParty._currentScreen = "#pgMountain";
                    localStorage.setItem(myParty._id, JSON.stringify(myParty));
                    tmpRndNextPath = "Mountain";
                    break;
                case "#pgBridge":
                    console.log("About to go to Bridge");
                    myParty._currentScreen = "#pgBridge"
                    localStorage.setItem(myParty._id, JSON.stringify(myParty));
                    tmpRndNextPath = "Bridge";
                    break;
                default:
                    console.log(tmpRndNextPath);
                    break;
            }; // END Switch() for next path

            // Show the updated stats
            document.querySelector("#pFstResults").innerHTML = "<table><tr><td style='padding-right: 0.5em; border-right: 2px solid goldenrod;'>" + 
            myParty.cMain.cName +
            "<br>MP: " + myParty.cMain.cMp +
            
            "</td><td style='padding-right: 0.5em; border-right: 2px solid goldenrod; padding-left: 0.5em;'>" + 
            myParty.cComp01.cName +
            "<br>MP: " + myParty.cComp01.cMp +
            
            "</td><td style='padding-left: 0.5em;'>" + 
            myParty.cComp02.cName +
            "<br>MP: " + myParty.cComp02.cMp +
            
            "</td></tr></table>" +

            "<p>Amazing! " + valFstPerson + " has bestowed upon you " + (Math.ceil(tmpRndFrac*100)) + "% of their Power and gifted you their " + valFstItem  +"!</p>" +
            "<p>Now, head for the " + tmpRndNextPath + " with your boon.</p>" +
            "<p><button id='btnFstGoNext'>Go</button></p>"
            ; // END <table> updated    
            let elBtnFstGoNext = document.querySelector("#btnFstGoNext");
            elBtnFstGoNext.addEventListener("click", function(){fnNavQuest("#pgForest", myParty._currentScreen, myParty._id)});
            
            ; // END <table> of Party UPGRADE
        }; // END fnFstGetMP()
}; // END fnForest()

//=====================================================================
//  fnLake - Function for all the Lake action
//=====================================================================
function fnLake(currParty){
    console.log("At the Lake", currParty);
    let myParty = JSON.parse(localStorage.getItem(currParty));
    console.log(myParty._id);

    document.querySelector("#pLakMsg").innerHTML = "Welcome to Eel Lake. A powerful foe stands before you! You must all join together to defeat it!";  

    // A Function to draw the Party Table when needed, then run it right away
    function fnPartyDrawTable(){
            document.querySelector("#pLakParty").innerHTML = "<table><tr><td style='padding-right: 0.5em; border-right: 2px solid goldenrod;'>" + 
            myParty.cMain.cName +
            "<br>HP: " + myParty.cMain.cHP +
            "<br>WEP: " + myParty.cMain.cWep +

            "</td><td style='padding-right: 0.5em; border-right: 2px solid goldenrod; padding-left: 0.5em;'>" + 
            myParty.cComp01.cName +
            "<br>HP: " + myParty.cComp01.cHP +
            "<br>WEP: " + myParty.cComp01.cWep +

            "</td><td style='padding-left: 0.5em;'>" + 
            myParty.cComp02.cName +
            "<br>HP: " + myParty.cComp02.cHP +
            "<br>WEP: " + myParty.cComp02.cWep +
    
        "</td></tr></table>"; // END <table> of Party
    }; // END fnPartyDrawTable()

    // Render the table at the start of the level, and then later, after taking damage
    fnPartyDrawTable();

    // Enemy { constructor(eType, eHp, eStr, eSpd, eMp, eWep, eClass, eStatus){ eLuck() {}}
    // Generate a Level Boss
    let lakBoss = new Enemy(fnGenArray(arrNamesBosses), fnRandomNumRange(75, 100), null, null, null, fnGenArray(arrWeapons), null, "Alive");
    console.log(lakBoss);

    document.querySelector("#pLakEnemy").innerHTML = lakBoss.eType + " stands before you! They hold a " + lakBoss.eWep + " and have " + lakBoss.eHp + "HP. Who of your Party will strike first?";

    // Create Buttons for the action of each character
    document.querySelector("#pLakAction").innerHTML = 
        myParty.cMain.cName   + " uses " + myParty.cMain.cWep   + " <button id='btnLakMain'>Go!</button><br>" +
        myParty.cComp01.cName + " uses " + myParty.cComp01.cWep + " <button id='btnLakC01'>Go!</button><br>" +
        myParty.cComp02.cName + " uses " + myParty.cComp02.cWep + " <button id='btnLakC02'>Go!</button>" 
        ; // END of #pLakActions
    // Create JS Objects for each of generated Buttons
    let elBtnLakMain = document.querySelector("#btnLakMain"); 
    let elBtnLakC01 =  document.querySelector("#btnLakC01");
    let elBtnLakC02 =  document.querySelector("#btnLakC02");

    // Create Event Listeners for each of those Buttons
    // If you need to pass a Parameter into a function: function(){subRoutine(parameter);}
    // If you DON'T need to pass a Parm, it's only: subRoutine (no parens)
    elBtnLakMain.addEventListener("click", fnLakMainFight);
    elBtnLakC01.addEventListener("click",  fnLakC01Fight);
    elBtnLakC02.addEventListener("click",  fnLakC02Fight);

    // Create Functions for those Button Clicks
    function fnLakMainFight(){
        console.log(myParty.cMain.cName, myParty.cMain.cLuck, "VS", lakBoss.eHp);
        // This character fighting, so disable their Button
        elBtnLakMain.disabled = true;
        // From BOSS, subtract LUK as a hit
        lakBoss.eHp = lakBoss.eHp - myParty.cMain.cLuck;
        // Conditional to deal with a "Boss Defeated" or a "Keep Fighting Boss"
        if(lakBoss.eHp <= 0){
            console.log("BOSS DEFEATED");
            // Deactivate other attacks
            elBtnLakMain.disabled = true;
            elBtnLakC01.disabled = true;
            elBtnLakC02.disabled = true;
            
            myParty.cMain.cLuck     += fnRandomNumRange(25, 75);
            myParty.cComp01.cLuck   += fnRandomNumRange(25, 75);
            myParty.cComp02.cLuck   += fnRandomNumRange(25, 75);

            let tmpRndPath = ["#pgDungeon", "#pgMountain", "#pgBridge"];
            let tmpRndNextPath = tmpRndPath[fnRandomNumRange(0, 2)];
            switch(tmpRndNextPath){
                case "#pgDungeon":
                    console.log("About to go to Dungeon");
                    myParty._currentScreen = "#pgDungeon";
                    localStorage.setItem(myParty._id, JSON.stringify(myParty));
                    tmpRndNextPath = "Dungeon";
                    break;
                case "#pgMountain":
                    console.log("About to go to Mountain");
                    myParty._currentScreen = "#pgMountain";
                    localStorage.setItem(myParty._id, JSON.stringify(myParty));
                    tmpRndNextPath = "Mountain";
                    break;
                case "#pgBridge":
                    console.log("About to go to Bridge");
                    myParty._currentScreen = "#pgBridge"
                    localStorage.setItem(myParty._id, JSON.stringify(myParty));
                    tmpRndNextPath = "Bridge";
                    break;
                default:
                    console.log(tmpRndNextPath);
                    break;
            }; // END Switch() for next path

            console.log(myParty);

            document.querySelector("#pLakResults").innerHTML = "<p>Success!</p><p>" + myParty.cMain.cName + " struck the final attack and defeated " + lakBoss.eType + "!</p><p>You now have " + myParty.cMain.cLuck +"LUK and get to move on to the " + tmpRndNextPath + ".</p><p><button id='btnLakGoNext'>Next</button></p>";
            let elBtnLakGoNext = document.querySelector("#btnLakGoNext");
            elBtnLakGoNext.addEventListener("click", function(){fnNavQuest("#pgLake", myParty._currentScreen, myParty._id)});
        }else{
            console.log("KEEP FIGHTING", lakBoss.eHp);
            // You took damage
            let tmpHIT = myParty.cMain.cHP / 10;
            myParty.cMain.cHP = Math.round(myParty.cMain.cHP - tmpHIT);
            console.log("Main down to", myParty.cMain.cHP);
            // After the attack, update #pLakResults to show weaker Boss
            document.querySelector("#pLakResults").innerHTML = "<p>You have weakened " + lakBoss.eType + " down to " + lakBoss.eHp + "HP! Keep fighting and choose another Party Member!</p>" +
            "<p>" + myParty.cMain.cName + " is weakened: " + myParty.cMain.cHP + "HP!</p>"
            ; // END #pLakResults

            // and then our Party table with damage taken
            fnPartyDrawTable();

            // Deal with "What about if we all failed??"
            if(
                elBtnLakMain.disabled == true && 
                elBtnLakC01.disabled  == true && 
                elBtnLakC02.disabled  == true
            ){
                console.log("3 members were defeated");

                // No bonuses, but move to the next screen after being weakened
                let tmpRndPath = ["#pgDungeon", "#pgMountain", "#pgBridge"];
                let tmpRndNextPath = tmpRndPath[fnRandomNumRange(0, 2)];
                switch(tmpRndNextPath){
                    case "#pgDungeon":
                        console.log("About to go to Dungeon");
                        myParty._currentScreen = "#pgDungeon";
                        localStorage.setItem(myParty._id, JSON.stringify(myParty));
                        tmpRndNextPath = "Dungeon";
                        break;
                    case "#pgMountain":
                        console.log("About to go to Mountain");
                        myParty._currentScreen = "#pgMountain";
                        localStorage.setItem(myParty._id, JSON.stringify(myParty));
                        tmpRndNextPath = "Mountain";
                        break;
                    case "#pgBridge":
                        console.log("About to go to Bridge");
                        myParty._currentScreen = "#pgBridge"
                        localStorage.setItem(myParty._id, JSON.stringify(myParty));
                        tmpRndNextPath = "Bridge";
                        break;
                    default:
                        console.log(tmpRndNextPath);
                        break;
                }; // END Switch() for next path

                console.log(myParty);

                document.querySelector("#pLakResults").innerHTML = "<p>Alas!</p><p>You failed to defeat " + lakBoss.eType + "!</p><p>Scamper off to the " + tmpRndNextPath + ".</p><p><button id='btnLakGoNext'>Next Level</button></p>";
                let elBtnLakGoNext = document.querySelector("#btnLakGoNext");
                elBtnLakGoNext.addEventListener("click", function(){fnNavQuest("#pgLake", myParty._currentScreen, myParty._id)});
            }; // Check if 3 defeats

        }; // END If..Else eHP checker
    }; // END fnLakMainFight()

    function fnLakC01Fight(){
        console.log(myParty.cComp01.cName, myParty.cComp01.cLuck, "VS", lakBoss.eHp);
        elBtnLakC01.disabled = true;
        lakBoss.eHp = lakBoss.eHp - myParty.cComp01.cLuck;
        if(lakBoss.eHp <= 0){
            console.log("BOSS DEFEATED");
            elBtnLakMain.disabled = true;
            elBtnLakC01.disabled = true;
            elBtnLakC02.disabled = true;

            myParty.cMain.cLuck     += fnRandomNumRange(25, 75);
            myParty.cComp01.cLuck   += fnRandomNumRange(25, 75);
            myParty.cComp02.cLuck   += fnRandomNumRange(25, 75);

        let tmpRndPath = ["#pgDungeon", "#pgMountain", "#pgBridge"];
            let tmpRndNextPath = tmpRndPath[fnRandomNumRange(0, 2)];
            switch(tmpRndNextPath){
                case "#pgDungeon":
                    console.log("About to go to Dungeon");
                    myParty._currentScreen = "#pgDungeon";
                    localStorage.setItem(myParty._id, JSON.stringify(myParty));
                    tmpRndNextPath = "Dungeon";
                    break;
                case "#pgMountain":
                    console.log("About to go to Mountain");
                    myParty._currentScreen = "#pgMountain";
                    localStorage.setItem(myParty._id, JSON.stringify(myParty));
                    tmpRndNextPath = "Mountain";
                    break;
                case "#pgBridge":
                    console.log("About to go to Bridge");
                    myParty._currentScreen = "#pgBridge"
                    localStorage.setItem(myParty._id, JSON.stringify(myParty));
                    tmpRndNextPath = "Bridge";
                    break;
                default:
                    console.log(tmpRndNextPath);
                    break;
            }; // END Switch() for next path

            console.log(myParty);

            document.querySelector("#pLakResults").innerHTML = "<p>Success!</p><p>" + myParty.cComp01.cName + " struck the final attack and defeated " + lakBoss.eType + "!</p><p>You now have " + myParty.cComp01.cLuck +"LUK and get to move on to the " + tmpRndNextPath + ".</p><p><button id='btnLakGoNext'>Next</button></p>";
            let elBtnLakGoNext = document.querySelector("#btnLakGoNext");
            elBtnLakGoNext.addEventListener("click", function(){fnNavQuest("#pgLake", myParty._currentScreen, myParty._id)});
        }else{
            console.log("KEEP FIGHTING", lakBoss.eHp);
            let tmpHIT = myParty.cComp01.cHP / 10;
            myParty.cComp01.cHP = Math.round(myParty.cComp01.cHP - tmpHIT);
            console.log("Main down to", myParty.cComp01.cHP);
            document.querySelector("#pLakResults").innerHTML = "<p>You have weakened " + lakBoss.eType + " down to " + lakBoss.eHp + "HP! Keep fighting and choose another Party Member!</p>" +
            "<p>" + myParty.cComp01.cName + " is weakened: " + myParty.cComp01.cHP + "HP!</p>"
            ; // END #pLakResults
            fnPartyDrawTable();

            // Deal with "What about if we all failed??"
            if(
                elBtnLakMain.disabled == true && 
                elBtnLakC01.disabled  == true && 
                elBtnLakC02.disabled  == true
            ){
                console.log("3 members were defeated");

                // No bonuses, but move to the next screen after being weakened
                let tmpRndPath = ["#pgDungeon", "#pgMountain", "#pgBridge"];
                let tmpRndNextPath = tmpRndPath[fnRandomNumRange(0, 2)];
                switch(tmpRndNextPath){
                    case "#pgDungeon":
                        console.log("About to go to Dungeon");
                        myParty._currentScreen = "#pgDungeon";
                        localStorage.setItem(myParty._id, JSON.stringify(myParty));
                        tmpRndNextPath = "Dungeon";
                        break;
                    case "#pgMountain":
                        console.log("About to go to Mountain");
                        myParty._currentScreen = "#pgMountain";
                        localStorage.setItem(myParty._id, JSON.stringify(myParty));
                        tmpRndNextPath = "Mountain";
                        break;
                    case "#pgBridge":
                        console.log("About to go to Bridge");
                        myParty._currentScreen = "#pgBridge"
                        localStorage.setItem(myParty._id, JSON.stringify(myParty));
                        tmpRndNextPath = "Bridge";
                        break;
                    default:
                        console.log(tmpRndNextPath);
                        break;
                }; // END Switch() for next path

                console.log(myParty);

                document.querySelector("#pLakResults").innerHTML = "<p>Alas!</p><p>You failed to defeat " + lakBoss.eType + "!</p><p>Scamper off to the " + tmpRndNextPath + ".</p><p><button id='btnLakGoNext'>Next Level</button></p>";
                let elBtnLakGoNext = document.querySelector("#btnLakGoNext");
                elBtnLakGoNext.addEventListener("click", function(){fnNavQuest("#pgLake", myParty._currentScreen, myParty._id)});
            }; // Check if 3 defeats
            
        }; // END If..Else eHP checker
    }; // END fnLakC01Fight

    function fnLakC02Fight(){
        console.log(myParty.cComp02.cName, myParty.cComp02.cLuck, "VS", lakBoss.eHp);
        elBtnLakC02.disabled = true;
        lakBoss.eHp = lakBoss.eHp - myParty.cComp02.cLuck;
        if(lakBoss.eHp <= 0){
            console.log("BOSS DEFEATED");
            elBtnLakMain.disabled = true;
            elBtnLakC01.disabled = true;
            elBtnLakC02.disabled = true;

            myParty.cMain.cLuck     += fnRandomNumRange(25, 75);
            myParty.cComp01.cLuck   += fnRandomNumRange(25, 75);
            myParty.cComp02.cLuck   += fnRandomNumRange(25, 75);

            let tmpRndPath = ["#pgDungeon", "#pgMountain", "#pgBridge"];
            let tmpRndNextPath = tmpRndPath[fnRandomNumRange(0, 2)];
            switch(tmpRndNextPath){
                case "#pgDungeon":
                    console.log("About to go to Dungeon");
                    myParty._currentScreen = "#pgDungeon";
                    localStorage.setItem(myParty._id, JSON.stringify(myParty));
                    tmpRndNextPath = "Dungeon";
                    break;
                case "#pgMountain":
                    console.log("About to go to Mountain");
                    myParty._currentScreen = "#pgMountain";
                    localStorage.setItem(myParty._id, JSON.stringify(myParty));
                    tmpRndNextPath = "Mountain";
                    break;
                case "#pgBridge":
                    console.log("About to go to Bridge");
                    myParty._currentScreen = "#pgBridge"
                    localStorage.setItem(myParty._id, JSON.stringify(myParty));
                    tmpRndNextPath = "Bridge";
                    break;
                default:
                    console.log(tmpRndNextPath);
                    break;
            }; // END Switch() for next path

            console.log(myParty);

            document.querySelector("#pLakResults").innerHTML = "<p>Success!</p><p>" + myParty.cComp02.cName + " struck the final attack and defeated " + lakBoss.eType + "!</p><p>You now have " + myParty.cComp02.cLuck +"LUK and get to move on to the " + tmpRndNextPath + ".</p><p><button id='btnLakGoNext'>Next</button></p>";
            let elBtnLakGoNext = document.querySelector("#btnLakGoNext");
            elBtnLakGoNext.addEventListener("click", function(){fnNavQuest("#pgLake", myParty._currentScreen, myParty._id)});
        }else{
            console.log("KEEP FIGHTING", lakBoss.eHp);
            let tmpHIT = myParty.cComp02.cHP / 10;
            myParty.cComp02.cHP = Math.round(myParty.cComp02.cHP - tmpHIT);
            console.log("Main down to", myParty.cComp02.cHP);
            document.querySelector("#pLakResults").innerHTML = "<p>You have weakened " + lakBoss.eType + " down to " + lakBoss.eHp + "HP! Keep fighting and choose another Party Member!</p>" +
            "<p>" + myParty.cComp02.cName + " is weakened: " + myParty.cComp02.cHP + "HP!</p>"
            ; // END #pLakResults
            fnPartyDrawTable();

            // Deal with "What about if we all failed??"
            if(
                elBtnLakMain.disabled == true && 
                elBtnLakC01.disabled  == true && 
                elBtnLakC02.disabled  == true
            ){
                console.log("3 members were defeated");

                // No bonuses, but move to the next screen after being weakened
                let tmpRndPath = ["#pgDungeon", "#pgMountain", "#pgBridge"];
                let tmpRndNextPath = tmpRndPath[fnRandomNumRange(0, 2)];
                switch(tmpRndNextPath){
                    case "#pgDungeon":
                        console.log("About to go to Dungeon");
                        myParty._currentScreen = "#pgDungeon";
                        localStorage.setItem(myParty._id, JSON.stringify(myParty));
                        tmpRndNextPath = "Dungeon";
                        break;
                    case "#pgMountain":
                        console.log("About to go to Mountain");
                        myParty._currentScreen = "#pgMountain";
                        localStorage.setItem(myParty._id, JSON.stringify(myParty));
                        tmpRndNextPath = "Mountain";
                        break;
                    case "#pgBridge":
                        console.log("About to go to Bridge");
                        myParty._currentScreen = "#pgBridge"
                        localStorage.setItem(myParty._id, JSON.stringify(myParty));
                        tmpRndNextPath = "Bridge";
                        break;
                    default:
                        console.log(tmpRndNextPath);
                        break;
                }; // END Switch() for next path

                console.log(myParty);

                document.querySelector("#pLakResults").innerHTML = "<p>Alas!</p><p>You failed to defeat " + lakBoss.eType + "!</p><p>Scamper off to the " + tmpRndNextPath + ".</p><p><button id='btnLakGoNext'>Next Level</button></p>";
                let elBtnLakGoNext = document.querySelector("#btnLakGoNext");
                elBtnLakGoNext.addEventListener("click", function(){fnNavQuest("#pgLake", myParty._currentScreen, myParty._id)});
            }; // Check if 3 defeats

        }; // END If..Else eHP checker
    }; // END fnLakC02Fight

}; // END fnLake()


//=====================================================================
//  fnMountain - Function for all the action at Mountain
//=====================================================================
function fnMountain(currParty){
    console.log("At the Mountain", currParty);
    let myParty = JSON.parse(localStorage.getItem(currParty));
    console.log(myParty._id);

    document.querySelector("#pMntMsg").innerHTML = "Welcome to the Mad Mountain. A fearsome rival looms over you! You must all strike in turn!!";  

    // A Function to draw the Party Table when needed, then run it right away
    function fnPartyDrawTable(){
            document.querySelector("#pMntParty").innerHTML = "<table><tr><td style='padding-right: 0.5em; border-right: 2px solid goldenrod;'>" + 
            myParty.cMain.cName +
            "<br>HP: " + myParty.cMain.cHP +
            "<br>WEP: " + myParty.cMain.cWep +

            "</td><td style='padding-right: 0.5em; border-right: 2px solid goldenrod; padding-left: 0.5em;'>" + 
            myParty.cComp01.cName +
            "<br>HP: " + myParty.cComp01.cHP +
            "<br>WEP: " + myParty.cComp01.cWep +

            "</td><td style='padding-left: 0.5em;'>" + 
            myParty.cComp02.cName +
            "<br>HP: " + myParty.cComp02.cHP +
            "<br>WEP: " + myParty.cComp02.cWep +
    
        "</td></tr></table>"; // END <table> of Party
    }; // END fnPartyDrawTable()

    // Render the table at the start of the level, and then later, after taking damage
    fnPartyDrawTable();

    // Enemy { constructor(eType, eHp, eStr, eSpd, eMp, eWep, eClass, eStatus){ eLuck() {}}
    // Generate a Level Boss
    let mntBoss = new Enemy(fnGenArray(arrNamesBosses), fnRandomNumRange(75, 100), null, null, null, fnGenArray(arrWeapons), null, "Alive");
    console.log(mntBoss);

    document.querySelector("#pMntEnemy").innerHTML = mntBoss.eType + " approaches you! They wield a " + mntBoss.eWep + " and have " + mntBoss.eHp + " Hit Points. Pick your first attacker!";

    // Create Buttons for the action of each character
    document.querySelector("#pMntAction").innerHTML = 
        myParty.cMain.cName   + " strikes with " + myParty.cMain.cWep   + " <button id='btnMntMain'>Go!</button><br>" +
        myParty.cComp01.cName + " strikes with " + myParty.cComp01.cWep + " <button id='btnMntC01'>Go!</button><br>" +
        myParty.cComp02.cName + " strikes with " + myParty.cComp02.cWep + " <button id='btnMntC02'>Go!</button>" 
        ; // END of #pMntActions
    // Create JS Objects for each of generated Buttons
    let elbtnMntMain = document.querySelector("#btnMntMain"); 
    let elbtnMntC01 =  document.querySelector("#btnMntC01");
    let elbtnMntC02 =  document.querySelector("#btnMntC02");

    // Create Event Listeners for each of those Buttons
    // If you need to pass a Parameter into a function: function(){subRoutine(parameter);}
    // If you DON'T need to pass a Parm, it's only: subRoutine (no parens)
    elbtnMntMain.addEventListener("click", fnMntMainFight);
    elbtnMntC01.addEventListener("click",  fnMntC01Fight);
    elbtnMntC02.addEventListener("click",  fnMntC02Fight);

    // Create Functions for those Button Clicks
    function fnMntMainFight(){
        console.log(myParty.cMain.cName, myParty.cMain.cLuck, "VS", mntBoss.eHp);
        // This character fighting, so disable their Button
        elbtnMntMain.disabled = true;
        // From BOSS, subtract LUK as a hit
        mntBoss.eHp = mntBoss.eHp - myParty.cMain.cLuck;
        // Conditional to deal with a "Boss Defeated" or a "Keep Fighting Boss"
        if(mntBoss.eHp <= 0){
            console.log("BOSS DEFEATED");
            // Deactivate other attacks
            elbtnMntMain.disabled = true;
            elbtnMntC01.disabled = true;
            elbtnMntC02.disabled = true;
            
            myParty.cMain.cLuck     += fnRandomNumRange(25, 75);
            myParty.cComp01.cLuck   += fnRandomNumRange(25, 75);
            myParty.cComp02.cLuck   += fnRandomNumRange(25, 75);

            let tmpRndPath = ["#pgDungeon", "#pgBridge"];
            let tmpRndNextPath = tmpRndPath[fnRandomNumRange(0, 1)];
            switch(tmpRndNextPath){
                case "#pgDungeon":
                    console.log("About to go to Dungeon");
                    myParty._currentScreen = "#pgDungeon";
                    localStorage.setItem(myParty._id, JSON.stringify(myParty));
                    tmpRndNextPath = "Dungeon";
                    break;

                case "#pgBridge":
                    console.log("About to go to Bridge");
                    myParty._currentScreen = "#pgBridge"
                    localStorage.setItem(myParty._id, JSON.stringify(myParty));
                    tmpRndNextPath = "Bridge";
                    break;
                default:
                    console.log(tmpRndNextPath);
                    break;
            }; // END Switch() for next path

            console.log(myParty);

            document.querySelector("#pMntResults").innerHTML = "<p>Amazing!</p><p>" + myParty.cMain.cName + "\'s weapon found its target and and struck down  " + mntBoss.eType + "!</p><p>You now have more LUK, " + myParty.cMain.cLuck +", and travel to the " + tmpRndNextPath + ".</p><p><button id='btnMntGoNext'>Next Level</button></p>";
            let elbtnMntGoNext = document.querySelector("#btnMntGoNext");
            elbtnMntGoNext.addEventListener("click", function(){fnNavQuest("#pgMountain", myParty._currentScreen, myParty._id)});
        }else{
            console.log("KEEP FIGHTING", mntBoss.eHp);
            // You took damage
            let tmpHIT = myParty.cMain.cHP / 10;
            myParty.cMain.cHP = Math.round(myParty.cMain.cHP - tmpHIT);
            console.log("Main down to", myParty.cMain.cHP);
            // After the attack, update #pMntResults to show weaker Boss
            document.querySelector("#pMntResults").innerHTML = "<p>" + mntBoss.eType + "\'s HP are down to " + mntBoss.eHp + "! Who else will strike?</p>" +
            "<p>" + myParty.cMain.cName + " is weakened: " + myParty.cMain.cHP + "HP!</p>"
            ; // END #pMntResults

            // and then our Party table with damage taken
            fnPartyDrawTable();

            // Deal with "What about if we all failed??"
            if(
                elbtnMntMain.disabled == true && 
                elbtnMntC01.disabled  == true && 
                elbtnMntC02.disabled  == true
            ){
                console.log("3 members were defeated");

                // No bonuses, but move to the next screen after being weakened
                let tmpRndPath = ["#pgDungeon", "#pgBridge"];
                let tmpRndNextPath = tmpRndPath[fnRandomNumRange(0, 1)];
                switch(tmpRndNextPath){
                    case "#pgDungeon":
                        console.log("About to go to Dungeon");
                        myParty._currentScreen = "#pgDungeon";
                        localStorage.setItem(myParty._id, JSON.stringify(myParty));
                        tmpRndNextPath = "Dungeon";
                        break;

                    case "#pgBridge":
                        console.log("About to go to Bridge");
                        myParty._currentScreen = "#pgBridge"
                        localStorage.setItem(myParty._id, JSON.stringify(myParty));
                        tmpRndNextPath = "Bridge";
                        break;
                    default:
                        console.log(tmpRndNextPath);
                        break;
                }; // END Switch() for next path

                console.log(myParty);

                document.querySelector("#pMntResults").innerHTML = "<p>Oh no!</p><p>" + mntBoss.eType + " is stronger than you!</p><p>Run away to the " + tmpRndNextPath + ".</p><p><button id='btnMntGoNext'>Next Level</button></p>";
                let elbtnMntGoNext = document.querySelector("#btnMntGoNext");
                elbtnMntGoNext.addEventListener("click", function(){fnNavQuest("#pgMountain", myParty._currentScreen, myParty._id)});
            }; // Check if 3 defeats
        }; // END If..Else eHP checker
    }; // END fnMntMainFight()

    function fnMntC01Fight(){
        console.log(myParty.cComp01.cName, myParty.cComp01.cLuck, "VS", mntBoss.eHp);
        elbtnMntC01.disabled = true;
        mntBoss.eHp = mntBoss.eHp - myParty.cComp01.cLuck;
        if(mntBoss.eHp <= 0){
            console.log("BOSS DEFEATED");
            elbtnMntMain.disabled = true;
            elbtnMntC01.disabled = true;
            elbtnMntC02.disabled = true;

            myParty.cMain.cLuck     += fnRandomNumRange(25, 75);
            myParty.cComp01.cLuck   += fnRandomNumRange(25, 75);
            myParty.cComp02.cLuck   += fnRandomNumRange(25, 75);

        let tmpRndPath = ["#pgDungeon", "#pgBridge"];
            let tmpRndNextPath = tmpRndPath[fnRandomNumRange(0, 1)];
            switch(tmpRndNextPath){
                case "#pgDungeon":
                    console.log("About to go to Dungeon");
                    myParty._currentScreen = "#pgDungeon";
                    localStorage.setItem(myParty._id, JSON.stringify(myParty));
                    tmpRndNextPath = "Dungeon";
                    break;

                case "#pgBridge":
                    console.log("About to go to Bridge");
                    myParty._currentScreen = "#pgBridge"
                    localStorage.setItem(myParty._id, JSON.stringify(myParty));
                    tmpRndNextPath = "Bridge";
                    break;
                default:
                    console.log(tmpRndNextPath);
                    break;
            }; // END Switch() for next path

            console.log(myParty);

            document.querySelector("#pMntResults").innerHTML = "<p>Amazing!</p><p>" + myParty.cComp01.cName + "\'s weapon found its target and and struck down  " + mntBoss.eType + "!</p><p>You now have more LUK, " + myParty.cMain.cLuck +", and travel to the " + tmpRndNextPath + ".</p><p><button id='btnMntGoNext'>Next Level</button></p>";
            let elbtnMntGoNext = document.querySelector("#btnMntGoNext");
            elbtnMntGoNext.addEventListener("click", function(){fnNavQuest("#pgMountain", myParty._currentScreen, myParty._id)});
        }else{
            console.log("KEEP FIGHTING", mntBoss.eHp);
            let tmpHIT = myParty.cComp01.cHP / 10;
            myParty.cComp01.cHP = Math.round(myParty.cComp01.cHP - tmpHIT);
            console.log("Main down to", myParty.cComp01.cHP);
            document.querySelector("#pMntResults").innerHTML = "<p>" + mntBoss.eType + "\'s HP are down to " + mntBoss.eHp + "! Who else will strike?</p>" +
            "<p>" + myParty.cComp01.cName + " is weakened: " + myParty.cComp01.cHP + "HP!</p>"
            ; // END #pMntResults
            fnPartyDrawTable();

            // Deal with "What about if we all failed??"
            if(
                elbtnMntMain.disabled == true && 
                elbtnMntC01.disabled  == true && 
                elbtnMntC02.disabled  == true
            ){
                console.log("3 members were defeated");

                // No bonuses, but move to the next screen after being weakened
                let tmpRndPath = ["#pgDungeon", "#pgBridge"];
                let tmpRndNextPath = tmpRndPath[fnRandomNumRange(0, 1)];
                switch(tmpRndNextPath){
                    case "#pgDungeon":
                        console.log("About to go to Dungeon");
                        myParty._currentScreen = "#pgDungeon";
                        localStorage.setItem(myParty._id, JSON.stringify(myParty));
                        tmpRndNextPath = "Dungeon";
                        break;

                    case "#pgBridge":
                        console.log("About to go to Bridge");
                        myParty._currentScreen = "#pgBridge"
                        localStorage.setItem(myParty._id, JSON.stringify(myParty));
                        tmpRndNextPath = "Bridge";
                        break;
                    default:
                        console.log(tmpRndNextPath);
                        break;
                }; // END Switch() for next path

                console.log(myParty);

                document.querySelector("#pMntResults").innerHTML = "<p>Oh no!</p><p>" + mntBoss.eType + " is stronger than you!</p><p>Run away to the " + tmpRndNextPath + ".</p><p><button id='btnMntGoNext'>Next Level</button></p>";
                let elbtnMntGoNext = document.querySelector("#btnMntGoNext");
                elbtnMntGoNext.addEventListener("click", function(){fnNavQuest("#pgMountain", myParty._currentScreen, myParty._id)});
            }; // Check if 3 defeats
        }; // END If..Else eHP checker
    }; // END fnMnt01

    function fnMntC02Fight(){
        console.log(myParty.cComp02.cName, myParty.cComp02.cLuck, "VS", mntBoss.eHp);
        elbtnMntC02.disabled = true;
        mntBoss.eHp = mntBoss.eHp - myParty.cComp02.cLuck;
        if(mntBoss.eHp <= 0){
            console.log("BOSS DEFEATED");
            elbtnMntMain.disabled = true;
            elbtnMntC01.disabled = true;
            elbtnMntC02.disabled = true;

            myParty.cMain.cLuck     += fnRandomNumRange(25, 75);
            myParty.cComp01.cLuck   += fnRandomNumRange(25, 75);
            myParty.cComp02.cLuck   += fnRandomNumRange(25, 75);

            let tmpRndPath = ["#pgDungeon", "#pgBridge"];
            let tmpRndNextPath = tmpRndPath[fnRandomNumRange(0, 1)];
            switch(tmpRndNextPath){
                case "#pgDungeon":
                    console.log("About to go to Dungeon");
                    myParty._currentScreen = "#pgDungeon";
                    localStorage.setItem(myParty._id, JSON.stringify(myParty));
                    tmpRndNextPath = "Dungeon";
                    break;

                case "#pgBridge":
                    console.log("About to go to Bridge");
                    myParty._currentScreen = "#pgBridge"
                    localStorage.setItem(myParty._id, JSON.stringify(myParty));
                    tmpRndNextPath = "Bridge";
                    break;
                default:
                    console.log(tmpRndNextPath);
                    break;
            }; // END Switch() for next path

            console.log(myParty);

            document.querySelector("#pMntResults").innerHTML = "<p>Amazing!</p><p>" + myParty.cComp02.cName + "\'s weapon found its target and and struck down  " + mntBoss.eType + "!</p><p>You now have more LUK, " + myParty.cMain.cLuck +", and travel to the " + tmpRndNextPath + ".</p><p><button id='btnMntGoNext'>Next Level</button></p>";
            let elbtnMntGoNext = document.querySelector("#btnMntGoNext");
            elbtnMntGoNext.addEventListener("click", function(){fnNavQuest("#pgMountain", myParty._currentScreen, myParty._id)});
        }else{
            console.log("KEEP FIGHTING", mntBoss.eHp);
            let tmpHIT = myParty.cComp02.cHP / 10;
            myParty.cComp02.cHP = Math.round(myParty.cComp02.cHP - tmpHIT);
            console.log("Main down to", myParty.cComp02.cHP);
            document.querySelector("#pMntResults").innerHTML = "<p>" + mntBoss.eType + "\'s HP are down to " + mntBoss.eHp + "! Who else will strike?</p>" +
            "<p>" + myParty.cComp02.cName + " is weakened: " + myParty.cComp02.cHP + "HP!</p>"
            ; // END #pMntResults
            fnPartyDrawTable();

            // Deal with "What about if we all failed??"
            if(
                elbtnMntMain.disabled == true && 
                elbtnMntC01.disabled  == true && 
                elbtnMntC02.disabled  == true
            ){
                console.log("3 members were defeated");

                // No bonuses, but move to the next screen after being weakened
                let tmpRndPath = ["#pgDungeon", "#pgBridge"];
                let tmpRndNextPath = tmpRndPath[fnRandomNumRange(0, 1)];
                switch(tmpRndNextPath){
                    case "#pgDungeon":
                        console.log("About to go to Dungeon");
                        myParty._currentScreen = "#pgDungeon";
                        localStorage.setItem(myParty._id, JSON.stringify(myParty));
                        tmpRndNextPath = "Dungeon";
                        break;

                    case "#pgBridge":
                        console.log("About to go to Bridge");
                        myParty._currentScreen = "#pgBridge"
                        localStorage.setItem(myParty._id, JSON.stringify(myParty));
                        tmpRndNextPath = "Bridge";
                        break;
                    default:
                        console.log(tmpRndNextPath);
                        break;
                }; // END Switch() for next path

                console.log(myParty);

                document.querySelector("#pMntResults").innerHTML = "<p>Oh no!</p><p>" + mntBoss.eType + " is stronger than you!</p><p>Run away to the " + tmpRndNextPath + ".</p><p><button id='btnMntGoNext'>Next Level</button></p>";
                let elbtnMntGoNext = document.querySelector("#btnMntGoNext");
                elbtnMntGoNext.addEventListener("click", function(){fnNavQuest("#pgMountain", myParty._currentScreen, myParty._id)});
            }; // Check if 3 defeats
        }; // END If..Else eHP checker
    }; // END fnMnt02
}; // END fnMountain()

//=====================================================================
//  fnBridge - Function for all the action at Bridge
//=====================================================================
function fnBridge(currParty){
    console.log("At the Bridge", currParty);
    let myParty = JSON.parse(localStorage.getItem(currParty));
    console.log(myParty._id);

    document.querySelector("#pBrdMsg").innerHTML = "Welcome to the Peril Bridge. A new challenger approaches! Will your combined might prevail?";  

    // A Function to draw the Party Table when needed, then run it right away
    function fnPartyDrawTable(){
            document.querySelector("#pBrdParty").innerHTML = "<table><tr><td style='padding-right: 0.5em; border-right: 2px solid goldenrod;'>" + 
            myParty.cMain.cName +
            "<br>HP: " + myParty.cMain.cHP +
            "<br>WEP: " + myParty.cMain.cWep +

            "</td><td style='padding-right: 0.5em; border-right: 2px solid goldenrod; padding-left: 0.5em;'>" + 
            myParty.cComp01.cName +
            "<br>HP: " + myParty.cComp01.cHP +
            "<br>WEP: " + myParty.cComp01.cWep +

            "</td><td style='padding-left: 0.5em;'>" + 
            myParty.cComp02.cName +
            "<br>HP: " + myParty.cComp02.cHP +
            "<br>WEP: " + myParty.cComp02.cWep +
    
        "</td></tr></table>"; // END <table> of Party
    }; // END fnPartyDrawTable()

    // Render the table at the start of the level, and then later, after taking damage
    fnPartyDrawTable();

    // Enemy { constructor(eType, eHp, eStr, eSpd, eMp, eWep, eClass, eStatus){ eLuck() {}}
    // Generate a Level Boss
    let brdBoss = new Enemy(fnGenArray(arrNamesBosses), fnRandomNumRange(75, 100), null, null, null, fnGenArray(arrWeapons), null, "Alive");
    console.log(brdBoss);

    document.querySelector("#pBrdEnemy").innerHTML = brdBoss.eType + " approaches you! They wield a " + brdBoss.eWep + " and have " + brdBoss.eHp + " Hit Points. Pick your first attacker!";

    // Create Buttons for the action of each character
    document.querySelector("#pBrdAction").innerHTML = 
        myParty.cMain.cName   + " equipped " + myParty.cMain.cWep   + " <button id='btnBrdMain'>Go!</button><br>" +
        myParty.cComp01.cName + " equipped " + myParty.cComp01.cWep + " <button id='btnBrdC01'>Go!</button><br>" +
        myParty.cComp02.cName + " equipped " + myParty.cComp02.cWep + " <button id='btnBrdC02'>Go!</button>" 
        ; // END of #pBrdActions
    // Create JS Objects for each of generated Buttons
    let elbtnBrdMain = document.querySelector("#btnBrdMain"); 
    let elbtnBrdC01 =  document.querySelector("#btnBrdC01");
    let elbtnBrdC02 =  document.querySelector("#btnBrdC02");

    // Create Event Listeners for each of those Buttons
    // If you need to pass a Parameter into a function: function(){subRoutine(parameter);}
    // If you DON'T need to pass a Parm, it's only: subRoutine (no parens)
    elbtnBrdMain.addEventListener("click", fnBrdMainFight);
    elbtnBrdC01.addEventListener("click",  fnBrdC01Fight);
    elbtnBrdC02.addEventListener("click",  fnBrdC02Fight);

    // Create Functions for those Button Clicks
    function fnBrdMainFight(){
        console.log(myParty.cMain.cName, myParty.cMain.cLuck, "VS", brdBoss.eHp);
        // This character fighting, so disable their Button
        elbtnBrdMain.disabled = true;
        // From BOSS, subtract LUK as a hit
        brdBoss.eHp = brdBoss.eHp - myParty.cMain.cLuck;
        // Conditional to deal with a "Boss Defeated" or a "Keep Fighting Boss"
        if(brdBoss.eHp <= 0){
            console.log("BOSS DEFEATED");
            // Deactivate other attacks
            elbtnBrdMain.disabled = true;
            elbtnBrdC01.disabled = true;
            elbtnBrdC02.disabled = true;
            
            myParty.cMain.cLuck     += fnRandomNumRange(25, 75);
            myParty.cComp01.cLuck   += fnRandomNumRange(25, 75);
            myParty.cComp02.cLuck   += fnRandomNumRange(25, 75);

            // TO-DO: Super simplify
            let tmpRndPath = ["#pgDungeon"];
            let tmpRndNextPath = tmpRndPath[0];
            switch(tmpRndNextPath){
                case "#pgDungeon":
                    console.log("About to go to Dungeon");
                    myParty._currentScreen = "#pgDungeon";
                    localStorage.setItem(myParty._id, JSON.stringify(myParty));
                    tmpRndNextPath = "Dungeon";
                    break;

                default:
                    console.log(tmpRndNextPath);
                    break;
            }; // END Switch() for next path

            console.log(myParty);

            document.querySelector("#pBrdResults").innerHTML = "<p>Excellent!</p><p>" + myParty.cMain.cName + " toppled  " + brdBoss.eType + "!</p><p>You earned a boon of " + myParty.cMain.cLuck +"LUK, and will journey toward the " + tmpRndNextPath + ".</p><p><button id='btnBrdGoNext'>Next Level</button></p>";
            let elbtnBrdGoNext = document.querySelector("#btnBrdGoNext");
            elbtnBrdGoNext.addEventListener("click", function(){fnNavQuest("#pgBridge", myParty._currentScreen, myParty._id)});
        }else{
            console.log("KEEP FIGHTING", brdBoss.eHp);
            // You took damage
            let tmpHIT = myParty.cMain.cHP / 10;
            myParty.cMain.cHP = Math.round(myParty.cMain.cHP - tmpHIT);
            console.log("Main down to", myParty.cMain.cHP);
            // After the attack, update #pBrdResults to show weaker Boss
            document.querySelector("#pBrdResults").innerHTML = "<p>" + brdBoss.eType + " is struck down to " + brdBoss.eHp + "HP! Who now strikes?</p>" +
            "<p>" + myParty.cMain.cName + " is weakened: " + myParty.cMain.cHP + "HP!</p>"
            ; // END #pBrdResults

            // and then our Party table with damage taken
            fnPartyDrawTable();

            // Deal with "What about if we all failed??"
            if(
                elbtnBrdMain.disabled == true && 
                elbtnBrdC01.disabled  == true && 
                elbtnBrdC02.disabled  == true
            ){
                console.log("3 members were defeated");

                // No bonuses, but move to the next screen after being weakened
                let tmpRndPath = ["#pgDungeon"];
                let tmpRndNextPath = tmpRndPath[0];
                switch(tmpRndNextPath){
                    case "#pgDungeon":
                        console.log("About to go to Dungeon");
                        myParty._currentScreen = "#pgDungeon";
                        localStorage.setItem(myParty._id, JSON.stringify(myParty));
                        tmpRndNextPath = "Dungeon";
                        break;

                    default:
                        console.log(tmpRndNextPath);
                        break;
                }; // END Switch() for next path

                console.log(myParty);

                document.querySelector("#pBrdResults").innerHTML = "<p>Oh no!</p><p>" + brdBoss.eType + " is stronger than you!</p><p>Run away to the " + tmpRndNextPath + ".</p><p><button id='btnBrdGoNext'>Next Level</button></p>";
                let elbtnBrdGoNext = document.querySelector("#btnBrdGoNext");
                elbtnBrdGoNext.addEventListener("click", function(){fnNavQuest("#pgBridge", myParty._currentScreen, myParty._id)});
            }; // Check if 3 defeats
        }; // END If..Else eHP checker
    }; // END fnBrdMainFight()

    function fnBrdC01Fight(){
        console.log(myParty.cComp01.cName, myParty.cComp01.cLuck, "VS", brdBoss.eHp);
        elbtnBrdC01.disabled = true;
        brdBoss.eHp = brdBoss.eHp - myParty.cComp01.cLuck;
        if(brdBoss.eHp <= 0){
            console.log("BOSS DEFEATED");
            elbtnBrdMain.disabled = true;
            elbtnBrdC01.disabled = true;
            elbtnBrdC02.disabled = true;

            myParty.cMain.cLuck     += fnRandomNumRange(25, 75);
            myParty.cComp01.cLuck   += fnRandomNumRange(25, 75);
            myParty.cComp02.cLuck   += fnRandomNumRange(25, 75);

            let tmpRndPath = ["#pgDungeon"];
            let tmpRndNextPath = tmpRndPath[0];
            switch(tmpRndNextPath){
                case "#pgDungeon":
                    console.log("About to go to Dungeon");
                    myParty._currentScreen = "#pgDungeon";
                    localStorage.setItem(myParty._id, JSON.stringify(myParty));
                    tmpRndNextPath = "Dungeon";
                    break;

                default:
                    console.log(tmpRndNextPath);
                    break;
            }; // END Switch() for next path

            console.log(myParty);

            document.querySelector("#pBrdResults").innerHTML = "<p>Excellent!</p><p>" + myParty.cComp01.cName + " toppled  " + brdBoss.eType + "!</p><p>You earned a boon of " + myParty.cMain.cLuck +"LUK, and will journey toward the " + tmpRndNextPath + ".</p><p><button id='btnBrdGoNext'>Next Level</button></p>";
            let elbtnBrdGoNext = document.querySelector("#btnBrdGoNext");
            elbtnBrdGoNext.addEventListener("click", function(){fnNavQuest("#pgBridge", myParty._currentScreen, myParty._id)});
        }else{
            console.log("KEEP FIGHTING", brdBoss.eHp);
            let tmpHIT = myParty.cComp01.cHP / 10;
            myParty.cComp01.cHP = Math.round(myParty.cComp01.cHP - tmpHIT);
            console.log("Main down to", myParty.cComp01.cHP);
            document.querySelector("#pBrdResults").innerHTML = "<p>" + brdBoss.eType + " is struck down to " + brdBoss.eHp + "HP! Who now strikes?</p>" +
            "<p>" + myParty.cComp01.cName + " is weakened: " + myParty.cComp01.cHP + "HP!</p>"
            ; // END #pBrdResults
            fnPartyDrawTable();

            // Deal with "What about if we all failed??"
            if(
                elbtnBrdMain.disabled == true && 
                elbtnBrdC01.disabled  == true && 
                elbtnBrdC02.disabled  == true
            ){
                console.log("3 members were defeated");

                // No bonuses, but move to the next screen after being weakened
                let tmpRndPath = ["#pgDungeon"];
                let tmpRndNextPath = tmpRndPath[0];
                switch(tmpRndNextPath){
                    case "#pgDungeon":
                        console.log("About to go to Dungeon");
                        myParty._currentScreen = "#pgDungeon";
                        localStorage.setItem(myParty._id, JSON.stringify(myParty));
                        tmpRndNextPath = "Dungeon";
                        break;

                    default:
                        console.log(tmpRndNextPath);
                        break;
                }; // END Switch() for next path

                console.log(myParty);

                document.querySelector("#pBrdResults").innerHTML = "<p>Oh no!</p><p>" + brdBoss.eType + " is stronger than you!</p><p>Run away to the " + tmpRndNextPath + ".</p><p><button id='btnBrdGoNext'>Next Level</button></p>";
                let elbtnBrdGoNext = document.querySelector("#btnBrdGoNext");
                elbtnBrdGoNext.addEventListener("click", function(){fnNavQuest("#pgBridge", myParty._currentScreen, myParty._id)});
            }; // Check if 3 defeats
        }; // END If..Else eHP checker
    }; // END fnBrd01

    function fnBrdC02Fight(){
        console.log(myParty.cComp02.cName, myParty.cComp02.cLuck, "VS", brdBoss.eHp);
        elbtnBrdC02.disabled = true;
        brdBoss.eHp = brdBoss.eHp - myParty.cComp02.cLuck;
        if(brdBoss.eHp <= 0){
            console.log("BOSS DEFEATED");
            elbtnBrdMain.disabled = true;
            elbtnBrdC01.disabled = true;
            elbtnBrdC02.disabled = true;

            myParty.cMain.cLuck     += fnRandomNumRange(25, 75);
            myParty.cComp01.cLuck   += fnRandomNumRange(25, 75);
            myParty.cComp02.cLuck   += fnRandomNumRange(25, 75);

            let tmpRndPath = ["#pgDungeon"];
            let tmpRndNextPath = tmpRndPath[0];
            switch(tmpRndNextPath){
                case "#pgDungeon":
                    console.log("About to go to Dungeon");
                    myParty._currentScreen = "#pgDungeon";
                    localStorage.setItem(myParty._id, JSON.stringify(myParty));
                    tmpRndNextPath = "Dungeon";
                    break;

                default:
                    console.log(tmpRndNextPath);
                    break;
            }; // END Switch() for next path

            console.log(myParty);

            document.querySelector("#pBrdResults").innerHTML = "<p>Excellent!</p><p>" + myParty.cComp02.cName + " toppled  " + brdBoss.eType + "!</p><p>You earned a boon of " + myParty.cMain.cLuck +"LUK, and will journey toward the " + tmpRndNextPath + ".</p><p><button id='btnBrdGoNext'>Next Level</button></p>";
            let elbtnBrdGoNext = document.querySelector("#btnBrdGoNext");
            elbtnBrdGoNext.addEventListener("click", function(){fnNavQuest("#pgBridge", myParty._currentScreen, myParty._id)});
        }else{
            console.log("KEEP FIGHTING", brdBoss.eHp);
            let tmpHIT = myParty.cComp02.cHP / 10;
            myParty.cComp02.cHP = Math.round(myParty.cComp02.cHP - tmpHIT);
            console.log("Main down to", myParty.cComp02.cHP);
            document.querySelector("#pBrdResults").innerHTML = "<p>" + brdBoss.eType + " is struck down to " + brdBoss.eHp + "HP! Who now strikes?</p>" +
            "<p>" + myParty.cComp02.cName + " is weakened: " + myParty.cComp02.cHP + "HP!</p>"
            ; // END #pBrdResults
            fnPartyDrawTable();

            // Deal with "What about if we all failed??"
            if(
                elbtnBrdMain.disabled == true && 
                elbtnBrdC01.disabled  == true && 
                elbtnBrdC02.disabled  == true
            ){
                console.log("3 members were defeated");

                // No bonuses, but move to the next screen after being weakened
                let tmpRndPath = ["#pgDungeon"];
                let tmpRndNextPath = tmpRndPath[0];
                switch(tmpRndNextPath){
                    case "#pgDungeon":
                        console.log("About to go to Dungeon");
                        myParty._currentScreen = "#pgDungeon";
                        localStorage.setItem(myParty._id, JSON.stringify(myParty));
                        tmpRndNextPath = "Dungeon";
                        break;

                    default:
                        console.log(tmpRndNextPath);
                        break;
                }; // END Switch() for next path

                console.log(myParty);

                document.querySelector("#pBrdResults").innerHTML = "<p>Oh no!</p><p>" + brdBoss.eType + " is stronger than you!</p><p>Run away to the " + tmpRndNextPath + ".</p><p><button id='btnBrdGoNext'>Next Level</button></p>";
                let elbtnBrdGoNext = document.querySelector("#btnBrdGoNext");
                elbtnBrdGoNext.addEventListener("click", function(){fnNavQuest("#pgBridge", myParty._currentScreen, myParty._id)});
            }; // Check if 3 defeats
        }; // END If..Else eHP checker
    }; // END fnBrd02
}; // END fnBridge()


// Set up a way to Load or Quit while we play
function fnLogOut(logWhere, logWhich){
    console.log("fnLogOut() is running from where:", logWhere.id, "which was clicked:", logWhich);
    
    // // If coming from the Dungeon scene, close splash screen and disable sound
    // if (logWhere.id == "#pgEndGood") {
    //     const splash = document.getElementById("splashScreen");
    //     const sound = document.getElementById("playSound");
    //     splash.style.display = "none";
    //     sound.onpause();
    // }
    
    // Re-load game data
    let tmpGamesAll = JSON.parse(localStorage.getItem("allEmails"));

    // Switch between Load or Quit
    switch(logWhich) {
        case "Load":
            // if(window.confirm("Are you sure you want to load another saved game?")){
                console.log("Yes, log out");
                // // Re-load game data
                // let tmpGamesAll = JSON.parse(localStorage.getItem("allEmails"));
                // Clear out the old list of Saved Games first
                document.querySelector("#pLGPartySelect").innerHTML = "";
                // Then re-build the list
                // Show the Saved Games (Parties) to select from
                for(let i = 0; i < tmpGamesAll.length; i++){
                    let tmpPartyData = JSON.parse(localStorage.getItem(tmpGamesAll[i]));
                    // if a previously saved game has reached the Dungeon, disable it
                    if (tmpPartyData._currentScreen == "#pgEndGood" || tmpPartyData._currentScreen == "#pgEndBad" || tmpPartyData._currentScreen == "#pgEndOK") {
                    document.querySelector("#pLGPartySelect").innerHTML += 
                        "<p>" + tmpPartyData.cMain.cName + " - Game Over @Dungeon</p>";
                    } else {
                    document.querySelector("#pLGPartySelect").innerHTML += 
                        "<p>" + tmpPartyData.cMain.cName + " <button onclick='fnGameLoad(`" + tmpGamesAll[i] + "`);'>" + "Enter Game" + "</button></p>";
                    }
                }; //END For()
                // Move to pgLoadGame
                fnNavMenus("#" + logWhere.id, "#pgLoadGame");
            // }; // END True on the Confirm
            break;
        case "Quit":
            // if(window.confirm("Are you sure you wish to exit this quest?")){
            //     console.log("Yes, quit!");
            //     fnNavMenus("#" + logWhere.id, "#pgWelcome");
            // }; // END True on the Confirm
            console.log("Yes, quit!");
            // Clear out the old list of Saved Games first
            document.querySelector("#pLGPartySelect").innerHTML = "";
            // Then re-build the list
            // Show the Saved Games (Parties) to select from
            for(let i = 0; i < tmpGamesAll.length; i++){
                let tmpPartyData = JSON.parse(localStorage.getItem(tmpGamesAll[i]));
                // if a previously saved game has reached the Dungeon, disable it
                if (tmpPartyData._currentScreen == "#pgEndGood" || tmpPartyData._currentScreen == "#pgEndBad" || tmpPartyData._currentScreen == "#pgEndOK") {
                document.querySelector("#pLGPartySelect").innerHTML += 
                    "<p>" + tmpPartyData.cMain.cName + " - Game Over @Dungeon</p>";
                } else {
                document.querySelector("#pLGPartySelect").innerHTML += 
                    "<p>" + tmpPartyData.cMain.cName + " <button onclick='fnGameLoad(`" + tmpGamesAll[i] + "`);'>" + "Enter Game" + "</button></p>";
                }
            }; //END For()
            fnNavMenus("#" + logWhere.id, "#pgWelcome");
            break;
        default:
            console.log(logWhich);
            break;
    }; // END Switch() between screens
}; // END fnLogOut()


//=====================================================================
//  fnDungeon - Function for all the actions in the Dungeon
//=====================================================================
function fnDungeon(currParty){
    console.log("At the Dungeon", currParty);
    let myParty = JSON.parse(localStorage.getItem(currParty));
    console.log(myParty._id);

    document.querySelector("#pDunMsg").innerHTML = "Welcome to the Dungeon, the final leg of your quest! Face the ultimate challenge with all your stats and " + myParty._inventory[0] + " before time runs out and the roof collapses!";  

    // PartyMember(cName, cHP, cStr, cSpd, cMp, cLuck, cWep, cClass)
    // A Function to draw the Party Table when needed, then run it right away
    function fnPartyDrawTable(){
            document.querySelector("#pDunParty").innerHTML = "<table><tr><td style='padding-right: 0.5em; border-right: 2px solid goldenrod;'>" + 
            myParty.cMain.cName +
            "<br>" + myParty.cMain.cClass +
            "<br><strong>HP</strong>:" + myParty.cMain.cHP +
            "<br><strong>STR</strong>: " + myParty.cMain.cStr +
            "<br><strong>SPD</strong>: " + myParty.cMain.cSpd +
            "<br><strong>MP</strong>: " + myParty.cMain.cMp +
            "<br><strong>LUK</strong>: " + myParty.cMain.cLuck +
            "<br>" + myParty.cMain.cWep +

            "</td><td style='padding-right: 0.5em; border-right: 2px solid goldenrod; padding-left: 0.5em;'>" + 
            myParty.cComp01.cName +
            "<br>" + myParty.cComp01.cClass +
            "<br><strong>HP</strong>:" + myParty.cComp01.cHP +
            "<br><strong>STR</strong>: " + myParty.cComp01.cStr +
            "<br><strong>SPD</strong>: " + myParty.cComp01.cSpd +
            "<br><strong>MP</strong>: " + myParty.cComp01.cMp +
            "<br><strong>LUK</strong>: " + myParty.cComp01.cLuck +
            "<br>" + myParty.cComp02.cWep +

            "</td><td style='padding-left: 0.5em;'>" + 
            myParty.cComp02.cName +
            "<br>" + myParty.cComp01.cClass +
            "<br><strong>HP</strong>:" + myParty.cComp02.cHP +
            "<br><strong>STR</strong>: " + myParty.cComp02.cStr +
            "<br><strong>SPD</strong>: " + myParty.cComp02.cSpd +
            "<br><strong>MP</strong>: " + myParty.cComp02.cMp +
            "<br><strong>LUK</strong>: " + myParty.cComp02.cLuck +
            "<br>" + myParty.cComp02.cWep +
    
        "</td></tr></table>"; // END <table> of Party
    }; // END fnPartyDrawTable()

    // Render the table at the start of the level, and then later, after taking damage
    fnPartyDrawTable();

    // This level's challenge is based on time
    document.querySelector("#pDunEnemy").innerHTML = "<p style='text-align: center;'><span id='pDunTimer'>10</span> seconds left!</p>";
    // Good: 8-10 seconds left, OK: >= 3 sec Bad: < 2 sec
    // Starting point (maximum time)
    let timeLeft = 10; 
     // Obj of the number counting down
    let elPDunTimer = document.querySelector("#pDunTimer");

    // Arrow Expression (instead of Function) to keep track of the passage of time
    let fnCountdownInterval =  window.setInterval(() => {
        // Count down 1 second
        timeLeft--;
        // And display on-screen
        elPDunTimer.innerHTML = timeLeft;

        // Deal with running out of time (BAD ending)
        if(timeLeft <= 0){
            // Turn off timer
            window.clearInterval(fnCountdownInterval);
            // Disable interactive buttons
            elBtnDunAction.disabled = true;
            // Show bad ending message and action
            elPDunTimer.innerHTML = "Alas! Time\'s up and the roof has collapsed upon your party.";
            document.querySelector("#pDunResults").innerHTML = "<p style='text-align: center;'>DEAD</p>";
            // Before moving to worst ending, delay x amount of time
            
            fnCountdownDelay(3, "#pgEndBad", myParty); 
        }; // END If bad ending checker
    }, 1000); // END .setInterval()

    // Create on-screen interactivity so the time matters
    document.querySelector("#pDunAction").innerHTML = "<p style='text-align: center;'><button id='btnDunAction'>ATTACK</button></p>";
    let elBtnDunAction = document.querySelector("#btnDunAction");
    elBtnDunAction.addEventListener("click", fnDunAction);  // function() { aFunction(a, b, c);  }

    // Run the action of this level to check timer and give Ending possibilities
    function fnDunAction(){
        console.log("fnDunAction() is running");
        // Turn off item, we interacted
        elBtnDunAction.disabled = true;
        // Turn off timer, we interacted
        window.clearInterval(fnCountdownInterval);
        console.log("Timer stopped at", timeLeft);
        let maxDelayTime = 3;
        if(timeLeft >= 8){
        // 8, 9, 10
            console.log("BEST ending");
            document.querySelector("#pDunEnemy").innerHTML = "<p style='text-align: center;'>Amazing!</p>";
            document.querySelector("#pDunResults").innerHTML = "<p style='text-align: center;'>Go to GOOD end</p>";
            fnCountdownDelay(maxDelayTime, "#pgEndGood", myParty); 
        } else if(timeLeft >=3 && timeLeft <= 7){
            // 3, 4, 5, 6, 7
            console.log("OK ending");
            document.querySelector("#pDunEnemy").innerHTML = "<p style='text-align: center;'>Adequate</p>";
            document.querySelector("#pDunResults").innerHTML = "<p style='text-align: center;'>Go to OK end</p>";
            fnCountdownDelay(maxDelayTime, "#pgEndOK", myParty); 
        } else {
            // 1, 2
            console.log("BAD ending");
            document.querySelector("#pDunEnemy").innerHTML = "<p style='text-align: center;'>No!</p>";
            document.querySelector("#pDunResults").innerHTML = "<p style='text-align: center;'>Go to BAD end</p>";
            fnCountdownDelay(maxDelayTime, "#pgEndBad", myParty); 
        }; // END If..Else If time checker
    }; // END fnDunAction()

    // Set up a delay to play for x time before moving us to GOOD/OK/BAD screens
    function fnCountdownDelay(maxDelayTime, pgEnd, partyID) {
        let delayTimer = window.setInterval(() => {
            let splash, sound;
            maxDelayTime--;
            if(maxDelayTime <= 0){
                console.log("Delay over, move to an End screen:", pgEnd);
                // Clear this Interval (Timer)
                window.clearInterval(delayTimer);
                switch(pgEnd){
                    case "#pgEndGood":
                        console.log("Display The Good Job screen");
                        myParty._currentScreen = pgEnd;
                        localStorage.setItem(myParty._id, JSON.stringify(myParty));
                        document.querySelector("#pgDungeon").style.display = "none";
                        document.querySelector("#pgEndGood").style.display = "block";
                        splash = document.getElementById("goodImage");
                        sound = document.getElementById("goodSound");
                        splash.style.display = "flex";
                        sound.currentTime = 0; 
                        sound.play();
                        break;
                    case "#pgEndOK":
                        console.log("Display The OK Job screen");
                        // fnNavQuest("#pgDungeon", pgEnd, partyID._id);
                        myParty._currentScreen = pgEnd;
                        localStorage.setItem(myParty._id, JSON.stringify(myParty));
                        document.querySelector("#pgDungeon").style.display = "none";
                        document.querySelector("#pgEndOK").style.display = "block";
                        splash = document.getElementById("OKImage");
                        sound = document.getElementById("OKSound");
                        splash.style.display = "flex";
                        sound.currentTime = 0; 
                        sound.play();
                        break;
                    case "#pgEndBad":
                        console.log("Display The BAD Job screen");
                        // fnNavQuest("#pgDungeon", pgEnd, partyID._id);
                        myParty._currentScreen = pgEnd;
                        localStorage.setItem(myParty._id, JSON.stringify(myParty));
                        document.querySelector("#pgDungeon").style.display = "none";
                        document.querySelector("#pgEndBad").style.display = "block";
                        splash = document.getElementById("badImage");
                        sound = document.getElementById("badSound");
                        splash.style.display = "flex";
                        sound.currentTime = 0; 
                        sound.play();
                        break;
                }; // END Switch()
            }; // END of Delay Timer
        }, 1000);
    }; // END fnCountdownDelay()

    function fnDunTheEnd(){
        const splash = document.getElementById("splashScreen");
        const sound = document.getElementById("playSound");
        splash.style.display = "flex";
        sound.currentTime = 0; 
        sound.play();
        sound.play().catch(() => {
            console.log("Autoplay blocked, but will play on next user interaction.");
        });
    } // END fnDunTheEnd

}; // END fnDungeon()


// Make inner functions global so HTML can access them
window.fnGameInit = fnGameInit;
window.fnNavMenus = fnNavMenus;
window.fnCharCreate = fnCharCreate;
window.fnGenArray = fnGenArray;
window.fnGameLoad = fnGameLoad;
window.fnNavQuest = fnNavQuest;
window.fnTavern = fnTavern;
window.fnLake = fnLake;
window.fnBridge = fnBridge;
window.fnMountain = fnMountain;
window.fnDungeon = fnDungeon;
window.fnLogOut = fnLogOut;