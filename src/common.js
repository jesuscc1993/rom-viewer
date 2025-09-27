let baseUrl;

let leftSidebarEl;
let romsContainerEl;
let rightSidebarEl;

const arrayBufferToBase64 = (buffer) => {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return `data:image/jpg;base64,${window.btoa(binary)}`;
};

const generateRoms = async (platform) => {
  const romsGridEl = jQuery(`<div class="roms-grid"></div>`);

  platform.roms.forEach(async (rom) => {
    const romFilename = typeof rom === 'string' ? rom : rom.name || rom.path;
    const romName = sanitizeRomName(romFilename).replace(/\.[^.]*$/, '');
    const coverPath = `${buildPath(
      romSettings.coverPath,
      rom.coverPath || platform.coverPath || platform.romPath,
      romName
    )}.jpg`;

    const imageSrc = await getRomCover(coverPath);
    const coverEl = jQuery(
      imageSrc
        ? `<img class="rom-cover" alt="${romName}" src="${imageSrc}"></img>`
        : `<div class="rom-cover rom-title" alt="${romName}">${romName}</div>`
    );

    const romEl = jQuery(`<div class="rom" title="${romName}"></div>`);
    romEl.append(coverEl);

    romEl.click((e) => {
      e.preventDefault();

      onRomClick(romSettings, platform, rom);
    });

    romsGridEl.append(romEl);
  });

  return romsGridEl;
};

const generateRomList = async (platform) => {
  const ulEl = jQuery(`<ul class="no-style link-list roms-list"></ul>`);

  const platformEl = jQuery(`
    <li class="header">
      <div>
        <strong>${platform.name}</strong>
        ${
          appSettings.showRomCount
            ? `<span class="tertiary">(${platform.roms.length})<span>`
            : undefined
        }
      </div>
    </li>
  `);
  ulEl.append(platformEl);

  platform.roms.forEach(async (rom) => {
    const romFilename = typeof rom === 'string' ? rom : rom.name || rom.path;
    const romName = sanitizeRomName(romFilename).replace(/\.[^.]*$/, '');

    const romEl = jQuery(`
      <li class="rom" title="${romFilename}">
        <a href>
          ${romName}
        </a>
      </li>
    `);
    romEl.click((e) => {
      e.preventDefault();

      onRomClick(romSettings, platform, rom);
    });

    ulEl.append(romEl);
  });

  return ulEl;
};

const generatePlatformLink = (ulEl, platform) => {
  const { name, roms, type } = platform;

  if (type === 'separator') {
    ulEl.append(`<hr />`);
    return;
  }

  if (type === 'label') {
    ulEl.append(`
      <li class="header">
        <div>
          <strong>${name}</strong>
        </div>
      </li>
    `);
    return;
  }

  if (!roms?.length) return;

  const anchorEl = jQuery(`
    <a href="${baseUrl}#${sanitizePlatformName(name)}">
      ${name}
    </a>
  `);
  if (appSettings.showRomCount) {
    anchorEl.append(`
      <span class="tertiary">
        (${roms.length})
      <span>
    `);
  }
  anchorEl.click(() => {
    setSelectedPlatform(platform);
  });

  const liEl = jQuery(`<li class="anchor"></li>`);
  liEl.append(anchorEl);
  ulEl.append(liEl);
  leftSidebarEl.append(ulEl);
};

const generatePlatforms = async () => {
  const ulEl = jQuery(`<ul class="no-style link-list platforms-list"></ul>`);

  romSettings.platforms.forEach(async (platform) => {
    generatePlatformLink(ulEl, platform);

    platform.coverPath = platform.coverPath || platform.name;
    platform.romPath = platform.romPath || platform.name;

    if (!platform.roms?.length) return;

    const platformNameEl = jQuery(`
      <h3 id="${sanitizePlatformName(platform.name)}">
        ${platform.label || platform.name}
      </h3>
    `);

    if (appSettings.showRomCount) {
      platformNameEl.append(`
        <span class="tertiary">
          (${platform.roms.length})
        <span>
      `);
    }

    const platformEl = jQuery(`<div class="platform ${platform.name}"></div>`);
    platformEl.append(platformNameEl);
    platformEl.append(await generateRoms(platform));
    romsContainerEl.append(platformEl);
  });

  leftSidebarEl.append(ulEl);
};

