const BASE_URL = 'https://lighthouse-user-api.herokuapp.com'
const INDEX_URL = BASE_URL + '/api/v1/users/'

const friends = JSON.parse(localStorage.getItem('closeFriends')) || [] 
//從local storage取得親密好友清單，第一次使用，local storage內沒東西會取回 null值(布林值false)，故list 會得到一個空陣列
let filteredFriends = []

const dataPanel = document.querySelector('#data-panel')
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector("#search-input")


dataPanel.addEventListener('click', function onDataPanelClicked(event) {
  // 監測more功能
  if (event.target.matches('.btn-show-modal-friend')) {
    showModalFriend(Number(event.target.dataset.id))
  }

  // 監測remove close friend功能
  if (event.target.matches('.btn-remove-close-friend')) {
    removeFromCloseFriend(Number(event.target.dataset.id))
  }
})

function removeFromCloseFriend(id) {
  if (!friends || !friends.length) { return }
  const friendIndex = friends.findIndex((friend) => { return friend.id === id })
  if (friendIndex === -1) { return }
  friends.splice(friendIndex, 1)
  localStorage.setItem('closeFriends', JSON.stringify(friends))
  renderFriendsList(friends)
}

function showModalFriend(id) {
  const modalTitle = document.querySelector('#friend-modal-title')
  const modalGender = document.querySelector('#friend-modal-gender')
  const modalRegion = document.querySelector('#friend-modal-region')
  const modalAge = document.querySelector('#friend-modal-age')
  const modalBirthday = document.querySelector('#friend-modal-birthday')
  const modalEmail = document.querySelector('#friend-modal-email')
  const modalAvatar = document.querySelector('#friend-modal-avatar')

  axios.get(INDEX_URL + id)
    .then(function (response) {
      const data = response.data
      modalTitle.innerHTML = `<p>${data.name}&nbsp;${data.surname}</p>`
      modalGender.innerText = `Gender: ${data.gender}`
      modalRegion.innerText = `Region: ${data.region}`
      modalAge.innerText = `Age: ${data.age}`
      modalBirthday.innerText = `Birthday: ${data.birthday}`
      modalEmail.innerText = `Email: ${data.email}`
      modalAvatar.innerHTML = `<img src="${data.avatar}" alt="friend-avatar" class="img-thumbnail">`
    })
    .catch(function (error) {
      console.log(error);
    })

}

function renderFriendsList(data) {
  let rawHTML = ''
  data.forEach(function (item) {
    rawHTML += `
      <div class="col-sm-3">
        <div class="mt-4">
          <div class="card">
            <img src="${item.avatar}" class="card-img-top" alt="avatar">
            <div class="card-body">
              <h5 class="card-title">${item.name}&nbsp;${item.surname}</h5>
              <button class="btn btn-primary btn-show-modal-friend" data-toggle="modal" data-target="#friend-modal" data-id="${item.id}">More</button>
              <button class="btn btn-danger btn-remove-close-friend" data-id="${item.id}">x</button>
            </div>
          </div>
        </div>
      </div>
    `
  })

  dataPanel.innerHTML = rawHTML
}

renderFriendsList(friends)