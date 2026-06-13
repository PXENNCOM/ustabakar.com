export const downloadPdf = (url, filename) => {
  const token = localStorage.getItem('token');
  
  fetch(`http://localhost:3001/api${url}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
    .then((res) => res.arrayBuffer())
    .then((buffer) => {
      const blob = new Blob([buffer], { type: 'application/pdf' });
      const objectUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = objectUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(objectUrl);
    })
    .catch((err) => alert('PDF hatası: ' + err.message));
};