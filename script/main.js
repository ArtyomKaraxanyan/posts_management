function delete_post(postId){
    Swal.fire({
      title: 'Are you sure?',
      text: 'Once deleted, you will not be able to recover this item!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
    }).then((result) => {
      if (result.isConfirmed) {
        document.getElementById('delete_post').action = "/delete/post/" + postId;
        // Submit the form
       document.getElementById('delete_post').submit();
        
  
        Swal.fire('Deleted!', 'Your item has been deleted.', 'success');
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Cancelled', 'Your item is safe :)', 'error');
      }
    });
  }
  function edit_post(postId,userId){
  console.log(userId);
        document.getElementById('edit_post').action = "/edit/post/"+userId+'/' + postId;
        // Submit the form
       document.getElementById('edit_post').submit();
      
  }

  let maps
  function initialize() {
    var input = document.getElementById('location');
    var autocomplete = new google.maps.places.Autocomplete(input);
      google.maps.event.addListener(autocomplete, 'place_changed', function () {
      var place=autocomplete.getPlace();
      document.getElementById('place').value = place.name;
      document.getElementById('lat').value = place.geometry.location.lat();
      document.getElementById('lng').value = place.geometry.location.lng();
      });
  }
  google.maps.event.addDomListener(window, 'load', initialize);