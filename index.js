const BASE_URL = 'https://lighthouse-user-api.herokuapp.com'
const INDEX_URL = BASE_URL + '/api/v1/users/'

const friends = []
let filteredFriends = []
const FRIEND_PER_PAGE = 16

const dataPanel = document.querySelector('#data-panel')
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector("#search-input")
const paginator = document.querySelector('#paginator')


// search功能
searchForm.addEventListener('submit', function onSearchFormSubmitted(event) {
  event.preventDefault()  //終止瀏覽器預設行為

  const keyword = searchInput.value.trim().toLowerCase()

  filteredFriends = friends.filter((friend) => { return friend.name.toLowerCase().includes(keyword) || friend.surname.toLowerCase().includes(keyword) })

  if (filteredFriends.length === 0) {
    return alert(`您輸入的關鍵字：${keyword} 沒有符合條件的朋友`)
  }

  renderFriendsList(getFriendByPage(1))
  renderPaginator(filteredFriends.length)
})

dataPanel.addEventListener('click', function onDataPanelClicked(event) {
  // 監測more功能
  if (event.target.matches('.btn-show-modal-friend')) {
    showModalFriend(Number(event.target.dataset.id))
  }

  // 監測close friend功能
  if (event.target.matches('.btn-add-close-friend')) {
    addToCloseFriend(Number(event.target.dataset.id))
  }
})

// 監測paginator按鈕
paginator.addEventListener('click', function onPaginatorClicked(event) {
  const page = Number(event.target.dataset.id)
  renderFriendsList(getFriendByPage(page))
})

function renderPaginator(amount) {
  // 200 / 16 = 12...8 
  const numberOfPages = Math.ceil(amount / FRIEND_PER_PAGE)
  let rawHTML = ''
  for (let page = 1; page <= numberOfPages; page++) {
    rawHTML += `<li class="page-item"><a class="page-link" href="#" data-id=${page}>${page}</a></li>`
  }
  paginator.innerHTML = rawHTML
}

function getFriendByPage(page) {
  const data = filteredFriends.length ? filteredFriends : friends
  const startIndex = (page - 1) * FRIEND_PER_PAGE
  const endIndex = startIndex + FRIEND_PER_PAGE
  return data.slice(startIndex, endIndex)
}

function addToCloseFriend(id) {
  const list = JSON.parse(localStorage.getItem('closeFriends')) || []
  const friend = friends.find((friend) => { return friend.id === id })

  if (list.some((friend) => { return friend.id === id })) {
    return alert('此朋友已為親密好友！')
  }

  list.push(friend)
  localStorage.setItem('closeFriends', JSON.stringify(list))
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
              <button class="btn btn-info btn-add-close-friend" data-id="${item.id}">+</button>
            </div>
          </div>
        </div>
      </div>
    `
  })

  dataPanel.innerHTML = rawHTML
}


axios.get(INDEX_URL)
  .then(function (response) {
    console.log(response.data.results)
    friends.push(...response.data.results)
    renderFriendsList(getFriendByPage(1))
    renderPaginator(friends.length)
  })
  .catch(function (error) {
    console.log(error);
  })
