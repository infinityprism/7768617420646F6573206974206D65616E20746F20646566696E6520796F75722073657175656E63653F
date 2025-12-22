// =============================================== Website elements

const screenBox = document.querySelector(".grid-container");
const selectionBox = document.querySelector(".selectionBox");

const glitchVideo = document.getElementById("glitch-video")
const dim = document.getElementById("dim");
const scratched = document.getElementById("scratched");
const seen = document.getElementById("seen");
const blinded = document.getElementById("blinded");
const uncertainty = document.getElementById("uncertainty");
const watched = document.getElementById("watched");
let phasesShown = [dim];

const overlayDiv = document.querySelector(".overlayDiv");
const updateOutput = document.getElementById("update-output");
const startingBlackScreen = document.querySelector(".black-screen");
const startingText = document.querySelector("#homeScreenText");
const mediaQueryMobile = window.matchMedia("(max-width: 1100px)");
let isInIntroMenu = true;

const selectOptions = document.querySelector(".option-selection"); // all options
const fightOption = document.getElementById("fight-option"); //1 fight option
const runOption = document.getElementById("run-option"); // run option
const skillOption = document.getElementById("skill-option"); // skill option that houses all the other skills in it
const skillList = document.querySelector("#skills"); // the list of skills inside the skill option

const dialogue = document.getElementById("dialogue");
const turnDialogue = document.getElementById("turnDialogue");
const attackDialogue = ["SOMETHING listens to you struggle.", "SOMETHING is trying to talk to you.", "SOMETHING shatters it all to pieces."];
const enemyDialogue = attackDialogue[Math.floor(Math.random() * 3)];

const thalassophobia = document.getElementById("thalassophobia");
const virtualAngel = document.getElementById("virtual-angel");
const sheriruth = document.getElementById("sheriruth");
const zero = document.getElementById("0-something");
const cancelSFX = document.getElementById("cant-do-that");
const buttonSFX = document.getElementById("button-sfx");
const cancelNextSFX = document.getElementById("cancel-sfx");
const attackSFX = document.getElementById("basicATK-sfx");
const enemyTurnSFX = document.getElementById("pianoString-sfx");
const healSFX = document.getElementById("heal-sfx");
const statUpSFX = document.getElementById("statUp-sfx");
const fearAttackSFX = document.getElementById("fearAttack-sfx");
const fearAttack2SFX = document.getElementById("fearAttack2-sfx");
const friendsSFX = document.getElementById("friends-sfx");

const soundEffects = [cancelSFX, buttonSFX, cancelNextSFX, attackSFX, enemyTurnSFX, healSFX, statUpSFX, fearAttackSFX, fearAttack2SFX];

// =============================================== Disable features
document.addEventListener('contextmenu', (e) => e.preventDefault());

function ctrlShiftKey(e, key) {
    return e.ctrlKey && e.shiftKey && e.key.toUpperCase() === key.toUpperCase();
};

// =============================================== sfx

function playSong(song) {
    song.currentTime = 0;
    song.loop = true;
    song.play();
};

function playBackgroundMusic(sound) {
    sound.currentTime = 0;
    sound.volume = 0.1;
    sound.loop = true;
    sound.play();
};

function playSFX(soundIndex) {
    soundEffects[soundIndex].currentTime = 0;
    soundEffects[soundIndex].play();
};

function playAudioNTimes(src, playCount, delayMs) {
    for (let i = 0; i < playCount; i++) {
        setTimeout(() => {
            const clone = new Audio(src);
            clone.play();
        }, i * delayMs);
    }
};

async function glitchEffectPlay() {
    glitchVideo.classList.replace('inactive', 'activeVideo');
    overlayDiv.classList.add('glitch-effect');
    glitchVideo.play();
    friendsSFX.play();
    await delay(1000);
    friendsSFX.pause();
    glitchVideo.pause();
    overlayDiv.classList.remove('glitch-effect');
    glitchVideo.classList.replace('activeVideo', 'inactive');
};

// =============================================== Other functions

function introClick() {
    if (mediaQueryMobile.matches) return;

    overlayDiv.classList.remove("black-screen");
    startingText.style.display = "none";
    isInIntroMenu = false;
    playSong(thalassophobia);
};

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
};

async function screenShake() {
    screenBox.classList.add("horizontal-shake");
    await delay(500);
    screenBox.classList.remove("horizontal-shake");
};

