var dblite   = require('dblite');// npmjs.org: dblite
var APP_ROOT = "app://127.0.0.1";
//dblite.bin = "db/sqlite3.exe"; // win32
dblite.bin   = "db/sqlite3";     // linux
var db = dblite(APP_ROOT + '/db/db.sqlite3');
var datepicker1 = null,
    datepicker2 = null,
    datereleve = null,
    dateecheance = null,
    datereglement = null;
var params;
var paramsDatepicker = {
  monthsFull: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'],
  monthsShort: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aou', 'Sep', 'Oct', 'Nov', 'Déc'],
  weekdaysFull: ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'],
  weekdaysShort: ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'],
  showMonthsShort: undefined,
  showWeekdaysFull: undefined,
// Buttons
  today: 'Hui',
  clear: 'Effacer',
  close: 'Fermer',
// Accessibility labels
  labelMonthNext: 'Mois suiv',
  labelMonthPrev: 'Mois préc',
  labelMonthSelect: 'Mois',
  labelYearSelect: 'Année',
// Formats
  format: 'dd mmmm yyyy',
  formatSubmit: 'yyyy-mm-dd',
  hiddenPrefix: undefined,
  hiddenSuffix: '_submit',
  hiddenName: undefined,
// Editable input
  editable: false,
// Dropdown selectors
  selectMonths: true, // Creates a dropdown to control month
  selectYears: 15, // Creates a dropdown of 15 years to control year
// First day of the week
  firstDay: undefined,
// Date limits
  min: undefined,
  max: undefined,
// Disable dates
  disable: undefined,
// Root picker container
  container: undefined,
// Hidden input container
  containerHidden: undefined,
// Close on a user action
  closeOnSelect: true,
  closeOnClear: true,
// Events
  onStart: undefined,
  onRender: undefined,
  onStop: undefined
};


window.onload = function () {
  //require('nw.gui').Window.get().showDevTools();

  //==periode date1
  params = $.extend({}, paramsDatepicker, {
    onOpen: function() {
      datepicker1 = this;
    },
    onClose: function () {
      console.log(datepicker1.get('select', 'yyyy/mm/dd'));
      console.log(this);
    },
    onSet: function() {
      setTimeout(function () {
        if (datepicker2 == null) return;
        var d1 = this.get('value');
        this.set('min', new Date(d1.year, d1.month, d1.day));
      }, 500);
    }
  });
  $('#date1').pickadate(params);

  //==periode date2
  params = $.extend({}, paramsDatepicker, {
    onOpen: function() {
      datepicker2 = this;
      if (datepicker1 == null) return;
      var d1 = datepicker1.get('value');
      this.set('min', new Date(d1.year, d1.month, d1.day));
    }
  });
  $('#date2').pickadate(params);

  //==nouvel ajout/datereleve
  params = $.extend({}, paramsDatepicker, {
    onOpen: function() {
      datereleve = this;
    }
  });
  $('#datereleve').pickadate(params);

  //==nouvel ajout/dateecheance
  params = $.extend({}, paramsDatepicker, {
    onOpen: function() {
      dateecheance = this;
    }
  });
  $('#dateecheance').pickadate(params);


  //==nouvel ajout/datereglement
  params = $.extend({}, paramsDatepicker, {
    onOpen: function() {
      datereglement = this;
    }
  });
  $('#datereglement').pickadate(params);



  $('.container .right > a.btn:first').click(function () {
    location.replace('add.html');
  });
  $('#btnback').click(function () {
    location.replace(location.pathname.replace(/[\/][^\/]+$/, '/index.html'));
  });
  $('#modereglement').material_select();
};