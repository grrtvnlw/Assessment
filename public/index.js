$(document).on('click', '.completed', function() {
  let id = $(this).attr('id');
  axios.put(`/Invoice/${id}`)
  .then((result) => {
    if (result.status == 200) {
      window.location.reload();
    }
  })
});
