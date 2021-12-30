const root = document.documentElement;
// hello?
// # for id and . for class
//document.querySelector gets the data from the html file with the tag(id or class)
const fretboard = document.querySelector('.fretboard');
const instrumentSelector = document.querySelector('#instrument-selector');
const accidentalSelector = document.querySelector('.accidental-selector');
const numFretsSelector = document.querySelector('#number-of-frets');
const showAll = document.querySelector('#show-all-notes');
const showMultipleSelector = document.querySelector('#show-multiple-notes');
const noteNameSection = document.querySelector('.note-name-section');

let numFrets = 21;

let allNotes;
let showMultipleNotes = false;


const singleFretsList = [3, 5, 7, 9, 15, 17, 19, 21];
const doubleFretList = [12, 24];

const notesFlat = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"];
const notesSharp = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

let accidentals = 'flats';
//const guitarTuning = [4, 11, 7, 2, 9, 4];

const instrumentTuningPresets = {
    'Guitar (6 String)': [4, 9, 2, 7, 11, 4],
    'Guitar (7 String)': [11, 4, 9, 2, 7, 11, 4],
    'Bass (4 String)': [4, 9, 2, 7],
    'Bass (5 string)': [11, 4, 9, 2, 7]
}

let selectedInstrument = 'Guitar (6 String)';

let numStrings = instrumentTuningPresets[selectedInstrument].length;

const app = {
    init() {
        this.setupFretboard();
        this.setupEventListener();
        this.setupinstrumentSelector();
        this.setupNoteName();
    },
    setupFretboard() {
        fretboard.innerHTML = '';
        root.style.setProperty('--number-of-strings', numStrings);
        // add strings to fretboard
        //  we are writing html to make the strings since it is dynamic
        for (let i = 0; i < numStrings; i++){
            let string = tools.createElement('div');
            string.classList.add('string');
            fretboard.appendChild(string);

            // add frets
            for (let fret = 0; fret <= numFrets; fret++){
                let noteFret = tools.createElement('div');
                noteFret.classList.add('note-fret');
                string.appendChild(noteFret);

                let noteName = this.generateNoteNames(fret + instrumentTuningPresets[selectedInstrument][i]);
                noteFret.setAttribute('data-note', noteName);

                if(i === 0 && singleFretsList.indexOf(fret) !== -1){
                    noteFret.classList.add('single-fretmark');
                }

                if(i === 0 && doubleFretList.indexOf(fret) !== -1){
                    let doubleMark = tools.createElement('div');
                    doubleMark.classList.add('double-fretmark');
                    noteFret.appendChild(doubleMark);
                }

            }
        }
        allNotes = document.querySelectorAll('.note-fret');
    }, 
    // generates the names of notes at each fret
    // has option to show flat or sharp
    generateNoteNames(noteIndex) {
        noteIndex = noteIndex % 12;
        let noteName;
        if (accidentals === 'flats'){
            noteName = notesFlat[noteIndex];
        } else if(accidentals === 'sharps') {
            noteName = notesSharp[noteIndex];
        }
        return noteName;
    },
    // populates the dropdown menu that allows you to select the instrument
    setupinstrumentSelector() {
        for(instrument in instrumentTuningPresets){
            let instrumentOption = tools.createElement('option', instrument);
            instrumentSelector.appendChild(instrumentOption);
        }
    },
    // populates the bar at the bottom to show all notes and changes to flat or sharp
    setupNoteName() {
        noteNameSection.innerHTML = '';
        let noteNames
        if(accidentals === 'flats') {
            noteNames = notesFlat;
        } else {
            noteNames = notesSharp;
        }
        noteNames.forEach((noteName) => {
            let noteNameElement = tools.createElement('span', noteName);
            noteNameSection.appendChild(noteNameElement);
        });
    },

    showNoteDot(event) {
        if(event.target.classList.contains('note-fret')){
            if(showMultipleNotes === true){
                app.togglemultipleNotes(event.target.dataset.note, 1);
            } else {
                event.target.style.setProperty('--noteOpacity', 1);
            }
        }
    },

    hideNoteDot(event) {
        if(showMultipleNotes === true){
            app.togglemultipleNotes(event.target.dataset.note, 0);
        }else {
            event.target.style.setProperty('--noteOpacity', 0);
        }

    },

    // all these are events that the app us listening for
    setupEventListener(){
        // shows notes when you hover over it
        fretboard.addEventListener('mouseover', (this.showNoteDot));
        // removes when you unhover over it
        fretboard.addEventListener('mouseout', (this.hideNoteDot));
        // completely re does the whole fretboard layout when you change instrument
        instrumentSelector.addEventListener('change', (event) => {
            selectedInstrument = event.target.value;
            numStrings = instrumentTuningPresets[selectedInstrument].length;
            this.setupFretboard();
        });

        accidentalSelector.addEventListener('click', (event) => {
            if(event.target.classList.contains('acc-select')) {
                accidentals = event.target.value;
                this.setupFretboard();
                this.setupNoteName();
            } else {
                return;
            }
        });

        numFretsSelector.addEventListener('change', () => {
            numFrets = numFretsSelector.value;
            this.setupFretboard();
        });

        showAll.addEventListener('change', () => {
            if(showAll.checked){
                root.style.setProperty('--noteOpacity', 1);
                // turns off the event listener
                fretboard.removeEventListener('mouseover', (this.showNoteDot));
                fretboard.removeEventListener('mouseout', (this.hideNoteDot));
                this.setupFretboard();
            } else {
                root.style.setProperty('--noteOpacity', 0);
                // reenables the event listeners
                fretboard.addEventListener('mouseover', (this.showNoteDot));
                fretboard.addEventListener('mouseout', (this.hideNoteDot));
                this.setupFretboard();
            }
        });

        showMultipleSelector.addEventListener('change', () => {
            showMultipleNotes = !showMultipleNotes;
        });

        noteNameSection.addEventListener('mouseover', (event) => {
            let noteToShow = event.target.innerText;
            app.togglemultipleNotes(noteToShow, 1)
        });

        noteNameSection.addEventListener('mouseout', (event) => {
            // removes it as long as the select all is not checked
            if(!showMultipleSelector.checked){
                let noteToShow = event.target.innerText;
                app.togglemultipleNotes(noteToShow, 0)
            } else {
                return;
            }
            
        })
    },

    togglemultipleNotes(noteName, opacity) {
        for(let i = 0 ; i < allNotes.length; i++){
            if(allNotes[i].dataset.note === noteName) {
                allNotes[i].style.setProperty('--noteOpacity', opacity);
            }
        }
    }
}

const tools = {
    createElement(element, content) {
        element = document.createElement(element);
        if(arguments.length > 1){
            element.innerHTML = content;
        }
        return element;
    }
}

app.init();