async function overlayScreenShake(overlayColor, showOverlay) {
    overlayDiv.classList.add(overlayColor, showOverlay);
    await screenShake();
    overlayDiv.classList.remove(overlayColor, showOverlay);
};

async function overlayEffect(overlayColor, showOverlay) {
    overlayDiv.classList.add(overlayColor, showOverlay);
    await delay(500);
    overlayDiv.classList.remove(overlayColor, showOverlay);
};

function returnToFirstMenu() {
    fightOption.style.display = "block";
    fightOption.textContent = "Fight";
    skillOption.style.display = "none";
    skillList.style.display = "none";
    runOption.style.display = "block";
    isInSubMenu1 = false;
    isInSubMenu2 = false;
    dialogue.textContent = "What will you do?";
};

function typeWriter(txt, { speed = 50, displayTime = 2000 } = {}) {

    return new Promise(resolve => {
    let i = 0;
    turnDialogue.textContent = "";
    
    function typeLetter() {
        if (i < txt.length) {
            turnDialogue.style.display = "block";
            turnDialogue.append(txt.charAt(i));
            i++;
            setTimeout(typeLetter, speed);
        } else {
            setTimeout(() => {
                turnDialogue.style.display = "none";
                resolve();
            }, displayTime);
        }
    }
    typeLetter();
    });
};

async function typeWriterBlock(txt1, txt2) {
    overlayDiv.classList.add("black-effect", "fade");
    playerTurn = false;
    await typeWriter(txt1, {displayTime: 3000});
    await typeWriter(txt2, {displayTime: 3000});
    playerTurn = true;
    overlayDiv.classList.remove("black-effect", "fade");
};

// =============================================== Player and enemy variables

const baseHP = 100;
const baseATK = 15;
const baseDEF = 5;

const baseEnemyHP = 250;
const baseEnemyATK = 10;
const baseEnemyDEF = 10;

let maxPlayerHP = baseHP;
let playerHP = maxPlayerHP;
let playerATK = baseATK;
let playerDEF = baseDEF;

let maxEnemyHP = baseEnemyHP;
let enemyHP = maxEnemyHP;
let enemyATK = baseEnemyATK;
let enemyDEF = baseEnemyDEF;

const playerBarText = document.getElementById("playerBarText");
const playerHPBar = document.getElementById("playerHPBar");
const enemyBarText = document.getElementById("enemyBarText");
const enemyHPBar = document.getElementById("enemyHPBar");

let playerTurn = true;
let newSkillsUnlocked = [];
let lastAttackIndex = -1;

// =============================================== Order variables

let orderRequired = {
    0: ["attack", "attack", "heal"],
    1: ["create", "heal", "heal"],
    2: ["attack", "declare", "create"],
    3: ["search", "declare", "heal"],
    4: ["create", "declare", "search"],
    5: ["search", "define", "initialize"]
};
let currentOrder = [];
let correctAttempts = 0;
let currentLevel = 0;
let pendingOrderResult = null;
let resets = 0;

// =============================================== Menu variables

const returnGaze = ["m", "y", "d", "e", "i"];
let keyIndex = 0;
let gazeReturned = false;
let difficultyActivated = false;
let isInSubMenu1 = false;
let isInSubMenu2 = false;
let openedMenu = false;

// =============================================== Menu logic

startingBlackScreen.addEventListener("click", introClick, { once: true });

