// let ctrl = "ctrl/app.php";
<<<<<<< HEAD
const api = 'https://huubie.com.mx/alpha/eventos/ctrl/ctrl-payment.php';
=======
const api = 'https://www.huubie.com.mx/alpha/eventos/ctrl/ctrl-payment.php';
>>>>>>> 7ba913db8575743191304a29637ce7c9d0e2056a


// init vars.
let app;


$(async () => {
<<<<<<< HEAD
    // await fn_ajax({ opc: "init" }, link).then((data) => {
=======
    // await fn_ajax({ opc: "init" }, api).then((data) => {
>>>>>>> 7ba913db8575743191304a29637ce7c9d0e2056a
        
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

<<<<<<< HEAD

        this.viewPDF();

    }

=======
        this.createNote({
            parent: "containerPrimary",
        });
    }

>>>>>>> 7ba913db8575743191304a29637ce7c9d0e2056a
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

<<<<<<< HEAD
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
=======
    // Components. 
    createNote(options) {
        var defaults = {
            parent: 'containerNote',
            dataPackage: [],
            data_header: {
                email: "[email]",             // Email del organizador
                phone: "[phone]",             // Teléfono del cliente
                contact: "[contact]",           // Nombre del cliente
                idEvent: "[idEvent]",           // ID del evento
                location: "[location]",          // Ubicación o salón
                date_creation: "[date_creation]",     // Fecha de creación del evento
                date_start: "[date_start]",        // Fecha y hora de inicio
                date_end: "[date_end]",          // Fecha y hora de finalización
                quantity_people: "[quantity_people]",   // Número de personas
                advance_pay: "[advance_pay]",       // Pago por anticipo
                total_pay: "[total_pay]",         // Pago total
                notes: "[notes]",             // Notas del evento
                type_event: "[type_event]"         // Tipo de evento
>>>>>>> 7ba913db8575743191304a29637ce7c9d0e2056a
            }
        };

        const opts = Object.assign({}, defaults, options);

<<<<<<< HEAD
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
=======
        var header = `
        <div class="flex justify-content-end ">
        <img src="https://huubie.com.mx/alpha/src/img/logo/logo.ico" alt="Logo" class="event-logo">
        </div>
        <div class="event-header">
            <p><strong>CLIENTE:</strong> ${opts.data_header.contact}</p>
            <p><strong>TELEFONO:</strong> ${opts.data_header.phone}</p>
        
        </div>`;

        var template = `
        <div class="event-details mt-10">
          
            <p>Agradecemos su preferencia por celebrar su evento con nosotros el día 
            <strong>${opts.data_header.date_start}</strong>, de 
            <strong>${opts.data_header.date_start}</strong> a 
            <strong>${opts.data_header.date_end}</strong>, en el salón 
            <strong>${opts.data_header.location}</strong>.</p>
            <p>Estamos encantados de recibir a <strong>${opts.data_header.quantity_people}</strong> invitados y nos aseguraremos de que cada detalle esté a la altura de sus expectativas.</p>
            <br>
            <p><strong>PAGO ANTICIPO:</strong> ${formatPrice(opts.data_header.advance_pay)}</p>
            <p><strong>PAGO TOTAL:</strong> ${formatPrice(opts.data_header.total_pay)}</p>
           ${opts.data_header.notes ? `<p><strong>NOTAS:</strong> ${opts.data_header.notes}</p>` : ""}
        </div>`;


        var docs = `
        <div id="docEvent" class="p-6 bg-white shadow-lg text-gray-800 rounded-lg">
            ${header}
            ${template}

            <div class="line text-gray-800 mt-3" id="containerPackage"></div>
            <div class="line text-gray-800 mt-3" id="containerEndFormat"></div>
>>>>>>> 7ba913db8575743191304a29637ce7c9d0e2056a
        </div>`;

        $('#' + opts.parent).append(docs);

<<<<<<< HEAD
        // 📜 Aplicación del plugin rpt_json_table2 a la tabla del menú
        $('#containerEndFormat').rpt_json_table2({
            data: opts.dataMenu,
            color_th: 'bg-defaultx',
            class: 'table table-sm text-gray-800'
        });
=======
        console.log('menu', opts.dataMenu);


        let $td = ''; // Se debe usar let en lugar de const para permitir la reasignación

        opts.dataMenu.forEach((item, index) => {
            $td += `
        <tr class="border-t border-gray-300">
            <td class="py-2 font-semibold">${item.dish}</td>
            <td class="py-2 font-semibold">${item.price}</td>
            <td class="py-2 font-semibold text-center">${item.quantity}</td>
            <td class="py-2 font-semibold text-right">$${(item.price * item.quantity).toFixed(2)}</td>
        </tr>
    `;
        });


        var footer = `
            <div class="flex w-full p-4 bg-white mt-5">
            <!-- Tabla -->
            <table class="w-full text-left border-collapse border-t border-gray-400">
                <thead>
                    <tr class="border-b border-gray-400">
                        <th class="py-2 text-sm font-semibold uppercase">Description de Menú</th>
                        <th class="py-2 text-sm font-semibold uppercase">Precio</th>
                        <th class="py-2 text-sm font-semibold uppercase">Cantidad</th>
                        <th class="py-2 text-sm font-semibold uppercase">Importe</th>
                    </tr>
                </thead>
                <tbody>
                  ${$td}
                </tbody>
            </table>

           
        </div>`;

        $('#containerEndFormat').append(footer);


        // $('#containerPackage').rpt_json_table3({ 
        //     data: opts.dataPackage,
        //     class: 'table table-bordered table-sm text-gray-800',
        //     right: [2,3,4]
        //  });


>>>>>>> 7ba913db8575743191304a29637ce7c9d0e2056a
    }



<<<<<<< HEAD



=======
>>>>>>> 7ba913db8575743191304a29637ce7c9d0e2056a
}
