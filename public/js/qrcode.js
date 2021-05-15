// Get users id out of url
const id = window.location.href.split('/').slice('-1')[0]

// Initialize QR code, render it to page
const qrc = new QRCode(document.getElementById('qrcode'), {
  text: `https://qr-social-links.herokuapp.com/users/single/${id}`,
  width: 250,
  height: 250,
})