document.addEventListener("keydown", function(event) {
    // disable features
    if (
        event.key === 'F12' ||
        ctrlShiftKey(event, 'I') ||
        ctrlShiftKey(event, 'J') ||
        ctrlShiftKey(event, 'C') ||
        (event.ctrlKey && event.key.toUpperCase() === 'U')
    ) {
        event.preventDefault();
        event.stopPropagation();
    };

    // menu
    if (event.key.toLowerCase() === "e") {
        if (!playerTurn || isInIntroMenu) {
            return;
        }
        if (openedMenu) {
            playSFX(1);
            openedMenu = false;
            selectionBox.style.display = "none";
        } else {
            playSFX(1);
            openedMenu = true;
            selectionBox.style.display = "block";
        }
    } else if (event.key.toLowerCase() === "f" && isInSubMenu1) {
        playSFX(2);
        fightOption.textContent = "Fight";
        skillOption.style.display = "none";
        runOption.style.display = "block";
        isInSubMenu1 = false;
        isInSubMenu2 = false;
    } else if (event.key.toLowerCase() === "f" && isInSubMenu2) {
        playSFX(2);
        fightOption.style.display = "block";
        skillOption.style.display = "block";
        skillList.style.display = "none";
        isInSubMenu1 = true;
        isInSubMenu2 = false;
    };

    // event
    const key = event.key.toLowerCase();

    if (gazeReturned) return;
    if (correctAttempts < 3) return;
    if (key === returnGaze[keyIndex]) {
        glitchEffectPlay();
        keyIndex++;
        console.log(keyIndex);
        if (keyIndex === returnGaze.length) {
            correctAttempts++;
            const newOutput = updateOutput.cloneNode(true);
            updateOutput.replaceWith(newOutput);
            newOutput.textContent = "Output Value: CLOSE THE GAP.";
            console.log("keys pressed correctly!");
            keyIndex = 0;
            thalassophobia.pause();
            playSong(sheriruth);
            increaseDifficulty(true);
            gazeReturned = true;
        }
    } else {
        keyIndex = 0;
    };
});

selectOptions.addEventListener("click", () => {
    Array.from(selectOptions.children).forEach(option => {
        playSFX(1);
    });
});

runOption.addEventListener("click", async function() {
    runOption.style.color = "gray";
    playSFX(0);
    await delay(500);
    runOption.style.color = "aliceblue";
});

fightOption.addEventListener("click", function() {
    if (fightOption.textContent === "Fight") {
        fightOption.textContent = "Attack";
        runOption.style.display = "none";
        skillOption.style.display = "block";
        isInSubMenu1 = true;
        isInSubMenu2 = false;
    } else if (fightOption.textContent === "Attack") {
        battleTurn();
    }
});

skillOption.addEventListener("click", function() {
    fightOption.style.display = "none";
    skillOption.style.display = "none";
    skillList.style.display = "block";
    isInSubMenu1 = false;
    isInSubMenu2 = true;
});

// =============================================== Order operations

function processPendingOrder() {
    if (!pendingOrderResult) return;
    if (pendingOrderResult === 'correct') {
        correctAttempts++;
        correctOrder();
    } else if (pendingOrderResult === 'incorrect') {
        incorrectOrder();
    }
    pendingOrderResult = null;
};

function setOrderLevel(level) {
    currentLevel = level;
};

function resetToPreviousLevel() {
    if (currentLevel > 0) {
        setOrderLevel(currentLevel - 1);
        correctAttempts--;
        updateOutput.lastChild?.remove();
        lockPreviousSkill();
    } else {
        currentLevel = 0;
    }

    switch (resets) {
        case 1:
            typeWriterBlock("You've caused so much suffering, yet this compensation...", 
                "...is not an equivalent exchange to what you've done.");
            console.log("Reset level: 1!");
            hideVideo();
            break;
        case 2:
            typeWriterBlock("You say you're trying, that you're sorry for what has happened, that you've changed,", 
                "but tell me: who wants to forgive a liar like you?");
            console.log("Reset level: 2!");
            hideVideo();
            break;
        case 3:
            typeWriterBlock("Broken promises after broken promises...", 
                "Someone who values promise, yet she can't even keep one herself. How ironic.");
            console.log("Reset level: 3!");
            hideVideo();
            break;
        case 4:
            typeWriterBlock("You're insecure, so jealous that Deliverer has everything you never had...", 
                "Those feelings... are oddly human coming from someone inhumane like you.");
            console.log("Reset level: 4!");
            hideVideo();
            break;
        case 5:
            typeWriterBlock("You blamed him for becoming someone you hated, yet haven't you noticed?", 
                "He's like that because of you. Anaxa SUFFERED because of YOU. It's all your fault.");
            console.log("Reset level: 5!");
            hideVideo();
            if (!gazeReturned) {
                document.title = "Why can't you change?";
            };
            playBackgroundMusic(virtualAngel);

            break;
        case 6: 
            typeWriterBlock("You tell yourself that you care for him, that you want to help resolve his problems...", 
                "...yet all you've done is make things worse. Mydei's better off forgetting you altogether.");
            console.log("Reset level: 6!");
            hideVideo();
            break;
        case 7: 
            typeWriterBlock('"You shall walk with greed, and die over petty change."', 
                "Alone at death's door, fated to carry this burden all alone... That's what you deserve.");
            console.log("Reset level: 7!");
            hideVideo();
            break;
        case 8:
            typeWriterBlock("Admit it: you're so lonely that you even had to BEG to have her scold you for one last time—", 
                "—Even if that meant hurting yourself. How low are you willing to go just to see her again?");
            console.log("Reset level: 8!");
            hideVideo();
            break;
        case 9:
            typeWriterBlock("Aglaea will never forgive you, nor will she ever care for you again.", 
                "You failed to help her—even left her all alone—she owes you nothing in return.");
            console.log("Reset level: 9!");
            hideVideo();
            break;
        case 10:
            typeWriterBlock("When you blamed Tribbie for not fulfilling that promise she made for you...", 
                "...Have you ever considered that even she couldn't bring herself to forgive what you've done?");
            console.log("Reset level: 10!");
            break;
        case 11:
            typeWriterBlock("Can you believe it? The most accepting, kind, and caring person was even horrified of you.", 
                "You useless thing... Can you even bring yourself to continue living like this?");
            console.log("Reset level: 11!");
            break;
        case 12:
            typeWriterBlock("You're nothing but a liar. And when they see the truth...", 
                "They'll hate you as much as you hate yourself. You should just leave them for good.");
            console.log("Reset level: 12!");
            break;
        case 13:
            console.log("Reset level: 13!");
            console.log("Redirecting...");
            window.location.href = "https://drive.google.com/drive/folders/1LgG9dMXCy-FCBj1dxWgt9kHRmki-mzkI?usp=drive_link";
            hideVideo();
            break;
    }
};