const generatePlatformDetails = async (platform) => {
  rightSidebarEl.empty();

  const romList = await generateRomList(platform);
  rightSidebarEl.append(romList);

  rightSidebarEl.append(`
    <ul class="no-style link-list">
      <li class="header">
        <div>
          <strong>Default emulator</strong>
        </div>
      </li>
      <li class="emulator-link" title="/${platform.emulatorPath}">
        <a href>
          ${sanitizeEmulatorName(
            getLastPathSection(platform.emulatorPath, true)
          )}
        </a>
      </li>
    </ul>
  `);
  rightSidebarEl.find('.emulator-link').click((e) => {
    e.preventDefault();

    onEmulatorClick(romSettings, platform);
  });

  rightSidebarEl.append(`
    <ul class="no-style link-list">
      <li class="header">
        <div>
          <strong>Default cover path</strong>
        </div>
      </li>
      <li class="no-hover">
        <div>
          /${platform.coverPath || platform.romPath}
        </div>
      </li>
    </ul>
  `);
};

const getBaseUrl = () => {
  return location.protocol + '//' + location.host + location.pathname;
};

const getLastPathSection = (path, removeExtension) => {
  let lastSection = path.split(/[\\|/]/).pop();
  if (removeExtension) lastSection = lastSection.replace(/\.[^/.]+$/, '');
  return lastSection;
};

const getEmulatorPath = (romSettings, platform) => {
  return buildPath(romSettings.emulatorPath, platform.emulatorPath);
};

const getEmulatorKey = (platform, rom) => {
  return rom.emulatorKey || platform.emulatorKey;
};

const getRomPath = (romSettings, platform, rom) => {
  return buildPath(
    romSettings?.romPath,
    platform?.romPath,
    typeof rom === 'string' ? rom : rom.path
  );
};

const processSettings = (settings) => {
  window.appSettings = settings.appSettings || {};

  appSettings.coverFontSize = appSettings.coverFontSize || '1.25em';
  appSettings.coverPadding = appSettings.coverPadding || '16px';
  appSettings.coverWidth = appSettings.coverWidth || '192px';
  appSettings.maxColumns = appSettings.maxColumns || 7;
  appSettings.minCoverHeight = appSettings.minCoverHeight || '136px';
  appSettings.sidebarWidth = appSettings.sidebarWidth || '192px';

  appSettings.showRomCount = appSettings.showRomCount != false;
  appSettings.showShadows = appSettings.showShadows != false;
  appSettings.theme = appSettings.theme || 'windows';

  if (appSettings.showShadows) {
    jQuery('body').addClass('with-shadows');
  }
  jQuery('body').addClass(appSettings.theme.toLowerCase());

  jQuery(':root').css({
    '--cover-font-size': appSettings.coverFontSize,
    '--cover-padding': appSettings.coverPadding,
    '--cover-width': appSettings.coverWidth,
    '--max-columns': appSettings.maxColumns,
    '--min-cover-height': appSettings.minCoverHeight,
    '--sidebar-width': appSettings.sidebarWidth,
  });
};

const replaceExtension = (filename, newExtension) => {
  return filename.includes('.')
    ? filename.replace(/\.[^.]+$/, `.${newExtension}`)
    : `${filename}.${newExtension}`;
};

const sanitizePlatformName = (name) => {
  return name.replace(/\s+/g, '');
};

const sanitizeEmulatorName = (name) => {
  return name.replace(/[\s-_]+.*/g, '');
};

const sanitizeRomName = (name) => {
  return name.replace(/\s*(\(.*?\)|\[.*?\]|{.*?}|.*\/|.*\\)\s*/g, '');
};

const buildPath = (...pathParts) => {
  return pathParts.filter((path) => !!path).join('/');
};

const setHash = (hash) => {
  history.pushState(
    null,
    null,
    hash ? `#${hash}` : window.location.pathname + window.location.search
  );
};

const scrollIntoView = (targetElement, options = {}) => {
  if (targetElement) {
    targetElement.scrollIntoView({ behavior: 'smooth', ...options });
  }
};

const initializeCommons = () => {
  baseUrl = getBaseUrl();

  leftSidebarEl = jQuery('#leftSidebar');
  romsContainerEl = jQuery('#romsContainer');
  rightSidebarEl = jQuery('#rightSidebar');
};

initializeCommons();
