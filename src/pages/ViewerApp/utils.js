export function generateSessionId() {
  const numChars = 4;
  const charSet = "0123456789"; // "0123456789abcdefghijklmnopqrstuvwxyz";
  let str = "";
  for (let i = 0; i < numChars; i++) {
    str += charSet.charAt(Math.floor(Math.random() * charSet.length));
  }
  return str;
}

const attributeMapping = {
  Laces: "Laces",
  "Back-Tab_Mesh-Detail": "Foxing Accent",
  "Back-Tab_Mesh": "Foxing",
  Interior: "Collar Lining",
  Label: "Label",
  Main_Mesh: "Vamp",
  Tongue_Detail: "Tongue Accent",
  Laces_Tabs: "Eyestay",
  Side_Wrap: "Quarter Overlay",
  "Sole-Wrap": "Midsole",
  Sole_Color: "Outsole",
  Side_Mesh: "Quarter",
};

export const prepConfiguration = (colors) => {
  if (!colors || !Object.keys(colors).length) return null;
  return Object.entries(attributeMapping).reduce((output, [attrName, key]) => {
    if (!colors[key]) return output;
    return Object.assign(output, {
      [attrName]: colors[key],
    });
  }, {});
};
