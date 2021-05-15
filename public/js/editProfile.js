const updateBtn = document.querySelector('#updateBtn')
const form = document.querySelector('form')
const id = window.location.href.split('/').slice('-1')[0]

async function update() {
  const url = `/users/edit/${id}`

  const name = form.name.value
  const email = form.email.value
  const telephone = form.telephone.value
  const website = form.website.value
  const twitter = form.twitter.value
  const instagram = form.instagram.value
  const facebook = form.facebook.value
  const github = form.github.value
  const password = form.password.value
  const password2 = form.password2.value

  const bodyValues = {
    name,
    email,
    telephone,
    website,
    twitter,
    instagram,
    facebook,
    github,
  }

  // Check if password match and are not empty values
  if (password === password2 && password !== '' && password2 !== '') {
    console.log('True dat')
    bodyValues.password = password
    bodyValues.password2 = password2
  }

  const response = await fetch(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(bodyValues),
  })

  if (response.status !== 200) {
    throw new Error('Something went wrong with the update request..')
  }

  const data = await response.json()

  return data
}

// Redirect to dashboard on click
async function updateClick(e) {
  e.preventDefault()

  try {
    const data = await update()

    window.location.href = data.redirect
  } catch (err) {
    console.log('Rejected:', err.message)
  }
}

updateBtn.addEventListener('click', updateClick)
