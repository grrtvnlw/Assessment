$(document).on('click', '.completed', function() {
  let id = $(this).attr('id');
  axios.put(`/Invoice/${id}`);
  window.location.reload();
});