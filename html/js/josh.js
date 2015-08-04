var dblite   = require('dblite');// npmjs.org: dblite
//dblite.bin = "db/sqlite3.exe"; // win32
dblite.bin   = "db/sqlite3";     // linux
var db = dblite('db/db.sqlite3');
var _ = require('lodash');
var moment = require('moment');
var format = require('format-number');
var numFormat;
var datepicker1 = null,
    datepicker2 = null;
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

// nouvelle ligne dans le tableau
function creerNouvelleLigne(enregistrementDb) {
  "use strict";
  var echeance = moment(enregistrementDb.cEcheance).format("DD/MM/YYYY");
  var beginLigne = '<tr id=L"' + enregistrementDb.cCodeClient + '" data-ligne="' + JSON.stringify(enregistrementDb) + '">';
  var colCode = '<td>'+ enregistrementDb.cCodeClient +'</td>';
  var colRaisonSociale = '<td>' + enregistrementDb.cRaisonSociale + '</td>';
  var colPharmacien = '<td>' + enregistrementDb.cNomPharmacien + '</td>';
  var colCaTtc = '<td>' + enregistrementDb.cCaTtc + '</td>';
  var colAcompte = '<td>' + enregistrementDb.cAcompte + '</td>';
  var colSoldeApresAcompte = '<td>' + enregistrementDb.cSoldeApresAcompte + '</td>';
  var colModeReglement = '<td>' + enregistrementDb.cModeReglement + '</td>';
  var colEcheance = '<td>' + echeance + '</td>';
  var endLigne = '</tr>';
  var childElementToAppend = beginLigne;
  childElementToAppend    += colCode;
  childElementToAppend    += colRaisonSociale;
  childElementToAppend    += colPharmacien;
  childElementToAppend    += numFormat(colCaTtc);
  childElementToAppend    += numFormat(colAcompte);
  childElementToAppend    += numFormat(colSoldeApresAcompte);
  childElementToAppend    += colModeReglement;
  childElementToAppend    += colEcheance;
  childElementToAppend     = childElementToAppend + endLigne;
  $('tbody').append(childElementToAppend);
}

// for excel gen
function datenum(v, date1904) {
  if(date1904) v+=1462;
  var epoch = Date.parse(v);
  return (epoch - new Date(Date.UTC(1899, 11, 30))) / (24 * 60 * 60 * 1000);
}
function Workbook() {
  if(!(this instanceof Workbook)) return new Workbook();
  this.SheetNames = [];
  this.Sheets = {};
}
function s2ab(s) {
  var buf = new ArrayBuffer(s.length);
  var view = new Uint8Array(buf);
  for (var i=0; i!=s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
  return buf;
}
function build_sheet() {
	var ws = {};
	var range = {s: {c:10000000, r:10000000}, e: {c:0, r:0 }};
  for(var R = 0x0; R < TousEnregistrements.length; ++R) {
    var CetEnregistrement = TousEnregistrements[R];
    var cols = ['cDateFacturation','cPeriode','cCodeClient','cRaisonSociale','cNomPharmacien','cCaTtc','cAcompte',
      'cSoldeApresAcompte','cModeReglement','cEcheance','cCommentaireApresEcheance','cNomCommercial','cReglement',
      'cDateReglement','cSuspensionCommentaire'];
    for(var C = 0x0; C < _.size(CetEnregistrement); ++C) {
      if(range.s.r > R) range.s.r = R;
      if(range.s.c > C) range.s.c = C;
      if(range.e.r < R) range.e.r = R;
      if(range.e.c < C) range.e.c = C;
      var cell = {v: CetEnregistrement[cols[C]] };
      if(cell.v == null) continue;
      var cell_ref = XLSX.utils.encode_cell({c:C,r:R});

      if(typeof cell.v === 'number') cell.t = 'n';
      else if(typeof cell.v === 'boolean') cell.t = 'b';
      else if(cell.v instanceof Date) {
        cell.t = 'n'; cell.z = XLSX.SSF._table[14];
        cell.v = datenum(cell.v);
      }
      else cell.t = 's';

      ws[cell_ref] = cell;
    }
  }
	if(range.s.c < 10000000) ws['!ref'] = XLSX.utils.encode_range(range);
	return ws;
}

var NomFeuilleDeCalcul = "TPHARMA",
    Classeur = new Workbook(),
    data = [[1,2,3],[true, false, null, "sheetjs"],["foo","bar",new Date("2014-02-19T14:30Z"), "0.3"], ["baz", null, "qux"]],
    FeuilleDeCalcul,
    Classeur_out,
    TousEnregistrements;

function onGenererExcel_Click() {
  "use strict";
  FeuilleDeCalcul = build_sheet(data);
  /* add worksheet to workbook */
  Classeur.SheetNames.push(NomFeuilleDeCalcul);
  Classeur.Sheets[NomFeuilleDeCalcul] = FeuilleDeCalcul;
  Classeur_out = XLSX.write(Classeur, {bookType:'xlsx', bookSST:true, type: 'binary'});
  saveAs(new Blob([s2ab(Classeur_out)],{type:"application/octet-stream"}), "test.xlsx");
}


window.onload = function () {
  // la ligne suivante fait apparaitre la fenetre de debogage si elle est décommentée
  //require('nw.gui').Window.get().showDevTools();

  numFormat = format({noUnits: true, integerSeparator:' ', decimal:','});


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


  // ===== les actions sur boutons ==========
  //bouton Generer
  $('#gen').click(onGenererExcel_Click);
  //bouton Ajouter
  $('#add').click(function () {
    location.replace('add.html');
  });

  // ==== chargement du tableau a partir de la base de donnees ===============
  TousEnregistrements = [];
  db.query(
    'SELECT * FROM releves_facture_client ORDER BY date_facturation DESC',
    function (err, rows) {
      if (!err) {
        var ReleveFacture = rows.length && rows[0];
        if (ReleveFacture) {
          var CetEnregistrement = {
            cDateFacturation          : new Date(ReleveFacture[0x0]),
            cPeriode                  : ReleveFacture[1],
            cCodeClient               : ReleveFacture[2],
            cRaisonSociale            : ReleveFacture[3],
            cNomPharmacien            : ReleveFacture[4],
            cCaTtc                    : parseInt(ReleveFacture[5]),
            cAcompte                  : parseInt(ReleveFacture[6]),
            cSoldeApresAcompte        : ReleveFacture[7],
            cModeReglement            : ReleveFacture[8],
            cEcheance                 : new Date(ReleveFacture[9]),
            cCommentaireApresEcheance : ReleveFacture[10],
            cNomCommercial            : ReleveFacture[11],
            cReglement                : parseInt(ReleveFacture[12]),
            cDateReglement            : new Date(ReleveFacture[13]),
            cSuspensionCommentaire    : ReleveFacture[14]
          };
          TousEnregistrements.push(CetEnregistrement);
          creerNouvelleLigne(CetEnregistrement);
        }
      }
    }
  );
};