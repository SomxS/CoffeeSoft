// let ctrl = "ctrl/app.php";
const api = 'https://huubie.com.mx/alpha/eventos/ctrl/ctrl-payment.php';


// init vars.
let app;


$(async () => {
    // await fn_ajax({ opc: "init" }, link).then((data) => {
        
        // vars.
       
        
        // instancias.

        app = new App(api,'root');
        app.init();
   
    
    // });

});

class App extends Templates {
    constructor(link, div_modulo) {
        super(link, div_modulo);
    }

    init() {
        this.render();
        
    }

    render(){
        this.createNavBar();
        this.layout();
        this.filterBar();

      
    }

    layout() {
        this.primaryLayout({
            parent: "root",
            id: "Primary",
        });


        this.viewPDF();

    }

    filterBar(options) {

  

        this.createfilterBar({
            parent: "filterBar",
            data: [
                { opc: "select", class: "col-3", id: "UDNs", lbl: "Seleccionar UDN: ", data: [{id: 4, valor:'BAOS'}] },
                { opc: "input-calendar", class: "col-3", id: "calendar", lbl: "Consultar fecha: " },
            ],
        });


        // initialized.

        dataPicker({
            parent: "calendar",
            onSelect: (start, end) => {
                // this.ls();
            },
        });
    }

    ls(options) {
     
        let rangePicker = getDataRangePicker("calendar");
     
        this.createTable({
            parent: "containerCalendarizacion",
            idFilterBar: "filterBarCalendarizacion",

            data: { opc: "lsEvents", date_init: rangePicker.fi, date_end: rangePicker.ff },
            conf: { datatable: false, pag: 15 },
            attr: {
               
                class_table: "table table-bordered table-sm table-striped text-uppercase",
                id         : "lsTable",
                center     : [1, 2, 3, 6, 7],
                extends    : true,
                
            },
        });

        
       
    }

    async viewPDF(){

        let data = await useFetch({
            url:api,
            data:{

                opc: 'getDataEvent',
                idEvent: 15,

            }
        });

        this.createPDF({
            parent:'containerPrimary',
            data_header: data.Event,
            dataMenu: data.Menu

        });
    }

    // Components. 
    createPDF(options) {

        const defaults = {
            parent: 'containerNote',
            dataPackage: [],
            dataMenu: [],
            data_header: {
                email: "[email]",
                phone: "[phone]",
                contact: "[contact]",
                idEvent: "[idEvent]",
                location: "[location]",
                date_creation: "[date_creation]",
                date_start: "[date_start]",
                date_start_hr: "[date_start_hr]",
                date_end: "[date_end]",
                date_end_hr: "[date_end]",
                day: "[day]",
                quantity_people: "[quantity_people]",
                advance_pay: "[advance_pay]",
                total_pay: "[total_pay]",
                notes: "[notes]",
                type_event: "[type_event]"
            }
        };

        const opts = Object.assign({}, defaults, options);

        // 📜 Construcción del encabezado del PDF con logo
        const header = `
        <div class="flex justify-end mb-4">
            <img src="https://huubie.com.mx/alpha/src/img/logo/logo.ico" alt="Logo" class="h-16">
        </div>
        <div class="event-header text-sm text-gray-800">
            <p><strong>CLIENTE:</strong> ${opts.data_header.contact}</p>
            <p><strong>TELÉFONO:</strong> ${opts.data_header.phone}</p>
            <p><strong>ORGANIZADOR DEL EVENTO:</strong> ${opts.data_header.email}</p>
            <p><strong>TIPO DE EVENTO:</strong> ${opts.data_header.type_event}</p>
        </div>`;

        // 📜 Construcción del cuerpo del PDF
        const template = `
        <div class="event-details mt-6 text-sm text-gray-800">
            <p>Agradecemos su preferencia por celebrar su evento con nosotros el día 
            <strong>${opts.data_header.day}</strong>,
            <strong>${opts.data_header.date_start} ${opts.data_header.date_start_hr}</strong> a 
            <strong>${opts.data_header.date_end} ${opts.data_header.date_end_hr}</strong>, en el salón 
            <strong>${opts.data_header.location}</strong>.</p>
            <p>Estamos encantados de recibir a <strong>${opts.data_header.quantity_people}</strong> invitados y nos aseguraremos de que cada detalle esté a la altura de sus expectativas.</p>
            <br>
         
            ${opts.data_header.notes ? `<p><strong>NOTAS:</strong> ${opts.data_header.notes}</p>` : ""}
        </div>`;

        // 📜 Estructura principal del documento
        const docs = `
        <div id="docEvent" class="p-6 bg-white shadow-lg text-gray-800 rounded-lg">
            ${header}
            ${template}
            <div class="text-gray-800 mt-4" id="containerEndFormat"></div>
            
            <!-- 📜 Sección de Totales -->
            <div class="mt-6 mb-2 text-sm">
                <div class="flex justify-end border-t border-gray-400 pt-2">
                    <p class="font-bold"> TOTAL </p>
                </div>
                <div class="flex justify-end">
                    Anticipo: ${formatPrice(opts.data_header.advance_pay)} 
                </div>
                <div class="flex justify-end font-bold">
                    <p>SALDO</p>
                </div>
            </div>

            <!-- 📜 Cláusulas -->

            <div class="mt-6 mb-4 text-sm">
                <p class="font-bold"> Cláusulas </p>
                <ul class="list-decimal pl-5">
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                
                </ul>
            </div>
        </div>`;

        $('#' + opts.parent).append(docs);

        // 📜 Aplicación del plugin rpt_json_table2 a la tabla del menú
        $('#containerEndFormat').rpt_json_table2({
            data: opts.dataMenu,
            color_th: 'bg-defaultx',
            class: 'table table-sm text-gray-800'
        });
    }






}
