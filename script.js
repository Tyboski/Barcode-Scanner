
$(function() {
  var onDetected = function(result) {
    $('#barcode').val(result.codeResult.code);
    $('#barcode').trigger('change');
  };

  Quagga.init({
    inputStream: {
      name: 'Live',
      type: 'LiveStream',
      target: document.querySelector('#barcodeScanner')
    },
    decoder: {
      readers: ['ean_reader']
    }
  }, function(err) {
    if (err) {
      console.error('Failed to initialize barcode scanner:', err);
      return;
    }
    console.log('Barcode scanner initialized.');

    Quagga.start();

    Quagga.onDetected(onDetected);
  });

  $('#barcode').on('change', function() {
    var barcode = $(this).val();
    if (barcode) {
      $.ajax({
        url: 'https://api.nutritionix.com/v1_1/item?upc=' + barcode + '&appId=d857e3a4&appKey=aa604d03813f8387e506458ee8c38d3e',
        dataType: 'jsonp',
        success: function(data) {
          if (data.brand_name && data.item_name) {
            var html = '<p><strong>' + data.brand_name + ' ' + data.item_name + '</strong></p>';
            html += '<p>Calories: ' + data.nf_calories + '</p>';
            html += '<p>Total Fat: ' + data.nf_total_fat + 'g</p>';
            html += '<p>Sodium: ' + data.nf_sodium + 'mg</p>';
            html += '<p>Total Carbohydrate: ' + data.nf_total_carbohydrate + 'g</p>';
            html += '<p>Protein: ' + data.nf_protein + 'g</p>';
            $('#nutrition-info').html(html);
          } else {
            $('#nutrition-info').html('<p>Product not found.</p>');
          }
        },
        error: function() {
          $('#nutrition-info').html('<p>Failed to fetch data.</p>');
        }
      });
    }
  });
});