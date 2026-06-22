# Guess the Country – Interactive Map Game

A browser-based geography game built with vanilla JavaScript and Leaflet.js.
Players must identify countries based on map markers, with real-time feedback and visual progression.

![Gameplay screenshot](./Screenshot.png)

## Live Demo

👉 [Play the game here](https://jeroen-kuilman.github.io/map-country-game/)

⚠️ Note: the game is not responsive (yet), so the game is not optimized for phones and tablets. In version 2.0 there will be a focus on responsiveness.

## Technical Overview

### Tech Stack

**JavaScript (ES6+)**

- Modular architecture (controller + modules separation)
- Classes with private fields
- Async/await
- Promise.all for parallel data fetching
- Custom state management (centralized state object)
- Event-driven UI updates
- Game loop design & lifecycle handling
- Keyboard navigation
- Autocomplete functionality
- The Fisher-Yates shuffle algorithm
- JSDoc documentation

**Leaflet.js**

- Interactive map rendering
- Custom marker icons
- GeoJSON country borders
- Dynamic popups
- Polylines
- Programmatic camera control

**REST APIs**

- Three parallel external data sources merged and cross-referenced (country info, coordinates, population)
- Filters applied to guard against incomplete data
- GeoJSON border dataset

**CSS3**

- Custom properties
- CSS grid and flexbox
- Rem-based scalable typography
- Clamp() for fluid sizing
- Custom button states

**HTML5**

- Semantic structure
- Accessible form elements
- Native search input

**Vite**

- Build tooling
- Dev server
- Production bundling

**NPM**

- Dependency and package management

**GitHub Pages / gh-pages**

- Automated deployment pipeline

**Git**

- Version control with conventional commit messages

### Gameplay and Features:

To start the game, click ‘Start’ and the game will generate a round in which you must name the country indicated by the marker. The game ends when you have either 10 correct answers or 10 incorrect answers. Type your answer in the field at the top left. There are several ways to confirm your answer and to navigate the list.

- To use autocomplete:
  - Use the Tab key to cycle through the list, and press Enter to confirm.
  - If the answer you want to give is the first option in the list, press Enter and your answer will be entered and confirmed immediately.
  - You can also select an option from the list using the mouse. The answer will be confirmed automatically.
  - Can’t remember? Click the info button.

- Map features:
  - Markers change colour depending on whether the answer is correct or incorrect.
  - Polylines (lines between markers) are added, with dynamic colouring, so that the progress of the game can be visually tracked.
  - Markers (excluding the blue ones) have pop-ups. To open one, click on a marker. Green markers show only the correct answer. Red markers show both the incorrect answer you gave and the correct answer.

- Other features:
  - Feedback in the top right-hand corner based on the game state.
  - The START button changes to a RESET button when the game is active, and changes back to a START button once the game is complete.
  - An error message appears if one or more of the API fetches fail.

### Architecture

The app follows a modular structure based on the MVC-architecture, but implemented in a non-strict way. This allowed me to leverage the useful parts of the pattern, without overdoing it for the sake of having an architectural pattern.

- **appModule** - state & game logic
- **main (controller)** - page initialization, orchestration & game flow
- **UI modules** - map, list, and stats interfaces
- **config**

This separation allowed for better control and scalability.

### Key Challenges

- Setting up a strong planning phase
- Designing a consistent game loop across multiple modules
- Managing shared state without a framework
- Synchronizing UI updates with asynchronous operations
- Creating consistent, guarded behavior in the list UI
- Designing a UX-focused autocomplete feature for the input field

### Models

![Flowchart](./Models/Flowchart%20guess%20country%20game-version1.drawio.png)
Flowchart (initial planning)

![Mental model for refactoring](./Models/Flowchart%20guess%20country%20game-Init-game-round%20summary.drawio.png)
Ad-Hoc model created to clarify the current and the future application flow before refactoring

## Ontwikkel Proces & Reflectie | Nederlandse versie (ENGLISH VERSION BELOW)

### Mijn motivatie, Leerervaringen en Verantwoording:

Dit was voor mij het tweede project dat ik zelfstandig bouwde in HTML/CSS en JavaScript. De aanleiding van dit project was de afronding van mijn JavaScript-cursus. Ik had veel nieuwe theoretische kennis meegekregen, en ik vond dat het tijd was om dat in de praktijk toe te passen. Dit project had een aanzienlijk grotere scope dan mijn vorige project, zeker aangezien mijn intentie al heel vroeg was om gebruik te maken van een externe library en een API, en dus was er iets vereist wat ik in mijn vorige project had nagelaten: een planning. Ik had de core van wat mijn spel moest zijn al in mijn hoofd zitten. De planning bestond uit:

- User stories
- Een flowchart
- Een simpele mockup
- Een splitsing voor welke modules verantwoordelijk moesten zijn voor welke code.

Het grootste compliment dat ik mezelf kan geven is dat het uiteindelijke resultaat grotendeels overeenkomt met de oorspronkelijke planning. Een doel gezet en bereikt.

Het project was niet zonder uitdagingen. Ik had halverwege nog best moeite om mijn code over verschillende modules te volgen. De appModule en main raakten al snel met elkaar verweven, en toen het punt aangebroken was dat de gameplay loop gestroomlijnd moest worden (start spel -> begin -> middel -> einde -> start spel -> etc.), was dat het moment dat ik even het overzicht in de applicatieflow kwijt was.

Een refactor-sessie was dus nodig. Voordat ik daaraan kon beginnen, moest ik echter eerst in kaart brengen hoe mijn code op dat moment werkte, en hoe het in de toekomst moest gaan werken. Om dit voor mezelf te visualiseren, heb ik een model opgesteld, niet volgens een bestaande standaard, maar wel op een manier dat ik weer overzicht kreeg. Dit leidde tot succes, waardoor het na het refactoren eigenlijk redelijk vlot ging. Daarna waren eventuele prestatiedips meer afkomstig vanuit vermoeidheid, dan warrige code.

### Wat zou ik de volgende keer anders doen?

Het is vooral een kwestie is van mijn huidige aanpak aanscherpen door herhaling. Wel wil ik een betere manier van modelleren voordat ik ga refactoren, aangezien ik het nu ad-hoc deed. Voor zo'n project prima, maar in teamverband of bij grotere projecten is dat niet houdbaar.

Aspecten die op de planning staan voor het volgende project:

- Nieuwe vormen van modelleren. Mogelijk de sequence diagram of de call graph. Geen vervanging voor de flowchart.
- React-framework (basis)
- Jest voor testen

### Wat ik nog wil toevoegen in de toekomst / bugfixes:

Een 2.0-versie volgt binnenkort. Hierin ligt de focus op:

- Responsive design

Andere mogelijke features die ik mogelijk nog wil implementeren zijn:

- Local storage implementatie.
- De mogelijkheid om oude einduitslagen terug te kijken op de kaart. Data is aanwezig en moet alleen nog op de juiste plek samengebracht worden.

Bugfixing:

- Op dit moment zijn er geen bugs bekend.

## Development Process & Reflection | English version

### My motivation, Learning experiences, and Justification:

This was the second project I built independently using HTML/CSS and JavaScript. The project was prompted by the completion of my JavaScript course. I had gained a lot of new theoretical knowledge, and I felt it was time to put it into practice. This project had a considerably broader scope than my previous one, particularly as I had intended from the very outset to use an external library and an API; consequently, it required something I’d neglected in my previous project: a plan. I already had the core concept of what my game was to be in my head. The planning consisted of the following:

- User stories
- A flowchart
- A simple mock-up
- A breakdown of which modules were responsible for which code.

The greatest compliment I can pay myself is that the final result largely matches the original plan. A target set and reached.

The project wasn’t without its challenges. Halfway through, I still found it quite difficult to keep track of my code across the different modules. The appModule and main quickly became intertwined, and when the time came to streamline the gameplay loop (start game -> beginning -> middle -> end -> start game -> etc.), that was the moment I briefly lost a clear overview of the application flow.

A refactoring session was therefore needed. Before I could start, however, I first had to work out how my code was working at that moment, and how it needed to work in the future. To visualise this for myself, I drew up a model – not based on any existing standard, but in a way that allowed me to regain an overview. This proved successful, meaning that once the refactoring was complete, things actually went quite smoothly. After that, any dips in performance were down more to fatigue than to messy code.

### What would I do differently next time?

It’s mainly a matter of refining my current approach through repetition. However, I do want to find a better way of modelling before I start refactoring, as I’ve been doing it on an ad hoc basis up to now. That’s fine for a project like this, but it’s not sustainable when working in a team or on larger projects.

Items on the agenda for the next project:

- New modelling approaches. Possibly sequence diagrams or call graphs. Not a replacement for flowcharts.
- React framework (basics)
- Jest for testing

### What I still want to add in the future / bug fixes:

A 2.0 version will be released shortly. This will focus on:

- Responsive design.

Other features I may wish to implement include:

- Local storage implementation.
- The ability to view past final results on the map. The data is available and just needs to be collated in the right place.

Bugfixing:

- No known bugs at this time.
