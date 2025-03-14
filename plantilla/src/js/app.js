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

                opc: 'getEvent',
                idEvent: 15,

            }
        });

        this.createPDF({
            parent:'containerPrimary',
            data_header: data.Event,
            dataMenu: data.Menu,
            clauses: [
                "El Horario de Inicio y Finalización estipulado en la orden de servicio deberá ser respetado.",
                "Concluidas las 5 horas del servicio este se suspende teniendo como máximo 30 minutos para desalojar el salón.",
                "No se pueden introducir alimentos ni bebidas (snacks, antojitos, pan dulce o cualquier bebida).",
                "En caso de adquirir un paquete de buffet (niños o padres) se deberá pagar el evento.",
                "En caso de haber ingresado bebidas alcohólicas los invitados deberán tener mínimo 18 años cumplidos.",
                "En caso de cancelación el evento se realizará a través de eventos o vales de consumo dentro del restaurante con una penalización del 10%.",
                "Cualquier cambio en la logística del evento quedará sujeto a disponibilidad de espacios y áreas involucradas para su realización.",
                "El restaurant no se hace responsable por objetos olvidados dentro del evento.",
                "No se permite el uso de fuegos artificiales, confeti o cualquier tipo de papel que afecte al medio ambiente.",
                "La empresa solo se hace responsable con la paquetería en este orden de servicio."
            ]

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
                date_end_hr: "[date_end_hr]",
                day: "[day]",
                quantity_people: "[quantity_people]",
                advance_pay: "[advance_pay]",
                total_pay: "[total_pay]",
                notes: "[notes]",
                type_event: "[type_event]"
            },
            clauses: ["", "", "", "", "", "", "", "", "", ""] // 📌 Cláusulas configurables
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
            <p><strong>CORREO:</strong> ${opts.data_header.email}</p>
            <p><strong>TIPO :</strong> ${opts.data_header.type_event}</p>
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


        // 📜 Menu
        const menu = `
         <div class="text-gray-800 mt-4" id="containerMenu">
            <div class=" text-sm font-bold mb-2">Menú</div>
            <div class = "d-inline-flex gap-3">
            <div>
                <strong>Paquete:</strong>
                <small>normal</small>
            </div>
            <div>
            <strong> Cantidad:</strong>
            <small>1</small>
            </div>
            <div>
            <strong> Precio:</strong>
            <small>300</small>
            </div>
            </div>
        </div>
        `;



        // 📜 Estructura principal del documento
        const docs = `
        <div id="docEvent" class="p-6 bg-white shadow-lg text-gray-800 rounded-lg">
            ${header}
            ${template}
            ${menu }
            <div class="text-gray-800 mt-4" id="containerEndFormat"></div>
            
            <!-- 📜 Sección de Totales (Subtotal, Total y Saldo) -->
            <div class="mt-6 text-sm text-gray-800 flex justify-end">
                <div class="w-1/3">
                    <div class="flex justify-between border-t border-gray-400 pt-2">
                        <p class="font-bold">Total</p>
                        <p>${formatPrice(opts.data_header.total_pay)}</p>
                    </div>
                    <div class="flex justify-between">
                        <p>Anticipo:</p>
                        <p>${formatPrice(opts.data_header.advance_pay)}</p>
                    </div>
                    <div class="flex justify-between font-bold">
                        <p>Saldo</p>
                        <p>${formatPrice(opts.data_header.total_pay - opts.data_header.advance_pay)}</p>
                    </div>
                </div>
            </div>

            <!-- 📜 Cláusulas configurables -->
            <div class="mt-6 mb-4 text-xs">
                <p class="font-bold"> Cláusulas </p>
                <ul class="list-decimal pl-5">
                    ${opts.clauses.map(clause => `<li>${clause}</li>`).join('')}
                </ul>
            </div>
        </div>`;

        $('#' + opts.parent).append(docs);

        // 📜 Aplicación del plugin rpt_json_table2 a la tabla del menú
        $('#containerEndFormat').rpt_json_table2({
            data: opts.dataMenu,
            color_th: 'bg-disabled1 ',
            class: 'table table-sm text-gray-800',
            center: [1,2]
        });
    }






}