function unlockNewSkill() {
    const nextHidden = document.querySelector('#skills .hidden-skill');
    if (nextHidden) {
        console.log('Unlocking: ', nextHidden.id);
        nextHidden.classList.replace('hidden-skill', 'unlocked-skill');
        newSkillsUnlocked.push(nextHidden.id);
    } else {
        console.log("No more skills to unlock");
    }
};

function lockPreviousSkill() {
    if (newSkillsUnlocked.length > 0) {
        const unlockedSkillId = newSkillsUnlocked[newSkillsUnlocked.length - 1];    
        const unlockedSkill = document.getElementById(unlockedSkillId);
        if (unlockedSkill && !unlockedSkill.classList.contains('hidden-skill')) {
            console.log('Lock skill: ', unlockedSkill.id);
            unlockedSkill.classList.add('hidden-skill');
            newSkillsUnlocked.pop();
        } 
    }
};

function registerAction(action) {
    const activeOrder = orderRequired[currentLevel];
    currentOrder.push(action);
    console.log(currentOrder);
    console.log("correct attempts: ", correctAttempts);

    if (!arraysMatch(activeOrder, currentOrder)) {
        currentOrder = [];
        pendingOrderResult = 'incorrect';
        return;
    }

    if (currentOrder.length === activeOrder.length) {
        if (arraysMatchFull(currentOrder, activeOrder)) {
            pendingOrderResult = 'correct';
        } else {
            pendingOrderResult = 'incorrect';
        }
        currentOrder = [];
    }
};

function arraysMatch(array1, array2) {
    if (!Array.isArray(array1) || !Array.isArray(array2)) return false;
    return array2.every((value, index) => value === array1[index]);
};

function arraysMatchFull(array1, array2) {
    return array1.length === array2.length && array1.every((value, index) => value === array2[index]);
}

function correctOrder() {
    switch (correctAttempts) {
        case 1:
            typeWriterBlock("???: Don't be afraid...", "???: It's not as scary as you think it is.");
            unlockNewSkill();
            currentLevel++;
            console.log("First order correct!");
            updateOutput.append(" H");
            showVideo();
            break;
        case 2:
            typeWriterBlock("???: You have to keep going.", "???: Don't give up. No matter how impossible it seems.");
            unlockNewSkill();
            currentLevel++;
            console.log("Second order correct!");
            updateOutput.append("el");
            showVideo();
            break;
        case 3:
            typeWriterBlock("???: Take a deep breath...", "???: Steady your breath...");
            unlockNewSkill();
            currentLevel++;
            console.log("Third order correct!");
            updateOutput.append("lo");
            showVideo();
            break;
        case 4:
            typeWriterBlock("???: This is getting nowhere fast...", "???: Seems like there's a lot going on...");
            unlockNewSkill();
            currentLevel++;
            console.log("Fourth order correct!");
            updateOutput.append(" Wo");
            showVideo();
            break;
        case 5: 
            typeWriterBlock("???: You need to block out the little things...", "???: And figure out what's important!");
            unlockNewSkill();
            currentLevel++;
            console.log("Fifth order correct!");
            updateOutput.append("rld!");
            showVideo();
            break;
        case 6:
            if (gazeReturned) {
                typeWriterBlock("???: Sometimes, it's okay to be afraid.", "???: I'm right here with you. Take a deep breath and open your eyes.");
            } else return;
            unlockNewSkill();
            currentLevel++;
            console.log("Sixth order correct!");
            showVideo();
            break;
        case 7:
            typeWriterBlock("???: It's hard to focus when it feels like the world's closing in on you.", "???: Don't worry, I'm right by your side. It'll be okay.");
            currentLevel++;
            console.log("Seventh order correct!");
            break;
    }
};

