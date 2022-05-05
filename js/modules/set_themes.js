const darkMode = {
  id: 'dark',
  borderRoundClr: 'hsl(0, 0%, 24%)',
  borderRoundHover: 'hsl(235, 21%, 11%)',
  PrimarytextClr: '#fafafa',
  secondaryTextClr: '#4d5066',
  secondaryTextHover: 'hsl(0, 0%, 98%',
  borderBottom: '#4d5066',
  brightBlue: 'hsl(220, 98%, 61%)',
  bodyBg: '#161722',
  todoBg: '#25273c',
};

const lightMode = {
  id: 'light',
  borderRoundClr: 'hsl(0, 0%, 80%)',
  borderRoundHover: 'hsl(235, 21%, 11%)',
  PrimarytextClr: 'hsl(236, 9%, 61%)',
  secondaryTextClr: 'hsl(236, 9%, 61%)',
  secondaryTextHover: 'hsl(236, 9%, 1%)',
  borderBottom: 'hsl(233, 11%, 84%)',
  brightBlue: 'hsl(220, 98%, 61%)',
  bodyBg: '#e4e5f1',
  todoBg: '#fafafa',
};

// This function will change the values of the custom properties with the theme object passed.
export const applyTheme = theme => {
  document.querySelector(':root').style.setProperty('--borderRoundClr', theme.borderRoundClr);
  document.querySelector(':root').style.setProperty('--borderRoundHover', theme.borderRoundHover);
  document.querySelector(':root').style.setProperty('--primarytextClr', theme.PrimarytextClr);
  document.querySelector(':root').style.setProperty('--secondaryTextClr', theme.secondaryTextClr);
  document.querySelector(':root').style.setProperty('--secondaryTextHover', theme.secondaryTextHover);
  document.querySelector(':root').style.setProperty('--borderBottom', theme.borderBottom);
  document.querySelector(':root').style.setProperty('--brightBlue', theme.brightBlue);
  document.querySelector(':root').style.setProperty('--bodyBg', theme.bodyBg);
  document.querySelector(':root').style.setProperty('--todoBg', theme.todoBg);

  document.body.dataset.theme = theme.id;

  document.querySelectorAll('[data-icon]').forEach($icon => $icon.classList.toggle('show', !($icon.dataset.icon === theme.id)));
};

// this function will set the active theme to the localStorage.
export const setTheme = () => {
  const theme = document.querySelector('[data-theme]').dataset.theme;
  localStorage.setItem('theme', theme);
  applyTheme(theme);
};

// this function will return the theme from localStorage if that is exist.
export const getTheme = () => {
  let theme = localStorage.getItem('theme');
  theme === 'dark' ? (theme = darkMode) : (theme = lightMode);
  applyTheme(theme);
};
