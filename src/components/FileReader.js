// src/components/FileReader.js
import { useState, useEffect } from "react";


// ✅ Capitalized function name tells React this is a component
export default function FileFromDisk() 
{
  const [fileContent, setFileContent] = useState("");

  const handleFileChange = (event) => {
            const file = event.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (e) => setFileContent(e.target.result);
            reader.readAsText(file);
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <pre>{fileContent}</pre>
    </div>
  );
}

/// Read a Project File (already exist inside your project PUBLIC directory
export function FileFromPublicFolder(fileName) 
{
  const [data, setData] = useState("");

  useEffect(() => {
    // Looks for 'data.txt' inside the public directory
    fetch("/" + fileName)
      .then((response) => response.text())
      .then((text) => setData(text))
      .catch((err) => console.error("Error reading file:", err));
  }, [fileName]);

  return (
    <div>
      <h3>Bundled File Content:</h3>
      <p>{data}</p>
    </div>
  );
}