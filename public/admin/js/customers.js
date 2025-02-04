//Block user
function blockUser(id) {
  if (confirm("Are you sure you want to block this user?")) {
    const url = `/admin//user/block?id=${id}`;
    const options = { method: "PUT" };
    fetch(url, options)
      .then((response) => (window.location.href = response.url))
      .catch((err) => console.log("something happend in add category"));
  }
}

//Unblock user
function unblockUser(id) {
  if (confirm("Block this user ?")) {
    const url = `/admin//user/unblock?id=${id}`;
    const options = { method: "PUT" };
    fetch(url, options)
      .then((response) => (window.location.href = response.url))
      .catch((err) => console.log("something happend in add category"));
  }
}
