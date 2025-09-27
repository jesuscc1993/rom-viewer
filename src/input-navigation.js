let platforms;
let platformNames;
let selectedPlatform;
let selectedPlatformIndex;
let selectedRomIndex = 0;
let selectedRom;
let selectedRomEl;

const Key = {
  Up: 'UP',
  Left: 'LEFT',
  Down: 'DOWN',
  Right: 'RIGHT',
};

/* keyboard navigation */
const bindKeyboardKeys = () => {
  platforms = romSettings.platforms.filter(({ roms }) => !!roms?.length);
  platformNames = platforms.map((platform) => platform.name);

  const hash = window.location.hash.substring(1);
  setSelectedPlatformByIndex(
    platformNames.includes(hash) ? platformNames.indexOf(hash) : 0
  );

  document.addEventListener('keydown', (event) => {
    switch (event.key.toUpperCase()) {
      case 'ARROWUP':
      case 'W':
        onDirectionPress(event, Key.Up);
        break;
      case 'ARROWLEFT':
      case 'A':
        onDirectionPress(event, Key.Left);
        break;
      case 'ARROWDOWN':
      case 'S':
        onDirectionPress(event, Key.Down);
        break;
      case 'ARROWRIGHT':
      case 'D':
        onDirectionPress(event, Key.Right);
        break;
      case 'ENTER':
        if (selectedRomEl) selectedRomEl.click();
        break;
      default:
        console.debug(`${event.key} pressed`);
    }
  });
};

const onDirectionPress = (event, direction) => {
  event.preventDefault();

  if ([Key.Up, Key.Down].includes(direction)) {
    if (direction === Key.Up) selectPrevPlatform();
    if (direction === Key.Down) selectNextPlatform();
  }

  if ([Key.Left, Key.Right].includes(direction)) {
    if (direction === Key.Left) selectPrevRom();
    if (direction === Key.Right) selectNextRom();
  }
};

/* platform selection */
const selectPrevPlatform = (romIndex) => {
  setSelectedPlatformByIndex(
    (selectedPlatformIndex - 1 + platformNames.length) % platformNames.length,
    romIndex
  );
};

const selectNextPlatform = () => {
  setSelectedPlatformByIndex(
    (selectedPlatformIndex + 1) % platformNames.length
  );
};

const setSelectedPlatform = (platform, romIndex = 0) => {
  selectedPlatformIndex = platforms.indexOf(platform);
  selectedPlatform = platform;
  setSelectedRomByIndex(
    romIndex >= 0 ? romIndex : selectedPlatform.roms.length - 1
  );
  setHash(sanitizePlatformName(selectedPlatform.name));
  generatePlatformDetails(selectedPlatform);
};

const setSelectedPlatformByIndex = (
  platformIndex = selectedPlatformIndex,
  romIndex = 0
) => {
  setSelectedPlatform(platforms[platformIndex], romIndex);
};

/* rom selection */
const selectPrevRom = () => {
  let newIndex = selectedRomIndex - 1;

  if (newIndex < 0) {
    selectPrevPlatform(-1);
  } else {
    setSelectedRomByIndex(newIndex);
  }
};

const selectNextRom = () => {
  const newIndex = selectedRomIndex + 1;

  if (newIndex >= selectedPlatform.roms.length) {
    selectNextPlatform();
  } else {
    setSelectedRomByIndex(newIndex);
  }
};

const setSelectedRomByIndex = (romIndex = selectedRomIndex) => {
  selectedRomIndex = romIndex;
  selectedRom = selectedPlatform.roms[romIndex];

  jQuery('.rom.selected').removeClass('selected');
  selectedRomEl = jQuery(`#${sanitizePlatformName(selectedPlatform.name)}`)
    .parents('.platform')
    .find('.rom')
    .eq(selectedRomIndex);
  selectedRomEl.addClass('selected');

  scrollIntoView(selectedRomEl.get(0), { block: 'center' });
};
