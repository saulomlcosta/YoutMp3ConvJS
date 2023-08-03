document.getElementById('downloadButton').addEventListener('click', async () => {
  const youtubeUrl = document.getElementById('youtubeUrl').value.trim();
  const loader = document.getElementById('loader');

  if (!youtubeUrl) {
    alert('Please enter a valid YouTube URL.');
    return;
  }

  try {
    loader.style.display = 'block';

    const response = await fetch('http://localhost:3000/download', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ youtubeUrl }),
    });

    if (!response.ok) {
      throw new Error('Error downloading the audio.');
    }

    const contentDisposition = response.headers.get('Content-Disposition');
    const match = contentDisposition && contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
    let filename = match && match[1] ? match[1] : 'audio.mp3';
    filename = filename.replace(/"/g, '');

    const objectUrl = URL.createObjectURL(await response.blob());

    const downloadLink = document.createElement('a');
    downloadLink.href = objectUrl;
    downloadLink.download = `${filename}.mp3`;
    downloadLink.click();

    URL.revokeObjectURL(objectUrl);
    console.log('Download started!');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    loader.style.display = 'none';
  }
});




