const updateBtn = document.querySelector('#updateBtn')
const form = document.querySelector('form')
const id = window.location.href.split('/').slice('-1')[0]

// Add error to required fields
function errorHandler(field, text) {
  form[field].style.borderColor = 'red'
  form[field].placeholder = text

  if (field === 'password' || field === 'password2' || field === 'website') {
    form[field].value = ''
  }
}

// Update fn for edit profile page
async function update() {
  const url = `/users/edit/${id}`

  // Get form values
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
    password,
    password2,
  }

  // Remove red border if no error
  const noErrorBorder = 'rgb(206, 212, 218)'
  form.name.style.borderColor = noErrorBorder
  form.email.style.borderColor = noErrorBorder
  form.website.style.borderColor = noErrorBorder
  form.password.style.borderColor = noErrorBorder
  form.password2.style.borderColor = noErrorBorder

  if (name === '') {
    errorHandler('name', 'Name is required')
  }

  if (email === '') {
    errorHandler('email', 'Email is required')
  }

  // Regex, check if valid URL
  const validUrl = /^(ftp|http|https):\/\/[^ "]+$/.test(website)

  // Check URL
  if (website.length > 0 && !validUrl) {
    errorHandler(
      'website',
      'Optional field, URL need to start with http:// or https://'
    )
  }

  if (password !== password2) {
    errorHandler('password', 'Passwords do not match')
    errorHandler('password2', 'Passwords do not match')
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
