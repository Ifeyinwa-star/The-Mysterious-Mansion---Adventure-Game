// The Mysterious Mansion Adventure Game
// Core game logic and state management

class MansionGame {
    constructor() {
        this.gameState = {
            currentRoom: 'entrance',
            health: 100,
            score: 0,
            inventory: [],
            flags: {
                hasKey: false,
                hasSword: false,
                killedGhost: false,
                solvedPuzzle: false,
                hasMap: false,
                hasLantern: false
            }
        };
        
        this.rooms = this.initializeRooms();
        this.initializeGame();
    }
    
    initializeRooms() {
        return {
            entrance: {
                name: "Entrance Hall",
                description: "You stand in a grand entrance hall with a sweeping staircase. Dust motes dance in the dim light filtering through grimy windows. The air is thick with the scent of decay and old memories.",
                exits: {
                    north: "library",
                    east: "dining",
                    up: "upstairs"
                },
                characters: [],
                objects: [
                    {
                        name: "Old Map",
                        description: "A yellowed map of the mansion's layout",
                        id: "map",
                        canTake: true
                    }
                ]
            },
            
            library: {
                name: "Library",
                description: "Towering bookshelves line the walls, filled with ancient tomes. A fireplace crackles softly, casting dancing shadows. You sense something supernatural lurking among the books.",
                exits: {
                    south: "entrance",
                    east: "study"
                },
                characters: [
                    {
                        name: "Ghostly Librarian",
                        description: "A translucent figure organizing books. It hasn't noticed you yet.",
                        id: "ghost",
                        hostile: true,
                        health: 50
                    }
                ],
                objects: [
                    {
                        name: "Ancient Sword",
                        description: "A gleaming sword with mystical runes",
                        id: "sword",
                        canTake: true,
                        visible: false // Only appears after defeating ghost
                    }
                ]
            },
            
            dining: {
                name: "Dining Room",
                description: "A long mahogany table dominates the room, set for a dinner that was never finished. Cobwebs drape the chandelier like ghostly decorations.",
                exits: {
                    west: "entrance",
                    north: "kitchen"
                },
                characters: [],
                objects: [
                    {
                        name: "Silver Key",
                        description: "An ornate silver key with mysterious engravings",
                        id: "key",
                        canTake: true
                    },
                    {
                        name: "Crystal Goblet",
                        description: "A valuable crystal goblet that gleams despite the dust",
                        id: "goblet",
                        canTake: true
                    }
                ]
            },
            
            kitchen: {
                name: "Kitchen",
                description: "The old kitchen still holds the lingering aroma of meals cooked long ago. Pots and pans hang from hooks, and a large wood stove sits cold and dark.",
                exits: {
                    south: "dining"
                },
                characters: [
                    {
                        name: "Kitchen Sprite",
                        description: "A mischievous sprite that guards the kitchen's secrets",
                        id: "sprite",
                        hostile: false,
                        hasRiddle: true
                    }
                ],
                objects: [
                    {
                        name: "Oil Lantern",
                        description: "A reliable lantern that provides light in dark places",
                        id: "lantern",
                        canTake: true,
                        visible: false // Given by sprite after solving riddle
                    }
                ]
            },
            
            study: {
                name: "Study",
                description: "A cozy study filled with papers and artifacts. A large desk sits in the center, and mysterious symbols are carved into the wooden walls.",
                exits: {
                    west: "library"
                },
                characters: [],
                objects: [
                    {
                        name: "Puzzle Box",
                        description: "An intricate wooden box with moving parts and symbols",
                        id: "puzzlebox",
                        canTake: false,
                        isPuzzle: true
                    }
                ]
            },
            
            upstairs: {
                name: "Upstairs Hallway",
                description: "A long hallway with doors leading to various rooms. Portraits on the walls seem to watch your every move with their painted eyes.",
                exits: {
                    down: "entrance",
                    north: "master_bedroom",
                    south: "attic"
                },
                characters: [],
                objects: []
            },
            
            master_bedroom: {
                name: "Master Bedroom",
                description: "An opulent bedroom with a canopy bed and antique furniture. The air feels heavy with sorrow and loss. A locked chest sits at the foot of the bed.",
                exits: {
                    south: "upstairs"
                },
                characters: [
                    {
                        name: "Mansion Owner's Spirit",
                        description: "The benevolent spirit of the mansion's former owner",
                        id: "owner",
                        hostile: false,
                        isFinal: true
                    }
                ],
                objects: [
                    {
                        name: "Treasure Chest",
                        description: "An ornate chest that requires a key to open",
                        id: "chest",
                        canTake: false,
                        requiresKey: true
                    }
                ]
            },
            
            attic: {
                name: "Attic",
                description: "A dusty attic filled with forgotten memories. Boxes and old furniture create a maze of shadows. Without light, it's too dangerous to explore thoroughly.",
                exits: {
                    north: "upstairs"
                },
                characters: [
                    {
                        name: "Shadow Demon",
                        description: "A terrifying creature made of pure darkness",
                        id: "demon",
                        hostile: true,
                        health: 100,
                        requiresLight: true // Can only be fought with lantern
                    }
                ],
                objects: []
            }
        };
    }
    