function incorrectOrder() {
    console.log("Order incorrect! Try again.");
    resets++;
    resetToPreviousLevel();
};

function showVideo() {
    const nextPhase = document.querySelector('video.hiddenVideo');
    if (!nextPhase) return;
    
    nextPhase.classList.replace('hiddenVideo', 'seenVideo');
    phasesShown.push(nextPhase);
};

function hideVideo() {
    if (phasesShown.length <= 1) return;

    const lastPhase = phasesShown.pop();
    lastPhase.classList.replace('seenVideo', 'hiddenVideo');
    
};

// =============================================== If easter egg was unlocked

function increaseDifficulty(sheriruthMode) {
    difficultyActivated = true;
    if (sheriruthMode) {
        document.title = "You refused to change.";
        maxEnemyHP = baseEnemyHP + 143;
        enemyHP = maxEnemyHP;
        enemyATK = baseEnemyATK + 6;
        enemyDEF = baseEnemyDEF + 5;
        maxPlayerHP = baseHP + 50;
        playerHP = maxPlayerHP;
        updateHPBar();
        orderRequired = {
            0: ["attack", "attack", "heal"],
            1: ["create", "heal", "heal"],
            2: ["attack", "declare", "create"],
            3: ["search", "create", "declare", "attack", "attack"],
            4: ["define", "attack", "declare", "define", "attack"],
            5: ["declare", "create", "heal", "attack", "heal"],
            6: ["create", "search", "declare", "define", "initialize"]
        };
        currentOrder = [];
    } else {
        maxEnemyHP = baseEnemyHP;
        maxPlayerHP = baseHP;
    }
};

// =============================================== Battle mechanism

function updateHPBar() {
    playerHP = Math.max(0, Math.min(playerHP, maxPlayerHP));
    enemyHP = Math.max(0, Math.min(enemyHP, maxEnemyHP));

    playerHPBar.max = maxPlayerHP;
    playerHPBar.value = playerHP;
    playerBarText.textContent = `${playerHP} / ${maxPlayerHP}`;

    enemyHPBar.max = maxEnemyHP;
    enemyHPBar.value = enemyHP;
    enemyBarText.textContent = `${enemyHP} / ${maxEnemyHP}`;
};

function randomBellCurve() {
    return (Math.random() + Math.random() + Math.random()) / 3;
};

function attackEnemy() {
    registerAction("attack");
    playSFX(3);

    const baseDamage = Math.max(playerATK - enemyDEF, 0);

    const variance = 0.3; 
    const curve = randomBellCurve(); 
    const multiplier = 1 + (curve - 0.5) * 2 * variance;

    const damageDealt = Math.max(Math.floor(baseDamage * multiplier), 0);
    enemyHP -= damageDealt;
    overlayEffect("gray-overlay", "showGray");
    updateHPBar();
    dialogue.textContent = `You dealt ${damageDealt} damage!`;
};

function enemyAttack() {
    playSFX(7);

    const baseDamage = Math.max(enemyATK - playerDEF, 0);

    const variance = 0.3; 
    const curve = randomBellCurve(); 
    const multiplier = 1 + (curve - 0.5) * 2 * variance;

    const damageDealt = Math.max(Math.floor(baseDamage * multiplier), 0);
    playerHP -= damageDealt;
    overlayScreenShake("black-overlay", "showBlack");
    updateHPBar();
    dialogue.innerText = `${enemyDialogue}\nSOMETHING deals ${damageDealt} damage!`;
};

