var dblite   = require('dblite');// npmjs.org: dblite
//dblite.bin = "db/sqlite3.exe"; // win32
dblite.bin   = "db/sqlite3";     // linux
var db = dblite('db/db.sqlite3');
/*var datereleve = null,
    dateecheance = null,
    datereglement = null;*/
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


function onAddButtonClick() {
  "use strict";
  // sur click de Enregistrer sur page add.html
  cCodeClient = $('#codeclient').val();
  cRaisonSociale = $('#pharmacie').val();
  cNomPharmacien = $('#nompharmacien').val();
  cCaTtc = $('#ca_ttc').val();
  cAcompte = $('#acompte').val();
  cSoldeApresAcompte = parseInt(cAcompte) - parseInt(cCaTtc);
  cModeReglement = $('#modereglement').val();
  //cEcheance = $('#dateecheance');
  cCommentaireApresEcheance = $('#commentaireapresrelance').val();
  cNomCommercial = $('#nomcommercial').val();
  cReglement = $('#reglement').val();
  //cDateReglement = $('#datereglement');
  cSuspensionCommentaire = $('#suspension_commentaire').val();
  cPeriode = '';
  db.query('INSERT INTO releves_facture_client VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [
    cDateFacturation,
    cPeriode,
    cCodeClient,
    cRaisonSociale,
    cNomPharmacien,
    cCaTtc,
    cAcompte,
    cSoldeApresAcompte,
    cModeReglement,
    cEcheance,
    cCommentaireApresEcheance,
    cNomCommercial,
    cReglement,
    cDateReglement,
    cSuspensionCommentaire
  ]);
  setTimeout(function () {
    $('#btnback').trigger('click');
  }, 500);
}

// ==== variables gloables ================================
var
  cDateFacturation,
  cPeriode,
  cCodeClient,
  cRaisonSociale,
  cNomPharmacien,
  cCaTtc,
  cAcompte,
  cSoldeApresAcompte,
  cModeReglement,
  cEcheance,
  cCommentaireApresEcheance,
  cNomCommercial,
  cReglement,
  cDateReglement,
  cSuspensionCommentaire;

window.onload = function () {
  // la ligne suivante fait apparaitre la fenetre de debogage si elle est décommentée
  //require('nw.gui').Window.get().showDevTools();

  //==nouvel ajout/datereleve
  params = $.extend({}, paramsDatepicker, {
    /*onOpen: function() {
      datereleve = this;
    },*/
    onSet: function (context) {
      var d = new Date(context.select);
      cDateFacturation = d.getUTCFullYear() + '-' + (d.getUTCMonth() + 1) + '-' + d.getUTCDate();
    }
  });
  $('#datereleve').pickadate(params);

  //==nouvel ajout/dateecheance
  params = $.extend({}, paramsDatepicker, {
    /*onOpen: function() {
      dateecheance = this;
    },*/
    onSet: function (context) {
      var d = new Date(context.select);
      cEcheance = d.getUTCFullYear() + '-' + (d.getUTCMonth() + 1) + '-' + d.getUTCDate();
    }
  });
  $('#dateecheance').pickadate(params);

  //==nouvel ajout/datereglement
  params = $.extend({}, paramsDatepicker, {
    /*onOpen: function() {
      datereglement = this;
    },*/
    onSet: function (context) {
      var d = new Date(context.select);
      cDateReglement = d.getUTCFullYear() + '-' + (d.getUTCMonth() + 1) + '-' + d.getUTCDate();
    }
  });
  $('#datereglement').pickadate(params);

  $('#modereglement').material_select();

  // ===== les actions sur boutons ==========
  //bouton Retour
  $('#btnback').click(function () {
    location.replace(location.pathname.replace(/[\/][^\/]+$/, '/index.html'));
  });
  //bouton Enregistrer
  $('#save').click(onAddButtonClick);
};