    initializeGame() {
        this.updateDisplay();
        this.updateControls();
        this.addMessage("Welcome to the Mysterious Mansion! Explore carefully and be prepared for anything...");
    }
    
    updateDisplay() {
        const currentRoom = this.rooms[this.gameState.currentRoom];
        
        // Update room info
        document.getElementById('room-name').textContent = currentRoom.name;
        document.getElementById('room-description').textContent = currentRoom.description;
        
        // Update status
        document.getElementById('health').textContent = `Health: ${this.gameState.health}`;
        document.getElementById('score').textContent = `Score: ${this.gameState.score}`;
        
        // Update characters
        this.updateCharacters(currentRoom.characters);
        
        // Update objects
        this.updateObjects(currentRoom.objects);
        
        // Update inventory
        this.updateInventory();
    }
    
    updateCharacters(characters) {
        const charactersDiv = document.getElementById('characters');
        charactersDiv.innerHTML = '';
        
        if (characters.length > 0) {
            const title = document.createElement('h3');
            title.textContent = 'Characters';
            charactersDiv.appendChild(title);
            
            characters.forEach(character => {
                const characterDiv = document.createElement('div');
                characterDiv.className = 'character';
                
                const name = document.createElement('h4');
                name.textContent = character.name;
                
                const desc = document.createElement('p');
                desc.textContent = character.description;
                
                characterDiv.appendChild(name);
                characterDiv.appendChild(desc);
                charactersDiv.appendChild(characterDiv);
            });
        }
    }
    
    updateObjects(objects) {
        const objectsDiv = document.getElementById('objects');
        objectsDiv.innerHTML = '';
        
        const visibleObjects = objects.filter(obj => obj.visible !== false);
        
        if (visibleObjects.length > 0) {
            const title = document.createElement('h3');
            title.textContent = 'Objects';
            objectsDiv.appendChild(title);
            
            visibleObjects.forEach(object => {
                const objectDiv = document.createElement('div');
                objectDiv.className = 'object';
                
                const name = document.createElement('h4');
                name.textContent = object.name;
                
                const desc = document.createElement('p');
                desc.textContent = object.description;
                
                objectDiv.appendChild(name);
                objectDiv.appendChild(desc);
                objectsDiv.appendChild(objectDiv);
            });
        }
    }
    
    updateInventory() {
        const inventoryDiv = document.getElementById('inventory-items');
        inventoryDiv.innerHTML = '';
        
        if (this.gameState.inventory.length === 0) {
            const empty = document.createElement('p');
            empty.textContent = 'Your inventory is empty.';
            inventoryDiv.appendChild(empty);
        } else {
            this.gameState.inventory.forEach(item => {
                const itemDiv = document.createElement('div');
                itemDiv.className = 'inventory-item';
                itemDiv.textContent = item.name;
                inventoryDiv.appendChild(itemDiv);
            });
        }
    }
    
    updateControls() {
        this.updateDirectionButtons();
        this.updateActionButtons();
    }
    
    updateDirectionButtons() {
        const buttonsDiv = document.getElementById('direction-buttons');
        buttonsDiv.innerHTML = '';
        
        const currentRoom = this.rooms[this.gameState.currentRoom];
        
        Object.entries(currentRoom.exits).forEach(([direction, roomId]) => {
            const button = document.createElement('button');
            button.textContent = direction.charAt(0).toUpperCase() + direction.slice(1);
            button.onclick = () => this.movePlayer(direction);
            buttonsDiv.appendChild(button);
        });
    }
    
    updateActionButtons() {
        const buttonsDiv = document.getElementById('action-buttons');
        buttonsDiv.innerHTML = '';
        
        const currentRoom = this.rooms[this.gameState.currentRoom];
        
        // Add interaction buttons for characters
        currentRoom.characters.forEach(character => {
            if (character.hostile) {
                const button = document.createElement('button');
                button.textContent = `Fight ${character.name}`;
                button.onclick = () => this.fightCharacter(character.id);
                buttonsDiv.appendChild(button);
            } else {
                const button = document.createElement('button');
                button.textContent = `Talk to ${character.name}`;
                button.onclick = () => this.talkToCharacter(character.id);
                buttonsDiv.appendChild(button);
            }
        });
        
        // Add buttons for taking objects
        currentRoom.objects.forEach(object => {
            if (object.canTake && object.visible !== false) {
                const button = document.createElement('button');
                button.textContent = `Take ${object.name}`;
                button.onclick = () => this.takeObject(object.id);
                buttonsDiv.appendChild(button);
            } else if (object.isPuzzle) {
                const button = document.createElement('button');
                button.textContent = `Solve ${object.name}`;
                button.onclick = () => this.solvePuzzle(object.id);
                buttonsDiv.appendChild(button);
            } else if (object.requiresKey) {
                const button = document.createElement('button');
                button.textContent = `Open ${object.name}`;
                button.onclick = () => this.openChest(object.id);
                if (!this.gameState.flags.hasKey) {
                    button.disabled = true;
                }
                buttonsDiv.appendChild(button);
            }
        });
    }
    
