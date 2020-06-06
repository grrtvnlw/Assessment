$(document).on('click', '.completed', function() {
  let id = $(this).attr('id');
  axios.put(`/Invoice/${id}`);
  axios.get('/Invoice')
});