function enemyAttack2() {
    playSFX(8);

    const damageDealt = Math.floor(enemyATK * 1.8 - baseDEF);
    playerHP -= damageDealt;
    overlayScreenShake("black-overlay", "showBlack");
    updateHPBar();
    dialogue.innerText = `${enemyDialogue}\nSOMETHING deals ${damageDealt} damage!`;
};

function enemyAttack3() {
    playSFX(7);

    const damageDealt = Math.floor(enemyATK * 1.5);
    playerHP -= damageDealt;
    overlayScreenShake("black-overlay", "showBlack");
    updateHPBar();
    dialogue.innerText = `${enemyDialogue}\nSOMETHING deals ${damageDealt} damage!`;
};

function enemyRevenge() {
    playSFX(4);
    enemyHP = Math.min(baseEnemyHP, enemyHP + 200);
    playerHP -= 20;
    overlayScreenShake("black-overlay", "showBlack");
    updateHPBar();
    typeWriter("SOMETHING did not succumb.", 75, 2000);
};

const enemyAttacks = [enemyAttack, enemyAttack2, enemyAttack3];

function randomizeEnemyAttack() {
    const endResult = checkBattleEnd();
    if (endResult == 'battle-end' || endResult == 'final' || endResult == 'sheriruth' || endResult == 'stair') return;
    
    let index;

    do {
        index = Math.floor(Math.random() * enemyAttacks.length);
    } while (index === lastAttackIndex && enemyAttacks.length > 1);

    lastAttackIndex = index;
    enemyAttacks[index]();

};

const skills = [
    {
        name: "heal",
        preview: "Heal 30% of HP.",
        args: [0.3],
        action: function healPlayer(percent) {
            playSFX(5);
            registerAction("heal");
            const healAmount = Math.floor(baseHP * percent);
            playerHP = Math.min(playerHP + healAmount, maxPlayerHP);
            dialogue.textContent = `You recovered ${healAmount} HP!`;
            updateHPBar();
        }
    },
    {
        name: "create",
        preview: "Attack 3 times.",
        args: [],
        action: function attackThreeTimes() {
            playAudioNTimes("/audio/Attack.mp3", 3, 350);
            registerAction("create");
            const damageDealt = baseEnemyHP * 0.05 + playerATK * 1 - enemyDEF;
            enemyHP -= damageDealt;
            dialogue.textContent = `You dealt ${damageDealt} damage!`;
            updateHPBar();
        }
    },
    {
        name: "declare",
        preview: "Increases ATK.",
        args: [0.3],
        action: function increaseATK(percent) {
            playSFX(6);
            registerAction("declare");
            const atkIncrease = Math.floor(baseATK * percent);
            playerATK += atkIncrease;
            dialogue.textContent = `Your ATK Increased by ${atkIncrease}!`;
        }
    },
    {
        name: "search",
        preview: "Attack twice and deal one fixed instance of damage.",
        args: [],
        action: function attackTwice() {
            playAudioNTimes("/audio/Attack.mp3", 3, 350);
            registerAction("search");
            const damageDealt = Math.floor(playerATK * 1.3);
            const totalDMG = Math.max(0, (damageDealt + 15) - enemyDEF);
            enemyHP -= totalDMG;
            dialogue.textContent = `You dealt ${damageDealt} + 15 damage!`;
            updateHPBar();
        }
    }, 
    {
        name: "define",
        preview: "Heals HP to full and increases ATK.",
        args: [],
        action: function cherishAbility() {
            playSFX(6);
            registerAction("define");
            playerHP = Math.min(playerHP + 150, maxPlayerHP);
            const atkIncrease = Math.floor(baseATK * 0.4);
            playerATK += atkIncrease;
            dialogue.textContent = `Your HP has been healed and your ATK has been raised!`;
            updateHPBar();
        }
    },
    {
        name: "initialize",
        preview: "Restart anew.",
        args: [],
        action: function initializeSequence() {
            playSFX(4);
            overlayScreenShake("red-overlay", "showRed");
            registerAction("initialize");
            const damageDealt = baseEnemyHP;
            enemyHP -= damageDealt;
            dialogue.textContent = `The missing variables have all been initialized... right?`;
            updateHPBar();
        }
    }
];

let lastSkillIndex = null;
let confirmation = false;