    movePlayer(direction) {
        const currentRoom = this.rooms[this.gameState.currentRoom];
        const newRoomId = currentRoom.exits[direction];
        
        if (newRoomId) {
            this.gameState.currentRoom = newRoomId;
            this.addMessage(`You go ${direction} to the ${this.rooms[newRoomId].name}.`);
            this.updateDisplay();
            this.updateControls();
            
            // Check for special room conditions
            if (newRoomId === 'attic' && !this.gameState.flags.hasLantern) {
                this.addMessage("It's too dark to explore safely without a light source!");
            }
        }
    }
    
    fightCharacter(characterId) {
        const currentRoom = this.rooms[this.gameState.currentRoom];
        const character = currentRoom.characters.find(c => c.id === characterId);
        
        if (!character) return;
        
        if (characterId === 'demon' && !this.gameState.flags.hasLantern) {
            this.addMessage("The shadow demon is too powerful to fight in the darkness! You need a light source.");
            return;
        }
        
        if (characterId === 'ghost' || characterId === 'demon') {
            if (!this.gameState.flags.hasSword) {
                this.addMessage("You need a weapon to fight supernatural creatures!");
                this.gameState.health -= 30;
                this.addMessage("The creature attacks you! You lose 30 health.");
                if (this.gameState.health <= 0) {
                    this.gameOver(false, "You were defeated by a supernatural creature!");
                    return;
                }
                this.updateDisplay();
                return;
            }
        }
        
        // Fight logic
        const playerDamage = Math.floor(Math.random() * 30) + 20;
        const enemyDamage = Math.floor(Math.random() * 20) + 10;
        
        character.health -= playerDamage;
        this.addMessage(`You attack the ${character.name} for ${playerDamage} damage!`);
        
        if (character.health <= 0) {
            this.addMessage(`You defeated the ${character.name}!`);
            this.gameState.score += 100;
            
            // Remove character from room
            const index = currentRoom.characters.indexOf(character);
            currentRoom.characters.splice(index, 1);
            
            // Special rewards
            if (characterId === 'ghost') {
                this.gameState.flags.killedGhost = true;
                const sword = currentRoom.objects.find(obj => obj.id === 'sword');
                if (sword) sword.visible = true;
                this.addMessage("A mystical sword appears where the ghost fell!");
            }
            
            if (characterId === 'demon') {
                this.gameState.score += 200;
                this.addMessage("You've destroyed the shadow demon! The mansion feels lighter.");
            }
        } else {
            this.gameState.health -= enemyDamage;
            this.addMessage(`The ${character.name} attacks you for ${enemyDamage} damage!`);
            
            if (this.gameState.health <= 0) {
                this.gameOver(false, `You were defeated by the ${character.name}!`);
                return;
            }
        }
        
        this.updateDisplay();
        this.updateControls();
    }
    
    talkToCharacter(characterId) {
        const currentRoom = this.rooms[this.gameState.currentRoom];
        const character = currentRoom.characters.find(c => c.id === characterId);
        
        if (!character) return;
        
        if (characterId === 'sprite') {
            if (character.hasRiddle) {
                this.addMessage("Kitchen Sprite: 'Answer my riddle and I'll give you something useful!'");
                this.addMessage("'I provide light in the darkest night, without me shadows cause fright. What am I?'");
                this.addMessage("Type your answer: (Hint: You need this to explore dark places)");
                
                // Simple riddle implementation
                const answer = prompt("Answer the riddle:").toLowerCase();
                if (answer.includes('lantern') || answer.includes('light') || answer.includes('lamp')) {
                    this.addMessage("Kitchen Sprite: 'Correct! Take this lantern, it will serve you well!'");
                    const lantern = currentRoom.objects.find(obj => obj.id === 'lantern');
                    if (lantern) {
                        lantern.visible = true;
                        character.hasRiddle = false;
                    }
                } else {
                    this.addMessage("Kitchen Sprite: 'Wrong answer! Try again later.'");
                }
            } else {
                this.addMessage("Kitchen Sprite: 'You've already solved my riddle!'");
            }
        } else if (characterId === 'owner') {
            if (this.hasAllTreasures()) {
                this.gameOver(true, "The mansion owner's spirit smiles at you. 'You have collected all the treasures and brought peace to this house. You are truly worthy!' You've won the game!");
            } else {
                this.addMessage("Mansion Owner: 'Collect all the treasures and bring peace to my mansion, then return to me.'");
            }
        }
        
        this.updateDisplay();
        this.updateControls();
    }
    
