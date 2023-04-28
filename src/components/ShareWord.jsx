import { useState } from 'react';

function App() {
  const [secretMessage, setSecretMessage] = useState('');
  const [uniqueId, setUniqueId] = useState('');
  const [shareableLink, setShareableLink] = useState('');

  const generateUniqueId = () => {
    const randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const idLength = 10;
    let id = '';
    for (let i = 0; i < idLength; i++) {
      id += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
    }
    return id;
  };

  const handleGenerateLink = () => {
    const id = generateUniqueId();
    setUniqueId(id);
    setShareableLink(`${window.location.href}?id=${id}`);

    fetch('/api/words', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, message: secretMessage }),
    })
      .then((response) => response.json())
      .then((data) => console.log(data))
      .catch((error) => console.error(error));
  };

  return (
    <div>
      <label htmlFor="secret-message-input">Enter your secret message:</label>
      <input
        type="text"
        id="secret-message-input"
        value={secretMessage}
        onChange={(e) => setSecretMessage(e.target.value)}
      />

      <button onClick={handleGenerateLink}>Generate Shareable Link</button>

      {shareableLink && (
        <div>
          <p>Shareable link:</p>
          <input type="text" value={shareableLink} readOnly />
        </div>
      )}

      {window.location.search.includes('?id=') && (
        <div>
          <p>Secret message:</p>
          <input
            type="text"
            value={secretMessage}
            readOnly
            onFocus={() => {
              const params = new URLSearchParams(window.location.search);
              const id = params.get('id');
              setUniqueId(id);
            }}
          />
        </div>
      )}
    </div>
  );
}

export default App;