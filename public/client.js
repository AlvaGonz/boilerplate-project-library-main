$( document ).ready(function() {
  let  items = [];
  let  itemsRaw = [];
  
  $.getJSON('/api/books', function(data) {
    //let  items = [];
    itemsRaw = data;
    $.each(data, function(i, val) {
      items.push('<li class="bookItem" id="' + i + '">' + val.title + ' - ' + val.commentcount + ' comments</li>');
      return ( i !== 14 );
    });
    if (items.length >= 15) {
      items.push('<p>...and '+ (data.length - 15)+' more!</p>');
    }
    $('<ul/>', {
      'class': 'listWrapper',
      html: items.join('')
      }).appendTo('#display');
  });
  
  let  comments = [];
  $('#display').on('click','li.bookItem',function() {
    $("#detailTitle").html('<b>'+itemsRaw[this.id].title+'</b> (id: '+itemsRaw[this.id]._id+')');
    $.getJSON('/api/books/'+itemsRaw[this.id]._id, function(data) {
      comments = [];
      $.each(data.comments, function(i, val) {
        comments.push('<li>' +val+ '</li>');
      });
      comments.push('<br><form id="newCommentForm"><input style="width:300px" type="text" class="form-control" id="commentToAdd" name="comment" placeholder="New Comment"></form>');
      comments.push('<br><button class="btn btn-info addComment" id="'+ data._id+'">Add Comment</button>');
      comments.push('<button class="btn btn-danger deleteBook" id="'+ data._id+'">Delete Book</button>');
      $('#detailComments').html(comments.join(''));
    });
  });
  
  $('#bookDetail').on('click','button.deleteBook',function() {
    if (confirm('⚠️ Are you sure you want to delete this book?')) {
      $.ajax({
        url: '/api/books/'+this.id,
        type: 'delete',
        success: function(data) {
          alert('✅ ' + data);
          $('#detailComments').html('<p style="color: #10b981; font-weight: 600;">✅ ' + data + '</p><p style="color: var(--text-secondary);">Refresh the page to see updated list</p>');
        },
        error: function(err) {
          alert('❌ Error: ' + (err.responseText || 'Unknown error'));
        }
      });
    }
  });  
  
  $('#bookDetail').on('click','button.addComment',function() {
    let  newComment = $('#commentToAdd').val();
    if (!newComment.trim()) {
      alert('⚠️ Please enter a comment');
      return;
    }
    $.ajax({
      url: '/api/books/'+this.id,
      type: 'post',
      dataType: 'json',
      data: $('#newCommentForm').serialize(),
      success: function(data) {
        comments.unshift(newComment); //adds new comment to top of list
        $('#detailComments').html(comments.join(''));
        $('#commentToAdd').val(''); // Clear input
      },
      error: function(err) {
        alert('❌ Error adding comment: ' + (err.responseText || 'Unknown error'));
      }
    });
  });
  
  $('#newBookForm').submit(function(e) {
    e.preventDefault();
    $.ajax({
      url: '/api/books',
      type: 'post',
      dataType: 'json',
      data: $('#newBookForm').serialize(),
      success: function(data) {
        alert('✅ Book added successfully!');
        location.reload();
      },
      error: function(err) {
        alert('❌ Error adding book: ' + (err.responseJSON || 'Unknown error'));
      }
    });
  });
  
  $('#deleteAllBooks').click(function() {
    if (confirm('⚠️ Are you sure you want to delete ALL books?')) {
      $.ajax({
        url: '/api/books',
        type: 'delete',
        dataType: 'json',
        success: function(data) {
          alert('✅ All books deleted successfully!');
          location.reload();
        },
        error: function(err) {
          alert('❌ Error deleting books: ' + (err.responseJSON || 'Unknown error'));
        }
      });
    }
  }); 
  
});