    takeObject(objectId) {
        const currentRoom = this.rooms[this.gameState.currentRoom];
        const object = currentRoom.objects.find(obj => obj.id === objectId);
        
        if (!object || !object.canTake) return;
        
        this.gameState.inventory.push(object);
        this.addMessage(`You take the ${object.name}.`);
        
        // Set flags for important items
        if (objectId === 'key') {
            this.gameState.flags.hasKey = true;
        } else if (objectId === 'sword') {
            this.gameState.flags.hasSword = true;
        } else if (objectId === 'map') {
            this.gameState.flags.hasMap = true;
            this.gameState.score += 25;
        } else if (objectId === 'lantern') {
            this.gameState.flags.hasLantern = true;
        } else if (objectId === 'goblet') {
            this.gameState.score += 50;
        }
        
        // Remove object from room
        const index = currentRoom.objects.indexOf(object);
        currentRoom.objects.splice(index, 1);
        
        this.updateDisplay();
        this.updateControls();
    }
    
    solvePuzzle(objectId) {
        if (objectId === 'puzzlebox') {
            this.addMessage("You examine the puzzle box closely. It has symbols that match those on your map!");
            
            if (this.gameState.flags.hasMap) {
                this.addMessage("Using the map as a guide, you align the symbols correctly!");
                this.addMessage("The puzzle box opens, revealing a secret compartment with ancient gold coins!");
                this.gameState.score += 150;
                this.gameState.flags.solvedPuzzle = true;
                
                // Remove puzzle from room
                const currentRoom = this.rooms[this.gameState.currentRoom];
                const puzzleIndex = currentRoom.objects.findIndex(obj => obj.id === objectId);
                currentRoom.objects.splice(puzzleIndex, 1);
                
                // Add coins to inventory
                this.gameState.inventory.push({
                    name: "Ancient Gold Coins",
                    description: "Valuable ancient coins"
                });
            } else {
                this.addMessage("The symbols are confusing without a reference. You need something to help guide you.");
            }
        }
        
        this.updateDisplay();
        this.updateControls();
    }
    
    openChest(objectId) {
        if (objectId === 'chest' && this.gameState.flags.hasKey) {
            this.addMessage("You use the silver key to open the treasure chest!");
            this.addMessage("Inside you find a magnificent jeweled crown and a bag of precious gems!");
            this.gameState.score += 300;
            
            // Add treasures to inventory
            this.gameState.inventory.push({
                name: "Jeweled Crown",
                description: "A crown fit for royalty"
            });
            this.gameState.inventory.push({
                name: "Precious Gems",
                description: "A collection of valuable gems"
            });
            
            // Remove chest from room
            const currentRoom = this.rooms[this.gameState.currentRoom];
            const chestIndex = currentRoom.objects.findIndex(obj => obj.id === objectId);
            currentRoom.objects.splice(chestIndex, 1);
        }
        
        this.updateDisplay();
        this.updateControls();
    }
    
    hasAllTreasures() {
        const requiredItems = ['map', 'key', 'sword', 'lantern'];
        const hasRequired = requiredItems.every(item => 
            this.gameState.flags[`has${item.charAt(0).toUpperCase() + item.slice(1)}`] || 
            this.gameState.inventory.some(inv => inv.id === item)
        );
        
        const hasValuables = this.gameState.inventory.some(item => 
            item.name === "Jeweled Crown" || item.name === "Crystal Goblet" || item.name === "Ancient Gold Coins"
        );
        
        return hasRequired && hasValuables && this.gameState.flags.solvedPuzzle;
    }
    
    addMessage(message) {
        const messagesDiv = document.getElementById('game-messages');
        const p = document.createElement('p');
        p.textContent = message;
        messagesDiv.appendChild(p);
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
        
        // Keep only last 10 messages
        while (messagesDiv.children.length > 10) {
            messagesDiv.removeChild(messagesDiv.firstChild);
        }
    }
    
    gameOver(won, message) {
        const modal = document.getElementById('game-over-modal');
        const title = document.getElementById('game-over-title');
        const messageP = document.getElementById('game-over-message');
        
        title.textContent = won ? 'Congratulations!' : 'Game Over';
        messageP.textContent = message + ` Final Score: ${this.gameState.score}`;
        
        modal.style.display = 'flex';
    }
}

// Initialize game when page loads
let game;

document.addEventListener('DOMContentLoaded', () => {
    game = new MansionGame();
});

function restartGame() {
    document.getElementById('game-over-modal').style.display = 'none';
    game = new MansionGame();
}