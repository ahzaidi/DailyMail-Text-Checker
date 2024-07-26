document.addEventListener('DOMContentLoaded', function() {
  document.getElementById("addButton").addEventListener("click", addText);
  document.getElementById("textInput").addEventListener("keydown", function(event) {
      if (event.key === "Enter") {
          addText();
      }
  });
  document.getElementById("importButton").addEventListener("click", importCSV);
  document.getElementById("exportButton").addEventListener("click", exportCSV);
  document.getElementById("csvInput").addEventListener("change", handleFileSelect);
  displayTextList();
});

function addText() {
  const textInput = document.getElementById("textInput").value.trim();
  if (textInput) {
      chrome.storage.sync.get("textList", ({ textList }) => {
          textList = textList || [];
          textList.push(textInput);
          chrome.storage.sync.set({ textList }, () => {
              console.log(`Added text: ${textInput}`);
              displayTextList();
          });
      });
      document.getElementById("textInput").value = '';
  } else {
      console.log('No text entered');
  }
}

function displayTextList() {
  chrome.storage.sync.get("textList", ({ textList }) => {
      const textListElement = document.getElementById("textList");
      textListElement.innerHTML = '';
      if (textList && textList.length > 0) {
          textList.forEach((text, index) => {
              const li = document.createElement("li");
              
              const span = document.createElement("span");
              span.textContent = text;
              li.appendChild(span);
              
              const buttonContainer = document.createElement("div");
              buttonContainer.classList.add("button-container");
              
              const removeButton = document.createElement("button");
              removeButton.textContent = "-";
              removeButton.classList.add("remove-button");
              removeButton.addEventListener("click", () => removeText(index));
              
              const editButton = document.createElement("button");
              editButton.textContent = "Edit";
              editButton.classList.add("edit-button");
              editButton.addEventListener("click", () => editText(index));
              
              buttonContainer.appendChild(removeButton);
              buttonContainer.appendChild(editButton);
              li.appendChild(buttonContainer);
              
              textListElement.appendChild(li);
          });
      } else {
          console.log('No text in storage');
      }
  });
}

function removeText(index) {
  chrome.storage.sync.get("textList", ({ textList }) => {
      textList.splice(index, 1);
      chrome.storage.sync.set({ textList }, () => {
          console.log(`Removed text at index: ${index}`);
          displayTextList();
      });
  });
}

function editText(index) {
  const newText = prompt("Edit the text:").trim();
  if (newText) {
      chrome.storage.sync.get("textList", ({ textList }) => {
          textList[index] = newText;
          chrome.storage.sync.set({ textList }, () => {
              console.log(`Edited text at index: ${index}`);
              displayTextList();
          });
      });
  }
}

function handleFileSelect(event) {
  const file = event.target.files[0];
  if (file) {
      const reader = new FileReader();
      reader.onload = function(e) {
          const contents = e.target.result;
          const rows = contents.split('\n').map(row => row.trim()).filter(row => row.length > 0);
          chrome.storage.sync.get("textList", ({ textList }) => {
              textList = textList || [];
              textList.push(...rows);
              chrome.storage.sync.set({ textList }, () => {
                  console.log(`Imported CSV with ${rows.length} rows.`);
                  displayTextList();
              });
          });
      };
      reader.readAsText(file);
  }
}

function importCSV() {
  document.getElementById("csvInput").click();
}

function exportCSV() {
  chrome.storage.sync.get("textList", ({ textList }) => {
      const csvContent = textList.map(e => e).join("\n"); // Ensure no quotes are added
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", "rules.csv");
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  });
}
