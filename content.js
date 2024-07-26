chrome.storage.sync.get("textList", ({ textList }) => {
  const bodyText = document.body.innerText.toLowerCase();
  let textFound = false;

  textList.forEach(text => {
    if (bodyText.includes(text.toLowerCase())) {
      textFound = true;
      alert(`Found: ${text}`);
    }
  });

  if (textFound) {
    console.log("Specified text found.");
  } else {
    console.log("Specified text not found.");
  }
});
