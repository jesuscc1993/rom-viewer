const romSettings = {
  appSettings: {
    coverFontSize: '1.25em',
    coverPadding: '16px',
    coverWidth: '192px',
    maxColumns: 7,
    minCoverHeight: '136px',
    showRomCount: true,
    showShadows: true,
    sidebarWidth: '192px',
    theme: 'windows',
  },
  romPath: '',
  coverPath: '',
  emulatorPath: '',
  platforms: [
    { name: 'PlayStation', type: 'label' },
    {
      name: 'PS1',
      emulatorPath: 'DuckStation/duckstation-qt-x64-ReleaseLTCG.exe',
      roms: [],
    },
    {
      name: 'PS2',
      emulatorPath: 'PCSX2/pcsx2-qtx64.exe',
      roms: [],
    },
    {
      name: 'PS3',
      emulatorPath: 'RPCS3/rpcs3.exe',
      roms: [],
    },
    {
      name: 'PSP',
      emulatorPath: 'PPSSPP/PPSSPPWindows64.exe',
      roms: [],
    },
    { name: 'Nintendo', type: 'label' },
    {
      name: 'SNES',
      emulatorPath: 'bSNES/bsnes_hd.exe',
      roms: [],
    },
    {
      name: 'GBA',
      emulatorPath: 'mGBA/mGBA.exe',
      coverPath: 'GBA/_framed',
      roms: [],
    },
    {
      name: 'NDS',
      emulatorPath: 'DesMuMe/DeSmuME-VS2019-x64-Release.exe',
      roms: [],
    },
    {
      name: '3DS',
      emulatorPath: 'Citra/citra-qt.exe',
      roms: [],
    },
    { type: 'separator' },
    {
      name: 'Wii',
      emulatorPath: 'Dolphin/Dolphin.exe',
      roms: [],
    },
    {
      name: 'Wii U',
      emulatorPath: 'Cemu/Cemu.exe',
      roms: [],
    },
    {
      name: 'Switch',
      emulatorPath: 'yuzu/yuzu-windows-msvc/yuzu.exe',
      roms: [],
    },
    { name: 'Xbox', type: 'label' },
    {
      name: 'Xbox',
      emulatorPath: 'Xemu/xemu.exe',
      roms: [],
    },
    {
      name: 'X360',
      emulatorPath: 'Xenia/xenia_canary.exe',
      roms: [],
    },
  ],
};
