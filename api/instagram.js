export default async function handler(req, res) {
  // CORS Header untuk keamanan
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  // Token ditaruh di sini agar aman dan tidak terbaca di Inspect Element Frontend
  const INSTAGRAM_TOKEN = "IGAAYBSCUee2FBZAGFpMTJDbkJnbjViRXRGQTI2WmEtUW1mdEFMVzhDcEFBSTVNdF9CTkYxYk1YemdiNHd0dU5vNXNHX0xtWUxsWVhTZAnZAORlRMLVZAaeE42ci1zd2RKMGduUG5CcEJ0RFNNSGkwN25vVko3eHhrZAUNwQXBmdk4yTQZDZD";
  const url = `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,permalink,thumbnail_url,timestamp&access_token=${INSTAGRAM_TOKEN}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error(error); // <--- Ditambahin ini biar variabel 'error' dianggap terpakai
    res.status(500).json({ error: 'Gagal mengambil data dari Instagram' });
  }
}