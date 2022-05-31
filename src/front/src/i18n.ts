import { addMessages, init, getLocaleFromNavigator, locale } from "svelte-i18n";

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
  const jsonFiles = {}

  for (let l of languages) {
    const jsonFile = await fetchJSON(l.file)
    jsonFiles[l.id] = jsonFile
    addMessages(l.id, jsonFile);
  }
  // messy solution to have my selectbox in LocaleSwitcher
  // have an inital value that is within my languages object
  let nav_locale = getLocaleFromNavigator();
  console.log("nav_local", nav_locale)
  if (!languages.map((l) => l.id).includes("local")) {
    let locale_splite = nav_locale.split("-");
    nav_locale = locale_splite.length > 1 ? locale_splite[0] : nav_locale;
  }
  console.log("nav_local", nav_locale)
  const res = await window.electronAPI.setupI18n({languages, locale: nav_locale, translations: jsonFiles})
  console.log("res", res);

  window.electronAPI.onChangeLanguage(async (_, language_id)=>{
    console.log("language_id", language_id)
    locale.set(language_id)
    const res = await window.electronAPI.setupI18n({languages, locale: language_id, translations: jsonFiles})
    console.log("res", res);
  })
  init({
    fallbackLocale: "en",
    initialLocale: nav_locale,
  });
}
