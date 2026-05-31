# Pathfinder 1e Roll20 Sheet Overhaul - Main Page

We will completely redesign the character sheet to match the aesthetic, density, and functionality of the Pathfinder First Edition Roll20 character sheet. The first milestone is to build the "Main Page" (Core section), focusing on layout and auto-calculations.

## Scope for First Iteration

The Roll20 PF1e sheet is extremely detailed. Attempting to add every single field at once can make the file enormous. We are starting with the most critical elements of the main page: **Detailed Header, Ability Scores (with auto-calculating modifiers), Defenses (HP, AC, Saves), and Core Offense (Initiative, BAB, CMB, CMD)**.

## Proposed Changes

### Frontend Assets

#### `index.html`
- **Container adjustments:** Change the layout to a wider format or scale it to fit the dense column-based layout typical of Roll20.
- **Detailed Header:** Add inputs for Alignment, Player, Deity, Homeland, Race, Size, Gender, Age, Height, Weight, Hair, Eyes.
- **Ability Scores Block:** For each ability (STR, DEX, CON, INT, WIS, CHA), add inputs for Base Score, Temp Score, and read-only displays for the calculated Modifier and Temp Modifier. Add styling for "Rollable" buttons on the ability names.
- **Defense Block:** 
  - Hit Points (Total, Current, Nonlethal).
  - Armor Class grid (Total, Touch, Flat-Footed) broken down by (Armor + Shield + Dex + Size + Natural + Deflection + Misc).
  - Saving Throws grid (Fortitude, Reflex, Will) broken down by (Total = Base + Ability + Magic + Misc + Temp).
- **Offense Block:**
  - Initiative (Total = Dex + Misc).
  - Base Attack Bonus (BAB).
  - Combat Maneuver Bonus (CMB) and Defense (CMD).

#### `styles.css`
- Introduce CSS Grid layouts for complex, tabular structures like AC and Saves.
- Use Roll20-like aesthetics: dark headers with white text, compact input fields, and distinct "rollable button" styling (e.g., slight hover effect, dice icon or bold text).
- Remove the old minimalist layout in favor of a high-density, functional layout.

#### `main.js`
- Implement robust auto-calculation logic:
  - `calculateModifier(score)`: `Math.floor((score - 10) / 2)`
  - Event listeners on all ability score inputs to automatically update the corresponding modifiers.
  - Cascade updates: When DEX changes, automatically update the DEX modifier, Initiative, Reflex save, and AC.

## Verification Plan

### Manual Verification
- Ensure the layout looks similar to the Roll20 PF1e sheet (compact, organized into clear distinct panels).
- Change an ability score (e.g., DEX to 16) and verify that the modifier immediately updates to +3, and that AC, Initiative, and Reflex saves update accordingly.

---

# Classes Section & Multi-class Aggregation

To support Pathfinder's multi-classing system and automate the base stats, we will add a dedicated "Classes" section that automatically calculates and populates your Base Attack Bonus (BAB) and Base Saving Throws (Fortitude, Reflex, Will).

## Proposed Changes

### Frontend Assets

#### `index.html`
- **Classes Section**: Add a new `pf-section` above the `pf-body` columns.
- **Table Layout**: Create a repeating list layout with columns for: `Class Name`, `Level`, `BAB`, `Fortitude`, `Reflex`, `Will`, and an `Add / Remove` button.
- **Read-Only Lock**: Change the existing `bab`, `fort-base`, `ref-base`, and `will-base` input fields to `readonly`, as their values will now be strictly controlled by the classes section.

#### `styles.css`
- Add grid styles for the new `.classes-grid` to ensure inputs align neatly in columns.
- Add styles for the "Add Class" and "Remove" (trash can or `X`) buttons to fit the Roll20 aesthetic.

#### `main.js`
- **State Management**: Introduce a lightweight state array (e.g., `let classesData = []`) to track the list of classes.
- **Dynamic Rendering**: Add functions `renderClasses()`, `addClass()`, and `removeClass(index)`.
- **Aggregation Logic**: Add an `aggregateClassStats()` function that fires whenever class inputs change. This function will:
  - Format the class names and levels into the "Character Class & Level" header field.
  - Sum `BAB` across all classes and inject it into the `bab` input.
  - Sum `Fort`, `Ref`, and `Will` base saves and inject them into their respective base inputs.
- **Integration**: Tie the aggregation function into the existing `recalculateAll()` loop so that as soon as a class updates BAB, CMB/CMD are immediately recalculated.

---

# Automated Class Progression

We will upgrade the Classes section so that instead of manually looking up Base Attack Bonus (BAB) and Saving Throws, the user can select their class from a dropdown, and the application will calculate the exact math based on the official Pathfinder 1e progression tables.

## Scope
We will implement the 11 Core Classes and 8 Base Classes, plus a "Custom" option.

## Proposed Changes

### Pathfinder Math Integration
In Pathfinder 1e, class progressions follow exact mathematical formulas. We will implement these formulas in `main.js`:
- **BAB Full:** `Math.floor(Level)`
- **BAB 3/4 (Medium):** `Math.floor(Level * 0.75)`
- **BAB 1/2 (Slow):** `Math.floor(Level * 0.5)`
- **Good Save:** `Math.floor(Level / 2) + 2`
- **Poor Save:** `Math.floor(Level / 3)`

### Frontend Assets

#### `index.html` & `main.js`
- **Class Data Dictionary:** We will add a constant object to `main.js` that maps class names to their specific progressions (e.g., `Fighter: { bab: 'full', fort: 'good', ref: 'poor', will: 'poor' }`).
- **Dropdown Selection:** The "Class Name" text input will be converted into an HTML `<select>` dropdown populated by our Class Data dictionary.
- **Auto-Calculation Logic:** When a user selects a class or changes their Level:
  - If a standard class is selected, the application will use the formulas to calculate the exact BAB, Fort, Ref, and Will values for that level and lock the input fields to prevent accidental edits.
  - If "Custom" is selected, the input fields will unlock so the user can type in their own numbers.

---

# Export and Persistence (Save, Load, PDF)

To allow you to save your character between sessions and export the sheet for printing or sharing, we will add three new features: **Save to JSON**, **Load JSON**, and **Print to PDF**.

## Proposed Changes

### Frontend Assets

#### `index.html`
- **Action Toolbar**: Add a small toolbar at the top of the application with three buttons:
  - `💾 Save Sheet` (Downloads a JSON file)
  - `📂 Load Sheet` (Opens a file browser to upload a JSON file)
  - `🖨️ Export to PDF` (Triggers the print dialog)
- Add a hidden `<input type="file" accept=".json">` to handle the file upload.

#### `styles.css`
- **Print Styles**: Add `@media print` rules to ensure the PDF looks clean:
  - Hide all buttons (Save, Load, Print, Add Class, Delete Class).
  - Remove dark backgrounds or invert colors so it prints nicely on standard paper.
  - Adjust margins and borders so the grid layout fits on a standard A4/Letter page.

#### `main.js`
- **`saveCharacter()`**: 
  - Gathers all data from `classData` and every `input`/`select` field in the DOM.
  - Packages it into a JSON string.
  - Creates a temporary anchor tag to download `character.json`.
- **`loadCharacterData(event)`**:
  - Reads the uploaded `.json` file.
  - Parses the JSON.
  - Re-populates `classData` and updates every input field in the DOM.
  - Calls `recalculateAll()` to ensure all math is correct.
- **`printToPDF()`**:
  - Simply calls `window.print()`.
