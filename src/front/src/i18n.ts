import { addMessages, init, getLocaleFromNavigator } from "svelte-i18n";

function fetchJSON(f: string): Promise<{}> {
  return new Promise(async (resolve, reject) => {
    let content = await fetch(f);
    let json = await content.json();
    resolve(json);
  });
}

export const languages: Array<{id: string, file: string, label: string}> = [
  {
    id: "en",
    file: "i18n/en.json",
    label: "English",
  },
  {
    id: "fr",
    file: "i18n/fr.json",
    label: "Français",
  },
];

export async function init_i18n() {
  for (let l of languages) {
    addMessages(l.id, await fetchJSON(l.file));
  }

  // messy solution to have my selectbox in LocaleSwitcher
  // have an inital value that is within my languages object
  let locale = getLocaleFromNavigator();
  if (!languages.map((l) => l.id).includes("local")) {
    let locale_splite = locale.split("-");
    locale = locale_splite.length > 1 ? locale_splite[0] : locale;
  }
  init({
    fallbackLocale: "en",
    initialLocale: locale,
  });
}