skills.forEach((skill, index) => {
    const skillName = document.getElementById(skill.name);
    skillName.addEventListener("click", () => {

        if (lastSkillIndex === index && confirmation) {
            useSkill(index, ...skill.args);
            lastSkillIndex = null;
            return;
        }

        dialogue.textContent = skill.preview;
        lastSkillIndex = index;
        confirmation = true;
    });
});

// =============================================== Battle turns

async function useSkill(skillIndex, ...args) {
    const skill = skills[skillIndex];
    skill.action(...(args.length ? args : skill.args));
    
    playerTurn = false;
    selectionBox.style.display = "none";
    await delay(1500);
    
    const endResult = checkBattleEnd();
        if (endResult == 'battle-end' || endResult == 'stair' || endResult == 'succumb') return;
        if (endResult == 'final') {
            window.location.href = "https://drive.google.com/drive/folders/1U2O4e3j2JgitvZ19yRe6qH_R7HglgHpY?usp=drive_link";
            return;
        } else if (endResult == 'sheriruth') {
            window.location.href = "https://forms.gle/n1BoMPwqV73TcQX28";
            return;
        };

    dialogue.textContent = `${enemyDialogue}`;
    await delay(1000);
    randomizeEnemyAttack();
    await delay(1500);
    playerTurn = true;
    openedMenu = false;

    const endResultAfter = checkBattleEnd();
        if (endResultAfter === 'battle-end' || endResultAfter == 'stair' || endResultAfter == 'succumb') return;
        if (endResultAfter == 'final') {
            window.location.href = "https://drive.google.com/drive/folders/1U2O4e3j2JgitvZ19yRe6qH_R7HglgHpY?usp=drive_link";
            return;
        } else if (endResultAfter == 'sheriruth') {
            window.location.href = "https://forms.gle/n1BoMPwqV73TcQX28";
            return;
        };

    processPendingOrder();
    returnToFirstMenu();
};

function checkBattleEnd() {
    if (playerHP <= 0) {
        dialogue.textContent = "You drowned in the depths.";
        thalassophobia.pause();
        virtualAngel.pause();
        sheriruth.pause(); 
        overlayDiv.classList.add("black-overlay", "completeDarkness");
        playSong(zero);
        return 'battle-end';
    }
    if (enemyHP <= 0) {

        if (correctAttempts >= 6 && difficultyActivated) {
            dialogue.textContent = "You failed to close the gaps.";
            return 'sheriruth';
        };

        if (correctAttempts === 5) {
            return 'final';
        }; 
    
        if (currentLevel < 5) {
            if (correctAttempts >= 1) {
                enemyRevenge();
                playerTurn = true;
                openedMenu = false;
                returnToFirstMenu();
                return 'succumb';
            }
            playSFX(4);
            playerHP = Math.max(0, playerHP - 143);
            overlayScreenShake("red-overlay", "showRed");
            updateHPBar();
            dialogue.innerText = `You took 143 damage.\nYou drowned in the depths.`;
            thalassophobia.pause();
            virtualAngel.pause();
            sheriruth.pause(); 
            return 'stair';
    }; 
        thalassophobia.pause();
        virtualAngel.pause();
        sheriruth.pause(); 
        overlayDiv.classList.add("black-overlay", "completeDarkness");
        playSong(zero);
        return 'battle-end';
    };
    return 'continue';
};

async function battleTurn() {
        attackEnemy();
        playerTurn = false;
        selectionBox.style.display = "none";
        await delay(1500);
        
        const endResult = checkBattleEnd();
        if (endResult == 'battle-end' || endResult == 'stair' || endResult == 'succumb') return;
        if (endResult == 'final') {
            window.location.href = "https://forms.gle/SsGn8i4pvqZMmw1U9";
            return;
        } else if (endResult == 'sheriruth') {
            window.location.href = "https://www.google.com";
            return;
        };

        dialogue.textContent = `${enemyDialogue}`;
        await delay(1000);
        randomizeEnemyAttack();
        await delay(1500);
        playerTurn = true;
        openedMenu = false;

        const endResultAfter = checkBattleEnd();
        if (endResultAfter === 'battle-end' || endResultAfter == 'stair' || endResultAfter == 'succumb') return;
        if (endResultAfter == 'final') {
            window.location.href = "https://forms.gle/SsGn8i4pvqZMmw1U9";
            return;
        } else if (endResultAfter == 'sheriruth') {
            window.location.href = "https://www.google.com";
            return;
        };

        processPendingOrder();
        returnToFirstMenu();
};

// ============================================== What does it mean to "define?"